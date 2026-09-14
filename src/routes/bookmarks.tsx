import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { getBookmarks, removeBookmark, type Bookmark } from "@/lib/bookmarks";
import {
  Bookmark as BookmarkIcon,
  Trash2,
  ArrowRight,
  BookOpen,
  PlayCircle,
  Trophy,
  HelpCircle,
  FileText,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [{ title: "My Bookmarks | EMO Learners" }],
  }),
  component: BookmarksPage,
});

const kindIcons: Record<Bookmark["kind"], React.ElementType> = {
  course: PlayCircle,
  chapter: BookOpen,
  quiz: HelpCircle,
  test: Trophy,
  resource: FileText,
  challenge: Code2,
};

function BookmarksPage() {
  const [items, setItems] = useState<Bookmark[]>([]);

  useEffect(() => {
    setItems(getBookmarks());
    const onChange = () => setItems(getBookmarks());
    window.addEventListener("emo:bookmarks:change", onChange);
    return () => window.removeEventListener("emo:bookmarks:change", onChange);
  }, []);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeBookmark(id);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-10 md:px-6 md:py-14">
        <header className="border-b border-border pb-8">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
            Saved items
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl flex items-center gap-4">
            <BookmarkIcon className="h-10 w-10 text-primary" /> My Bookmarks
          </h1>
          <p className="mt-3 text-muted-foreground">
            A quick way to get back to the resources, courses, and chapters you've saved.
          </p>
        </header>

        <section className="mt-10">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface/30 p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <BookmarkIcon className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mt-6 font-display text-2xl font-bold">No bookmarks yet</h2>
              <p className="mt-2 text-muted-foreground">
                When you see the save icon on chapters or resources, click it to add them here.
              </p>
              <Button asChild className="mt-6">
                <Link to="/courses">
                  Explore courses <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((b) => {
                const Icon = kindIcons[b.kind] || BookmarkIcon;
                return (
                  <Link
                    key={b.id}
                    to={b.href}
                    className="group relative flex flex-col justify-between rounded-xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {b.kind}
                          </div>
                          <h3 className="mt-1 font-semibold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 pr-2">
                            {b.title}
                          </h3>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleRemove(b.id, e)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remove bookmark"
                        title="Remove bookmark"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
                      <span className="text-xs text-muted-foreground">
                        Saved {new Date(b.addedAt).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary opacity-80 group-hover:opacity-100">
                        Open{" "}
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
