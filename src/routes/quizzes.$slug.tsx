import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import { Runner } from "@/components/site/Runner";
import { quizzes } from "@/lib/learn-data";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/quizzes/$slug")({
  head: ({ params }) => {
    const q = quizzes.find((x) => x.slug === params.slug);
    const title = q ? `${q.title} — Quiz` : "Quiz — EMO Learners";
    return {
      meta: [
        { title },
        { name: "description", content: q?.description ?? "Take an interactive quiz on EMO Learners." },
        { property: "og:title", content: title },
        { property: "og:description", content: q?.description ?? "Take an interactive quiz on EMO Learners." },
      ],
    };
  },
  loader: ({ params }) => {
    const quiz = quizzes.find((q) => q.slug === params.slug);
    if (!quiz) throw notFound();
    return { quiz };
  },
  component: QuizPage,
  notFoundComponent: () => (
    <div className="min-h-screen">
      <Marquee />
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="font-display text-5xl font-extrabold uppercase">Quiz not found</h1>
        <Link to="/quizzes" className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to quizzes
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

function QuizPage() {
  const { slug } = Route.useParams();
  const quiz = quizzes.find((q) => q.slug === slug)!;

  return (
    <div className="min-h-screen">
      <Marquee />
      <Navbar />
      <section className="relative px-4 pb-24 pt-12">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <div className="mx-auto mb-8 max-w-3xl">
            <Link to="/quizzes" className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary">
              <ArrowLeft className="h-3.5 w-3.5" /> All quizzes
            </Link>
          </div>
          <Runner
            title={quiz.title}
            emoji={quiz.emoji}
            topic={quiz.topic}
            minutes={quiz.minutes}
            questions={quiz.questions}
            mode="quiz"
            backHref="/quizzes"
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
