export const CHALLENGE_START_DATE = "2026-07-15T00:00:00+05:30";
export const COURSE_URL = "https://youtu.be/UrsmFxEIp5k?si=Rd4V3aL7ztanYQ8u";
export const COURSE_PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PLu0W_9lII9agwh1XjRt242xIpHhPT2llg";

export type DayStatus = "locked" | "available" | "completed";

export interface ChallengeDay {
  id: number;
  title: string;
  topic: string;
  /** Short note bullets — the key takeaways from CodeWithHarry's Python course for this day. */
  notes: string[];
  /** YouTube link (chapter / playlist video) for the day. */
  videoUrl: string;
  /** Small code snippet learners can copy + run. */
  snippet?: string;
  status: DayStatus;
}

type Seed = {
  title: string;
  topic: string;
  notes: string[];
  snippet?: string;
  /** CodeWithHarry Python playlist chapter number — defaults to day id. */
  ch?: number;
};

const seeds: Seed[] = [
  {
    title: "Setup & Hello World",
    topic: "Install Python, IDE, first program",
    notes: [
      "Install Python 3 from python.org and add it to PATH.",
      "Use VS Code + the Python extension as your IDE.",
      "Run scripts with `python file.py` from the terminal.",
      "`print()` writes to the console — your first output.",
    ],
    snippet: `print("Hello, EMO Learners!")`,
  },
  {
    title: "Variables & Data Types",
    topic: "int, float, str, bool, type()",
    notes: [
      "Variables don't need a type — Python infers it.",
      "Core types: int, float, str, bool, NoneType.",
      "Use `type(x)` to inspect a value's class.",
      "Naming: lowercase_with_underscores, never start with a digit.",
    ],
    snippet: `name = "Mohit"\nage = 19\npi = 3.14\nis_student = True\nprint(type(age))`,
  },
  {
    title: "Strings Deep Dive",
    topic: "Slicing, methods, f-strings",
    notes: [
      "Strings are immutable — methods return new strings.",
      "Slice with `s[start:stop:step]`; negative indexes work.",
      "Useful methods: upper, lower, strip, split, replace, find.",
      "Prefer f-strings: `f\"hi {name}\"` over % or .format().",
    ],
    snippet: `s = " EMO Learners "\nprint(s.strip().upper())\nprint(f"Length: {len(s)}")`,
  },
  {
    title: "Operators",
    topic: "Arithmetic, logical, comparison",
    notes: [
      "Arithmetic: + - * / // % ** (// is floor division).",
      "Comparison returns bool: == != < > <= >=.",
      "Logical: and, or, not — short-circuit evaluated.",
      "Assignment shortcuts: += -= *= /=.",
    ],
    snippet: `print(10 // 3, 10 % 3, 2 ** 10)\nprint(True and not False)`,
  },
  {
    title: "Conditionals",
    topic: "if / elif / else",
    notes: [
      "Indentation defines blocks — 4 spaces is the convention.",
      "Use `elif` to chain conditions instead of nested ifs.",
      "Truthy/falsy: 0, '', [], {}, None are falsy.",
      "Ternary form: `a if cond else b`.",
    ],
    snippet: `marks = 78\ngrade = "A" if marks >= 75 else "B"\nprint(grade)`,
  },
  {
    title: "Loops — for",
    topic: "Iteration, range(), break",
    notes: [
      "`for x in iterable:` walks any sequence.",
      "`range(start, stop, step)` is the classic counter.",
      "`break` exits the loop; `continue` skips to next.",
      "Use `enumerate()` when you need the index too.",
    ],
    snippet: `for i, ch in enumerate("EMO"):\n    print(i, ch)`,
  },
  {
    title: "Loops — while",
    topic: "while, continue, else on loop",
    notes: [
      "`while cond:` runs until cond is falsy — beware infinite loops.",
      "`else` on a loop runs if it ends without `break`.",
      "Use a counter or sentinel to control termination.",
      "Prefer `for` when iterating a known sequence.",
    ],
    snippet: `n = 5\nwhile n > 0:\n    print(n)\n    n -= 1`,
  },
  {
    title: "Lists",
    topic: "CRUD, slicing, comprehensions",
    notes: [
      "Ordered, mutable, allow duplicates.",
      "Methods: append, extend, insert, pop, remove, sort.",
      "Slicing returns a new list — `a[:]` clones.",
      "List comprehension: `[x*x for x in range(10) if x%2==0]`.",
    ],
    snippet: `nums = [1, 2, 3, 4]\nsquares = [n*n for n in nums]\nprint(squares)`,
  },
  {
    title: "Tuples & Sets",
    topic: "Immutability, uniqueness",
    notes: [
      "Tuples are immutable lists — `(1, 2, 3)`.",
      "Sets store unique values — `{1, 2, 3}`; O(1) membership.",
      "Set ops: union `|`, intersect `&`, diff `-`.",
      "Unpack tuples: `a, b = (1, 2)`.",
    ],
    snippet: `s = set([1, 2, 2, 3])\nprint(s, 2 in s)`,
  },
  {
    title: "Dictionaries",
    topic: "Key-value, methods, nesting",
    notes: [
      "Keys must be hashable; values can be anything.",
      "Access: `d[key]` (raises) vs `d.get(key, default)`.",
      "Iterate items: `for k, v in d.items():`.",
      "Dict comprehension: `{k: v*2 for k, v in d.items()}`.",
    ],
    snippet: `student = {"name": "Mohit", "score": 92}\nprint(student.get("name"))`,
  },
  {
    title: "Functions",
    topic: "def, args, return, scope",
    notes: [
      "Define with `def`; return a value (or None).",
      "Default args: `def f(x=10):`; keyword args: `f(x=5)`.",
      "*args collects positional, **kwargs collects keyword.",
      "Variables inside are local unless declared `global`.",
    ],
    snippet: `def greet(name="world"):\n    return f"Hello, {name}!"\nprint(greet("EMO"))`,
  },
  {
    title: "Lambda & Higher Order",
    topic: "map, filter, reduce",
    notes: [
      "`lambda args: expr` — one-line anonymous function.",
      "`map(f, iter)` applies f to each item.",
      "`filter(pred, iter)` keeps items where pred is true.",
      "`functools.reduce` folds an iterable to one value.",
    ],
    snippet: `nums = [1, 2, 3, 4]\nprint(list(map(lambda x: x*x, nums)))`,
  },
  {
    title: "Modules & Packages",
    topic: "import, pip, virtualenv",
    notes: [
      "`import module` or `from module import name`.",
      "Install third-party with `pip install <pkg>`.",
      "Isolate per project: `python -m venv venv`.",
      "A package = folder with `__init__.py`.",
    ],
    snippet: `import math\nprint(math.sqrt(2))`,
  },
  {
    title: "File I/O",
    topic: "open, read, write, with",
    notes: [
      "Always use `with open(...) as f:` — auto-closes.",
      "Modes: r read, w write, a append, b binary.",
      "`f.read()`, `f.readlines()`, `for line in f`.",
      "Write text with `f.write(\"...\")`.",
    ],
    snippet: `with open("notes.txt", "w") as f:\n    f.write("Day 14 done!")`,
  },
  {
    title: "Exceptions",
    topic: "try/except/finally, raise",
    notes: [
      "Catch specific errors, not bare `except:`.",
      "`finally` always runs — cleanup goes here.",
      "Raise your own: `raise ValueError(\"...\")`.",
      "Custom exceptions = class inheriting from Exception.",
    ],
    snippet: `try:\n    x = int("abc")\nexcept ValueError as e:\n    print("oops:", e)`,
  },
  {
    title: "OOP Basics",
    topic: "Classes, objects, __init__",
    notes: [
      "Class = blueprint; instance = object made from it.",
      "`__init__(self, ...)` is the constructor.",
      "Instance attrs live on `self`; class attrs are shared.",
      "Methods take `self` as first parameter.",
    ],
    snippet: `class Dog:\n    def __init__(self, name):\n        self.name = name\nd = Dog("Bruno"); print(d.name)`,
  },
  {
    title: "Inheritance",
    topic: "Base/child, super(), MRO",
    notes: [
      "`class Child(Parent):` reuses parent methods.",
      "Call parent's __init__ with `super().__init__(...)`.",
      "Override methods to specialize behaviour.",
      "MRO: `Class.__mro__` shows lookup order.",
    ],
    snippet: `class Animal:\n    def speak(self): print("...")\nclass Cat(Animal):\n    def speak(self): print("meow")`,
  },
  {
    title: "Polymorphism & Dunders",
    topic: "__str__, __repr__, __len__",
    notes: [
      "Dunder methods customize built-in behavior.",
      "`__str__` is for users; `__repr__` for devs/debug.",
      "`__len__`, `__eq__`, `__add__` let your class act native.",
      "Same call, different types = polymorphism.",
    ],
    snippet: `class Box:\n    def __init__(self,n): self.n=n\n    def __len__(self): return self.n\nprint(len(Box(5)))`,
  },
  {
    title: "Decorators",
    topic: "Closures, @decorator syntax",
    notes: [
      "Functions are first-class — pass and return them.",
      "A decorator wraps a function to add behavior.",
      "Use `@decorator` above `def` as syntactic sugar.",
      "Preserve metadata with `functools.wraps`.",
    ],
    snippet: `def log(f):\n    def w(*a, **k):\n        print("calling", f.__name__)\n        return f(*a, **k)\n    return w\n@log\ndef hi(): print("hi")\nhi()`,
  },
  {
    title: "Generators & Iterators",
    topic: "yield, lazy evaluation",
    notes: [
      "`yield` turns a function into a generator.",
      "Generators are lazy — values produced on demand.",
      "Great for large/infinite sequences (memory-friendly).",
      "Custom iterator: implement __iter__ and __next__.",
    ],
    snippet: `def counter(n):\n    i = 0\n    while i < n:\n        yield i; i += 1\nprint(list(counter(5)))`,
  },
  {
    title: "Regex",
    topic: "re module, patterns",
    notes: [
      "`import re`; use raw strings `r\"\\d+\"`.",
      "Common: \\d digit, \\w word, \\s space, + 1+, * 0+.",
      "`re.search`, `re.findall`, `re.sub` are your toolkit.",
      "Test patterns at regex101.com before shipping.",
    ],
    snippet: `import re\nprint(re.findall(r"\\d+", "abc 123 def 45"))`,
  },
  {
    title: "JSON & APIs",
    topic: "json module, requests library",
    notes: [
      "`json.dumps` → string; `json.loads` → dict.",
      "Install requests: `pip install requests`.",
      "GET data: `requests.get(url).json()`.",
      "Always check `response.status_code` before parsing.",
    ],
    snippet: `import requests\nr = requests.get("https://api.github.com")\nprint(r.status_code)`,
  },
  {
    title: "Web Scraping",
    topic: "BeautifulSoup basics",
    notes: [
      "`pip install beautifulsoup4 requests`.",
      "Parse HTML: `BeautifulSoup(html, 'html.parser')`.",
      "Select with `soup.find`, `find_all`, or CSS selectors.",
      "Respect robots.txt and rate-limit your requests.",
    ],
    snippet: `from bs4 import BeautifulSoup\nsoup = BeautifulSoup("<h1>Hi</h1>", "html.parser")\nprint(soup.h1.text)`,
  },
  {
    title: "Numpy Intro",
    topic: "Arrays, vectorization",
    notes: [
      "`pip install numpy`; alias `import numpy as np`.",
      "ndarray is faster + leaner than a Python list.",
      "Vectorized math: `a + b`, `a * 2`, no loops needed.",
      "Reshape, slice, broadcast — the core moves.",
    ],
    snippet: `import numpy as np\na = np.array([1,2,3])\nprint(a * 2)`,
  },
  {
    title: "Pandas Intro",
    topic: "DataFrames, CSV",
    notes: [
      "`pip install pandas`; alias `import pandas as pd`.",
      "DataFrame = table; Series = single column.",
      "Read CSV with `pd.read_csv('file.csv')`.",
      "Filter: `df[df['marks'] > 75]`.",
    ],
    snippet: `import pandas as pd\ndf = pd.DataFrame({"name":["A","B"],"marks":[90,60]})\nprint(df)`,
  },
  {
    title: "Matplotlib",
    topic: "Plots, charts, visualization",
    notes: [
      "`pip install matplotlib`; `import matplotlib.pyplot as plt`.",
      "`plt.plot(x, y)` then `plt.show()`.",
      "Add `title`, `xlabel`, `ylabel`, `legend`.",
      "Bar, scatter, hist — same recipe, different fn.",
    ],
    snippet: `import matplotlib.pyplot as plt\nplt.plot([1,2,3],[1,4,9]); plt.show()`,
  },
  {
    title: "Flask Mini App",
    topic: "Routes, templates",
    notes: [
      "`pip install flask`; create `app.py`.",
      "Decorator routes: `@app.route('/')`.",
      "Return strings or render Jinja templates.",
      "Run with `flask run` or `python app.py`.",
    ],
    snippet: `from flask import Flask\napp = Flask(__name__)\n@app.route("/")\ndef home(): return "EMO live"`,
  },
  {
    title: "Tkinter GUI",
    topic: "Windows, widgets, events",
    notes: [
      "`tkinter` is built-in — no install needed.",
      "Root window: `tk.Tk()`; loop with `mainloop()`.",
      "Widgets: Label, Button, Entry, pack/grid layout.",
      "Bind events via `widget.bind` or `command=`.",
    ],
    snippet: `import tkinter as tk\nroot = tk.Tk()\ntk.Label(root, text="Hello EMO").pack()\nroot.mainloop()`,
  },
  {
    title: "Project Day",
    topic: "Build a portfolio project",
    notes: [
      "Pick one: To-do CLI, weather app, scraper, quiz bot.",
      "Plan features → split into functions → ship MVP.",
      "Push to GitHub with a clean README.",
      "Record a 30-sec demo for your portfolio.",
    ],
  },
  {
    title: "Capstone & Certificate",
    topic: "Ship it, share it, earn cert",
    notes: [
      "Polish the README, screenshots, and demo link.",
      "Tag the repo `python-30days` for discoverability.",
      "Share on LinkedIn + tag @EMO Learners.",
      "Claim your completion certificate on this page.",
    ],
  },
];

export const CHALLENGE_DAYS: ChallengeDay[] = seeds.map((s, i) => ({
  id: i + 1,
  title: s.title,
  topic: s.topic,
  notes: s.notes,
  snippet: s.snippet,
  videoUrl: COURSE_PLAYLIST_URL,
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
  { q: "Which course do I follow?", a: "CodeWithHarry's Complete Python Course on YouTube. Each day links to the matching chapter." },
  { q: "How much time per day?", a: "1–2 hours. Watch, code along, complete the day's task." },
  { q: "What if I miss a day?", a: "Pick up the next day. Streaks reset, progress doesn't." },
  { q: "Do I get a certificate?", a: "Yes — finish all 30 days to unlock your completion certificate." },
  { q: "Where do I ask doubts?", a: "Join our Telegram and Instagram community — links in the navbar." },
];
