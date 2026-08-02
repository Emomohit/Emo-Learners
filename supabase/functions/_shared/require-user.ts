// Shared auth gate for AI edge functions.
//
// These endpoints spend real AI credits on every call, so they must never be
// callable by anonymous internet traffic. We verify the caller's Supabase
// access token against the Auth API and reject anything that is not a
// confirmed, signed-in user.
//
// The anon/publishable key is NOT accepted as a caller identity: it is embedded
// in the public client bundle, so treating it as proof of identity would be the
// same as no auth at all.

export type AuthedUser = { id: string; email: string | null };

/**
 * Returns the verified user, or a Response to return immediately.
 */
export async function requireUser(req: Request): Promise<AuthedUser | Response> {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
  const deny = (msg: string, status = 401) =>
    new Response(JSON.stringify({ error: msg }), {
      status,
      headers: { "Content-Type": "application/json", ...cors },
    });

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";

  if (!token) return deny("Sign in required.");

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) return deny("Auth not configured.", 500);

  // Reject the publishable/anon key being passed off as a user token.
  if (token === anonKey) return deny("Sign in required.");

  const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return deny("Sign in required.");

  const user = (await res.json()) as {
    id?: string;
    email?: string | null;
    aud?: string;
    role?: string;
  };

  if (!user?.id || user.role !== "authenticated") return deny("Sign in required.");

  return { id: user.id, email: user.email ?? null };
}
