import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Send, MessagesSquare, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/placement/interview")({
  component: MockInterviewPage,
});

type Msg = { role: "user" | "assistant" | "system"; content: string };

const AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

type Mode = "hr" | "technical" | "system-design" | "behavioral";
const modes: { id: Mode; label: string; role: string }[] = [
  { id: "hr", label: "HR Round", role: "You are a friendly HR interviewer at a top Indian tech company. Ask standard HR questions (tell me about yourself, strengths/weaknesses, why us, career goals). After each answer, give short constructive feedback in italics and then ask the next question. Keep replies under 120 words." },
  { id: "technical", label: "Technical", role: "You are a senior software engineer interviewing a B.Tech final-year student. Ask CS-fundamentals + coding questions (DSA, OS, DBMS, OOP, Networking). After each answer, rate it 1-10, point out gaps, and ask a follow-up. Keep replies under 150 words." },
  { id: "system-design", label: "System Design", role: "You are a staff engineer conducting an entry-level system design interview. Start with a simple prompt (URL shortener, chat app, notification service). Guide with hints, then critique. Keep replies under 150 words." },
  { id: "behavioral", label: "Behavioral", role: "You conduct STAR-method behavioral interviews. Ask situation-based questions (conflict, failure, teamwork). After each answer, evaluate against the STAR structure and coach the candidate. Keep replies under 120 words." },
];

function MockInterviewPage() {
  const [mode, setMode] = useState<Mode>("hr");
  const [role, setRole] = useState("Software Engineer");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(content: string, history: Msg[]) {
    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      const system = modes.find((m) => m.id === mode)!.role + ` The candidate is applying for: ${role}. This is a mock interview — stay in character.`;
      const payload: Msg[] = [{ role: "system", content: system }, ...history, { role: "user", content }];
      const res = await fetch(AI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: payload }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "AI error");
      setMessages([...history, { role: "user", content }, { role: "assistant", content: body.reply ?? "" }]);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function start() {
    setStarted(true);
    setMessages([]);
    await send(`Let's begin the ${modes.find((m) => m.id === mode)?.label} interview for the ${role} role. Ask me your first question.`, []);
  }

  async function reply() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    await send(text, messages);
  }

  function reset() {
    setStarted(false);
    setMessages([]);
    setInput("");
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <div className="flex items-center gap-3">
        <MessagesSquare className="h-6 w-6 text-primary" />
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tighter md:text-5xl">
          Mock <span className="italic text-primary">Interview</span>
        </h1>
      </div>
      <p className="mt-3 text-muted-foreground">Live AI interviewer. Answer like you would in a real interview — get feedback after every response.</p>

      {!started ? (
        <div className="mt-8 rounded-2xl border border-border bg-surface/40 p-6">
          <label className="font-mono text-[11px] uppercase tracking-widest text-primary">Interview type</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${mode === m.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground hover:border-primary/50"}`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <label className="mt-6 block font-mono text-[11px] uppercase tracking-widest text-primary">Target role</label>
          <input
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Software Engineer, Data Analyst, SDE Intern"
          />
          <button onClick={start} disabled={loading} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessagesSquare className="h-4 w-4" />}
            {loading ? "Starting…" : "Start interview"}
          </button>
        </div>
      ) : (
        <>
          <div className="mt-6 flex items-center justify-between">
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {modes.find((m) => m.id === mode)?.label} · {role}
            </div>
            <button onClick={reset} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary">
              <RotateCcw className="h-3 w-3" /> New session
            </button>
          </div>

          <div className="mt-4 min-h-[300px] space-y-3 rounded-2xl border border-border bg-surface/40 p-4">
            {messages.filter((m) => m.role !== "system").map((m, i) => (
              <div key={i} className={`rounded-xl px-4 py-3 text-sm ${m.role === "user" ? "ml-8 bg-primary/10 text-foreground" : "mr-8 border border-border bg-surface text-foreground"}`}>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">{m.role === "user" ? "You" : "Interviewer"}</div>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            ))}
            {loading && <div className="text-sm text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin" /> Thinking…</div>}
            <div ref={endRef} />
          </div>

          <div className="mt-4 flex gap-2">
            <input
              className="flex-1 rounded-full border border-border bg-surface px-5 py-3 text-sm outline-none focus:border-primary"
              placeholder="Type your answer…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !loading) reply(); }}
            />
            <button onClick={reply} disabled={loading || !input.trim()} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand disabled:opacity-50">
              <Send className="h-4 w-4" /> Send
            </button>
          </div>
        </>
      )}
    </section>
  );
}
