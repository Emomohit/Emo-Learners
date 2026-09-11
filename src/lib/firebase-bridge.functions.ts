import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Exchanges a Firebase ID token for an EMO Learners session.
 *
 * Security: nothing the client sends is trusted except the signed Firebase ID
 * token, which is verified here against Google's public keys (signature,
 * issuer, audience, expiry). Email/name/picture are read from the verified
 * token payload only. The response contains a single-use hashed link token the
 * browser exchanges for its own session; no admin credentials leave the server.
 */
export const firebaseGoogleBridge = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ idToken: z.string().min(20).max(8000) }).parse(data))
  .handler(async ({ data }) => {
    const projectId = process.env.FIREBASE_PROJECT_ID ?? "emo-learners-web";
    const { createRemoteJWKSet, jwtVerify } = await import("jose");

    const jwks = createRemoteJWKSet(
      new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
    );

    let payload: Record<string, unknown>;
    try {
      const verified = await jwtVerify(data.idToken, jwks, {
        issuer: `https://securetoken.google.com/${projectId}`,
        audience: projectId,
      });
      payload = verified.payload as Record<string, unknown>;
    } catch (err) {
      console.error("Firebase token verification failed:", (err as Error)?.message);
      throw new Error("google-verification-failed");
    }

    const email = typeof payload.email === "string" ? payload.email.toLowerCase().trim() : "";
    const emailVerified = payload.email_verified === true;
    const firebaseUid = typeof payload.sub === "string" ? payload.sub : "";
    const fullName = typeof payload.name === "string" ? payload.name : null;
    const picture = typeof payload.picture === "string" ? payload.picture : null;

    if (!email || !emailVerified || !firebaseUid) throw new Error("google-verification-failed");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const metadata = {
      firebase_uid: firebaseUid,
      auth_provider: "firebase_google",
      ...(fullName ? { full_name: fullName } : {}),
      ...(picture ? { avatar_url: picture } : {}),
    };

    // Existing account for this email? Reuse it — never create a second one.
    let link = await supabaseAdmin.auth.admin.generateLink({ type: "magiclink", email });

    if (link.error) {
      const created = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: metadata,
      });
      if (created.error || !created.data.user) {
        console.error("Firebase bridge createUser failed:", created.error?.message);
        throw new Error("google-signin-failed");
      }
      link = await supabaseAdmin.auth.admin.generateLink({ type: "magiclink", email });
      if (link.error) {
        console.error("Firebase bridge generateLink failed:", link.error.message);
        throw new Error("google-signin-failed");
      }
    } else if (link.data.user) {
      // Keep the Firebase identity on file without touching anything the
      // student has already personalised.
      const existing = (link.data.user.user_metadata ?? {}) as Record<string, unknown>;
      await supabaseAdmin.auth.admin.updateUserById(link.data.user.id, {
        user_metadata: {
          ...existing,
          firebase_uid: firebaseUid,
          ...(existing.full_name ? {} : fullName ? { full_name: fullName } : {}),
          ...(existing.avatar_url ? {} : picture ? { avatar_url: picture } : {}),
        },
      });
    }

    const userId = link.data.user?.id;
    const hashedToken = link.data.properties?.hashed_token;
    if (!userId || !hashedToken) throw new Error("google-signin-failed");

    // Fill only the blanks on the profile — a custom name/photo always wins.
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", userId)
      .maybeSingle();

    if (!profile) {
      await supabaseAdmin
        .from("profiles")
        .upsert({ id: userId, email, full_name: fullName, avatar_url: picture }, { onConflict: "id" });
    } else {
      const patch: { full_name?: string; avatar_url?: string } = {};
      if (!profile.full_name && fullName) patch.full_name = fullName;
      if (!profile.avatar_url && picture) patch.avatar_url = picture;
      if (Object.keys(patch).length > 0) {
        await supabaseAdmin.from("profiles").update(patch).eq("id", userId);
      }
    }

    return { email, tokenHash: hashedToken };
  });
