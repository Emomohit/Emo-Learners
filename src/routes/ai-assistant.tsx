import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Send, Sparkles, Bot, User as UserIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({ meta: [{ title: "AI Study Assistant — EMO Learners" }] }),
  component: AiPage,
});

type Msg = { role: "user" | "assistant" | "system"; content: string };

const SUGGESTIONS = [
  "Explain Big-O notation with a simple example",
  "What is dynamic programming? When should I use it?",
  "Give me a 7-day plan to crack DBMS for end-sem",
  "Difference between TCP and UDP in one minute",
];

function AiPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [loading, user, nav]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setBusy(true);

    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const reply = data.reply ?? data.message ?? "Sorry, I couldn't generate a response.";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (err: any) {
      toast.error(err.message ?? "Assistant unavailable");
      setMessages([...next, { role: "assistant", content: "I'm having trouble right now. Try again in a moment." }]);
    } finally {
      setBusy(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="relative flex-1 overflow-hidden px-4 py-10">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto flex h-[calc(100vh-180px)] max-w-4xl flex-col">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// Study Buddy</span>
              <h1 className="mt-2 font-display text-3xl font-extrabold uppercase italic tracking-tighter md:text-5xl">
                AI Study <span className="text-primary">Assistant</span>
              </h1>
            </div>
            <Link to="/resources" className="hidden text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary md:inline-block">← Resources</Link>
          </div>

          <div ref={scrollRef} className="mt-6 flex-1 overflow-y-auto rounded-3xl border border-border bg-surface/30 p-4 backdrop-blur md:p-6">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-display text-xl font-extrabold uppercase">Ask me anything</h3>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Doubt clearing, concept summaries, problem-solving help — built for B.Tech students.
                </p>
                <div className="mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="rounded-full border border-border bg-background/60 px-4 py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-surface text-primary border border-border"}`}>
                    {m.role === "user" ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground" : "border border-border bg-background/70"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm text-muted-foreground">
                    <Loader2 className="inline h-4 w-4 animate-spin" /> thinking…
                  </div>
                </div>
              )}
            </div>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="mt-4 flex gap-2 rounded-2xl border border-border bg-surface/60 p-2 backdrop-blur"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about DSA, OS, DBMS, ML…"
              className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" /> Send
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}
