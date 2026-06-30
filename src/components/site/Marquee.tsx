const items = [
  "LEARN AI",
  "BUILD SKILLS",
  "GET INTERNSHIPS",
  "100% FREE",
  "FOR INDIAN STUDENTS",
  "30 DAY PYTHON CHALLENGE",
  "QUIZZES",
  "TESTS",
];

export function Marquee() {
  const doubled = [...items, ...items];
  return (
    <div className="w-full overflow-hidden border-b border-border bg-primary/5 py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((t, i) => (
          <span
            key={i}
            className="mx-8 flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary/90"
          >
            <span className="h-1 w-1 rounded-full bg-primary" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
