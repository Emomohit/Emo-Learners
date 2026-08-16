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
    description:
      "Variables, types, control flow, and built-ins. Perfect warm-up before the 30 Day Challenge.",
    minutes: 5,
    questions: [
      {
        q: "Which keyword defines a function in Python?",
        options: ["func", "def", "function", "lambda"],
        answer: 1,
        explain: "`def` defines a named function. `lambda` creates an anonymous one.",
      },
      { q: "What is the output of `len('emo')`?", options: ["2", "3", "4", "Error"], answer: 1 },
      { q: "Which type is mutable?", options: ["tuple", "str", "list", "frozenset"], answer: 2 },
      {
        q: "`3 ** 2` evaluates to…",
        options: ["6", "9", "5", "32"],
        answer: 1,
        explain: "`**` is the power operator.",
      },
      {
        q: "Which method adds an item to the end of a list?",
        options: ["push()", "append()", "add()", "insert()"],
        answer: 1,
      },
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
      {
        q: "LLM stands for…",
        options: [
          "Long Logic Machine",
          "Large Language Model",
          "Linear Learning Model",
          "Layered Latent Memory",
        ],
        answer: 1,
      },
      {
        q: "Which is supervised learning?",
        options: ["Clustering", "Regression", "Dimensionality reduction", "Reinforcement"],
        answer: 1,
      },
      {
        q: "A prompt that teaches by examples is called…",
        options: ["Zero-shot", "Few-shot", "Chain-of-thought", "RAG"],
        answer: 1,
      },
      {
        q: "What does 'overfitting' mean?",
        options: [
          "Model is too small",
          "Model memorizes training data",
          "Model uses too few features",
          "Model is undertrained",
        ],
        answer: 1,
      },
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
      {
        q: "Which hook manages local state?",
        options: ["useEffect", "useMemo", "useState", "useRef"],
        answer: 2,
      },
      {
        q: "What does JSX compile to?",
        options: [
          "HTML strings",
          "createElement calls",
          "Virtual DOM nodes directly",
          "Web Components",
        ],
        answer: 1,
      },
      {
        q: "Keys in lists help React…",
        options: ["Style items", "Identify items between renders", "Sort items", "Fetch data"],
        answer: 1,
      },
      {
        q: "`useEffect(fn, [])` runs…",
        options: ["Every render", "Once after mount", "Never", "Before render"],
        answer: 1,
      },
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
      {
        q: "Average lookup in a hash map is…",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 0,
      },
      { q: "A stack is…", options: ["FIFO", "LIFO", "Random access", "Priority based"], answer: 1 },
      {
        q: "Binary search needs the array to be…",
        options: ["Unsorted", "Sorted", "Hashed", "Linked"],
        answer: 1,
      },
      {
        q: "Best case for bubble sort?",
        options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
        answer: 1,
      },
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
      {
        q: "Output of `list(range(2, 10, 3))`?",
        options: ["[2,5,8]", "[2,4,6,8]", "[3,6,9]", "[2,5,8,11]"],
        answer: 0,
      },
      {
        q: "Which is NOT a Python built-in?",
        options: ["map", "filter", "reduce", "zip"],
        answer: 2,
        explain: "`reduce` lives in `functools`.",
      },
      {
        q: "`{1,2,2,3}` evaluates to…",
        options: ["{1,2,3}", "{1,2,2,3}", "[1,2,3]", "Error"],
        answer: 0,
      },
      {
        q: "Which creates a class method?",
        options: ["@staticmethod", "@classmethod", "@property", "def __init__"],
        answer: 1,
      },
      { q: "`'abc'[::-1]` returns…", options: ["'abc'", "'cba'", "Error", "''"], answer: 1 },
      {
        q: "Default value of `dict.get('x')` when 'x' is missing?",
        options: ["0", "''", "None", "KeyError"],
        answer: 2,
      },
      {
        q: "What does `*args` collect?",
        options: ["Keyword args", "Positional args as tuple", "Positional args as list", "Globals"],
        answer: 1,
      },
      {
        q: "Which is a list comprehension?",
        options: ["[x for x in r]", "{x: y}", "(x for x in r)", "list(x)"],
        answer: 0,
      },
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
      {
        q: "Cross-entropy loss is used for…",
        options: ["Regression", "Classification", "Clustering", "PCA"],
        answer: 1,
      },
      {
        q: "Gradient descent updates weights to…",
        options: ["Maximize loss", "Minimize loss", "Random walk", "Skip layers"],
        answer: 1,
      },
      {
        q: "RAG stands for…",
        options: [
          "Random Answer Gen",
          "Retrieval-Augmented Generation",
          "Recurrent Attention Gate",
          "Ranked Answer Graph",
        ],
        answer: 1,
      },
      {
        q: "A high-bias model tends to…",
        options: ["Overfit", "Underfit", "Memorize", "Generalize perfectly"],
        answer: 1,
      },
      {
        q: "Dropout is used to…",
        options: [
          "Increase capacity",
          "Reduce overfitting",
          "Speed inference",
          "Initialize weights",
        ],
        answer: 1,
      },
      {
        q: "Token in an LLM is roughly…",
        options: ["1 character", "1 word", "A sub-word unit", "A sentence"],
        answer: 2,
      },
      {
        q: "Attention is O(n²) in…",
        options: ["Memory only", "Sequence length", "Batch size", "Hidden dim"],
        answer: 1,
      },
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
      {
        q: "HTTP status 201 means…",
        options: ["OK", "Created", "Accepted", "No Content"],
        answer: 1,
      },
      {
        q: "`===` in JS checks…",
        options: ["Value only", "Type only", "Value and type", "Reference only"],
        answer: 2,
      },
      {
        q: "CSS `flex: 1` is shorthand for…",
        options: ["flex-grow:1", "1 1 0", "0 0 auto", "1 0 auto"],
        answer: 1,
      },
      {
        q: "React keys should be…",
        options: ["Indexes", "Random", "Stable and unique", "Strings only"],
        answer: 2,
      },
      {
        q: "Which storage persists across tabs?",
        options: ["sessionStorage", "localStorage", "memory", "cookie SameSite=Strict"],
        answer: 1,
      },
      { q: "REST is built on…", options: ["WebSockets", "HTTP", "gRPC", "MQTT"], answer: 1 },
    ],
  },
  {
    slug: "c-programming-fundamentals",
    title: "C Programming Fundamentals",
    topic: "C",
    emoji: "⚙️",
    description: "Pointers, arrays, memory allocation, and core C concepts every engineering student must know.",
    minutes: 8,
    questions: [
      { q: "Which operator accesses the value at a pointer address?", options: ["\u0026", "*", "->", "."], answer: 1, explain: "`*` is the dereference operator." },
      { q: "What does `sizeof(int)` typically return on a 64-bit system?", options: ["2", "4", "8", "Depends on compiler"], answer: 1, explain: "On most compilers, `int` is 4 bytes." },
      { q: "Which function allocates memory and initializes to zero?", options: ["malloc", "calloc", "realloc", "free"], answer: 1, explain: "`calloc` zero-initializes unlike `malloc`." },
      { q: "First element index in a C array?", options: ["1", "0", "-1", "Depends"], answer: 1 },
      { q: "Which header is needed for printf?", options: ["stdlib.h", "stdio.h", "string.h", "math.h"], answer: 1 },
      { q: "`char name[10]` stores max string length of...", options: ["10", "9", "11", "8"], answer: 1, explain: "One byte for null terminator." },
      { q: "Which keyword prevents variable modification?", options: ["static", "const", "volatile", "extern"], answer: 1 },
      { q: "What does `struct` do in C?", options: ["Defines a loop", "Groups related variables", "Allocates heap memory", "Declares function pointer"], answer: 1 },
    ],
  },
  {
    slug: "java-oop-basics",
    title: "Java OOP Basics",
    topic: "Java",
    emoji: "☕",
    description: "Inheritance, interfaces, polymorphism, and collections for Java developers.",
    minutes: 7,
    questions: [
      { q: "Which keyword inherits a class in Java?", options: ["implements", "extends", "inherits", "super"], answer: 1, explain: "`extends` for classes, `implements` for interfaces." },
      { q: "Java supports which type of class inheritance?", options: ["Multiple", "Single", "Diamond", "All"], answer: 1, explain: "Single for classes; multiple via interfaces." },
      { q: "Which collection allows duplicate elements?", options: ["Set", "HashSet", "ArrayList", "TreeSet"], answer: 2, explain: "`ArrayList` allows duplicates and maintains order." },
      { q: "Parent class of all Java classes?", options: ["Main", "Object", "System", "Class"], answer: 1 },
      { q: "Which block handles exceptions?", options: ["if-else", "try-catch", "switch-case", "for-each"], answer: 1 },
      { q: "Can an abstract class be instantiated directly?", options: ["Yes", "No", "Only static", "Only subclass"], answer: 1, explain: "Abstract classes need a concrete subclass." },
      { q: "Which access modifier is class-only visible?", options: ["public", "protected", "private", "default"], answer: 2 },
    ],
  },
  {
    slug: "dbms-essentials",
    title: "DBMS Essentials",
    topic: "DBMS",
    emoji: "🗄️",
    description: "SQL queries, normalization, keys, joins, and transactions — must-know for every CS student.",
    minutes: 8,
    questions: [
      { q: "Which normal form removes partial dependency?", options: ["1NF", "2NF", "3NF", "BCNF"], answer: 1, explain: "2NF removes partial dependencies on composite primary keys." },
      { q: "ACID stands for Atomicity, Consistency, Isolation, and...", options: ["Data", "Durability", "Dependency", "Distribution"], answer: 1 },
      { q: "Which SQL clause filters grouped results?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], answer: 1, explain: "HAVING filters after GROUP BY; WHERE filters before grouping." },
      { q: "A foreign key references which key in another table?", options: ["Candidate key", "Primary key", "Alternate key", "Super key"], answer: 1 },
      { q: "Which join returns all rows from both tables?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], answer: 3, explain: "FULL OUTER JOIN returns all rows from both tables, with NULLs where no match." },
      { q: "Which command permanently saves changes in a transaction?", options: ["SAVEPOINT", "COMMIT", "ROLLBACK", "GRANT"], answer: 1 },
      { q: "Deadlock occurs when two transactions...", options: ["Run simultaneously", "Wait for each other indefinitely", "Access the same table", "Use different databases"], answer: 1, explain: "Deadlock is a circular wait where each transaction holds a lock the other needs." },
      { q: "Which SQL command removes a table structure entirely?", options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"], answer: 1, explain: "DROP removes the entire table including its structure. DELETE only removes rows." },
    ],
  },
  {
    slug: "operating-systems-core",
    title: "Operating Systems Core",
    topic: "OS",
    emoji: "🖥️",
    description: "Process scheduling, memory management, deadlocks, and file systems — OS fundamentals.",
    minutes: 8,
    questions: [
      { q: "Which scheduling algorithm may cause starvation?", options: ["FCFS", "SJF", "Round Robin", "FIFO"], answer: 1, explain: "Shortest Job First (SJF) can starve long processes if short ones keep arriving." },
      { q: "What does a semaphore do?", options: ["Allocates memory", "Controls access to shared resources", "Schedules processes", "Manages files"], answer: 1, explain: "Semaphores are synchronization tools that control concurrent access to shared resources." },
      { q: "Which page replacement algorithm is optimal but impractical?", options: ["FIFO", "LRU", "Optimal (Belady)", "Clock"], answer: 2, explain: "Optimal replaces the page not needed for the longest time — requires future knowledge." },
      { q: "Thrashing occurs when...", options: ["CPU is idle", "Too much paging happens", "Memory is full", "Disk fails"], answer: 1, explain: "Thrashing happens when a process spends more time paging than executing." },
      { q: "Which memory allocation strategy finds the smallest suitable block?", options: ["First Fit", "Best Fit", "Worst Fit", "Next Fit"], answer: 1, explain: "Best Fit searches for the smallest block that fits, minimizing wasted space." },
      { q: "Context switch involves saving and restoring the...", options: ["File system", "Process Control Block", "Disk buffer", "Network stack"], answer: 1 },
      { q: "Which condition is NOT required for deadlock?", options: ["Mutual Exclusion", "Hold and Wait", "Preemption", "Circular Wait"], answer: 2, explain: "Preemption (ability to take resources away) actually prevents deadlock. No preemption is the condition." },
      { q: "Virtual memory uses which hardware support?", options: ["Cache", "MMU (Memory Management Unit)", "DMA", "ALU"], answer: 1 },
    ],
  },
  {
    slug: "computer-networks",
    title: "Computer Networks",
    topic: "Networks",
    emoji: "🌐",
    description: "TCP/IP, OSI model, HTTP, DNS, subnetting — networking fundamentals for placements and exams.",
    minutes: 8,
    questions: [
      { q: "How many layers does the OSI model have?", options: ["4", "5", "7", "6"], answer: 2, explain: "OSI has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application." },
      { q: "TCP is a ___-oriented protocol.", options: ["Connection", "Connectionless", "Message", "Packet"], answer: 0, explain: "TCP establishes a connection (3-way handshake) before data transfer." },
      { q: "Which protocol translates domain names to IP addresses?", options: ["DHCP", "DNS", "FTP", "ARP"], answer: 1, explain: "DNS (Domain Name System) resolves human-readable names to IP addresses." },
      { q: "HTTP status code 404 means...", options: ["Server Error", "Not Found", "Redirect", "Unauthorized"], answer: 1 },
      { q: "Which layer handles routing in the OSI model?", options: ["Transport", "Network", "Data Link", "Session"], answer: 1, explain: "The Network layer (Layer 3) handles logical addressing and routing." },
      { q: "Default port number for HTTPS?", options: ["80", "443", "8080", "22"], answer: 1 },
      { q: "Which device operates at Layer 2 (Data Link)?", options: ["Router", "Switch", "Hub", "Modem"], answer: 1, explain: "Switches use MAC addresses and operate at the Data Link layer." },
      { q: "UDP is preferred over TCP when...", options: ["Reliability matters", "Speed matters more than reliability", "Large files transfer", "Security is critical"], answer: 1, explain: "UDP skips handshakes and error checking, making it faster for streaming and gaming." },
    ],
  },
  {
    slug: "cyber-security-basics",
    title: "Cyber Security Basics",
    topic: "Security",
    emoji: "🔒",
    description: "Encryption, attacks, authentication, and security principles — essential knowledge for every developer.",
    minutes: 7,
    questions: [
      { q: "Which attack floods a server with traffic to make it unavailable?", options: ["Phishing", "SQL Injection", "DDoS", "Man-in-the-Middle"], answer: 2, explain: "DDoS (Distributed Denial of Service) overwhelms a server with massive traffic." },
      { q: "HTTPS uses which protocol for encryption?", options: ["SSH", "SSL/TLS", "IPSec", "PGP"], answer: 1 },
      { q: "Which type of encryption uses the same key for encrypt and decrypt?", options: ["Asymmetric", "Symmetric", "Hashing", "Digital signature"], answer: 1, explain: "Symmetric encryption (AES, DES) uses one shared key. Asymmetric (RSA) uses public/private key pair." },
      { q: "SQL Injection exploits...", options: ["Weak passwords", "Unsanitized user input in queries", "Network protocols", "File permissions"], answer: 1, explain: "Attackers inject malicious SQL through unvalidated input fields." },
      { q: "Two-Factor Authentication (2FA) combines...", options: ["Two passwords", "Something you know + something you have", "Two email addresses", "Password + security question"], answer: 1 },
      { q: "A firewall primarily...", options: ["Encrypts data", "Filters network traffic based on rules", "Scans for viruses", "Backs up data"], answer: 1 },
      { q: "Which hash algorithm is considered insecure today?", options: ["SHA-256", "MD5", "SHA-3", "bcrypt"], answer: 1, explain: "MD5 has known collision vulnerabilities and should not be used for security." },
    ],
  },
];
