import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { exchangeGoogleCode } from "@/lib/google-oauth.functions";

export const Route = createFileRoute("/auth_/callback")({
  ssr: false,
  head: () => ({ meta: [{ title: "Signing you in — EMO Learners" }] }),
  component: AuthCallbackPage,
});

const DEFAULT_DEST = "/dashboard";

function safePath(value: string | null | undefined) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}

/**
 * Handles the Google return trip on our own domain.
 *
 * Google sends back a one-time code. It is exchanged server-side (the client
 * secret never touches the browser) for a Google ID token, which Supabase
 * verifies before creating the session. Only then do we navigate onwards, so
 * the dashboard never renders without a user.
 */
function AuthCallbackPage() {
  const nav = useNavigate();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let done = false;

    const destination = () => {
      let stored: string | null = null;
      try {
        stored = sessionStorage.getItem("postAuthRedirect");
      } catch {
        stored = null;
      }
      return safePath(stored) ?? DEFAULT_DEST;
    };

    const cleanup = () => {
      try {
        sessionStorage.removeItem("postAuthRedirect");
        sessionStorage.removeItem("googleOAuthState");
      } catch {
        /* ignore */
      }
    };

    const finish = (dest: string) => {
      if (done) return;
      done = true;
      cleanup();
      // Replace so the callback URL (with its one-time code) leaves history.
      nav({ to: dest, replace: true });
    };

    const bail = (reason: string) => {
      if (done) return;
      done = true;
      cleanup();
      console.error("OAuth callback failed:", reason);
      setFailed(true);
      nav({ to: "/auth", search: { error: "google" }, replace: true });
    };

    const params = new URLSearchParams(window.location.search);
    const providerError = params.get("error");
    if (providerError) {
      bail(providerError);
      return;
    }

    const code = params.get("code");
    const state = params.get("state");

    (async () => {
      // Already signed in (e.g. a refresh of this page) — just move on.
      const existing = await supabase.auth.getSession();
      if (existing.data.session) {
        finish(destination());
        return;
      }

      if (!code) {
        bail("missing authorization code");
        return;
      }

      let expectedState: string | null = null;
      try {
        expectedState = sessionStorage.getItem("googleOAuthState");
      } catch {
        expectedState = null;
      }
      if (!state || !expectedState || state !== expectedState) {
        bail("state mismatch");
        return;
      }

      try {
        const { tokenHash } = await exchangeGoogleCode({
          data: { code, redirectUri: `${window.location.origin}/auth/callback` },
        });
        const { data, error } = await supabase.auth.verifyOtp({
          type: "magiclink",
          token_hash: tokenHash,
        });

        if (error || !data.session?.user) {
          bail(error?.message ?? "session could not be created");
          return;
        }
        finish(destination());
      } catch (err) {
        bail(err instanceof Error ? err.message : "unexpected error");
      }
    })();

    return () => {
      done = true;
    };
  }, [nav]);



  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="panel w-full max-w-sm p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border">
          <Zap className="h-6 w-6 text-primary" strokeWidth={2.5} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold">
          {failed ? "Taking you back to sign in" : "Signing you in…"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {failed
            ? "Please try again in a moment."
            : "Just a second while we get your account and progress ready."}
        </p>
        <div className="mx-auto mt-6 h-1 w-24 overflow-hidden rounded-full bg-border">
          <div className="h-full w-1/2 animate-marquee rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
