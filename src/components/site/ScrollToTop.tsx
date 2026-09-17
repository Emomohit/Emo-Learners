import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-32 right-4 z-40 flex h-10 w-10 animate-fade items-center justify-center rounded-full border border-border bg-background text-foreground shadow-lg transition-all hover:-translate-y-1 hover:border-primary hover:text-primary lg:bottom-20 lg:right-6"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
