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
 * Handles the Google return trip on our own domain.
 *
 * This public page only waits for the existing auth provider to finish
 * restoring its session, then sends the student to the intended app page.
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

    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!error && data.session) {
        finish(destination());
        return;
      }
      bail(error?.message ?? "session could not be created");
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
