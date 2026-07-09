import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PdfDropzone } from "@/components/site/PdfDropzone";

export const Route = createFileRoute("/emoiq/doubt")({
  component: DoubtPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

function DoubtPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pdfContext, setPdfContext] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      const res = await fetch(AI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: next }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "AI error");
      setMessages([...next, { role: "assistant", content: body.reply ?? "" }]);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tighter md:text-5xl">
        AI <span className="italic text-primary">Doubt Solver</span>
      </h1>
      <p className="mt-3 text-muted-foreground">Ask any doubt from your syllabus. Answers are concise and exam-focused.</p>

      {!user && <p className="mt-4 text-sm text-muted-foreground">Sign in to save chat history (coming soon).</p>}

      <div className="mt-8 min-h-[300px] space-y-3 rounded-2xl border border-border bg-surface/40 p-4">
        {messages.length === 0 && <p className="text-sm text-muted-foreground">Try: "Explain deadlock with an example" or "Difference between TCP and UDP for exam".</p>}
        {messages.map((m, i) => (
          <div key={i} className={`rounded-xl px-4 py-3 text-sm ${m.role === "user" ? "ml-8 bg-primary/10 text-foreground" : "mr-8 border border-border bg-surface text-foreground"}`}>
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">{m.role}</div>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
        {loading && <div className="text-sm text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin" /> Thinking…</div>}
        <div ref={endRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 rounded-full border border-border bg-surface px-5 py-3 text-sm outline-none focus:border-primary"
          placeholder="Ask a doubt…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !loading) send(); }}
        />
        <button onClick={send} disabled={loading || !input.trim()} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand disabled:opacity-50">
          <Send className="h-4 w-4" /> Send
        </button>
      </div>
    </section>
  );
}
