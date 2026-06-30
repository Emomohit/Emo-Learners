import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download, BookOpen, Sparkles, ShieldCheck, MessagesSquare } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — EMO Learners" }] }),
  component: Dashboard,
});

type Row = {
  id: string;
  title: string;
  kind: string;
  file_path: string;
  created_at: string;
  subject: { code: string; name: string; branch: string; semester: number } | null;
};

function Dashboard() {
  const { user, loading, isAdmin } = useAuth();
  const nav = useNavigate();
  const [recent, setRecent] = useState<Row[]>([]);
  const [counts, setCounts] = useState({ notes: 0, pyq: 0, syllabus: 0, important_qs: 0 });

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [loading, user, nav]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("resources")
        .select("id,title,kind,file_path,created_at,subject:subjects(code,name,branch,semester)")
        .order("created_at", { ascending: false })
        .limit(8);
      setRecent((data as any) ?? []);

      const kinds: (keyof typeof counts)[] = ["notes", "pyq", "syllabus", "important_qs"];
      const next = { notes: 0, pyq: 0, syllabus: 0, important_qs: 0 };
      await Promise.all(
        kinds.map(async (k) => {
          const { count } = await supabase
            .from("resources")
            .select("*", { count: "exact", head: true })
            .eq("kind", k);
          next[k] = count ?? 0;
        }),
      );
      setCounts(next);
    })();
  }, [user]);

  const download = async (path: string) => {
    const { data, error } = await supabase.storage
      .from("study-materials")
      .createSignedUrl(path, 600);
    if (error || !data?.signedUrl) return toast.error("Couldn't fetch file");
    window.open(data.signedUrl, "_blank", "noopener");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden px-4 py-16">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-6xl">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// Dashboard</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold uppercase italic tracking-tighter md:text-6xl">
            Hey, <span className="text-primary">{user.user_metadata?.full_name || user.email?.split("@")[0]}</span>
          </h1>
          <p className="mt-3 text-muted-foreground">Your study hub at a glance.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Notes" value={counts.notes} />
            <Stat label="PYQs" value={counts.pyq} />
            <Stat label="Syllabus" value={counts.syllabus} />
            <Stat label="Important Qs" value={counts.important_qs} />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickCard to="/resources" icon={<BookOpen className="h-5 w-5" />} title="Browse Resources" desc="Notes, PYQs & syllabus by branch & sem." />
            <QuickCard to="/ai-assistant" icon={<Sparkles className="h-5 w-5" />} title="AI Study Assistant" desc="Ask doubts. Get clean answers." />
            <QuickCard to="/contact" icon={<MessagesSquare className="h-5 w-5" />} title="Feedback" desc="Tell us what to build next." />
            {isAdmin && (
              <QuickCard to="/admin" icon={<ShieldCheck className="h-5 w-5" />} title="Admin Panel" desc="Upload PDFs · view feedback." accent />
            )}
          </div>

          <div className="mt-12">
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">// Recent uploads</h2>
            <div className="mt-3 space-y-2">
              {recent.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-surface/30 p-8 text-center text-sm text-muted-foreground">
                  No materials uploaded yet. Check back soon.
                </div>
              )}
              {recent.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/40 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary"><FileText className="h-4 w-4" /></div>
                    <div>
                      <div className="font-semibold">{r.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.subject?.code} · {r.subject?.name} · {r.subject?.branch} · Sem {r.subject?.semester}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => download(r.file_path)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-brand"
                  >
                    <Download className="h-3.5 w-3.5" /> Open
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5 backdrop-blur">
      <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-4xl font-extrabold text-primary">{value}</div>
    </div>
  );
}

function QuickCard({
  to,
  icon,
  title,
  desc,
  accent,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group rounded-2xl border p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary ${
        accent ? "border-primary/40 bg-primary/5" : "border-border bg-surface/40"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        <div className="font-display text-lg font-extrabold uppercase">{title}</div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
    </Link>
  );
}
