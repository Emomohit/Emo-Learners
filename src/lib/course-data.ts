// Long-form video courses (not a 30-day challenge). Each course is a single
// CodeWithHarry one-shot video on YouTube, chapterized so learners can hop
// straight to the lesson they need.

export type CourseChapter = {
  id: number;
  title: string;
  topic: string;
  notes: string[];
  snippet?: string;
  /** Approximate chapter start, seconds. Used to deep-link the video. */
  t: number;
};

export type Course = {
  slug: string;
  language: string;
  title: string;
  tagline: string;
  description: string;
  emoji: string;
  level: string;
  hours: string;
  instructor: string;
  videoId: string;
  accent: string; // tailwind color name for theming hints
  chapters: CourseChapter[];
};

export const chapterUrl = (videoId: string, t: number) =>
  `https://youtu.be/${videoId}?t=${Math.max(0, Math.floor(t))}`;

const javaChapters: CourseChapter[] = [
  {
    id: 1, t: 0,
    title: "Introduction to Java",
    topic: "What Java is and why it still rules enterprise + Android.",
    notes: [
      "Java is a compiled, statically typed, object-oriented language.",
      "Source `.java` → bytecode `.class` → runs on the JVM (write once, run anywhere).",
      "Powers Android, banking systems, big-data tooling (Spark, Kafka), Minecraft.",
      "Strong typing catches bugs at compile time, not at runtime.",
    ],
  },
  {
    id: 2, t: 600,
    title: "Install JDK & IntelliJ / VS Code",
    topic: "Setting up the toolchain.",
    notes: [
      "Install the JDK (Oracle or Temurin/Adoptium) — gives you `javac` and `java`.",
      "Verify: `java --version` and `javac --version` in the terminal.",
      "IntelliJ IDEA Community is the gold-standard Java IDE; VS Code with the Java Pack also works.",
      "First program: `HelloWorld.java` → `javac HelloWorld.java` → `java HelloWorld`.",
    ],
    snippet: `public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println("Hello, EMO Learners!");\n  }\n}`,
  },
  {
    id: 3, t: 1500,
    title: "Variables & Data Types",
    topic: "Primitives vs reference types.",
    notes: [
      "Primitives: `int`, `long`, `double`, `float`, `char`, `boolean`, `byte`, `short`.",
      "Reference types: `String`, arrays, classes — stored on the heap.",
      "Declare with type: `int age = 21;` — type can't change after that.",
      "`var` (Java 10+) infers the type but it's still static — `var x = 5;` is an int.",
    ],
    snippet: `int age = 21;\ndouble pi = 3.14159;\nString name = "Mohit";\nboolean isStudent = true;`,
  },
  {
    id: 4, t: 2400,
    title: "Type Casting",
    topic: "Widening, narrowing, and the cast operator.",
    notes: [
      "Widening (int → long → double) is automatic — no data loss.",
      "Narrowing (double → int) needs an explicit cast: `(int) 3.9` → 3.",
      "Casts truncate, they don't round.",
      "Wrapper classes (`Integer`, `Double`) box primitives for collections.",
    ],
    snippet: `double d = 9.7;\nint i = (int) d; // 9 — truncated, not rounded`,
  },
  {
    id: 5, t: 3300,
    title: "Operators",
    topic: "Arithmetic, relational, logical, bitwise.",
    notes: [
      "Arithmetic: `+ - * / %` — `/` between two ints is integer division.",
      "Relational return booleans: `==`, `!=`, `<`, `>`, `<=`, `>=`.",
      "Logical: `&&`, `||`, `!` — short-circuit evaluation.",
      "Compare strings with `.equals()`, NEVER with `==`.",
    ],
  },
  {
    id: 6, t: 4200,
    title: "Conditionals: if / else / switch",
    topic: "Branching logic.",
    notes: [
      "`if / else if / else` for ranged conditions.",
      "Java 14+ switch expressions: `String day = switch(n) { case 1 -> \"Mon\"; ... };`.",
      "Old-style switch needs `break` — forgetting one falls through.",
      "Ternary `a ? b : c` is fine for short two-way picks.",
    ],
  },
  {
    id: 7, t: 5100,
    title: "Loops: for / while / do-while",
    topic: "Repetition.",
    notes: [
      "Classic `for(int i=0; i<n; i++)` when you know the count.",
      "Enhanced for-each: `for(int x : arr)` — read-only iteration.",
      "`while` checks first, `do-while` runs at least once.",
      "`break` exits the loop, `continue` skips to the next iteration.",
    ],
    snippet: `int[] nums = {1,2,3,4,5};\nint sum = 0;\nfor (int n : nums) sum += n;\nSystem.out.println(sum); // 15`,
  },
  {
    id: 8, t: 6000,
    title: "Strings & String Methods",
    topic: "Working with text.",
    notes: [
      "Strings are immutable — every modification returns a new String.",
      "Common methods: `length()`, `charAt(i)`, `substring(a,b)`, `toUpperCase()`, `split(\",\")`.",
      "Concatenate with `+` or use `String.format(\"%s is %d\", name, age)`.",
      "For heavy concatenation in loops, use `StringBuilder`.",
    ],
  },
  {
    id: 9, t: 7200,
    title: "Arrays & 2D Arrays",
    topic: "Fixed-size collections.",
    notes: [
      "Declare: `int[] arr = new int[5];` or `int[] arr = {1,2,3};`.",
      "Length is `arr.length` (no parentheses — it's a field).",
      "2D array: `int[][] grid = new int[3][4];` — row-major in memory.",
      "Arrays are objects — passed by reference.",
    ],
    snippet: `int[][] grid = {{1,2,3},{4,5,6}};\nfor (int r = 0; r < grid.length; r++)\n  for (int c = 0; c < grid[r].length; c++)\n    System.out.print(grid[r][c] + " ");`,
  },
  {
    id: 10, t: 8400,
    title: "Methods & Method Overloading",
    topic: "Functions that live on classes.",
    notes: [
      "Signature: `returnType name(paramType param) { ... }`.",
      "Use `void` when nothing is returned.",
      "Overloading: same name, different parameter list. Return type alone doesn't count.",
      "`static` methods belong to the class, not an instance.",
    ],
    snippet: `static int add(int a, int b) { return a + b; }\nstatic double add(double a, double b) { return a + b; }`,
  },
  {
    id: 11, t: 9600,
    title: "OOP: Classes & Objects",
    topic: "The heart of Java.",
    notes: [
      "A class is a blueprint; an object is an instance created with `new`.",
      "Fields hold state, methods define behavior.",
      "Constructors initialize objects — same name as the class, no return type.",
      "`this` refers to the current instance.",
    ],
    snippet: `class Student {\n  String name;\n  Student(String n) { this.name = n; }\n}\nStudent s = new Student("Mohit");`,
  },
  {
    id: 12, t: 10800,
    title: "Encapsulation & Access Modifiers",
    topic: "Hiding internals.",
    notes: [
      "`private` (class only), `protected` (subclasses + same package), `public` (anyone), default (package).",
      "Make fields private, expose via getters/setters.",
      "Encapsulation = data + behavior bundled and protected together.",
    ],
  },
  {
    id: 13, t: 12000,
    title: "Inheritance",
    topic: "`extends` and the `super` keyword.",
    notes: [
      "`class Dog extends Animal` — Dog inherits Animal's fields/methods.",
      "Java has single inheritance for classes (use interfaces for multiple).",
      "`super(...)` calls the parent constructor; `super.method()` calls the parent method.",
      "Every class implicitly extends `Object`.",
    ],
  },
  {
    id: 14, t: 13200,
    title: "Polymorphism & Overriding",
    topic: "One interface, many forms.",
    notes: [
      "Override a parent method by matching signature + `@Override`.",
      "Runtime polymorphism: `Animal a = new Dog(); a.speak();` calls Dog's version.",
      "Overloading (compile-time) vs overriding (runtime) — different concepts.",
    ],
  },
  {
    id: 15, t: 14400,
    title: "Abstract Classes & Interfaces",
    topic: "Contracts and partial implementations.",
    notes: [
      "Abstract class: can have fields, constructors, and partial implementation. Cannot be instantiated.",
      "Interface: pure contract (default methods allowed since Java 8).",
      "A class can implement many interfaces but extend only one class.",
      "Use interfaces for capabilities (`Comparable`, `Runnable`), abstract classes for shared base logic.",
    ],
  },
  {
    id: 16, t: 16200,
    title: "Static, Final, and the `static` Keyword",
    topic: "Class-level state.",
    notes: [
      "`static` field/method belongs to the class — shared by all instances.",
      "`final` variable = constant; `final` method can't be overridden; `final` class can't be subclassed.",
      "`static final` = the standard Java constant idiom: `public static final double PI = 3.14159;`.",
    ],
  },
  {
    id: 17, t: 18000,
    title: "Exception Handling",
    topic: "`try / catch / finally / throw`.",
    notes: [
      "Checked exceptions (extend `Exception`) must be declared or caught.",
      "Unchecked exceptions (extend `RuntimeException`) are programmer bugs (NPE, ArrayIndexOutOfBounds).",
      "`finally` runs whether or not an exception was thrown — use for cleanup.",
      "`try-with-resources` auto-closes anything that implements `AutoCloseable`.",
    ],
    snippet: `try (Scanner sc = new Scanner(System.in)) {\n  int n = Integer.parseInt(sc.nextLine());\n} catch (NumberFormatException e) {\n  System.out.println("Not a number");\n}`,
  },
  {
    id: 18, t: 20400,
    title: "Collections: ArrayList, HashMap, HashSet",
    topic: "Dynamic data structures.",
    notes: [
      "`ArrayList<T>` — resizable array. `add`, `get(i)`, `remove(i)`, `size()`.",
      "`HashMap<K,V>` — key/value store, O(1) average lookup.",
      "`HashSet<T>` — unique elements, fast `contains`.",
      "Generics enforce type safety: `List<String> names = new ArrayList<>();`.",
    ],
    snippet: `Map<String, Integer> ages = new HashMap<>();\nages.put("Mohit", 21);\nSystem.out.println(ages.get("Mohit"));`,
  },
  {
    id: 19, t: 23400,
    title: "Generics",
    topic: "Type parameters.",
    notes: [
      "Generics let one class/method work with any reference type — checked at compile time.",
      "`class Box<T> { T value; }` — `T` is a placeholder.",
      "Bounded: `<T extends Number>` — only Number and subclasses.",
      "Wildcards: `List<? extends Animal>` for read, `List<? super Dog>` for write.",
    ],
  },
  {
    id: 20, t: 26100,
    title: "Lambdas & Functional Interfaces",
    topic: "Java 8 style.",
    notes: [
      "A lambda is shorthand for a single-method interface (functional interface).",
      "Syntax: `(a, b) -> a + b`.",
      "Common interfaces: `Function<T,R>`, `Predicate<T>`, `Consumer<T>`, `Supplier<T>`.",
      "Replaces verbose anonymous classes.",
    ],
    snippet: `Runnable r = () -> System.out.println("Hi");\nFunction<Integer,Integer> sq = x -> x * x;\nSystem.out.println(sq.apply(5));`,
  },
  {
    id: 21, t: 28800,
    title: "Streams API",
    topic: "Declarative collection processing.",
    notes: [
      "Streams chain operations: `filter`, `map`, `reduce`, `collect`.",
      "Lazy — nothing happens until a terminal op (like `collect` or `forEach`).",
      "Replaces verbose for-loops with readable pipelines.",
      "Don't reuse a stream — it's single-use.",
    ],
    snippet: `List<Integer> evens = List.of(1,2,3,4,5,6).stream()\n  .filter(n -> n % 2 == 0)\n  .toList();\nSystem.out.println(evens); // [2, 4, 6]`,
  },
  {
    id: 22, t: 31500,
    title: "File I/O",
    topic: "Reading and writing files.",
    notes: [
      "Modern path API: `Files.readString(Path.of(\"file.txt\"))`.",
      "`Files.writeString(Path.of(\"out.txt\"), content)` for writing.",
      "Use try-with-resources with `BufferedReader` / `BufferedWriter` for large files.",
      "Always handle `IOException`.",
    ],
  },
  {
    id: 23, t: 33000,
    title: "Multithreading Basics",
    topic: "Running code concurrently.",
    notes: [
      "Extend `Thread` or implement `Runnable` — the second is preferred.",
      "Start with `.start()`, not `.run()` (that runs on the current thread).",
      "Shared state needs `synchronized` blocks or `java.util.concurrent` primitives.",
      "Prefer `ExecutorService` over raw `Thread` in real apps.",
    ],
  },
  {
    id: 24, t: 34500,
    title: "Wrap-Up & What to Build Next",
    topic: "From course to project.",
    notes: [
      "Build a console banking app or a small Spring Boot REST API.",
      "Learn Maven/Gradle so you can pull in libraries.",
      "Pick a track: Backend (Spring Boot), Android (Kotlin shares the JVM), or Big Data (Spark).",
      "Practice on LeetCode / HackerRank to solidify syntax under pressure.",
    ],
  },
];

