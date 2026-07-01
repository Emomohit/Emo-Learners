import { Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { isBookmarked, toggleBookmark, type Bookmark as B } from "@/lib/bookmarks";
import { toast } from "sonner";

type Props = Omit<B, "addedAt"> & { compact?: boolean };

export function BookmarkButton({ compact, ...b }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(b.id));
    const onChange = () => setSaved(isBookmarked(b.id));
    window.addEventListener("emo:bookmarks:change", onChange);
    return () => window.removeEventListener("emo:bookmarks:change", onChange);
  }, [b.id]);

  const onClick = () => {
    const nowSaved = toggleBookmark(b);
    setSaved(nowSaved);
    toast(nowSaved ? "Saved to bookmarks" : "Removed from bookmarks");
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? "Remove bookmark" : "Save bookmark"}
      className={
        compact
          ? "inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/60 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          : "inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      }
    >
      {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
      {!compact && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
