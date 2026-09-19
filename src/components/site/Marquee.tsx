import { Link } from "@tanstack/react-router";

const items = [
  { text: "FREE FOR STUDENTS", link: "/about" },
  { text: "NOTES · PYQs · QUIZZES", link: "/resources" },
  { text: "PYTHON · JAVA · C · DSA", link: "/courses" },
  { text: "30-DAY PYTHON CHALLENGE", link: "/practice" },
  { text: "AI STUDY HELPER", link: "/emoiq" },
  { text: "BUILT FOR RGPV", link: "/resources" },
  { text: "LEARN BY DOING", link: "/courses" },
  { text: "JOIN THE COMMUNITY", link: "/join" },
];

export function Marquee() {
  const doubled = [...items, ...items];
  return (
    <div className="w-full overflow-hidden border-b border-border bg-background py-2.5">
      <div className="flex animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
        {doubled.map((t, i) => (
          <Link
            key={i}
            to={t.link}
            className="mx-8 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-widest text-primary transition-colors hover:text-foreground"
          >
            <span className="h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
            {t.text}
          </Link>
        ))}
      </div>
    </div>
  );
}
