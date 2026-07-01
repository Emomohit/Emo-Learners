// Simple client-side bookmarks. Later this can sync to Supabase.
const KEY = "emo:bookmarks:v1";

export type Bookmark = {
  id: string; // e.g. "course:java:ch-3"
  title: string;
  href: string;
  kind: "course" | "chapter" | "quiz" | "test" | "resource" | "challenge";
  addedAt: number;
};

function read(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Bookmark[];
  } catch {
    return [];
  }
}

function write(list: Bookmark[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("emo:bookmarks:change"));
}

export function getBookmarks(): Bookmark[] {
  return read().sort((a, b) => b.addedAt - a.addedAt);
}

export function isBookmarked(id: string): boolean {
  return read().some((b) => b.id === id);
}

export function toggleBookmark(b: Omit<Bookmark, "addedAt">): boolean {
  const list = read();
  const i = list.findIndex((x) => x.id === b.id);
  if (i >= 0) {
    list.splice(i, 1);
    write(list);
    return false;
  }
  list.push({ ...b, addedAt: Date.now() });
  write(list);
  return true;
}

export function removeBookmark(id: string) {
  write(read().filter((b) => b.id !== id));
}