const cChapters: CourseChapter[] = [
  {
    id: 1, t: 0,
    title: "Introduction to C",
    topic: "Why every serious programmer learns C.",
    notes: [
      "C is a compiled, statically typed, procedural language — the ancestor of C++, Java, Go, Rust.",
      "Operating systems (Linux kernel), databases, embedded firmware are written in C.",
      "Teaches you memory, pointers, and what really happens beneath higher-level languages.",
      "Tiny runtime, blazing fast — the cost is you manage memory yourself.",
    ],
  },
  {
    id: 2, t: 480,
    title: "Install GCC & a Code Editor",
    topic: "Setting up the toolchain.",
    notes: [
      "Windows: install MinGW or use WSL. macOS: Xcode CLI tools (`xcode-select --install`). Linux: `sudo apt install build-essential`.",
      "Verify: `gcc --version`.",
      "Compile and run: `gcc hello.c -o hello && ./hello`.",
      "VS Code + C/C++ extension is the easiest editor combo.",
    ],
    snippet: `#include <stdio.h>\nint main() {\n  printf("Hello, EMO Learners!\\n");\n  return 0;\n}`,
  },
  {
    id: 3, t: 1200,
    title: "Variables & Data Types",
    topic: "Primitives in C.",
    notes: [
      "Basic types: `int`, `char`, `float`, `double`, `void`.",
      "Modifiers: `short`, `long`, `signed`, `unsigned`.",
      "Type sizes are platform-dependent — use `sizeof(int)` to check.",
      "Variables must be declared with a type before use.",
    ],
    snippet: `int age = 21;\nfloat pi = 3.14f;\nchar grade = 'A';`,
  },
  {
    id: 4, t: 2100,
    title: "printf & scanf — Input / Output",
    topic: "Reading and writing to the terminal.",
    notes: [
      "Format specifiers: `%d` int, `%f` float, `%c` char, `%s` string, `%lf` double.",
      "`scanf` needs `&` on variable addresses: `scanf(\"%d\", &n);`.",
      "Forgetting `&` is the #1 beginner crash (segfault).",
      "Use `\\n` to break lines — `printf` does NOT auto-newline.",
    ],
    snippet: `int n;\nprintf("Enter a number: ");\nscanf("%d", &n);\nprintf("You entered %d\\n", n);`,
  },
  {
    id: 5, t: 3000,
    title: "Operators & Type Casting",
    topic: "Computing and converting.",
    notes: [
      "Arithmetic, relational, logical, bitwise, assignment — same family as Java/Python.",
      "Integer division truncates: `5/2 == 2`. Cast one to float for real division: `(float)5/2 == 2.5`.",
      "`%` doesn't work on floats.",
      "Increment/decrement: `i++`, `++i` — pre vs post matters in expressions.",
    ],
  },
  {
    id: 6, t: 3900,
    title: "Conditionals: if / else / switch",
    topic: "Branching.",
    notes: [
      "`if / else if / else` — non-zero is truthy, zero is falsy.",
      "`switch` needs `break;` after each case or it falls through.",
      "C has no `bool` by default — include `<stdbool.h>` for `true` / `false`.",
    ],
  },
  {
    id: 7, t: 4800,
    title: "Loops: for / while / do-while",
    topic: "Repetition.",
    notes: [
      "`for(int i=0; i<n; i++)` is the workhorse.",
      "`while(cond) {...}` checks first, `do {...} while(cond);` runs at least once.",
      "`break` exits, `continue` skips to the next iteration.",
      "Infinite loop: `for(;;)` or `while(1)`.",
    ],
    snippet: `for (int i = 1; i <= 5; i++) {\n  printf("%d ", i * i);\n}\n// 1 4 9 16 25`,
  },
  {
    id: 8, t: 5700,
    title: "Arrays",
    topic: "Contiguous fixed-size storage.",
    notes: [
      "Declare: `int arr[5] = {1,2,3,4,5};`.",
      "C does NOT bounds-check — writing past the end is undefined behavior.",
      "Array name decays to a pointer to its first element when passed to a function.",
      "Get length only at declaration: `sizeof(arr)/sizeof(arr[0])` — won't work inside functions.",
    ],
  },
  {
    id: 9, t: 6600,
    title: "2D Arrays",
    topic: "Tables and matrices.",
    notes: [
      "`int grid[3][4];` — 3 rows, 4 columns, row-major in memory.",
      "Iterate with nested loops.",
      "Useful for matrices, game boards, image pixels.",
    ],
    snippet: `int grid[2][3] = {{1,2,3},{4,5,6}};\nfor (int r = 0; r < 2; r++) {\n  for (int c = 0; c < 3; c++) printf("%d ", grid[r][c]);\n  printf("\\n");\n}`,
  },
  {
    id: 10, t: 7500,
    title: "Strings in C",
    topic: "Null-terminated character arrays.",
    notes: [
      "A C string is `char[]` ending in `'\\0'`.",
      "`<string.h>` gives you `strlen`, `strcpy`, `strcmp`, `strcat`.",
      "Never use `gets()` — buffer overflow risk. Use `fgets()`.",
      "String literals (`\"hello\"`) live in read-only memory — don't modify them.",
    ],
    snippet: `char name[20];\nfgets(name, sizeof(name), stdin);\nprintf("Hi %s", name);`,
  },
  {
    id: 11, t: 8400,
    title: "Functions",
    topic: "Reusable code blocks.",
    notes: [
      "Declare before use, or add a prototype above `main`.",
      "Pass by value by default — the function gets a copy.",
      "Pass arrays/large structs by pointer for efficiency.",
      "`void` means no return value or no parameters.",
    ],
    snippet: `int add(int a, int b) {\n  return a + b;\n}\nint main() { printf("%d", add(2, 3)); }`,
  },
  {
    id: 12, t: 9300,
    title: "Recursion",
    topic: "Functions that call themselves.",
    notes: [
      "Always have a base case — without it, you get a stack overflow.",
      "Each call adds a frame to the call stack.",
      "Classic uses: factorial, Fibonacci, tree traversal.",
      "Recursion is often clearer than loops but slower without tail-call optimization (C doesn't guarantee TCO).",
    ],
    snippet: `int fact(int n) {\n  if (n <= 1) return 1;\n  return n * fact(n - 1);\n}`,
  },
  {
    id: 13, t: 10200,
    title: "Pointers — The Big One",
    topic: "Variables that hold addresses.",
    notes: [
      "Declare: `int *p;`. Get address: `&x`. Dereference: `*p`.",
      "A pointer's type tells the compiler how many bytes to read and how `++` moves it.",
      "Null pointer: `int *p = NULL;` — always check before dereferencing.",
      "Most C bugs (segfaults, leaks, UB) come from pointer mistakes — go slow here.",
    ],
    snippet: `int x = 42;\nint *p = &x;\nprintf("%d\\n", *p); // 42\n*p = 100;\nprintf("%d\\n", x);  // 100`,
  },
  {
    id: 14, t: 11400,
    title: "Pointer Arithmetic & Arrays",
    topic: "Why arrays and pointers feel like the same thing.",
    notes: [
      "`arr[i]` is exactly `*(arr + i)`.",
      "`p + 1` moves by `sizeof(*p)` bytes, not 1 byte.",
      "Walking an array with a pointer is idiomatic C.",
      "But: `sizeof(arr)` works on an array; on a pointer it gives the pointer size.",
    ],
  },
  {
    id: 15, t: 12600,
    title: "Pointers to Pointers & Pass-by-Reference",
    topic: "Modifying caller variables.",
    notes: [
      "C is pass-by-value, so to modify a caller's variable you pass its address.",
      "`void swap(int *a, int *b)` is the classic example.",
      "`int **pp` is a pointer to a pointer — used for 2D dynamic arrays and `argv`.",
    ],
    snippet: `void swap(int *a, int *b) {\n  int t = *a; *a = *b; *b = t;\n}\nint x = 1, y = 2;\nswap(&x, &y);`,
  },
  {
    id: 16, t: 13800,
    title: "Dynamic Memory: malloc, calloc, realloc, free",
    topic: "Heap allocation.",
    notes: [
      "`malloc(size)` returns a `void *` to uninitialized memory, or NULL on failure.",
      "`calloc(n, size)` zeroes the memory.",
      "Always `free()` whatever you `malloc()` — otherwise: memory leak.",
      "After free, set the pointer to NULL so you don't use-after-free.",
    ],
    snippet: `int *arr = malloc(n * sizeof(int));\nif (!arr) { perror("malloc"); exit(1); }\n// ... use arr ...\nfree(arr);\narr = NULL;`,
  },
  {
    id: 17, t: 15000,
    title: "Structures (struct)",
    topic: "Custom record types.",
    notes: [
      "Group related fields: `struct Student { char name[50]; int age; };`.",
      "Access with `.` on a value, `->` on a pointer: `s->age`.",
      "`typedef struct {...} Student;` lets you drop the `struct` keyword.",
      "Structs can be passed by value (copies) or by pointer (efficient).",
    ],
    snippet: `typedef struct {\n  char name[50];\n  int age;\n} Student;\nStudent s = {"Mohit", 21};\nprintf("%s is %d\\n", s.name, s.age);`,
  },
  {
    id: 18, t: 16200,
    title: "Unions & Enums",
    topic: "Variants and named constants.",
    notes: [
      "A `union` stores one of several types in the same memory — size = largest member.",
      "Useful for tagged variants and low-level type punning.",
      "`enum` defines a set of named integer constants: `enum { RED, GREEN, BLUE };`.",
    ],
  },
  {
    id: 19, t: 17100,
    title: "File I/O",
    topic: "Reading and writing files.",
    notes: [
      "Open with `FILE *f = fopen(\"data.txt\", \"r\");` — check for NULL.",
      "Modes: `r` read, `w` write (truncate), `a` append, `b` binary.",
      "Read with `fgets`, `fscanf`, `fread`. Write with `fprintf`, `fputs`, `fwrite`.",
      "Always `fclose(f);` — buffers may not flush otherwise.",
    ],
    snippet: `FILE *f = fopen("out.txt", "w");\nif (!f) return 1;\nfprintf(f, "Score: %d\\n", 95);\nfclose(f);`,
  },
  {
    id: 20, t: 18600,
    title: "Storage Classes",
    topic: "auto, static, extern, register.",
    notes: [
      "`static` inside a function: variable persists across calls.",
      "`static` at file scope: symbol is private to the file.",
      "`extern` declares a variable defined in another file.",
      "`register` is a hint to keep in a CPU register — modern compilers usually ignore it.",
    ],
  },
  {
    id: 21, t: 19500,
    title: "The Preprocessor",
    topic: "#include, #define, macros.",
    notes: [
      "`#include <header.h>` for system headers, `\"local.h\"` for your own.",
      "`#define PI 3.14159` — text substitution before compilation.",
      "Function-like macros: `#define SQ(x) ((x)*(x))` — always parenthesize args.",
      "`#ifdef` / `#ifndef` / `#endif` for conditional compilation and include guards.",
    ],
  },
  {
    id: 22, t: 20700,
    title: "Multi-file Projects & Makefiles",
    topic: "Splitting code across files.",
    notes: [
      "Header files (`.h`) declare; source files (`.c`) define.",
      "Use include guards: `#ifndef FOO_H` / `#define FOO_H` / `#endif`.",
      "Compile each `.c` to a `.o`, then link: `gcc a.o b.o -o app`.",
      "A `Makefile` automates that — `make` rebuilds only what changed.",
    ],
  },
  {
    id: 23, t: 21600,
    title: "Common Pitfalls & Undefined Behavior",
    topic: "What separates a C beginner from a C programmer.",
    notes: [
      "Uninitialized variables, buffer overflows, use-after-free, dangling pointers.",
      "Always compile with `-Wall -Wextra` — let the compiler warn you.",
      "Run with `valgrind` (Linux/macOS) to catch leaks and invalid reads.",
      "When in doubt, draw the memory layout on paper.",
    ],
  },
  {
    id: 24, t: 22500,
    title: "Wrap-Up & What to Build Next",
    topic: "From course to project.",
    notes: [
      "Build a CLI tool: a tiny shell, a JSON parser, a text editor like `kilo`.",
      "Read `The C Programming Language` (K&R) — short, dense, timeless.",
      "Try a microcontroller (Arduino in C, ESP32, STM32) to feel why C exists.",
      "Move to C++ or Rust once C feels natural — they'll click way faster.",
    ],
  },
];

