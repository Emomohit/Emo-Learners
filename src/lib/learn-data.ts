export type Question = {
  q: string;
  options: string[];
  answer: number;
  explain?: string;
};

export type Quiz = {
  slug: string;
  title: string;
  topic: string;
  emoji: string;
  description: string;
  minutes: number;
  questions: Question[];
};

export const quizzes: Quiz[] = [
  {
    slug: "python-basics",
    title: "Python Basics",
    topic: "Python",
    emoji: "🐍",
    description: "Variables, types, control flow, and built-ins. Perfect warm-up before the 30 Day Challenge.",
    minutes: 5,
    questions: [
      { q: "Which keyword defines a function in Python?", options: ["func", "def", "function", "lambda"], answer: 1, explain: "`def` defines a named function. `lambda` creates an anonymous one." },
      { q: "What is the output of `len('emo')`?", options: ["2", "3", "4", "Error"], answer: 1 },
      { q: "Which type is mutable?", options: ["tuple", "str", "list", "frozenset"], answer: 2 },
      { q: "`3 ** 2` evaluates to…", options: ["6", "9", "5", "32"], answer: 1, explain: "`**` is the power operator." },
      { q: "Which method adds an item to the end of a list?", options: ["push()", "append()", "add()", "insert()"], answer: 1 },
    ],
  },
  {
    slug: "ai-fundamentals",
    title: "AI Fundamentals",
    topic: "AI",
    emoji: "🤖",
    description: "Models, datasets, prompts, and the difference between ML, DL, and LLMs.",
    minutes: 6,
    questions: [
      { q: "LLM stands for…", options: ["Long Logic Machine", "Large Language Model", "Linear Learning Model", "Layered Latent Memory"], answer: 1 },
      { q: "Which is supervised learning?", options: ["Clustering", "Regression", "Dimensionality reduction", "Reinforcement"], answer: 1 },
      { q: "A prompt that teaches by examples is called…", options: ["Zero-shot", "Few-shot", "Chain-of-thought", "RAG"], answer: 1 },
      { q: "What does 'overfitting' mean?", options: ["Model is too small", "Model memorizes training data", "Model uses too few features", "Model is undertrained"], answer: 1 },
    ],
  },
  {
    slug: "react-essentials",
    title: "React Essentials",
    topic: "Web Dev",
    emoji: "⚛️",
    description: "Components, hooks, state, and the rendering model.",
    minutes: 5,
    questions: [
      { q: "Which hook manages local state?", options: ["useEffect", "useMemo", "useState", "useRef"], answer: 2 },
      { q: "What does JSX compile to?", options: ["HTML strings", "createElement calls", "Virtual DOM nodes directly", "Web Components"], answer: 1 },
      { q: "Keys in lists help React…", options: ["Style items", "Identify items between renders", "Sort items", "Fetch data"], answer: 1 },
      { q: "`useEffect(fn, [])` runs…", options: ["Every render", "Once after mount", "Never", "Before render"], answer: 1 },
    ],
  },
  {
    slug: "data-structures",
    title: "Data Structures",
    topic: "DSA",
    emoji: "🧱",
    description: "Arrays, stacks, queues, trees, and Big-O intuition.",
    minutes: 6,
    questions: [
      { q: "Average lookup in a hash map is…", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 0 },
      { q: "A stack is…", options: ["FIFO", "LIFO", "Random access", "Priority based"], answer: 1 },
      { q: "Binary search needs the array to be…", options: ["Unsorted", "Sorted", "Hashed", "Linked"], answer: 1 },
      { q: "Best case for bubble sort?", options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"], answer: 1 },
    ],
  },
];

export type TestItem = {
  slug: string;
  title: string;
  topic: string;
  emoji: string;
  description: string;
  minutes: number;
  questions: Question[];
};

export const tests: TestItem[] = [
  {
    slug: "python-mastery",
    title: "Python Mastery Test",
    topic: "Python",
    emoji: "🐍",
    description: "Full timed test covering syntax, OOP, comprehensions, and standard library.",
    minutes: 15,
    questions: [
      { q: "Output of `list(range(2, 10, 3))`?", options: ["[2,5,8]", "[2,4,6,8]", "[3,6,9]", "[2,5,8,11]"], answer: 0 },
      { q: "Which is NOT a Python built-in?", options: ["map", "filter", "reduce", "zip"], answer: 2, explain: "`reduce` lives in `functools`." },
      { q: "`{1,2,2,3}` evaluates to…", options: ["{1,2,3}", "{1,2,2,3}", "[1,2,3]", "Error"], answer: 0 },
      { q: "Which creates a class method?", options: ["@staticmethod", "@classmethod", "@property", "def __init__"], answer: 1 },
      { q: "`'abc'[::-1]` returns…", options: ["'abc'", "'cba'", "Error", "''"], answer: 1 },
      { q: "Default value of `dict.get('x')` when 'x' is missing?", options: ["0", "''", "None", "KeyError"], answer: 2 },
      { q: "What does `*args` collect?", options: ["Keyword args", "Positional args as tuple", "Positional args as list", "Globals"], answer: 1 },
      { q: "Which is a list comprehension?", options: ["[x for x in r]", "{x: y}", "(x for x in r)", "list(x)"], answer: 0 },
    ],
  },
  {
    slug: "ai-ml-test",
    title: "AI & Machine Learning",
    topic: "AI",
    emoji: "🧠",
    description: "Models, training, evaluation, and modern LLM workflows.",
    minutes: 18,
    questions: [
      { q: "Cross-entropy loss is used for…", options: ["Regression", "Classification", "Clustering", "PCA"], answer: 1 },
      { q: "Gradient descent updates weights to…", options: ["Maximize loss", "Minimize loss", "Random walk", "Skip layers"], answer: 1 },
      { q: "RAG stands for…", options: ["Random Answer Gen", "Retrieval-Augmented Generation", "Recurrent Attention Gate", "Ranked Answer Graph"], answer: 1 },
      { q: "A high-bias model tends to…", options: ["Overfit", "Underfit", "Memorize", "Generalize perfectly"], answer: 1 },
      { q: "Dropout is used to…", options: ["Increase capacity", "Reduce overfitting", "Speed inference", "Initialize weights"], answer: 1 },
      { q: "Token in an LLM is roughly…", options: ["1 character", "1 word", "A sub-word unit", "A sentence"], answer: 2 },
      { q: "Attention is O(n²) in…", options: ["Memory only", "Sequence length", "Batch size", "Hidden dim"], answer: 1 },
    ],
  },
  {
    slug: "web-dev-test",
    title: "Full Stack Web Dev",
    topic: "Web Dev",
    emoji: "🌐",
    description: "HTML, CSS, JS, React, and HTTP fundamentals.",
    minutes: 20,
    questions: [
      { q: "HTTP status 201 means…", options: ["OK", "Created", "Accepted", "No Content"], answer: 1 },
      { q: "`===` in JS checks…", options: ["Value only", "Type only", "Value and type", "Reference only"], answer: 2 },
      { q: "CSS `flex: 1` is shorthand for…", options: ["flex-grow:1", "1 1 0", "0 0 auto", "1 0 auto"], answer: 1 },
      { q: "React keys should be…", options: ["Indexes", "Random", "Stable and unique", "Strings only"], answer: 2 },
      { q: "Which storage persists across tabs?", options: ["sessionStorage", "localStorage", "memory", "cookie SameSite=Strict"], answer: 1 },
      { q: "REST is built on…", options: ["WebSockets", "HTTP", "gRPC", "MQTT"], answer: 1 },
    ],
  },
];
