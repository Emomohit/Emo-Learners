export const CHALLENGE_START_DATE = "2026-07-15T00:00:00+05:30";
// Single source of truth — the CodeWithHarry one-shot Python tutorial that
// the EMO Learners 30-Day Challenge is built around.
export const COURSE_VIDEO_ID = "UrsmFxEIp5k";
export const COURSE_URL = `https://youtu.be/${COURSE_VIDEO_ID}`;

/** Deep-link to a chapter of the course video at `t` seconds. */
export const courseChapterUrl = (t: number) =>
  `https://youtu.be/${COURSE_VIDEO_ID}?t=${Math.max(0, Math.floor(t))}`;

export type DayStatus = "locked" | "available" | "completed";

export interface ChallengeDay {
  id: number;
  title: string;
  topic: string;
  /** What learners actually do on this day. */
  whatYouLearn: string;
  /** Key explanation bullets — drawn from this chapter of the video. */
  notes: string[];
  /** Estimated time the day will take, in minutes. */
  minutes: number;
  /** Deep-linked YouTube URL to the chapter inside the course video. */
  videoUrl: string;
  /** Small runnable snippet for the day. */
  snippet?: string;
  status: DayStatus;
}

type Seed = {
  title: string;
  topic: string;
  whatYouLearn: string;
  notes: string[];
  snippet?: string;
  /** Chapter start time in the course video, in seconds. */
  t: number;
  minutes?: number;
};

