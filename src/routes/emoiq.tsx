import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/emoiq")({
  head: () => ({
    meta: [
      { title: "EMoIQ — AI-Powered Smart Exam Strategy Engine" },
      { name: "description", content: "Upload PYQs, get topic weightage, predicted questions, a personalized study plan, and an AI doubt solver. Built for Indian B.Tech students." },
      { property: "og:title", content: "EMoIQ — AI Exam Strategy Engine" },
      { property: "og:description", content: "PYQ intelligence, question prediction, personalized study plans, and AI doubt solver." },
    ],
  }),
  component: EmoIqLayout,
});

function EmoIqLayout() {
  return (
    <div className="min-h-screen">
      <Marquee />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
