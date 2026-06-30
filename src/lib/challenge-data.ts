export const CHALLENGE_START_DATE = "2026-07-15T00:00:00+05:30";
export const COURSE_URL = "https://youtu.be/UrsmFxEIp5k?si=Rd4V3aL7ztanYQ8u";

export type DayStatus = "locked" | "available" | "completed";

export interface ChallengeDay {
  id: number;
  title: string;
  topic: string;
  videoStart?: string;
  notesUrl?: string;
  quizSlug?: string;
  assignmentUrl?: string;
  status: DayStatus;
}

const topics: { title: string; topic: string }[] = [
  { title: "Setup & Hello World", topic: "Install Python, IDE, first program" },
  { title: "Variables & Data Types", topic: "int, float, str, bool, type()" },
  { title: "Strings Deep Dive", topic: "Slicing, methods, f-strings" },
  { title: "Operators", topic: "Arithmetic, logical, comparison" },
  { title: "Conditionals", topic: "if / elif / else" },
  { title: "Loops — for", topic: "Iteration, range(), break" },
  { title: "Loops — while", topic: "while, continue, else on loop" },
  { title: "Lists", topic: "CRUD, slicing, comprehensions" },
  { title: "Tuples & Sets", topic: "Immutability, uniqueness" },
  { title: "Dictionaries", topic: "Key-value, methods, nesting" },
  { title: "Functions", topic: "def, args, return, scope" },
  { title: "Lambda & Higher Order", topic: "map, filter, reduce" },
  { title: "Modules & Packages", topic: "import, pip, virtualenv" },
  { title: "File I/O", topic: "open, read, write, with" },
  { title: "Exceptions", topic: "try/except/finally, raise" },
  { title: "OOP Basics", topic: "Classes, objects, __init__" },
  { title: "Inheritance", topic: "Base/child, super(), MRO" },
  { title: "Polymorphism & Dunders", topic: "__str__, __repr__, __len__" },
  { title: "Decorators", topic: "Closures, @decorator syntax" },
  { title: "Generators & Iterators", topic: "yield, lazy evaluation" },
  { title: "Regex", topic: "re module, patterns" },
  { title: "JSON & APIs", topic: "json module, requests library" },
  { title: "Web Scraping", topic: "BeautifulSoup basics" },
  { title: "Numpy Intro", topic: "Arrays, vectorization" },
  { title: "Pandas Intro", topic: "DataFrames, CSV" },
  { title: "Matplotlib", topic: "Plots, charts, visualization" },
  { title: "Flask Mini App", topic: "Routes, templates" },
  { title: "Tkinter GUI", topic: "Windows, widgets, events" },
  { title: "Project Day", topic: "Build a portfolio project" },
  { title: "Capstone & Certificate", topic: "Ship it, share it, earn cert" },
];

export const CHALLENGE_DAYS: ChallengeDay[] = topics.map((t, i) => ({
  id: i + 1,
  title: t.title,
  topic: t.topic,
  status: "available",
}));

export const BADGES = [
  { id: "spark", label: "First Spark", threshold: 1, desc: "Completed Day 1" },
  { id: "week", label: "Week Warrior", threshold: 7, desc: "7 days strong" },
  { id: "fortnight", label: "Fortnight Force", threshold: 14, desc: "Halfway hero" },
  { id: "marathon", label: "Marathon Mind", threshold: 21, desc: "21 day habit" },
  { id: "champion", label: "Python Champion", threshold: 30, desc: "Completed challenge" },
  { id: "streak", label: "Streak Master", threshold: 10, desc: "10-day streak" },
];

export const FAQ = [
  { q: "Is the challenge free?", a: "Yes — 100% free. EMO Learners is a student-built community." },
  { q: "Which course do I follow?", a: "CodeWithHarry's Complete Python Course on YouTube. Linked at the top." },
  { q: "How much time per day?", a: "1–2 hours. Watch, code along, complete the day's task." },
  { q: "What if I miss a day?", a: "Pick up the next day. Streaks reset, progress doesn't." },
  { q: "Do I get a certificate?", a: "Yes — finish all 30 days to unlock your completion certificate." },
  { q: "Where do I ask doubts?", a: "Join our Telegram and Instagram community — links in the navbar." },
];
