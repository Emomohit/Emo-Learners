import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import { Runner } from "@/components/site/Runner";
import { tests } from "@/lib/learn-data";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/tests/$slug")({
  head: ({ params }) => {
    const t = tests.find((x) => x.slug === params.slug);
    const title = t ? `${t.title} — Test` : "Test — EMO Learners";
    return {
      meta: [
        { title },
        { name: "description", content: t?.description ?? "Take a timed mock test on EMO Learners." },
        { property: "og:title", content: title },
        { property: "og:description", content: t?.description ?? "Take a timed mock test on EMO Learners." },
      ],
    };
  },
  loader: ({ params }) => {
    const test = tests.find((t) => t.slug === params.slug);
    if (!test) throw notFound();
    return { test };
  },
  component: TestPage,
  notFoundComponent: () => (
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
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen px-4 py-32 text-center">
      <h1 className="font-display text-3xl font-extrabold uppercase">Something broke</h1>
      <button onClick={reset} className="mt-6 rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">Retry</button>
    </div>
  ),
});

function TestPage() {
  const { test } = Route.useLoaderData();

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
