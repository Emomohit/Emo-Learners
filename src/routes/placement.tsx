import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/placement")({
  head: () => ({
    meta: [
      { title: "Placement Prep — Coding, Aptitude, Mock Interview, Resume" },
      { name: "description", content: "AI-powered placement prep for B.Tech students: coding practice, aptitude quizzes, mock interviews, and resume analysis in one place." },
      { property: "og:title", content: "Placement Prep — EMO Learners AI" },
      { property: "og:description", content: "Coding practice, aptitude, mock interviews, and resume analysis powered by AI." },
    ],
  }),
  component: PlacementLayout,
});

function PlacementLayout() {
  return (
    <div className="min-h-screen">
      <Marquee />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
