import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";

const Input = z.object({
  email: z.string().email(),
  fullName: z.string().min(1).max(120),
  newPassword: z.string().min(8).max(200),
});

// Throttle windows for the email-less reset path.
const WINDOW_MINUTES = 60;
const MAX_PER_EMAIL = 5;
const MAX_PER_IP = 10;

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

// Uniform failure so the endpoint never reveals which field was wrong,
// whether the account exists, or whether it is an admin account.
const GENERIC = "Account not found or details do not match.";

export const resetPasswordDirect = createServerFn({ method: "POST" })
  .inputValidator((data) => Input.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const emailLc = norm(data.email);
    let ip: string | null = null;
    try {
      ip = getRequestIP({ xForwardedFor: true }) ?? null;
    } catch {
      ip = null;
    }

    const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();

    // --- Durable brute-force throttle (survives worker restarts, unlike in-memory) ---
    const { count: emailTries } = await supabaseAdmin
      .from("password_reset_attempts")
      .select("id", { count: "exact", head: true })
      .eq("email_lc", emailLc)
      .gte("created_at", since);

    if ((emailTries ?? 0) >= MAX_PER_EMAIL) {
      throw new Error("Too many reset attempts for this account. Try again in an hour.");
    }

    if (ip) {
      const { count: ipTries } = await supabaseAdmin
        .from("password_reset_attempts")
        .select("id", { count: "exact", head: true })
        .eq("ip", ip)
        .gte("created_at", since);
      if ((ipTries ?? 0) >= MAX_PER_IP) {
        throw new Error("Too many reset attempts from this network. Try again in an hour.");
      }
    }

    // Record the attempt up front so failures always count toward the limit.
    const logAttempt = async (succeeded: boolean) => {
      await supabaseAdmin
        .from("password_reset_attempts")
        .insert({ email_lc: emailLc, ip, succeeded });
    };

    // --- Locate the account ---
    let userId: string | null = null;
    for (let page = 1; page <= 20 && !userId; page++) {
      const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: 200,
      });
      if (error) {
        await logAttempt(false);
        throw new Error("Lookup failed");
      }
      const match = list.users.find((u) => norm(u.email ?? "") === emailLc);
      if (match) {
        userId = match.id;
        break;
      }
      if (list.users.length < 200) break;
    }

    if (!userId) {
      await logAttempt(false);
      throw new Error(GENERIC);
    }

    // --- Privileged accounts can NEVER be reset through this email-less path ---
    // Knowing an admin's name + email must not be enough to seize the admin panel.
    const { data: privilegedRoles, error: rErr } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin");
    if (rErr) {
      await logAttempt(false);
      throw new Error("Lookup failed");
    }
    if ((privilegedRoles ?? []).length > 0) {
      await logAttempt(false);
      throw new Error(GENERIC);
    }

    // --- Verify the name registered at signup ---
    const { data: profile, error: pErr } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle();
    if (pErr) {
      await logAttempt(false);
      throw new Error("Lookup failed");
    }

    const provided = norm(data.fullName);
    const stored = norm(profile?.full_name ?? "");
    if (!stored || provided !== stored) {
      await logAttempt(false);
      throw new Error(GENERIC);
    }

    const { error: upErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: data.newPassword,
    });
    if (upErr) {
      await logAttempt(false);
      throw new Error("Could not update password");
    }

    await logAttempt(true);
    return { ok: true };
  });
