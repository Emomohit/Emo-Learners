import { useState } from "react";
import { MessageSquareWarning, X, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export function FeedbackWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed.length < 5) {
      toast.error("Please write a bit more so we can help.");
      return;
    }
    if (trimmed.length > 1000) {
      toast.error("Please keep it under 1000 characters.");
      return;
    }
    if (!user) {
      toast.error("Sign in to send feedback.");
      return;
    }
    setBusy(true);
    const page = typeof window !== "undefined" ? window.location.pathname : "";
    const { error } = await supabase.from("feedback" as any).insert({
      user_id: user.id,
      name: (user.user_metadata as any)?.full_name ?? user.email?.split("@")[0] ?? "Student",
      email: user.email ?? "unknown@emolearners.app",
      message: `[${page}] ${trimmed}`,
    } as any);
    setBusy(false);
    if (error) {
      toast.error("Could not send. Try again in a moment.");
      return;
    }
    toast.success("Thanks — we read every message.");
    setMessage("");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Report a mistake or send feedback"
        className="fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 rounded-md border border-foreground bg-background px-3 py-2 text-[10px] font-bold text-foreground shadow-lg transition-all hover:border-primary hover:text-primary lg:bottom-6"
      >
        <MessageSquareWarning className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Report / Feedback</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Send feedback"
          className="fixed inset-0 z-50 flex items-end justify-center bg-background p-4 sm:items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <form
            onSubmit={submit}
            className="w-full max-w-md rounded-md border-2 border-foreground bg-background p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Tell us what's wrong</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Spotted a wrong answer, broken link, or typo? Send it here.
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              maxLength={1000}
              placeholder="What went wrong, on which page?"
              className="mt-4 w-full rounded-md border border-input bg-background p-3 text-sm text-foreground focus:border-primary focus:outline-none"
              required
            />
            <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{message.length}/1000</span>
              {!user && <span className="text-primary">Sign in to send</span>}
            </div>
            <button
              type="submit"
              disabled={busy || !user}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-xs font-bold btn-grad disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send feedback
            </button>
          </form>
        </div>
      )}
    </>
  );
}
