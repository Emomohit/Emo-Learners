import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import { Runner } from "@/components/site/Runner";
import { tests as staticTests, type Quiz } from "@/lib/learn-data";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/tests/$slug")({
  head: ({ params }) => {
    const t = staticTests.find((x) => x.slug === params.slug);
    const title = t ? `${t.title} — Test` : "Test — EMO Learners";
    return {
      meta: [
        { title },
        { name: "description", content: t?.description ?? "Take a timed mock test on EMO Learners." },
        { property: "og:title", content: title },
      ],
    };
  },
  component: TestPage,
});

function TestPage() {
  const { slug } = Route.useParams();
  const [test, setTest] = useState<Quiz | null>(() => staticTests.find((t) => t.slug === slug) ?? null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    staticTests.find((t) => t.slug === slug) ? "ready" : "loading"
  );

  useEffect(() => {
    if (test) return;
    (async () => {
      const { data } = await supabase
        .from("custom_tests" as any)
        .select("slug,title,topic,emoji,description,minutes,questions")
        .eq("slug", slug)
        .maybeSingle();
      if (data) {
        const d = data as any;
        setTest({
          slug: d.slug,
          title: d.title,
          topic: d.topic,
          emoji: d.emoji ?? "📝",
          description: d.description ?? "",
          minutes: d.minutes ?? 20,
          questions: Array.isArray(d.questions) ? d.questions : [],
        });
        setStatus("ready");
      } else {
        setStatus("missing");
      }
    })();
  }, [slug, test]);

  if (status === "loading") {
    return (
      <div className="min-h-screen">
        <Marquee />
        <Navbar />
        <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-32 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" /> Loading test…
        </div>
        <Footer />
      </div>
    );
  }

  if (status === "missing" || !test) {
    return (
      <div className="min-h-screen">
        <Marquee />
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-32 text-center">
          <h1 className="font-display text-5xl font-extrabold uppercase">Test not found</h1>
          <Link to="/tests" className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to tests
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Marquee />
      <Navbar />
      <section className="relative px-4 pb-24 pt-12">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <div className="mx-auto mb-8 max-w-3xl">
            <Link to="/tests" className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary">
              <ArrowLeft className="h-3.5 w-3.5" /> All tests
            </Link>
          </div>
          <Runner
            title={test.title}
            emoji={test.emoji}
            topic={test.topic}
            minutes={test.minutes}
            questions={test.questions}
            mode="test"
            backHref="/tests"
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