// Chapters mapped from the CodeWithHarry Python one-shot video (UrsmFxEIp5k).
// Timestamps are approximations to the chapter starts in that single video.
const seeds: Seed[] = [
  {
    title: "Introduction & Why Python",
    topic: "What Python is and why it matters",
    whatYouLearn: "What Python is, where it's used, and how this 30-day plan works.",
    notes: [
      "Python is a high-level, interpreted, dynamically typed language.",
      "Used everywhere: web (Django, Flask), data science, AI/ML, automation, scripting.",
      "Readable syntax (uses indentation, not braces) → fastest language to learn first.",
      "You don't compile manually — the interpreter runs your `.py` file directly.",
      "Goal of Day 1: get the language, set expectations, prepare your machine.",
    ],
    t: 0,
    minutes: 45,
  },
  {
    title: "Install Python & VS Code",
    topic: "Setting up your local environment",
    whatYouLearn: "Install Python 3 and VS Code, run your first `python --version` check.",
    notes: [
      "Download Python 3 from python.org — tick 'Add Python to PATH' on Windows.",
      "Verify install in terminal: `python --version` (or `python3 --version`).",
      "Install VS Code + the official Python extension (Microsoft).",
      "Create a project folder and open it in VS Code — this becomes your workspace.",
      "Common mistake: forgetting PATH → `python` not recognized. Reinstall with the checkbox on.",
    ],
    snippet: `# In terminal\npython --version\n# Should print: Python 3.x.x`,
    t: 600,
    minutes: 60,
  },
  {
    title: "Modules, Pip & PyPI",
    topic: "Installing packages from PyPI",
    whatYouLearn: "What modules and pip are, and how to install third-party packages.",
    notes: [
      "A module is a `.py` file you can import; a package is a folder of modules.",
      "PyPI (pypi.org) is the central registry for Python packages.",
      "`pip` is the installer that comes with Python: `pip install <name>`.",
      "Standard library is built-in (math, random, os) — no install needed.",
      "Use `pip list` to see what's installed; `pip uninstall` to remove.",
    ],
    snippet: `pip install requests\n# then in Python:\nimport requests\nprint(requests.get("https://httpbin.org/ip").json())`,
    t: 1500,
    minutes: 50,
  },
  {
    title: "How Python Works",
    topic: "Interpreter, bytecode, REPL",
    whatYouLearn: "What actually happens when you run a Python file.",
    notes: [
      "Python source (`.py`) → compiled to bytecode (`.pyc`) → run by the Python VM.",
      "It's interpreted *at runtime* — that's why errors only show when execution hits them.",
      "REPL (`python` in terminal) is an interactive shell: type code, see result.",
      "`__pycache__` folders are cached bytecode — safe to delete, will regenerate.",
      "Dynamic typing = variable types are checked while running, not before.",
    ],
    snippet: `# Open REPL\npython\n>>> 2 + 3\n5\n>>> "hello".upper()\n'HELLO'`,
    t: 2400,
    minutes: 40,
  },
  {
    title: "Comments, Escape Sequences & print()",
    topic: "Your first real output",
    whatYouLearn: "Writing comments, using `print()`, and escape characters inside strings.",
    notes: [
      "Single-line comment: `# this is ignored by Python`.",
      "Multi-line: triple-quoted string `\"\"\"..\"\"\"` (technically a string, used as a comment).",
      "`print()` writes to stdout and adds a newline at the end by default.",
      "Escape sequences: `\\n` newline, `\\t` tab, `\\\\` backslash, `\\\"` quote.",
      "Customize with `print(a, b, sep='-', end='!')` — sep between items, end at the end.",
    ],
    snippet: `# My first program\nprint("Hello,\\nEMO Learners!")\nprint("A", "B", "C", sep=" -> ", end=" 🚀\\n")`,
    t: 3000,
    minutes: 45,
  },
  {
    title: "Variables & Data Types",
    topic: "int, float, str, bool, None",
    whatYouLearn: "How to store data and what core types Python gives you.",
    notes: [
      "A variable is just a name pointing to a value — no type declaration needed.",
      "Core types: `int` (5), `float` (3.14), `str` ('hi'), `bool` (True/False), `NoneType` (None).",
      "Inspect with `type(x)`; convert with `int()`, `str()`, `float()`, `bool()`.",
      "Naming: lowercase_with_underscores, can't start with a digit, case-sensitive.",
      "Python is dynamic: `x = 5` then `x = 'hi'` is legal — the variable just rebinds.",
    ],
    snippet: `name = "Mohit"\nage = 19\npi = 3.14\nis_student = True\nprint(type(age), type(pi), type(name))`,
    t: 3900,
    minutes: 50,
  },
  {
    title: "Operators",
    topic: "Arithmetic, comparison, logical, assignment",
    whatYouLearn: "Every operator you'll use day-to-day in Python.",
    notes: [
      "Arithmetic: `+ - * /` plus `//` (floor div), `%` (mod), `**` (power).",
      "Comparison: `== != > < >= <=` — returns a `bool`.",
      "Logical: `and`, `or`, `not` (words, not `&&` / `||`).",
      "Assignment shortcuts: `x += 1`, `x *= 2`, etc.",
      "`/` always returns a float in Python 3: `10/2 == 5.0`. Use `//` for int division.",
    ],
    snippet: `a, b = 10, 3\nprint(a / b, a // b, a % b, a ** b)\nprint(a > 5 and b < 5)`,
    t: 4800,
    minutes: 45,
  },
  {
    title: "Type Conversion & input()",
    topic: "Reading user input",
    whatYouLearn: "Taking input from the user and converting between types.",
    notes: [
      "`input(prompt)` always returns a `str` — even if the user types a number.",
      "Convert with `int(...)`, `float(...)`, `bool(...)`.",
      "Implicit conversion: `1 + 2.0` → `3.0` (int promoted to float).",
      "Wrap conversions in `try/except` for safety — strings like 'abc' fail `int()`.",
      "Use f-strings to combine input with output cleanly.",
    ],
    snippet: `name = input("Your name? ")\nage = int(input("Your age? "))\nprint(f"Hi {name}, next year you'll be {age + 1}.")`,
    t: 5700,
    minutes: 45,
  },
  {
    title: "Strings",
    topic: "Creating, indexing, slicing strings",
    whatYouLearn: "How strings work and how to extract parts of them.",
    notes: [
      "Strings are sequences of characters — `'a'`, `\"a\"`, or `'''...'''` all work.",
      "Strings are *immutable*: any 'change' returns a new string.",
      "Index from 0: `s[0]` first char, `s[-1]` last char.",
      "Slice: `s[start:stop:step]` — `stop` is exclusive. Negative steps reverse.",
      "Concatenate with `+`, repeat with `*`: `'ab' * 3 == 'ababab'`.",
    ],
    snippet: `s = "EMO Learners"\nprint(s[0], s[-1])\nprint(s[:3], s[4:], s[::-1])`,
    t: 6600,
    minutes: 50,
  },
  {
    title: "String Methods & f-strings",
    topic: "Useful built-in string operations",
    whatYouLearn: "The string methods you'll reach for in 90% of programs.",
    notes: [
      "`upper()`, `lower()`, `title()`, `strip()`, `replace(a,b)`, `split(sep)`, `join(list)`.",
      "Searching: `find` (returns -1 if missing), `index` (raises), `count`, `in` operator.",
      "Check shape with `startswith`, `endswith`, `isdigit`, `isalpha`.",
      "f-strings: `f\"hello {name}, total = {price:.2f}\"` — cleaner than `+` or `%`.",
      "All methods return *new* strings — the original is unchanged.",
    ],
    snippet: `s = "  emo learners  "\nclean = s.strip().title()\nprint(f"[{clean}] len={len(clean)}")\nprint("-".join(clean.split()))`,
    t: 7500,
    minutes: 50,
  },
  {
    title: "if / elif / else",
    topic: "Branching with conditionals",
    whatYouLearn: "Making your program decide what to do.",
    notes: [
      "Syntax uses a colon and indentation — no braces, no parentheses required.",
      "`elif` chains additional conditions; `else` is the catch-all.",
      "Falsy values: `0`, `0.0`, `''`, `None`, `[]`, `{}`, `False`. Everything else is truthy.",
      "Conditional expression (ternary): `value = a if cond else b`.",
      "Common bug: using `=` (assignment) where you meant `==` (compare).",
    ],
    snippet: `marks = int(input("Marks? "))\nif marks >= 90: grade = "A+"\nelif marks >= 75: grade = "A"\nelif marks >= 50: grade = "B"\nelse: grade = "F"\nprint(grade)`,
    t: 8400,
    minutes: 50,
  },
  {
    title: "Match-case",
    topic: "Pattern matching (Python 3.10+)",
    whatYouLearn: "A cleaner alternative to long if/elif chains.",
    notes: [
      "Introduced in Python 3.10 — check your version with `python --version`.",
      "`match value: case pattern: ...` — patterns can be literals, types, or structures.",
      "`case _:` is the wildcard / default branch.",
      "Patterns can destructure: `case [x, y]:` binds first two list items.",
      "Use for state machines, command dispatch, parsing — not as a plain `if` replacement.",
    ],
    snippet: `cmd = input("> ")\nmatch cmd.split():\n  case ["hi"]: print("hello")\n  case ["add", a, b]: print(int(a) + int(b))\n  case _: print("unknown")`,
    t: 9300,
    minutes: 40,
  },
  {
    title: "while Loops",
    topic: "Repeating until a condition fails",
    whatYouLearn: "Looping based on a condition rather than a fixed range.",
    notes: [
      "`while cond:` keeps running the block while `cond` is truthy.",
      "Use when you don't know upfront how many iterations you need (e.g. menu loop).",
      "Always update the loop variable inside the body — otherwise infinite loop.",
      "`break` exits the loop early; `continue` skips to the next iteration.",
      "Ctrl+C in the terminal kills a runaway loop.",
    ],
    snippet: `n = 1\nwhile n <= 5:\n  print(n)\n  n += 1`,
    t: 10200,
    minutes: 40,
  },
  {
    title: "for Loops & range()",
    topic: "Iterating over sequences",
    whatYouLearn: "The Python-idiomatic way to repeat with a counter or over data.",
    notes: [
      "`for item in iterable:` works on strings, lists, tuples, dicts, files, ranges.",
      "`range(stop)`, `range(start, stop)`, `range(start, stop, step)` — stop is exclusive.",
      "Use `enumerate(seq)` when you need both index and value.",
      "`zip(a, b)` pairs items from two sequences together.",
      "Loop body must be indented consistently (4 spaces is standard).",
    ],
    snippet: `for i in range(1, 6):\n  print(i, i*i)\nfor idx, ch in enumerate("EMO"):\n  print(idx, ch)`,
    t: 11100,
    minutes: 50,
  },
  {
    title: "break, continue, pass",
    topic: "Loop control statements",
    whatYouLearn: "Fine-grained control over how loops execute.",
    notes: [
      "`break` exits the innermost loop immediately.",
      "`continue` skips the rest of the current iteration and goes to the next.",
      "`pass` is a no-op — placeholder when syntax needs a statement but you have nothing yet.",
      "`for ... else:` runs the `else` block only if the loop completed without `break`.",
      "Avoid deeply nested loops — extract them into functions when it gets hairy.",
    ],
    snippet: `for n in range(2, 20):\n  for i in range(2, n):\n    if n % i == 0:\n      break\n  else:\n    print(n, "is prime")`,
    t: 12000,
    minutes: 35,
  },
  {
    title: "Lists",
    topic: "Ordered, mutable collections",
    whatYouLearn: "The most-used data structure in Python.",
    notes: [
      "Create with `[]` or `list()`; can hold mixed types.",
      "Mutable: you can change items in-place (`lst[0] = 99`).",
      "Index and slice exactly like strings: `lst[1:3]`.",
      "Common ops: `len`, `in`, `+` to concatenate, `*` to repeat.",
      "Lists keep insertion order — items stay in the order you added them.",
    ],
    snippet: `marks = [90, 75, 88, 60]\nmarks[1] = 80\nprint(marks, len(marks), sum(marks)/len(marks))`,
    t: 12900,
    minutes: 45,
  },
  {
    title: "List Methods & Comprehensions",
    topic: "append, sort, filter, map in one line",
    whatYouLearn: "Building, transforming, and filtering lists Pythonically.",
    notes: [
      "Mutating methods: `append`, `extend`, `insert`, `remove`, `pop`, `sort`, `reverse`.",
      "Non-mutating helpers: `sorted(lst)`, `reversed(lst)` — return new sequences.",
      "List comprehension: `[expr for x in seq if cond]` — concise map + filter.",
      "Beware: `b = a` shares the same list. Use `b = a.copy()` for an independent copy.",
      "Use comprehensions for transformation, classic loops for side effects.",
    ],
    snippet: `nums = [1, 2, 3, 4, 5]\nsquares_of_even = [n*n for n in nums if n % 2 == 0]\nprint(squares_of_even)`,
    t: 13800,
    minutes: 50,
  },
  {
    title: "Tuples",
    topic: "Immutable ordered collections",
    whatYouLearn: "When to use a tuple instead of a list.",
    notes: [
      "Create with `()` or just commas: `t = 1, 2, 3`.",
      "Immutable — once created, you can't change items.",
      "Faster than lists and usable as dict keys / set elements.",
      "Unpack: `x, y = (10, 20)` — common for returning multiple values from a function.",
      "Single-element tuple needs a trailing comma: `(5,)` not `(5)`.",
    ],
    snippet: `point = (3, 4)\nx, y = point\nprint(x, y)\n# point[0] = 99  # ❌ TypeError`,
    t: 14700,
    minutes: 35,
  },
  {
    title: "Sets",
    topic: "Unordered, unique collections",
    whatYouLearn: "Removing duplicates and doing math-set operations.",
    notes: [
      "Create with `{1, 2, 3}` or `set([...])`. `{}` is an empty *dict*, not set — use `set()`.",
      "Items are unique and unordered — no indexing.",
      "Operations: `union |`, `intersection &`, `difference -`, `symmetric_difference ^`.",
      "`add`, `remove`, `discard` (no error if missing), `in` check is O(1).",
      "Great for de-duplication: `unique = list(set(my_list))`.",
    ],
    snippet: `a = {1, 2, 3, 3}\nb = {3, 4, 5}\nprint(a, a | b, a & b, a - b)`,
    t: 15600,
    minutes: 35,
  },
  {
    title: "Dictionaries",
    topic: "Key → value mappings",
    whatYouLearn: "Storing structured data with named fields.",
    notes: [
      "Create with `{\"name\": \"Mohit\", \"age\": 19}` or `dict(name=...)`.",
      "Keys must be hashable (str, int, tuple) — values can be anything.",
      "Read with `d[key]` (KeyError if missing) or `d.get(key, default)` (safe).",
      "Iterate: `for k, v in d.items():` — also `d.keys()`, `d.values()`.",
      "Since Python 3.7 dicts preserve *insertion order* — useful for predictable output.",
    ],
    snippet: `student = {"name": "Mohit", "age": 19, "marks": [90, 85]}\nstudent["city"] = "Indore"\nfor k, v in student.items():\n  print(k, "->", v)`,
    t: 16500,
    minutes: 50,
  },
  {
    title: "Functions",
    topic: "Reusable blocks of code",
    whatYouLearn: "Defining and calling your own functions.",
    notes: [
      "Define with `def name(params):` — body is indented.",
      "`return` sends a value back; without it the function returns `None`.",
      "Parameters are local to the function — they don't leak to the outside.",
      "Docstrings: a triple-quoted string as the first line, shown by `help(fn)`.",
      "Rule of thumb: one function = one job. Keep them short (<20 lines).",
    ],
    snippet: `def greet(name):\n  """Return a greeting for the user."""\n  return f"Hi {name}!"\n\nprint(greet("EMO"))`,
    t: 17400,
    minutes: 50,
  },
  {
    title: "Function Arguments & Recursion",
    topic: "Default, keyword, *args, **kwargs",
    whatYouLearn: "Every way you can pass data into a function — plus recursion.",
    notes: [
      "Positional vs keyword args: `fn(1, 2)` vs `fn(a=1, b=2)`.",
      "Default values: `def fn(x=10):` — caller can omit `x`.",
      "`*args` collects extra positionals into a tuple; `**kwargs` collects keywords into a dict.",
      "Recursion: a function that calls itself — always needs a base case to stop.",
      "Don't mutate default-list args (`def f(a=[])`) — the list is shared across calls.",
    ],
    snippet: `def factorial(n):\n  if n <= 1: return 1\n  return n * factorial(n - 1)\n\ndef summary(**info):\n  for k, v in info.items(): print(k, v)\n\nprint(factorial(5))\nsummary(name="Mohit", age=19)`,
    t: 18300,
    minutes: 55,
  },
  {
    title: "File I/O",
    topic: "Reading and writing files",
    whatYouLearn: "Persisting data and reading files from disk.",
    notes: [
      "Open with `open(path, mode)` — modes: `r` read, `w` write (truncates), `a` append, `b` binary.",
      "Always prefer `with open(...) as f:` — auto-closes the file even on errors.",
      "Read: `f.read()` (all), `f.readline()` (one), iterate `for line in f:`.",
      "Write: `f.write('text')` — does NOT add a newline; you add `\\n` yourself.",
      "Use `encoding='utf-8'` explicitly for non-ASCII content.",
    ],
    snippet: `with open("notes.txt", "w", encoding="utf-8") as f:\n  f.write("Day 22 done!\\n")\n\nwith open("notes.txt", encoding="utf-8") as f:\n  print(f.read())`,
    t: 19200,
    minutes: 50,
  },
  {
    title: "Classes & Objects (OOP basics)",
    topic: "Defining your own types",
    whatYouLearn: "The mental model of objects, attributes, and methods.",
    notes: [
      "Class = blueprint; object = an instance of that blueprint.",
      "Define with `class Name:` — class names use CapitalCase.",
      "Attributes hold data; methods are functions defined inside the class.",
      "Create instances by calling the class: `s = Student()`.",
      "Use objects when data and behavior belong together (e.g. a `Student` with `name` + `study()`).",
    ],
    snippet: `class Student:\n  def study(self):\n    return "studying Python"\n\ns = Student()\nprint(s.study())`,
    t: 20100,
    minutes: 45,
  },
  {
    title: "Constructor & self",
    topic: "__init__ and instance state",
    whatYouLearn: "How `__init__` and `self` actually work.",
    notes: [
      "`__init__(self, ...)` runs automatically when you create an instance.",
      "`self` refers to *this specific instance* — used to attach attributes.",
      "Set instance state inside `__init__`: `self.name = name`.",
      "Methods always take `self` as the first parameter — you don't pass it manually.",
      "Class-level attributes (outside `__init__`) are shared across instances — be careful with mutables.",
    ],
    snippet: `class Student:\n  def __init__(self, name, marks):\n    self.name = name\n    self.marks = marks\n  def report(self):\n    return f"{self.name}: {self.marks}"\n\nprint(Student("Mohit", 92).report())`,
    t: 21000,
    minutes: 50,
  },
  {
    title: "Inheritance",
    topic: "Reusing and extending classes",
    whatYouLearn: "Building specialized classes on top of general ones.",
    notes: [
      "`class Child(Parent):` — Child gets all of Parent's methods automatically.",
      "Override a method by redefining it in the child class.",
      "Call the parent version with `super().method(...)` — most common in `__init__`.",
      "Python supports multiple inheritance (`class C(A, B):`) — use sparingly.",
      "Use inheritance only for true 'is-a' relationships; otherwise prefer composition.",
    ],
    snippet: `class Person:\n  def __init__(self, name): self.name = name\n\nclass Student(Person):\n  def __init__(self, name, marks):\n    super().__init__(name)\n    self.marks = marks\n\nprint(Student("Mohit", 92).name)`,
    t: 21900,
    minutes: 50,
  },
  {
    title: "Access Modifiers & @property",
    topic: "Encapsulation in Python",
    whatYouLearn: "How to mark internal attributes and expose computed ones.",
    notes: [
      "Python has no real `private` — convention only.",
      "`_name` = 'protected' (treat as internal); `__name` = 'private' (gets name-mangled).",
      "`@property` turns a method into a read-only attribute access.",
      "Add `@<prop>.setter` if you also want assignment with validation.",
      "Use properties when you want logic behind a simple attribute-like API.",
    ],
    snippet: `class Account:\n  def __init__(self, balance):\n    self._balance = balance\n  @property\n  def balance(self):\n    return self._balance\n\na = Account(500)\nprint(a.balance)`,
    t: 22800,
    minutes: 45,
  },
  {
    title: "Static & Class Methods",
    topic: "@staticmethod and @classmethod",
    whatYouLearn: "When to use a method that doesn't need `self`.",
    notes: [
      "`@staticmethod` — no `self`, no `cls`. Just a function grouped under the class.",
      "`@classmethod` — first arg is `cls` (the class itself), useful for alternate constructors.",
      "Use staticmethod for helpers that logically belong to the class but don't touch instance state.",
      "Use classmethod for factory patterns: `User.from_dict(data)`.",
      "Don't overuse — if it doesn't need the class at all, just write a regular function.",
    ],
    snippet: `class Math:\n  @staticmethod\n  def add(a, b): return a + b\n  @classmethod\n  def describe(cls): return f"I am {cls.__name__}"\n\nprint(Math.add(2, 3), Math.describe())`,
    t: 23700,
    minutes: 40,
  },
  {
    title: "Exception Handling",
    topic: "try / except / finally",
    whatYouLearn: "How to handle errors gracefully instead of crashing.",
    notes: [
      "Wrap risky code in `try:` and handle errors in `except <Type>:`.",
      "Catch specific exceptions (`ValueError`, `FileNotFoundError`) — avoid bare `except:`.",
      "`else:` runs if no exception occurred; `finally:` runs no matter what (cleanup).",
      "`raise ValueError('msg')` lets you signal your own errors.",
      "Common pattern: validate input with try/except around `int(input(...))`.",
    ],
    snippet: `try:\n  n = int(input("Number? "))\n  print(10 / n)\nexcept ValueError:\n  print("Not a valid number")\nexcept ZeroDivisionError:\n  print("Can't divide by zero")\nfinally:\n  print("done")`,
    t: 24600,
    minutes: 45,
  },
  {
    title: "Iterators, Generators & Decorators",
    topic: "Advanced Python + capstone day",
    whatYouLearn: "Wrap up: iterators, generators, decorators, and your mini project.",
    notes: [
      "Iterator: any object with `__iter__` and `__next__`. `for` uses them under the hood.",
      "Generator: a function with `yield` — produces values lazily, one at a time.",
      "Use generators for huge or infinite sequences — memory-efficient.",
      "Decorator: a function that wraps another function; applied with `@decorator` syntax.",
      "Capstone: build & ship one small project (CLI todo, weather app, scraper). Push to GitHub.",
    ],
    snippet: `def counter(n):\n  i = 0\n  while i < n:\n    yield i\n    i += 1\n\ndef log(fn):\n  def wrapper(*a, **kw):\n    print("calling", fn.__name__)\n    return fn(*a, **kw)\n  return wrapper\n\n@log\ndef hi(name): return f"Hi {name}"\n\nprint(list(counter(3)))\nprint(hi("EMO"))`,
    t: 25500,
    minutes: 75,
  },
];

export const CHALLENGE_DAYS: ChallengeDay[] = seeds.map((s, i) => ({
  id: i + 1,
  title: s.title,
  topic: s.topic,
  whatYouLearn: s.whatYouLearn,
  notes: s.notes,
  minutes: s.minutes ?? 45,
  videoUrl: courseChapterUrl(s.t),
  snippet: s.snippet,
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
  { q: "Which course do I follow?", a: "One video — CodeWithHarry's complete Python tutorial (youtu.be/UrsmFxEIp5k). Each day links to the matching chapter timestamp." },
  { q: "How much time per day?", a: "About 45 minutes to 1 hour: watch the chapter, code along, finish the day's task." },
  { q: "What if I miss a day?", a: "Pick up the next day. Streaks reset, progress doesn't." },
  { q: "Do I get a certificate?", a: "Yes — finish all 30 days to unlock your completion certificate." },
  { q: "Where do I ask doubts?", a: "Join our Telegram and Instagram community — links in the navbar." },
];