export const courses: Course[] = [
  {
    slug: "python",
    language: "Python",
    title: "Complete Python — 30 Day Challenge",
    tagline: "Zero to confident in one focused month.",
    description:
      "A 30-day structured Python challenge with streaks, badges, and a personalized certificate. Built around CodeWithHarry's one-shot Python tutorial.",
    emoji: "🐍",
    level: "Beginner → Intermediate",
    hours: "~12 hrs of video",
    instructor: "CodeWithHarry",
    videoId: "UrsmFxEIp5k",
    accent: "from-yellow-400 to-orange-500",
    chapters: [], // Python uses the /challenge page, not the generic course view.
  },
  {
    slug: "java",
    language: "Java",
    title: "Complete Java — Basics to Advanced",
    tagline: "OOP, JVM, and the language that still powers the world.",
    description:
      "A chapter-by-chapter walkthrough of CodeWithHarry's complete Java course — variables and loops to OOP, generics, lambdas, streams, and multithreading.",
    emoji: "☕",
    level: "Beginner → Advanced",
    hours: "~10 hrs of video",
    instructor: "CodeWithHarry",
    videoId: "q6z_UCBM5Ek",
    accent: "from-amber-500 to-red-600",
    chapters: javaChapters,
  },
  {
    slug: "c",
    language: "C",
    title: "Complete C Language — Basics to Advanced",
    tagline: "Learn what every other language is hiding from you.",
    description:
      "Master C from `printf` to pointers, structs, dynamic memory, and multi-file projects. Mapped chapter-by-chapter to CodeWithHarry's complete C course.",
    emoji: "🇨",
    level: "Beginner → Advanced",
    hours: "~6.5 hrs of video",
    instructor: "CodeWithHarry",
    videoId: "irqbmMNs2Bo",
    accent: "from-sky-400 to-blue-700",
    chapters: cChapters,
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}
