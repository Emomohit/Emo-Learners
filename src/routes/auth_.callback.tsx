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

    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const pick = (key: string) => query.get(key) ?? hash.get(key);

    const providerError = pick("error") ?? pick("error_description");
    if (providerError) {
      bail(providerError);
      return;
    }

    (async () => {
      const accessToken = pick("access_token");
      const refreshToken = pick("refresh_token");
      const code = pick("code");

      try {
        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        }

        // The auth client picks the sign-in code out of the URL by itself, so we
        // wait for it and only step in ourselves if nothing arrived in time.
        for (let attempt = 0; attempt < 20; attempt += 1) {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            window.history.replaceState({}, "", window.location.pathname);
            finish(destination());
            return;
          }
          if (attempt === 8 && code) {
            try {
              await supabase.auth.exchangeCodeForSession(code);
            } catch {
              /* the client may have already used this code */
            }
          }
          await new Promise((resolve) => setTimeout(resolve, 250));
        }

        bail("session could not be created");
      } catch (err) {
        bail(err instanceof Error ? err.message : String(err));
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
