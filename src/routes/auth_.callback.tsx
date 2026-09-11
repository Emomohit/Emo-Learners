import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
 * Handles the Google OAuth return trip.
 *
 * The Supabase client exchanges the code/tokens found in the URL and stores the
 * session. We wait for that confirmed session (and the profile row created by
 * the database trigger) BEFORE navigating, so the dashboard never renders
 * without a user. Nothing from the identity provider is trusted directly.
 */
function AuthCallbackPage() {
  const nav = useNavigate();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let done = false;

    const finish = (dest: string) => {
      if (done) return;
      done = true;
      sub?.subscription.unsubscribe();
      try {
        sessionStorage.removeItem("postAuthRedirect");
      } catch {
        /* ignore */
      }
      // Replace so the callback URL (with its one-time code) leaves history.
      nav({ to: dest, replace: true });
    };

    const destination = () => {
      let stored: string | null = null;
      try {
        stored = sessionStorage.getItem("postAuthRedirect");
      } catch {
        stored = null;
      }
      return safePath(stored) ?? DEFAULT_DEST;
    };

    const bail = (reason: string) => {
      if (done) return;
      done = true;
      sub?.subscription.unsubscribe();
      console.error("OAuth callback failed:", reason);
      setFailed(true);
      nav({ to: "/auth", search: { error: "google" }, replace: true });
    };

    // The provider reported a problem (including the user cancelling).
    const params = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const providerError = params.get("error") ?? hash.get("error");
    if (providerError) {
      bail(providerError);
      return;
    }

    let sub: { subscription: { unsubscribe: () => void } } | undefined;

    sub = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        finish(destination());
      }
    });

    // Poll for the session the client establishes from the URL, then confirm the
    // user server-side before we redirect anywhere.
    (async () => {
      for (let attempt = 0; attempt < 40 && !done; attempt++) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const { data: verified, error } = await supabase.auth.getUser();
          if (error || !verified.user) {
            bail(error?.message ?? "user could not be verified");
            return;
          }
          finish(destination());
          return;
        }
        await new Promise((r) => setTimeout(r, 250));
      }
      if (!done) bail("timed out waiting for the session");
    })();

    return () => {
      done = true;
      sub?.subscription.unsubscribe();
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
