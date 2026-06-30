import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Trash2, ShieldCheck, MessagesSquare, FileText, ClipboardList, Plus, X as XIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — EMO Learners" }] }),
  component: AdminPage,
});

type Subject = { id: string; branch: string; semester: number; code: string; name: string };
type Resource = { id: string; subject_id: string; kind: string; title: string; file_path: string; created_at: string };
type Feedback = { id: string; name: string; email: string; message: string; created_at: string };
type TestQuestion = { q: string; options: string[]; answer: number; explain?: string };
type CustomTest = { id: string; slug: string; title: string; topic: string; emoji: string; description: string | null; minutes: number; difficulty: string; questions: TestQuestion[]; published: boolean; created_at: string };

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"upload" | "tests" | "feedback">("upload");

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [loading, user, nav]);

  if (loading || !user) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 font-display text-3xl font-extrabold uppercase italic">Admins only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This area is for verified EMO Learners admins. Sign in with the founder account to access it.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const tabBtn = (key: typeof tab, label: string, Icon: typeof Upload) => (
    <button
      onClick={() => setTab(key)}
      className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all ${tab === key ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden px-4 py-16">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-6xl">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// Admin</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold uppercase italic tracking-tighter md:text-6xl">
            Control <span className="text-primary">Panel</span>
          </h1>

          <div className="mt-6 inline-flex flex-wrap rounded-full border border-border bg-surface/60 p-1">
            {tabBtn("upload", "Uploads", Upload)}
            {tabBtn("tests", "Tests", ClipboardList)}
            {tabBtn("feedback", "Feedback", MessagesSquare)}
          </div>

          <div className="mt-8">
            {tab === "upload" && <UploadPanel />}
            {tab === "tests" && <TestsPanel />}
            {tab === "feedback" && <FeedbackPanel />}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function UploadPanel() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [branch, setBranch] = useState("CSE");
  const [semester, setSemester] = useState(1);
  const [subjectId, setSubjectId] = useState("");
  const [kind, setKind] = useState<"notes" | "pyq" | "syllabus" | "important_qs">("notes");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState<string>("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("subjects")
        .select("*")
        .eq("branch", branch as any)
        .eq("semester", semester)
        .order("code");
      setSubjects((data ?? []) as Subject[]);
      setSubjectId("");
    })();
  }, [branch, semester]);

  useEffect(() => {
    if (!subjectId) {
      setResources([]);
      return;
    }
    refresh();
  }, [subjectId]);

  const refresh = async () => {
    const { data } = await supabase
      .from("resources")
      .select("*")
      .eq("subject_id", subjectId)
      .order("created_at", { ascending: false });
    setResources((data ?? []) as Resource[]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !subjectId || !title) return;
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "pdf";
      const path = `${branch}/${semester}/${subjectId}/${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("study-materials")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;

      const { error: insErr } = await supabase.from("resources").insert({
        subject_id: subjectId,
        kind,
        title,
        description: description || null,
        file_path: path,
        file_size: file.size,
        year: year ? Number(year) : null,
        uploaded_by: user?.id,
      });
      if (insErr) throw insErr;

      toast.success("Uploaded.");
      setTitle("");
      setDescription("");
      setYear("");
      setFile(null);
      (document.getElementById("file-input") as HTMLInputElement | null)?.value && ((document.getElementById("file-input") as HTMLInputElement).value = "");
      refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (r: Resource) => {
    if (!confirm(`Delete "${r.title}"?`)) return;
    await supabase.storage.from("study-materials").remove([r.file_path]);
    await supabase.from("resources").delete().eq("id", r.id);
    toast.success("Deleted");
    refresh();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-surface/40 p-6">
        <h3 className="font-display text-xl font-extrabold uppercase">Upload PDF</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Branch">
            <select value={branch} onChange={(e) => setBranch(e.target.value)} className="select">
              {["CSE", "CSE-IT", "CSE-CY", "AIML"].map((b) => <option key={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="Semester">
            <select value={semester} onChange={(e) => setSemester(Number(e.target.value))} className="select">
              {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Subject">
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required className="select">
            <option value="">Choose subject…</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}
          </select>
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Kind">
            <select value={kind} onChange={(e) => setKind(e.target.value as any)} className="select">
              <option value="notes">Notes</option>
              <option value="pyq">PYQ</option>
              <option value="syllabus">Syllabus</option>
              <option value="important_qs">Important Qs</option>
            </select>
          </Field>
          <Field label="Year (optional)">
            <input value={year} onChange={(e) => setYear(e.target.value)} inputMode="numeric" placeholder="2024" className="input" />
          </Field>
        </div>
        <Field label="Title">
          <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Unit 1 — Arrays & Linked Lists" className="input" />
        </Field>
        <Field label="Description (optional)">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="input resize-none" />
        </Field>
        <Field label="PDF / File">
          <input id="file-input" type="file" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} accept="application/pdf,image/*,.doc,.docx,.ppt,.pptx" className="input" />
        </Field>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-brand disabled:opacity-50"
        >
          <Upload className="h-4 w-4" /> {busy ? "Uploading…" : "Upload"}
        </button>
        <style>{`.input{width:100%;border:1px solid var(--border, hsl(var(--border)));background:hsl(var(--background));border-radius:.75rem;padding:.6rem .8rem;font-size:.875rem;color:hsl(var(--foreground))}.select{width:100%;border:1px solid hsl(var(--border));background:hsl(var(--background));border-radius:.75rem;padding:.6rem .8rem;font-size:.875rem;color:hsl(var(--foreground))}.input:focus,.select:focus{outline:none;border-color:hsl(var(--primary))}`}</style>
      </form>

      <div className="rounded-2xl border border-border bg-surface/40 p-6">
        <h3 className="font-display text-xl font-extrabold uppercase">Files in this subject</h3>
        {!subjectId && <p className="mt-3 text-sm text-muted-foreground">Pick a subject to see uploads.</p>}
        <div className="mt-3 space-y-2">
          {resources.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/50 p-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary"><FileText className="h-4 w-4" /></div>
                <div>
                  <div className="text-sm font-semibold">{r.title}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{r.kind}</div>
                </div>
              </div>
              <button onClick={() => remove(r)} className="rounded-lg border border-border p-2 text-muted-foreground hover:border-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeedbackPanel() {
  const [items, setItems] = useState<Feedback[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("feedback").select("*").order("created_at", { ascending: false }).limit(200);
      setItems((data ?? []) as Feedback[]);
    })();
  }, []);
  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-sm text-muted-foreground">No feedback yet.</p>}
      {items.map((f) => (
        <div key={f.id} className="rounded-2xl border border-border bg-surface/40 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div><b className="text-foreground">{f.name}</b> · <a href={`mailto:${f.email}`} className="text-primary hover:underline">{f.email}</a></div>
            <span className="font-mono text-muted-foreground">{new Date(f.created_at).toLocaleString()}</span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{f.message}</p>
        </div>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function emptyQ(): TestQuestion {
  return { q: "", options: ["", "", "", ""], answer: 0, explain: "" };
}

function TestsPanel() {
  const { user } = useAuth();
  const [items, setItems] = useState<CustomTest[]>([]);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [emoji, setEmoji] = useState("📝");
  const [minutes, setMinutes] = useState(20);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [questions, setQuestions] = useState<TestQuestion[]>([emptyQ()]);

  const refresh = async () => {
    const { data } = await supabase
      .from("custom_tests" as any)
      .select("*")
      .order("created_at", { ascending: false });
    setItems(((data ?? []) as unknown) as CustomTest[]);
  };

  useEffect(() => {
    refresh();
  }, []);

  const reset = () => {
    setTitle("");
    setTopic("");
    setEmoji("📝");
    setMinutes(20);
    setDifficulty("medium");
    setDescription("");
    setPublished(true);
    setQuestions([emptyQ()]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !topic) return toast.error("Title and topic are required");
    const clean = questions
      .map((q) => ({
        q: q.q.trim(),
        options: q.options.map((o) => o.trim()),
        answer: q.answer,
        explain: q.explain?.trim() || undefined,
      }))
      .filter((q) => q.q && q.options.every((o) => o));
    if (clean.length === 0) return toast.error("Add at least one complete question");

    setBusy(true);
    try {
      const slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`;
      const { error } = await supabase.from("custom_tests" as any).insert({
        slug,
        title,
        topic,
        emoji,
        description: description || null,
        minutes,
        difficulty,
        questions: clean,
        published,
        created_by: user?.id,
      } as any);
      if (error) throw error;
      toast.success("Test published");
      reset();
      refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to publish");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (t: CustomTest) => {
    if (!confirm(`Delete "${t.title}"?`)) return;
    await supabase.from("custom_tests" as any).delete().eq("id", t.id);
    toast.success("Deleted");
    refresh();
  };

  const togglePublish = async (t: CustomTest) => {
    await supabase.from("custom_tests" as any).update({ published: !t.published }).eq("id", t.id);
    refresh();
  };

  const setQ = (i: number, patch: Partial<TestQuestion>) =>
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  const setOpt = (i: number, oi: number, value: string) =>
    setQuestions((qs) =>
      qs.map((q, idx) =>
        idx === i ? { ...q, options: q.options.map((o, k) => (k === oi ? value : o)) } : q
      )
    );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-surface/40 p-6">
        <h3 className="font-display text-xl font-extrabold uppercase">New Test</h3>
        <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
          <Field label="Title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. OS Mid-Sem Mock" className="input" />
          </Field>
          <Field label="Emoji">
            <input value={emoji} onChange={(e) => setEmoji(e.target.value)} className="input text-center" />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Topic">
            <input value={topic} onChange={(e) => setTopic(e.target.value)} required placeholder="OS / DBMS / AI…" className="input" />
          </Field>
          <Field label="Minutes">
            <input type="number" min={1} value={minutes} onChange={(e) => setMinutes(Number(e.target.value) || 1)} className="input" />
          </Field>
          <Field label="Difficulty">
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className="select">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </Field>
        </div>
        <Field label="Description">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="input resize-none" />
        </Field>
        <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Publish immediately
        </label>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-sm font-extrabold uppercase tracking-widest">Questions ({questions.length})</h4>
            <button type="button" onClick={() => setQuestions((qs) => [...qs, emptyQ()])} className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              <Plus className="h-3 w-3" /> Add
            </button>
          </div>
          <div className="mt-3 space-y-4">
            {questions.map((q, i) => (
              <div key={i} className="rounded-xl border border-border bg-background/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">Q{i + 1}</span>
                  {questions.length > 1 && (
                    <button type="button" onClick={() => setQuestions((qs) => qs.filter((_, k) => k !== i))} className="text-muted-foreground hover:text-destructive">
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <textarea value={q.q} onChange={(e) => setQ(i, { q: e.target.value })} rows={2} placeholder="Question text…" className="input mt-2 resize-none" />
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input type="radio" name={`ans-${i}`} checked={q.answer === oi} onChange={() => setQ(i, { answer: oi })} className="h-3.5 w-3.5" />
                      <input value={opt} onChange={(e) => setOpt(i, oi, e.target.value)} placeholder={`Option ${oi + 1}`} className="input flex-1" />
                    </div>
                  ))}
                </div>
                <input value={q.explain ?? ""} onChange={(e) => setQ(i, { explain: e.target.value })} placeholder="Explanation (optional)" className="input mt-3" />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-brand disabled:opacity-50">
          {busy ? "Saving…" : "Publish Test"}
        </button>
      </form>

      <div className="rounded-2xl border border-border bg-surface/40 p-6">
        <h3 className="font-display text-xl font-extrabold uppercase">Your tests</h3>
        {items.length === 0 && <p className="mt-3 text-sm text-muted-foreground">Nothing yet — create your first test.</p>}
        <div className="mt-3 space-y-2">
          {items.map((t) => (
            <div key={t.id} className="rounded-xl border border-border bg-background/50 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{t.emoji} {t.title}</div>
                  <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t.topic} · {t.questions?.length ?? 0} Q · {t.minutes} min · {t.difficulty}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => togglePublish(t)} className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${t.published ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {t.published ? "Live" : "Draft"}
                  </button>
                  <button onClick={() => remove(t)} className="rounded-lg border border-border p-1.5 text-muted-foreground hover:border-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
