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

    const userEmail = context.claims?.email?.toLowerCase().trim();
    const emailVerified =
      (context.claims as { email_verified?: boolean })?.email_verified ?? false;

    if (!userEmail || userEmail !== founderEmail || !emailVerified) {
      return { promoted: false };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
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
