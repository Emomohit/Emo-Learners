const items = [
  "FREE FOR STUDENTS",
  "NOTES · PYQs · QUIZZES",
  "PYTHON · JAVA · C · DSA",
  "30-DAY PYTHON CHALLENGE",
  "AI STUDY HELPER",
  "BUILT FOR RGPV",
  "LEARN BY DOING",
  "JOIN THE COMMUNITY",
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
            <span className="h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
