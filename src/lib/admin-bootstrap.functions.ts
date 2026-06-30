import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Promotes the signed-in user to the 'admin' role IF their verified email
 * matches the FOUNDER_ADMIN_EMAIL backend secret. Safe to call on every login.
 * The email is never sent to the client — it lives only in server env.
 */
export const ensureFounderAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const founderEmail = process.env.FOUNDER_ADMIN_EMAIL?.toLowerCase().trim();
    if (!founderEmail) return { promoted: false };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Verify email + confirmation server-side via Admin API (don't rely on JWT claim shape).
    const { data: userRes, error: userErr } = await supabaseAdmin.auth.admin.getUserById(
      context.userId,
    );
    const userEmail = userRes?.user?.email?.toLowerCase().trim();
    const confirmed = !!userRes?.user?.email_confirmed_at;
    if (userErr || !userEmail || userEmail !== founderEmail || !confirmed) {
      return { promoted: false };
    }

    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert(
        { user_id: context.userId, role: "admin" },
        { onConflict: "user_id,role", ignoreDuplicates: true },
      );

    if (error) {
      console.error("ensureFounderAdmin upsert failed:", error.message);
      return { promoted: false };
    }
    return { promoted: true };
  });
