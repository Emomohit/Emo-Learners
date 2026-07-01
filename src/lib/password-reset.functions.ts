import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  email: z.string().email(),
  fullName: z.string().min(1).max(120),
  newPassword: z.string().min(8).max(200),
});

export const resetPasswordDirect = createServerFn({ method: "POST" })
  .inputValidator((data) => Input.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Find the user by email via Admin API.
    const emailLc = data.email.trim().toLowerCase();
    // listUsers paginates; search first page and filter — fine for typical scale.
    let userId: string | null = null;
    for (let page = 1; page <= 20 && !userId; page++) {
      const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: 200,
      });
      if (error) throw new Error("Lookup failed");
      const match = list.users.find((u) => (u.email ?? "").toLowerCase() === emailLc);
      if (match) {
        userId = match.id;
        break;
      }
      if (list.users.length < 200) break;
    }

    if (!userId) {
      // Do not leak which field failed.
      throw new Error("Account not found or details do not match.");
    }

    // Verify full_name matches the profile registered at signup.
    const { data: profile, error: pErr } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle();
    if (pErr) throw new Error("Lookup failed");

    const provided = data.fullName.trim().toLowerCase();
    const stored = (profile?.full_name ?? "").trim().toLowerCase();
    if (!stored || provided !== stored) {
      throw new Error("Account not found or details do not match.");
    }

    const { error: upErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: data.newPassword,
    });
    if (upErr) throw new Error("Could not update password");

    return { ok: true };
  });
