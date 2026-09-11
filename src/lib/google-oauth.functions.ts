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

    return { idToken: body.id_token };
  });
