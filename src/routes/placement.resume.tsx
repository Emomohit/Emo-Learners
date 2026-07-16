import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PdfDropzone } from "@/components/site/PdfDropzone";

export const Route = createFileRoute("/placement/resume")({
  component: ResumeAnalyzer,
});

const AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

type Analysis = {
  overall: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  ats: string;
};

const SYSTEM = `You are a senior tech recruiter reviewing a fresher B.Tech resume for Indian tech placements. Reply in STRICT JSON only, no prose, matching:
{
  "overall": "1-2 sentence verdict",
  "score": number (0-100),
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["actionable rewrite tips, prefer specific rewrites"],
  "ats": "1-2 lines on ATS compatibility (keywords, format)"
}`;

function ResumeAnalyzer() {
  const [pdfText, setPdfText] = useState("");
  const [target, setTarget] = useState("Software Engineer intern / new grad");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);

  async function analyze() {
    if (!pdfText.trim()) { toast.error("Upload your resume PDF first"); return; }
    setLoading(true);
    setResult(null);
    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      const user = `Target role: ${target}\n\nResume text:\n"""${pdfText.slice(0, 40000)}"""\n\nReturn JSON only.`;
      const res = await fetch(AI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: [{ role: "system", content: SYSTEM }, { role: "user", content: user }] }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "AI error");
      const raw = String(body.reply ?? "").trim().replace(/^```json\s*|\s*```$/g, "");
      const parsed = JSON.parse(raw) as Analysis;
      setResult(parsed);
    } catch (e) {
      toast.error("Could not analyze resume. Try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tighter md:text-5xl">
          Resume <span className="italic text-primary">Analyzer</span>
        </h1>
      </div>
      <p className="mt-3 text-muted-foreground">Upload your resume PDF. AI scores it and gives specific rewrite suggestions.</p>

      <div className="mt-6">
        <label className="block font-mono text-[11px] uppercase tracking-widest text-primary">Target role</label>
        <input
          className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="e.g. Frontend Developer, Data Analyst"
        />
      </div>

      <div className="mt-4">
        <PdfDropzone
          label="Upload your resume (PDF)"
          hint="Text is extracted in your browser. One file works best."
          onText={(t) => setPdfText(t)}
        />
      </div>

      <button onClick={analyze} disabled={loading || !pdfText.trim()} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand disabled:opacity-50">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "Analyzing…" : "Analyze resume"}
      </button>

      {result && (
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5">
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[11px] uppercase tracking-widest text-primary">Overall</div>
              <div className="font-display text-4xl font-extrabold text-primary">{Math.round(result.score)}<span className="text-lg text-muted-foreground">/100</span></div>
            </div>
            <p className="mt-2 text-sm">{result.overall}</p>
          </div>

          <ResultList title="Strengths" items={result.strengths} tone="emerald" />
          <ResultList title="Weaknesses" items={result.weaknesses} tone="red" />
          <ResultList title="Suggested rewrites" items={result.suggestions} tone="primary" />

          <div className="rounded-2xl border border-border bg-surface/50 p-5">
            <div className="font-mono text-[11px] uppercase tracking-widest text-primary">ATS notes</div>
            <p className="mt-2 text-sm text-muted-foreground">{result.ats}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function ResultList({ title, items, tone }: { title: string; items: string[]; tone: "emerald" | "red" | "primary" }) {
  if (!items?.length) return null;
  const toneClass = tone === "emerald" ? "text-emerald-400" : tone === "red" ? "text-red-400" : "text-primary";
  return (
    <div className="rounded-2xl border border-border bg-surface/50 p-5">
      <div className={`font-mono text-[11px] uppercase tracking-widest ${toneClass}`}>{title}</div>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((it, i) => <li key={i} className="flex gap-2"><span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${tone === "emerald" ? "bg-emerald-400" : tone === "red" ? "bg-red-400" : "bg-primary"}`} />{it}</li>)}
      </ul>
    </div>
  );
}
