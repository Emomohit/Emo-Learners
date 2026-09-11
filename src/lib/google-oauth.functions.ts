import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Direct Google sign-in that stays on OUR domain.
 *
 * Instead of sending students through the backend's hosted /authorize endpoint
 * (which can only return to its own allow-listed site URL), we run the Google
 * OAuth code flow ourselves: Google returns to <our origin>/auth/callback, the
 * code is exchanged server-side (client secret never reaches the browser), and
 * the resulting Google ID token is handed to Supabase via signInWithIdToken.
 */

const redirectUriSchema = z
  .string()
  .url()
  .refine((value) => value.endsWith("/auth/callback"), "unexpected redirect target");

export const buildGoogleAuthUrl = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ redirectUri: redirectUriSchema, state: z.string().min(16).max(128) }).parse(data),
  )
  .handler(async ({ data }) => {
    const clientId = process.env["GOOGLE_OAUTH_CLIENT_ID"];
    if (!clientId) throw new Error("google_not_configured");

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: data.redirectUri,
      response_type: "code",
      scope: "openid email profile",
      state: data.state,
      prompt: "select_account",
      access_type: "online",
      include_granted_scopes: "true",
    });

    return { url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` };
  });

export const exchangeGoogleCode = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ code: z.string().min(10).max(2048), redirectUri: redirectUriSchema }).parse(data),
  )
  .handler(async ({ data }) => {
    const clientId = process.env["GOOGLE_OAUTH_CLIENT_ID"];
    const clientSecret = process.env["GOOGLE_OAUTH_CLIENT_SECRET"];
    if (!clientId || !clientSecret) throw new Error("google_not_configured");

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: data.code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: data.redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!res.ok) {
      // Never leak the provider payload (it can contain client details).
      console.error("Google token exchange failed with status", res.status);
      throw new Error("google_exchange_failed");
    }

    const body = (await res.json()) as { id_token?: string };
    if (!body.id_token) throw new Error("google_exchange_failed");

    // The token came straight from Google's token endpoint over TLS, using our
    // own client secret, so the payload is trustworthy. We still check the
    // basics before trusting the email.
    const payload = decodeJwtPayload(body.id_token);
    const email = typeof payload.email === "string" ? payload.email.toLowerCase().trim() : "";
    const emailVerified = payload.email_verified === true || payload.email_verified === "true";
    const audience = typeof payload.aud === "string" ? payload.aud : "";
    const issuer = typeof payload.iss === "string" ? payload.iss : "";
    const expiry = typeof payload.exp === "number" ? payload.exp : 0;

    if (
      !email ||
      !emailVerified ||
      audience !== clientId ||
      !["accounts.google.com", "https://accounts.google.com"].includes(issuer) ||
      expiry * 1000 < Date.now()
    ) {
      throw new Error("google_token_rejected");
    }

    const fullName = typeof payload.name === "string" ? payload.name : "";
    const picture = typeof payload.picture === "string" ? payload.picture : "";

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Find the matching account, or create one for a first-time Google student.
    const { data: existing } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    let user = existing?.users.find((u) => u.email?.toLowerCase() === email);

    if (!user) {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: fullName, avatar_url: picture, signup_provider: "google" },
      });
      if (createErr || !created.user) {
        console.error("Google user creation failed:", createErr?.message);
        throw new Error("google_account_setup_failed");
      }
      user = created.user;
    } else if (fullName && !user.user_metadata?.full_name) {
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: { ...user.user_metadata, full_name: fullName, avatar_url: picture },
      });
    }

    // Mint a single-use sign-in token. Only its hash leaves the server.
    const { data: link, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkErr || !link.properties?.hashed_token) {
      console.error("Google session token failed:", linkErr?.message);
      throw new Error("google_session_failed");
    }

    return { tokenHash: link.properties.hashed_token };
  });

function decodeJwtPayload(token: string): Record<string, unknown> {
  const part = token.split(".")[1];
  if (!part) throw new Error("google_token_rejected");
  const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(json) as Record<string, unknown>;
}

