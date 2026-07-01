// Extra learning material layered on top of existing course chapters.
// Keyed by course slug + chapter id, so we don't have to rewrite the giant
// course-data.ts file. Merged at render time in courses.$slug.tsx.

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  why: string;
};

export type Exercise = {
  prompt: string;
  expected: string;
  solution: string;
};

export type ChapterExtras = {
  quiz?: QuizQuestion[];
  exercise?: Exercise;
  /** Extra snippets shown as tabbed variations under the main snippet. */
  extraSnippets?: { label: string; code: string }[];
};

type CourseExtras = Record<number, ChapterExtras>;

// ============================================================
// JAVA — high-impact chapters
// ============================================================
const javaExtras: CourseExtras = {
  3: {
    quiz: [
      {
        q: "Which line will NOT compile?",
        options: [
          "int x = 5;",
          "double d = 3;",
          "int y = 3.14;",
          "var z = 10;",
        ],
        answer: 2,
        why: "3.14 is a double — assigning it to an int needs an explicit cast.",
      },
      {
        q: "What is the default value of an uninitialized instance field of type int?",
        options: ["null", "0", "undefined", "garbage"],
        answer: 1,
        why: "Instance fields get default values — 0 for numeric types, false for boolean, null for references.",
      },
      {
        q: "Which is a reference type?",
        options: ["int", "char", "boolean", "String"],
        answer: 3,
        why: "String is an object; the other three are primitives.",
      },
      {
        q: "`var name = \"Mohit\";` — what is the type of `name`?",
        options: ["Object", "var", "String", "char[]"],
        answer: 2,
        why: "`var` infers the type at compile time — the compiler picks String.",
      },
    ],
    exercise: {
      prompt: "Declare three variables — your name (String), your age (int), and your CGPA (double). Print them on one line, comma separated.",
      expected: "Mohit, 21, 8.4",
      solution: `String name = "Mohit";
int age = 21;
double cgpa = 8.4;
System.out.println(name + ", " + age + ", " + cgpa);`,
    },
  },
  7: {
    quiz: [
      {
        q: "How many times does `for (int i = 0; i < 5; i++)` run?",
        options: ["4", "5", "6", "Depends on i"],
        answer: 1,
        why: "`i` goes 0, 1, 2, 3, 4 — five iterations.",
      },
      {
        q: "Inside a loop, `break` will…",
        options: [
          "Skip to the next iteration",
          "Exit the loop entirely",
          "Restart the loop",
          "Throw an exception",
        ],
        answer: 1,
        why: "`break` terminates the innermost loop immediately. `continue` skips to the next iteration.",
      },
      {
        q: "Which loop guarantees the body runs at least once?",
        options: ["for", "while", "do-while", "enhanced for"],
        answer: 2,
        why: "`do { ... } while (cond);` checks the condition after running the body.",
      },
      {
        q: "Enhanced for-each on an `int[] arr` — can you reassign elements through the loop variable?",
        options: [
          "Yes, changes are reflected in the array",
          "No, the loop variable is a copy",
          "Only for reference types",
          "Only if you use `final`",
        ],
        answer: 1,
        why: "For primitive arrays the loop variable is a copy — mutating it does not touch the array.",
      },
    ],
    exercise: {
      prompt: "Read an integer n from `Scanner`. Print the sum of all even numbers from 1 to n. If n = 10, output should be 30.",
      expected: "30",
      solution: `Scanner sc = new Scanner(System.in);
int n = sc.nextInt();
int sum = 0;
for (int i = 2; i <= n; i += 2) sum += i;
System.out.println(sum);`,
    },
  },
  11: {
    quiz: [
      {
        q: "What is a constructor?",
        options: [
          "A method that returns the class type",
          "A special method with no return type, invoked with `new`",
          "A static block",
          "A getter for private fields",
        ],
        answer: 1,
        why: "Constructors initialize an object when it's created with `new`. Same name as the class, no return type.",
      },
      {
        q: "What does `this` refer to inside an instance method?",
        options: [
          "The parent class",
          "The current class definition",
          "The current instance",
          "The main method",
        ],
        answer: 2,
        why: "`this` is a reference to the object the method was called on.",
      },
      {
        q: "You created a class with no constructor. Can you still do `new MyClass()`?",
        options: ["No", "Only if it's static", "Yes, Java adds a default no-arg constructor", "Only inside main"],
        answer: 2,
        why: "If you don't define any constructor, the compiler generates a public no-arg default constructor.",
      },
      {
        q: "Which is NOT a member of a class?",
        options: ["Field", "Method", "Constructor", "Package"],
        answer: 3,
        why: "Fields, methods, and constructors live inside a class. Packages contain classes.",
      },
    ],
    exercise: {
      prompt: "Create a `Book` class with fields `title` (String) and `pages` (int), a constructor that takes both, and a method `summary()` that returns `\"<title> — <pages>p\"`. Instantiate `new Book(\"Atomic Habits\", 320)` and print its summary.",
      expected: "Atomic Habits — 320p",
      solution: `class Book {
  String title; int pages;
  Book(String t, int p) { this.title = t; this.pages = p; }
  String summary() { return title + " — " + pages + "p"; }
}
System.out.println(new Book("Atomic Habits", 320).summary());`,
    },
  },
  13: {
    quiz: [
      {
        q: "How many classes can one Java class directly extend?",
        options: ["0", "1", "As many as needed", "Unlimited via interfaces"],
        answer: 1,
        why: "Java allows single class inheritance. You can implement many interfaces though.",
      },
      {
        q: "`super()` inside a constructor…",
        options: [
          "Calls the parent constructor",
          "Calls a static method",
          "Refers to the outer class",
          "Is illegal in Java",
        ],
        answer: 0,
        why: "`super(...)` invokes a constructor of the direct parent class. Must be the first statement.",
      },
      {
        q: "Every class in Java implicitly extends…",
        options: ["Nothing", "Class", "Object", "Comparable"],
        answer: 2,
        why: "`java.lang.Object` is the root of the class hierarchy — every class inherits from it.",
      },
      {
        q: "If a subclass doesn't define a constructor, what happens?",
        options: [
          "Compile error",
          "It gets a default no-arg one that calls `super()`",
          "It cannot be instantiated",
          "It becomes abstract",
        ],
        answer: 1,
        why: "The compiler generates a no-arg constructor that implicitly calls the parent's no-arg constructor.",
      },
    ],
    exercise: {
      prompt: "Create `Animal` with method `speak()` printing \"Some sound\". Create `Dog extends Animal` overriding `speak()` to print \"Woof\". `new Dog().speak();` should print Woof.",
      expected: "Woof",
      solution: `class Animal { void speak() { System.out.println("Some sound"); } }
class Dog extends Animal { @Override void speak() { System.out.println("Woof"); } }
new Dog().speak();`,
    },
  },
  15: {
    quiz: [
      {
        q: "Which can be instantiated with `new`?",
        options: [
          "An interface",
          "An abstract class",
          "A concrete class",
          "An enum's abstract method",
        ],
        answer: 2,
        why: "Only concrete (non-abstract) classes can be instantiated directly.",
      },
      {
        q: "An interface method without a body is…",
        options: ["static", "default", "abstract by default", "private"],
        answer: 2,
        why: "Interface methods without a body are implicitly `public abstract`.",
      },
      {
        q: "How many interfaces can a class implement?",
        options: ["0", "1", "As many as needed", "Only functional interfaces"],
        answer: 2,
        why: "Java uses interfaces to overcome single-class inheritance — a class can implement any number of interfaces.",
      },
      {
        q: "Which is TRUE about abstract classes?",
        options: [
          "They cannot have fields",
          "They cannot have constructors",
          "They can have both abstract and concrete methods",
          "They must implement every method they declare",
        ],
        answer: 2,
        why: "Abstract classes can mix implemented behavior with unimplemented (abstract) method signatures.",
      },
    ],
    exercise: {
      prompt: "Define an interface `Playable` with method `play()`. Make a class `Music` that implements it and prints \"🎵 playing\". Call `new Music().play();`.",
      expected: "🎵 playing",
      solution: `interface Playable { void play(); }
class Music implements Playable {
  public void play() { System.out.println("🎵 playing"); }
}
new Music().play();`,
    },
  },
  17: {
    quiz: [
      {
        q: "Checked exceptions extend…",
        options: ["Error", "RuntimeException", "Exception (but NOT RuntimeException)", "Throwable directly"],
        answer: 2,
        why: "Checked exceptions extend Exception. Unchecked extend RuntimeException.",
      },
      {
        q: "`finally` runs…",
        options: [
          "Only if no exception is thrown",
          "Only if an exception is caught",
          "Whether or not an exception is thrown",
          "Only on program exit",
        ],
        answer: 2,
        why: "`finally` runs on every path out of the try block — normal completion, caught exception, or uncaught exception (before it propagates).",
      },
      {
        q: "Which is the ADVISED way to work with resources like files?",
        options: [
          "try / finally with a manual close",
          "try-with-resources",
          "System.exit()",
          "throw and forget",
        ],
        answer: 1,
        why: "try-with-resources auto-closes anything that implements AutoCloseable and is more concise and safer.",
      },
      {
        q: "`NullPointerException` is…",
        options: ["Checked", "Unchecked", "An Error", "Deprecated"],
        answer: 1,
        why: "NPE extends RuntimeException — unchecked. Compiler doesn't force you to catch it.",
      },
    ],
    exercise: {
      prompt: "Read an integer with `Integer.parseInt(sc.nextLine())`. If parsing fails, print \"Invalid input\" and don't crash.",
      expected: "Invalid input",
      solution: `try {
  int n = Integer.parseInt(new Scanner(System.in).nextLine());
  System.out.println(n * 2);
} catch (NumberFormatException e) {
  System.out.println("Invalid input");
}`,
    },
  },
  18: {
    quiz: [
      {
        q: "Which collection is ordered AND allows duplicates?",
        options: ["HashSet", "HashMap", "ArrayList", "TreeSet"],
        answer: 2,
        why: "ArrayList preserves insertion order and allows duplicates. HashSet doesn't allow duplicates; HashMap is a key/value store.",
      },
      {
        q: "Average time for `HashMap.get(key)`?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 0,
        why: "Well-distributed hashes give O(1) average lookups. Worst case is O(n) with terrible hashCode.",
      },
      {
        q: "Which will throw `UnsupportedOperationException`?",
        options: [
          "`new ArrayList<>().add(1)`",
          "`List.of(1,2,3).add(4)`",
          "`new HashSet<>().remove(1)`",
          "`new HashMap<>().put(\"a\", 1)`",
        ],
        answer: 1,
        why: "`List.of` returns an IMMUTABLE list. Any mutation throws UnsupportedOperationException.",
      },
      {
        q: "Best collection to check membership fast?",
        options: ["ArrayList", "LinkedList", "HashSet", "Queue"],
        answer: 2,
        why: "`HashSet.contains` is O(1) average. Lists are O(n).",
      },
    ],
    exercise: {
      prompt: "Given `String[] words = {\"go\", \"go\", \"build\"}`, print each unique word.",
      expected: "go\nbuild",
      solution: `String[] words = {"go", "go", "build"};
Set<String> seen = new LinkedHashSet<>(List.of(words));
seen.forEach(System.out::println);`,
    },
  },
  20: {
    quiz: [
      {
        q: "A lambda is shorthand for what?",
        options: [
          "A static method",
          "An anonymous inner class implementing a functional interface",
          "A thread",
          "A stream",
        ],
        answer: 1,
        why: "A lambda desugars to an implementation of a single-method (functional) interface.",
      },
      {
        q: "`Function<Integer, Integer> sq = x -> x * x;` — what does `sq.apply(4)` return?",
        options: ["4", "8", "16", "Compile error"],
        answer: 2,
        why: "4 * 4 = 16.",
      },
      {
        q: "`Predicate<T>` returns…",
        options: ["T", "void", "boolean", "Integer"],
        answer: 2,
        why: "`Predicate<T>.test(T)` returns a boolean — it's a test.",
      },
      {
        q: "`() -> System.out.println(\"hi\")` matches which interface?",
        options: ["Runnable", "Function", "Consumer", "Supplier"],
        answer: 0,
        why: "No args and no return — that's Runnable (or any custom void-no-arg functional interface).",
      },
    ],
    exercise: {
      prompt: "Using a lambda, sort a `List<String>` of `[\"go\", \"build\", \"a\", \"lot\"]` by length ascending.",
      expected: "[a, go, lot, build]",
      solution: `List<String> words = new ArrayList<>(List.of("go", "build", "a", "lot"));
words.sort((x, y) -> Integer.compare(x.length(), y.length()));
System.out.println(words);`,
    },
  },
  21: {
    quiz: [
      {
        q: "Streams are…",
        options: ["Eager and reusable", "Lazy and single-use", "Always parallel", "Always sequential"],
        answer: 1,
        why: "Nothing happens until a terminal op, and a stream can only be consumed once.",
      },
      {
        q: "Which is a terminal operation?",
        options: ["filter", "map", "collect", "peek"],
        answer: 2,
        why: "Terminal ops trigger the pipeline: collect, forEach, count, reduce, toList, findFirst…",
      },
      {
        q: "`.filter(n -> n > 0).map(n -> n * 2)` — which runs first on an element?",
        options: [
          "filter, always",
          "map, always",
          "It depends on the source",
          "They run interleaved per element",
        ],
        answer: 3,
        why: "Streams pull each element through the whole pipeline lazily — filter checks it, then map transforms it, one at a time.",
      },
      {
        q: "Which finishes a stream into a `List`?",
        options: [
          ".toList()",
          ".collect(Collectors.toList())",
          "Both of the above",
          "Neither — streams can't become lists",
        ],
        answer: 2,
        why: "Both work. `.toList()` (Java 16+) returns an unmodifiable list; Collectors returns a modifiable one.",
      },
    ],
    exercise: {
      prompt: "Given a list of ints [1..10], use a stream to compute the sum of the squares of the even numbers.",
      expected: "220",
      solution: `int sum = IntStream.rangeClosed(1, 10)
  .filter(n -> n % 2 == 0)
  .map(n -> n * n)
  .sum();
System.out.println(sum);`,
    },
  },
};

// ============================================================
// C — high-impact chapters
// ============================================================
const cExtras: CourseExtras = {
  3: {
    quiz: [
      {
        q: "What does `sizeof(int)` return?",
        options: ["Always 2", "Always 4", "Platform-dependent (usually 4)", "Depends on the value"],
        answer: 2,
        why: "C guarantees minimum sizes, not exact sizes. On most modern platforms int is 4 bytes.",
      },
      {
        q: "Which is the correct char declaration?",
        options: [
          "char c = \"a\";",
          "char c = 'a';",
          "String c = \"a\";",
          "char c = a;",
        ],
        answer: 1,
        why: "Single quotes for chars, double quotes for strings. Double quotes make a char[].",
      },
      {
        q: "The type `unsigned int` cannot store…",
        options: ["0", "The value 4294967295 (on 32-bit)", "Negative numbers", "Very large numbers"],
        answer: 2,
        why: "Unsigned types drop the sign bit — they represent 0 and positive values only.",
      },
      {
        q: "`float pi = 3.14;` — what happens?",
        options: [
          "Compile error",
          "3.14 is a double, silently narrowed to float (may warn)",
          "Runtime crash",
          "Assigns 3 to pi",
        ],
        answer: 1,
        why: "3.14 is a double literal. To make it a float, write 3.14f.",
      },
    ],
    exercise: {
      prompt: "Declare an int, a float, and a char. Print them each with the correct format specifier.",
      expected: "21 3.14 A",
      solution: `int age = 21;\nfloat pi = 3.14f;\nchar grade = 'A';\nprintf("%d %.2f %c\\n", age, pi, grade);`,
    },
  },
  4: {
    quiz: [
      {
        q: "You forgot the `&` in `scanf(\"%d\", n);`. What happens?",
        options: [
          "Compile error",
          "It works fine",
          "Undefined behavior, likely a crash",
          "It reads a char instead",
        ],
        answer: 2,
        why: "scanf needs the ADDRESS of a variable to write to. Without &, it treats n's value as a pointer — usually a segfault.",
      },
      {
        q: "Which is the correct specifier for a double?",
        options: ["%d", "%f", "%lf", "%s"],
        answer: 2,
        why: "%lf for scanf reading a double. %f in printf also works for doubles (they get promoted).",
      },
      {
        q: "`printf(\"%d\\n\", 3.14);` prints what?",
        options: ["3.14", "3", "Undefined — wrong specifier", "Compile error"],
        answer: 2,
        why: "Mismatched format specifier and argument is UB. The compiler may warn but won't stop you.",
      },
      {
        q: "How do you print a percent sign in printf?",
        options: ["%p", "%%", "\\%", "\\p"],
        answer: 1,
        why: "%% inside a format string prints a literal %. \\% is not a valid escape.",
      },
    ],
    exercise: {
      prompt: "Read two integers with scanf and print their sum.",
      expected: "Enter a and b: 3 4\nSum = 7",
      solution: `int a, b;\nprintf("Enter a and b: ");\nscanf("%d %d", &a, &b);\nprintf("Sum = %d\\n", a + b);`,
    },
  },
  7: {
    quiz: [
      {
        q: "`for(int i=0; i<5; i++)` runs how many times?",
        options: ["4", "5", "6", "Depends"],
        answer: 1,
        why: "i takes values 0, 1, 2, 3, 4 — five iterations.",
      },
      {
        q: "Difference between `while` and `do-while`?",
        options: [
          "None",
          "while checks first, do-while checks after (body runs at least once)",
          "do-while is faster",
          "while can't be nested",
        ],
        answer: 1,
        why: "do-while guarantees at least one execution — the condition is checked after the body.",
      },
      {
        q: "`continue` inside a loop does what?",
        options: [
          "Exits the loop",
          "Skips the rest of the current iteration and moves to the next",
          "Restarts the loop from i=0",
          "Errors out",
        ],
        answer: 1,
        why: "continue jumps back to the loop condition (or the update in a for loop).",
      },
      {
        q: "How do you write an infinite loop in C?",
        options: ["for(;;)", "while(1)", "Both", "Neither — C doesn't allow it"],
        answer: 2,
        why: "Both idioms compile to the same thing. Use `break` to exit.",
      },
    ],
    exercise: {
      prompt: "Read an integer n and print the multiplication table of n from 1 to 10.",
      expected: "n = 5\n5 x 1 = 5\n5 x 2 = 10\n...\n5 x 10 = 50",
      solution: `int n;\nscanf("%d", &n);\nfor (int i = 1; i <= 10; i++)\n  printf("%d x %d = %d\\n", n, i, n * i);`,
    },
  },
  8: {
    quiz: [
      {
        q: "What is `arr[5]` if `int arr[5]`?",
        options: ["The last element", "The 5th element (0-indexed)", "Undefined behavior — one past the end", "0"],
        answer: 2,
        why: "Valid indices are 0..4. arr[5] is one past the end — reading it is UB.",
      },
      {
        q: "`int arr[3] = {1, 2, 3}; printf(\"%zu\", sizeof(arr));` prints (on 32-bit int)?",
        options: ["3", "12", "4", "Depends on the compiler"],
        answer: 1,
        why: "3 ints × 4 bytes each = 12 bytes.",
      },
      {
        q: "When you pass an array to a function, inside the function `sizeof(arr)` gives…",
        options: [
          "The size of the whole array",
          "The size of one element",
          "The size of a pointer",
          "0",
        ],
        answer: 2,
        why: "The array decays to a pointer at the function boundary. sizeof gives the pointer size (usually 8 bytes).",
      },
      {
        q: "Can you resize a `int arr[5]` at runtime?",
        options: ["Yes, use realloc", "No, its size is fixed at declaration", "Only in C99+", "Yes, use arr = new int[10]"],
        answer: 1,
        why: "Static arrays are fixed at declaration. For resizable storage, use malloc/realloc on the heap.",
      },
    ],
    exercise: {
      prompt: "Given `int nums[] = {5, 2, 8, 1, 9};` print the largest value.",
      expected: "9",
      solution: `int nums[] = {5, 2, 8, 1, 9};\nint n = sizeof(nums)/sizeof(nums[0]);\nint max = nums[0];\nfor (int i = 1; i < n; i++)\n  if (nums[i] > max) max = nums[i];\nprintf("%d\\n", max);`,
    },
  },
  10: {
    quiz: [
      {
        q: "C strings are terminated with…",
        options: ["'\\n'", "'\\0'", "EOF", "space"],
        answer: 1,
        why: "The null terminator '\\0' (a byte of value 0) marks the end of a C string.",
      },
      {
        q: "`char s[] = \"hi\";` — what is `sizeof(s)`?",
        options: ["2", "3", "4", "Undefined"],
        answer: 1,
        why: "'h', 'i', '\\0' — three chars.",
      },
      {
        q: "Which is UNSAFE?",
        options: ["fgets", "snprintf", "strncpy", "gets"],
        answer: 3,
        why: "gets has no length limit — it's been removed from modern C. Use fgets.",
      },
      {
        q: "`strcmp(\"abc\", \"abd\")` returns…",
        options: [
          "0",
          "A positive number",
          "A negative number",
          "1 or -1 only",
        ],
        answer: 2,
        why: "strcmp returns negative if s1 < s2, 0 if equal, positive if s1 > s2. 'c' < 'd' so this is negative.",
      },
    ],
    exercise: {
      prompt: "Read a name with fgets into a 50-char buffer and print `Hello, <name>!`.",
      expected: "Enter name: Mohit\nHello, Mohit!",
      solution: `char name[50];\nprintf("Enter name: ");\nfgets(name, sizeof(name), stdin);\nname[strcspn(name, "\\n")] = 0; // strip newline\nprintf("Hello, %s!\\n", name);`,
    },
  },
  13: {
    quiz: [
      {
        q: "`int x = 5; int *p = &x;` — what is `*p`?",
        options: ["The address of x", "5", "A copy of x", "NULL"],
        answer: 1,
        why: "* dereferences the pointer — it gives you the value at that address, i.e. x itself.",
      },
      {
        q: "`int *p = NULL; *p = 10;` — what happens?",
        options: [
          "Sets p to 10",
          "Compile error",
          "Segfault (dereferencing NULL)",
          "Nothing",
        ],
        answer: 2,
        why: "Dereferencing a NULL pointer is undefined behavior — on most systems it segfaults.",
      },
      {
        q: "`&x` gives you…",
        options: ["The value of x", "The address of x", "A copy of x", "The type of x"],
        answer: 1,
        why: "& is the address-of operator.",
      },
      {
        q: "`int *p; int a = 5; p = &a;` then `*p = 20;`. What is `a`?",
        options: ["5", "20", "Undefined", "The address of a"],
        answer: 1,
        why: "*p writes through the pointer to the memory a lives in, so a becomes 20.",
      },
    ],
    exercise: {
      prompt: "Write a function `void increment(int *n)` that increments the caller's integer. Call it on a local `int x = 4;` — after the call, x should be 5.",
      expected: "5",
      solution: `void increment(int *n) { (*n)++; }
int main() {
  int x = 4;
  increment(&x);
  printf("%d\\n", x);
  return 0;
}`,
    },
  },
  16: {
    quiz: [
      {
        q: "`malloc(n * sizeof(int))` returns…",
        options: [
          "An int",
          "A `void *` pointing to n ints of uninitialized memory, or NULL",
          "A zeroed int array",
          "Always a non-NULL pointer",
        ],
        answer: 1,
        why: "malloc gives raw, uninitialized memory. Always check for NULL.",
      },
      {
        q: "What zeroes the allocated memory?",
        options: ["malloc", "calloc", "realloc", "None"],
        answer: 1,
        why: "calloc(n, size) zeroes the whole block. malloc does NOT.",
      },
      {
        q: "You free a pointer but keep using it. What is that called?",
        options: ["Memory leak", "Dangling pointer / use-after-free", "Double free", "Stack overflow"],
        answer: 1,
        why: "Using a freed pointer is a use-after-free — classic UB. Set p = NULL after free() to catch this.",
      },
      {
        q: "You malloc a buffer and never free it. What's that?",
        options: ["A leak", "Undefined behavior", "A crash", "A syntax error"],
        answer: 0,
        why: "Memory leaks accumulate over the lifetime of the program. Not a crash, but real production issue.",
      },
    ],
    exercise: {
      prompt: "Allocate an int array of size n (read from stdin), fill it with i*i, print the sum, then free.",
      expected: "n = 4\nSum = 14",
      solution: `int n;\nscanf("%d", &n);\nint *arr = malloc(n * sizeof(int));\nif (!arr) return 1;\nint sum = 0;\nfor (int i = 0; i < n; i++) { arr[i] = i * i; sum += arr[i]; }\nprintf("Sum = %d\\n", sum);\nfree(arr);\narr = NULL;`,
    },
  },
  17: {
    quiz: [
      {
        q: "How do you access a field via a struct pointer?",
        options: ["p.field", "p->field", "*p.field", "&p.field"],
        answer: 1,
        why: "`p->field` is shorthand for `(*p).field`.",
      },
      {
        q: "`typedef struct { int x; } Point;` lets you write…",
        options: [
          "struct Point p;",
          "Point p;",
          "typedef p;",
          "struct p;",
        ],
        answer: 1,
        why: "typedef gives you a plain type alias — no `struct` keyword required.",
      },
      {
        q: "Structs in C can contain…",
        options: ["Methods", "Other structs, arrays, and pointers", "Static variables like Java classes", "Nothing but ints"],
        answer: 1,
        why: "C structs are pure data records. They can nest and hold any type of data. No methods.",
      },
      {
        q: "Two struct instances — how do you copy one to the other?",
        options: [
          "You can't; use memcpy",
          "Plain assignment: `a = b;` copies field by field",
          "Only pointer copy",
          "Use strcpy",
        ],
        answer: 1,
        why: "In C, struct assignment does a shallow member-wise copy. But watch out — pointer fields still point to the same memory.",
      },
    ],
    exercise: {
      prompt: "Define a struct Student with fields name (char[50]) and marks (int). Fill one and print it.",
      expected: "Mohit scored 95",
      solution: `typedef struct { char name[50]; int marks; } Student;\nStudent s = {"Mohit", 95};\nprintf("%s scored %d\\n", s.name, s.marks);`,
    },
  },
};

// ============================================================
// DSA — full course extras (chapters 1..20)
// ============================================================
const dsaExtras: CourseExtras = {
  1: {
    quiz: [
      {
        q: "Which of these is O(1)?",
        options: [
          "Looping over an array of n items",
          "Binary search",
          "Accessing arr[i] in an array",
          "Bubble sort",
        ],
        answer: 2,
        why: "Random access to a flat array is a single memory load — constant time regardless of size.",
      },
      {
        q: "A single loop from 1 to n is:",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 2,
        why: "Work grows linearly with n.",
      },
      {
        q: "Nested loops both up to n:",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"],
        answer: 2,
        why: "n × n = n².",
      },
      {
        q: "Binary search on a sorted array of size n:",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 1,
        why: "Each step halves the search space — log₂(n) steps.",
      },
    ],
    exercise: {
      prompt: "Given a function that does two independent single loops (each n) then a nested loop of n × n, state the overall time complexity in Big-O.",
      expected: "O(n²)",
      solution: "O(n) + O(n) + O(n²) → dominated by n² → O(n²). Constants and slower-growing terms drop.",
    },
  },
  2: {
    quiz: [
      {
        q: "Best case time to find an element in an unsorted array?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 0,
        why: "If the element is at index 0, you find it on the first check — O(1).",
      },
      {
        q: "Worst case time?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 2,
        why: "It might be at the end or absent — you scan every element.",
      },
      {
        q: "To insert at the end of a dynamic array (amortized):",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 0,
        why: "Amortized O(1) — occasional resize costs O(n) but averages out.",
      },
      {
        q: "To insert at the beginning of an array of size n:",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 2,
        why: "Every element must shift right one slot.",
      },
    ],
    exercise: {
      prompt: "Given an int array and a target, return the FIRST index where the target appears, or -1.",
      expected: "target=7 → 2",
      solution: `def find_first(arr, target):
    for i, v in enumerate(arr):
        if v == target:
            return i
    return -1
# find_first([3, 5, 7, 7, 9], 7) → 2`,
    },
  },
  3: {
    quiz: [
      {
        q: "Reversing a string of length n takes:",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 2,
        why: "You must touch every character.",
      },
      {
        q: "Checking if two strings are anagrams — fastest approach?",
        options: [
          "Sort both, O(n log n)",
          "Count chars in one array of size 26, O(n)",
          "Nested loop, O(n²)",
          "Cannot be done under O(n²)",
        ],
        answer: 1,
        why: "A frequency count works in linear time.",
      },
      {
        q: "In Python, `s[::-1]` reverses a string in:",
        options: ["O(1) (constant, just changes stride)", "O(n)", "O(log n)", "O(n log n)"],
        answer: 1,
        why: "Python slicing creates a NEW string, copying n characters.",
      },
      {
        q: "Which is TRUE about strings in most languages?",
        options: [
          "They are mutable everywhere",
          "In Python/Java/JS they are immutable — `s + \"a\"` builds a new string",
          "They are always O(1) to concatenate",
          "They cannot contain non-ASCII characters",
        ],
        answer: 1,
        why: "Immutability is why repeatedly using `+=` in a loop is O(n²). Use a list/StringBuilder and join at the end.",
      },
    ],
    exercise: {
      prompt: "Return True if two strings are anagrams (same characters, any order).",
      expected: "anagram('listen', 'silent') → True",
      solution: `def anagram(a, b):
    if len(a) != len(b): return False
    counts = [0] * 26
    for ch in a: counts[ord(ch) - ord('a')] += 1
    for ch in b: counts[ord(ch) - ord('a')] -= 1
    return all(c == 0 for c in counts)`,
    },
  },
  4: {
    quiz: [
      {
        q: "Average time to look up a key in a hash map?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 0,
        why: "Good hash functions give O(1) average — worst case is O(n) with terrible collisions.",
      },
      {
        q: "Best way to find duplicates in an array in O(n)?",
        options: [
          "Nested loops",
          "Sort, then scan for equal neighbors — O(n log n)",
          "Hash set — insert while checking membership",
          "Impossible in O(n)",
        ],
        answer: 2,
        why: "Insert into a set; if `contains(x)` is true before insert, x is a duplicate. O(n) time, O(n) space.",
      },
      {
        q: "You want counts of each character. Best structure?",
        options: ["Array of 26/128", "HashMap<Char, Int>", "Both work — array wins for ASCII", "Neither"],
        answer: 2,
        why: "For a small fixed alphabet, an array is faster and simpler. For general strings, use a hash map.",
      },
      {
        q: "Which is NOT typically hashable in Python?",
        options: ["A tuple of ints", "A string", "A list", "A frozenset"],
        answer: 2,
        why: "Lists are mutable — Python won't let you use them as dict keys.",
      },
    ],
    exercise: {
      prompt: "Given an int array, return the first element that repeats.",
      expected: "[2, 5, 3, 5, 2] → 5",
      solution: `def first_repeat(arr):
    seen = set()
    for x in arr:
        if x in seen: return x
        seen.add(x)
    return None`,
    },
  },
  5: {
    quiz: [
      {
        q: "Two-pointer approach on a sorted array to find a pair summing to target — time?",
        options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
        answer: 1,
        why: "One pointer at each end, moving inward — n steps total.",
      },
      {
        q: "When both pointers are moving TOWARD each other, the loop condition is usually:",
        options: ["l < r", "l > r", "l == r", "l != r"],
        answer: 0,
        why: "Stop when they meet or cross.",
      },
      {
        q: "For an unsorted array, can two-pointer solve pair-sum in O(n) without extra memory?",
        options: ["Yes, always", "No — you'd need to sort first (O(n log n)) or use a hash set (O(n) with O(n) space)", "Only for positive numbers", "Only for small n"],
        answer: 1,
        why: "Two pointers rely on order. Without sorting, use a hash set.",
      },
      {
        q: "The 'fast and slow pointer' idiom is used for:",
        options: [
          "Sorting",
          "Cycle detection in linked lists",
          "Binary search",
          "String comparison",
        ],
        answer: 1,
        why: "Floyd's tortoise-and-hare — if there's a cycle, the fast pointer laps the slow one.",
      },
    ],
    exercise: {
      prompt: "Given a SORTED array and target, return the two indices whose values sum to target (1-based), or [-1, -1].",
      expected: "[2, 7, 11, 15], target=9 → [1, 2]",
      solution: `def two_sum_sorted(arr, target):
    l, r = 0, len(arr) - 1
    while l < r:
        s = arr[l] + arr[r]
        if s == target: return [l + 1, r + 1]
        if s < target: l += 1
        else: r -= 1
    return [-1, -1]`,
    },
  },
  6: {
    quiz: [
      {
        q: "Sliding window works best when:",
        options: [
          "You need every possible subarray",
          "You need a subarray/substring satisfying some running condition",
          "Data is unsorted",
          "You have infinite memory",
        ],
        answer: 1,
        why: "Sliding window reuses work as the window expands and contracts — O(n) instead of O(n²).",
      },
      {
        q: "Time complexity of sliding window over an array of size n?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"],
        answer: 0,
        why: "Each element enters and leaves the window at most once.",
      },
      {
        q: "Fixed-size window vs variable-size — pick one for `longest substring with at most K distinct chars`:",
        options: ["Fixed", "Variable", "Neither works", "Both are O(n log n)"],
        answer: 1,
        why: "The window grows while valid and shrinks when the constraint breaks — it changes size.",
      },
      {
        q: "Maximum sum of any window of size k in O(n)?",
        options: [
          "Impossible",
          "Compute the first window's sum, then slide: subtract leaving element, add entering element",
          "Sort the array first",
          "Use recursion",
        ],
        answer: 1,
        why: "Reuse the previous window's sum — one addition, one subtraction per step.",
      },
    ],
    exercise: {
      prompt: "Given `nums` and `k`, return the maximum sum of any contiguous window of size k.",
      expected: "nums=[2, 1, 5, 1, 3, 2], k=3 → 9",
      solution: `def max_window(nums, k):
    w = sum(nums[:k])
    best = w
    for i in range(k, len(nums)):
        w += nums[i] - nums[i - k]
        best = max(best, w)
    return best`,
    },
  },
  7: {
    quiz: [
      {
        q: "A stack is:",
        options: ["FIFO", "LIFO", "Priority-ordered", "Random access"],
        answer: 1,
        why: "Last In, First Out.",
      },
      {
        q: "Push and pop on a stack are:",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 0,
        why: "Constant time — you're just moving a pointer at the top.",
      },
      {
        q: "Which is a classic stack problem?",
        options: [
          "Cycle detection",
          "Valid parentheses",
          "Kth smallest element",
          "Binary search",
        ],
        answer: 1,
        why: "Push open brackets, pop when you see a close — must match.",
      },
      {
        q: "Function call recursion internally uses:",
        options: ["Queue", "Heap", "Stack (the call stack)", "Hash table"],
        answer: 2,
        why: "Each call pushes a frame onto the call stack; return pops it.",
      },
    ],
    exercise: {
      prompt: "Given a string of `()`, `[]`, `{}`, return True if brackets are balanced.",
      expected: "'([]{})' → True, '(]' → False",
      solution: `def valid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ch in s:
        if ch in '([{': stack.append(ch)
        else:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack`,
    },
  },
  8: {
    quiz: [
      {
        q: "A queue is:",
        options: ["FIFO", "LIFO", "Sorted", "Random"],
        answer: 0,
        why: "First In, First Out — like a line at the tea stall.",
      },
      {
        q: "Which uses a queue naturally?",
        options: [
          "Depth-first search",
          "Breadth-first search",
          "Binary search",
          "Merge sort",
        ],
        answer: 1,
        why: "BFS explores level by level — you enqueue neighbors and dequeue in order.",
      },
      {
        q: "In Python, the fast queue implementation is:",
        options: ["list.pop(0)", "collections.deque", "heapq", "set"],
        answer: 1,
        why: "list.pop(0) is O(n). deque.popleft() is O(1).",
      },
      {
        q: "A priority queue is backed by:",
        options: ["Array", "Linked list", "Heap (typically binary heap)", "Hash map"],
        answer: 2,
        why: "Heaps give O(log n) push/pop with access to the min or max in O(1).",
      },
    ],
    exercise: {
      prompt: "Simulate a print queue: process 5 jobs in the order they arrive. Print each job number as it's processed.",
      expected: "1 2 3 4 5",
      solution: `from collections import deque
q = deque(range(1, 6))
while q:
    print(q.popleft(), end=' ')`,
    },
  },
  9: {
    quiz: [
      {
        q: "A singly-linked list node has:",
        options: [
          "value + prev pointer",
          "value + next pointer",
          "value only",
          "value + next + prev",
        ],
        answer: 1,
        why: "Singly-linked = one pointer forward. Doubly-linked has both.",
      },
      {
        q: "Time to insert at the head of a linked list?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 0,
        why: "Point new_node.next to old head; move head to new_node.",
      },
      {
        q: "Random access — arr[i] vs list[i] — which is faster?",
        options: [
          "Array — O(1) vs list's O(n)",
          "List — arrays are O(n)",
          "Same",
          "Depends on the language",
        ],
        answer: 0,
        why: "Arrays are contiguous — direct addressing. Linked lists must walk.",
      },
      {
        q: "Reversing a singly-linked list in place uses:",
        options: [
          "A stack",
          "Recursion or three pointers (prev, curr, next)",
          "A hash set",
          "Cannot be done in place",
        ],
        answer: 1,
        why: "Walk the list flipping next pointers one at a time.",
      },
    ],
    exercise: {
      prompt: "Reverse a singly-linked list in place. Return the new head.",
      expected: "1→2→3 becomes 3→2→1",
      solution: `def reverse(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    },
  },
  10: {
    quiz: [
      {
        q: "Every recursive function needs:",
        options: [
          "A loop",
          "A base case",
          "A global variable",
          "Tail recursion",
        ],
        answer: 1,
        why: "Without a base case, recursion never stops — stack overflow.",
      },
      {
        q: "Space complexity of `n!` recursion (call stack depth)?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 2,
        why: "One frame per call — n calls deep.",
      },
      {
        q: "Fib recursion `fib(n) = fib(n-1) + fib(n-2)` without memo is:",
        options: ["O(n)", "O(n log n)", "O(2ⁿ)", "O(n²)"],
        answer: 2,
        why: "The recursion tree branches by 2 at each level → exponential.",
      },
      {
        q: "How do you turn exponential fib into linear?",
        options: [
          "Larger recursion depth",
          "Memoize (top-down DP) or iterate (bottom-up)",
          "Cannot be done",
          "Use threads",
        ],
        answer: 1,
        why: "Save subproblem answers — each fib(k) is computed once.",
      },
    ],
    exercise: {
      prompt: "Compute the nth Fibonacci number (fib(0)=0, fib(1)=1) recursively WITH memoization.",
      expected: "fib(10) → 55",
      solution: `from functools import lru_cache
@lru_cache(None)
def fib(n):
    if n < 2: return n
    return fib(n - 1) + fib(n - 2)`,
    },
  },
  11: {
    quiz: [
      {
        q: "Bubble sort worst-case time:",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"],
        answer: 2,
        why: "Nested loops with n² comparisons in the worst case.",
      },
      {
        q: "Merge sort time (all cases):",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(n³)"],
        answer: 1,
        why: "log n levels of splitting × O(n) work to merge at each level.",
      },
      {
        q: "Quicksort worst case (unlucky pivots):",
        options: ["O(n log n)", "O(n²)", "O(n)", "O(2ⁿ)"],
        answer: 1,
        why: "If every pivot ends up as the smallest/largest, recursion is n deep.",
      },
      {
        q: "Which sort is STABLE (preserves relative order of equal keys)?",
        options: ["Quicksort", "Heapsort", "Merge sort", "Selection sort"],
        answer: 2,
        why: "Merge sort is stable by design. Quicksort and heapsort are not.",
      },
    ],
    exercise: {
      prompt: "Sort a list of tuples `[(name, age)]` by age ascending, stable.",
      expected: "[('a', 20), ('b', 30)]",
      solution: `people = [('b', 30), ('a', 20)]
people.sort(key=lambda p: p[1])  # Python's Timsort is stable
print(people)`,
    },
  },
  12: {
    quiz: [
      {
        q: "Binary search requires:",
        options: [
          "The array to be sorted",
          "The array to be unsorted",
          "A hash map",
          "Recursion",
        ],
        answer: 0,
        why: "Halving only works when order is known.",
      },
      {
        q: "Time complexity of binary search:",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 1,
        why: "Each step cuts the range in half.",
      },
      {
        q: "Which is a classic 'binary search on answer' problem?",
        options: [
          "Reverse a string",
          "Minimum days to ship packages (Koko/capacity type)",
          "Sort an array",
          "Sum of two numbers",
        ],
        answer: 1,
        why: "You binary search a possible answer and check feasibility in O(n).",
      },
      {
        q: "`mid = (lo + hi) / 2` in older languages can bug how?",
        options: [
          "It's fine",
          "Integer overflow if lo + hi exceeds int range",
          "Off-by-one always",
          "Slower than mid = lo + (hi - lo) / 2",
        ],
        answer: 1,
        why: "Use `mid = lo + (hi - lo) / 2` to avoid overflow in Java/C.",
      },
    ],
    exercise: {
      prompt: "Given a sorted array and target, return its index (or -1). Do it in O(log n).",
      expected: "[1, 3, 5, 7, 9], target=7 → 3",
      solution: `def bsearch(a, t):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == t: return mid
        if a[mid] < t: lo = mid + 1
        else: hi = mid - 1
    return -1`,
    },
  },
  13: {
    quiz: [
      {
        q: "Number of nodes in a binary tree of height h (perfect):",
        options: ["h", "h²", "2^h - 1", "2h"],
        answer: 2,
        why: "1 + 2 + 4 + ... + 2^(h-1) = 2^h - 1.",
      },
      {
        q: "Order of nodes visited in in-order traversal:",
        options: ["root, left, right", "left, root, right", "left, right, root", "right, root, left"],
        answer: 1,
        why: "In-order = LNR. On a BST it yields sorted output.",
      },
      {
        q: "Which traversal uses a QUEUE?",
        options: ["Pre-order", "In-order", "Post-order", "Level-order (BFS)"],
        answer: 3,
        why: "Level-order processes nodes level by level — FIFO queue.",
      },
      {
        q: "Height of a tree with a single node:",
        options: ["0", "1", "-1", "Undefined"],
        answer: 0,
        why: "Height is edges from root to deepest leaf. A single node has zero edges. (Some conventions say 1 — be consistent.)",
      },
    ],
    exercise: {
      prompt: "Given a binary tree root, return the values in in-order.",
      expected: "     2\n    / \\\n   1   3   →  [1, 2, 3]",
      solution: `def inorder(node, out=None):
    if out is None: out = []
    if not node: return out
    inorder(node.left, out)
    out.append(node.val)
    inorder(node.right, out)
    return out`,
    },
  },
  14: {
    quiz: [
      {
        q: "In a BST, for any node:",
        options: [
          "left < node < right",
          "left > node > right",
          "left == node == right",
          "No ordering",
        ],
        answer: 0,
        why: "All keys in the left subtree are less; all keys in the right subtree are greater.",
      },
      {
        q: "Average lookup in a balanced BST:",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 1,
        why: "Balanced → tree height is log n.",
      },
      {
        q: "Worst-case lookup in an UNBALANCED BST (built from sorted input):",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 2,
        why: "A degenerate BST becomes a linked list.",
      },
      {
        q: "Which structure guarantees O(log n) even with adversarial input?",
        options: ["Plain BST", "AVL / Red-Black tree", "Linked list", "Array"],
        answer: 1,
        why: "Self-balancing trees rebalance on inserts/deletes to keep height ≈ log n.",
      },
    ],
    exercise: {
      prompt: "Insert values [5, 3, 8, 1, 4] into an empty BST and return an in-order traversal (should be sorted).",
      expected: "[1, 3, 4, 5, 8]",
      solution: `class N:
    def __init__(s, v): s.v, s.l, s.r = v, None, None
def insert(root, v):
    if not root: return N(v)
    if v < root.v: root.l = insert(root.l, v)
    else: root.r = insert(root.r, v)
    return root
def io(n, out=[]):
    if n:
        io(n.l, out); out.append(n.v); io(n.r, out)
    return out
r = None
for v in [5, 3, 8, 1, 4]: r = insert(r, v)
print(io(r, []))`,
    },
  },
  15: {
    quiz: [
      {
        q: "A min-heap gives you:",
        options: [
          "O(1) min, O(log n) push/pop",
          "O(log n) min, O(1) push",
          "O(n) min",
          "O(1) everything",
        ],
        answer: 0,
        why: "Root is the minimum; insert/extract bubble up/down in log n.",
      },
      {
        q: "Which problem screams 'heap'?",
        options: [
          "Reverse a string",
          "Top K largest elements",
          "Check for cycle",
          "Sort by length",
        ],
        answer: 1,
        why: "Maintain a size-K min-heap; anything smaller than the top is skipped.",
      },
      {
        q: "In Python, `heapq` is a:",
        options: ["Max-heap", "Min-heap", "Balanced BST", "Sorted list"],
        answer: 1,
        why: "Python heapq is a MIN-heap. For a max-heap, push negatives.",
      },
      {
        q: "Building a heap from n items is:",
        options: ["O(n log n)", "O(n)", "O(log n)", "O(n²)"],
        answer: 1,
        why: "Heapify from the bottom up is O(n) despite intuition suggesting n log n.",
      },
    ],
    exercise: {
      prompt: "Return the K largest elements of a list.",
      expected: "[3, 1, 5, 12, 2, 11], k=3 → [12, 11, 5]",
      solution: `import heapq
def top_k(arr, k):
    return heapq.nlargest(k, arr)`,
    },
  },
  16: {
    quiz: [
      {
        q: "BFS uses a:",
        options: ["Stack", "Queue", "Heap", "Set only"],
        answer: 1,
        why: "Queue = FIFO → level-order traversal.",
      },
      {
        q: "DFS uses a:",
        options: ["Stack (explicit or via recursion)", "Queue", "Heap", "Hash map"],
        answer: 0,
        why: "DFS dives deep before backtracking — that's stack behavior.",
      },
      {
        q: "Time complexity of BFS/DFS on a graph with V vertices and E edges:",
        options: ["O(V)", "O(V + E)", "O(V × E)", "O(E²)"],
        answer: 1,
        why: "You visit each vertex once and traverse each edge once.",
      },
      {
        q: "To avoid revisiting nodes:",
        options: ["Sort the graph", "Maintain a `visited` set", "Use two pointers", "Use recursion"],
        answer: 1,
        why: "Mark visited on first encounter; skip on subsequent.",
      },
    ],
    exercise: {
      prompt: "Given an adjacency list (dict), return BFS order starting from a given source.",
      expected: "{0:[1,2], 1:[3], 2:[3], 3:[]}, src=0 → [0, 1, 2, 3]",
      solution: `from collections import deque
def bfs(graph, src):
    seen = {src}; q = deque([src]); out = []
    while q:
        n = q.popleft(); out.append(n)
        for nb in graph.get(n, []):
            if nb not in seen:
                seen.add(nb); q.append(nb)
    return out`,
    },
  },
  17: {
    quiz: [
      {
        q: "Backtracking is essentially:",
        options: [
          "Iterative binary search",
          "DFS with pruning that undoes choices when they don't lead to a solution",
          "Merge sort in disguise",
          "Greedy",
        ],
        answer: 1,
        why: "Try, recurse, undo — that's backtracking.",
      },
      {
        q: "Classic backtracking problems:",
        options: [
          "N-Queens, Sudoku, Permutations, Combinations",
          "Sorting arrays",
          "Reversing linked lists",
          "Two-sum",
        ],
        answer: 0,
        why: "Any 'find all valid arrangements' problem.",
      },
      {
        q: "Time complexity of generating all permutations of n items:",
        options: ["O(n)", "O(n log n)", "O(n!)", "O(2ⁿ)"],
        answer: 2,
        why: "n × (n-1) × … × 1 = n!.",
      },
      {
        q: "Why 'prune'?",
        options: [
          "It looks nice",
          "To skip branches that can't lead to a valid solution — cuts runtime drastically",
          "To reduce memory",
          "It doesn't help",
        ],
        answer: 1,
        why: "Pruning changes an intractable search into a tractable one on typical inputs.",
      },
    ],
    exercise: {
      prompt: "Return all permutations of a given list, e.g. [1, 2, 3].",
      expected: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
      solution: `def perms(arr):
    res = []
    def bt(path, rest):
        if not rest:
            res.append(path); return
        for i, v in enumerate(rest):
            bt(path + [v], rest[:i] + rest[i+1:])
    bt([], arr)
    return res`,
    },
  },
  18: {
    quiz: [
      {
        q: "Dynamic programming applies when a problem has:",
        options: [
          "No structure",
          "Overlapping subproblems and optimal substructure",
          "Only integer inputs",
          "Only geometric properties",
        ],
        answer: 1,
        why: "Those two properties are the DP litmus test.",
      },
      {
        q: "Top-down DP =",
        options: ["Iteration", "Recursion + memoization", "Bubble sort", "BFS"],
        answer: 1,
        why: "Solve with recursion, cache each subproblem's answer.",
      },
      {
        q: "Bottom-up DP =",
        options: ["Recursion", "Fill a table iteratively from base cases up", "Sorting", "Backtracking"],
        answer: 1,
        why: "You build the answer piece by piece without recursion overhead.",
      },
      {
        q: "Space for DP can often be reduced from O(n) to:",
        options: ["O(1)", "O(log n)", "O(n²)", "It cannot be reduced"],
        answer: 0,
        why: "If each state depends on only the last one or two, you can drop the full table.",
      },
    ],
    exercise: {
      prompt: "Given `cost[]` where cost[i] is the price to step on stair i, find the min cost to reach the top (you can start from step 0 or 1, and take 1 or 2 steps at a time).",
      expected: "cost=[10, 15, 20] → 15",
      solution: `def min_cost(cost):
    n = len(cost)
    a, b = cost[0], cost[1]
    for i in range(2, n):
        a, b = b, cost[i] + min(a, b)
    return min(a, b)`,
    },
  },
  19: {
    quiz: [
      {
        q: "Longest common subsequence (LCS) is:",
        options: ["O(n)", "O(n log n)", "O(n·m) with DP", "O(n²) always"],
        answer: 2,
        why: "Classic 2D DP over lengths of both strings.",
      },
      {
        q: "0/1 Knapsack DP time:",
        options: ["O(n)", "O(nW) where W is capacity", "O(n²)", "O(2ⁿ)"],
        answer: 1,
        why: "One state per (item, remaining capacity).",
      },
      {
        q: "Coin-change (min coins) with unlimited coins is:",
        options: ["Greedy always works", "DP over amount and coins, O(n·amount)", "O(1)", "O(coins!)"],
        answer: 1,
        why: "Greedy fails on some coin sets (e.g. [1, 3, 4] for 6). DP is safe.",
      },
      {
        q: "Which is NOT typically a DP problem?",
        options: [
          "Edit distance",
          "Longest increasing subsequence",
          "Find duplicates in an array",
          "Matrix chain multiplication",
        ],
        answer: 2,
        why: "Duplicates is a hashing problem, not overlapping subproblems.",
      },
    ],
    exercise: {
      prompt: "Compute the length of the longest common subsequence of two strings.",
      expected: "lcs('abcbdab', 'bdcaba') → 4",
      solution: `def lcs(a, b):
    n, m = len(a), len(b)
    dp = [[0]*(m+1) for _ in range(n+1)]
    for i in range(1, n+1):
        for j in range(1, m+1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[n][m]`,
    },
  },
  20: {
    quiz: [
      {
        q: "A hash-based URL shortener stores mapping:",
        options: [
          "short_code → long_url",
          "long_url → short_code",
          "Both",
          "Neither",
        ],
        answer: 2,
        why: "One direction for redirect lookup, the other to avoid re-shortening the same URL.",
      },
      {
        q: "For a rate limiter, which data structure fits 'sliding window over the last N seconds'?",
        options: ["Stack", "Queue / deque of timestamps", "Heap", "Trie"],
        answer: 1,
        why: "Pop expired timestamps from the front, push new ones at the back.",
      },
      {
        q: "You need to autocomplete a prefix. Best structure?",
        options: ["Array", "Trie", "Hash map only", "Heap"],
        answer: 1,
        why: "Trie stores strings by shared prefixes — walk the prefix, enumerate the subtree.",
      },
      {
        q: "Which is the FIRST principle of scaling?",
        options: [
          "Optimize the language",
          "Cache what you can and eliminate unnecessary work",
          "Buy bigger servers",
          "Use microservices",
        ],
        answer: 1,
        why: "Caching, batching, and eliminating work are cheaper than horizontal scaling.",
      },
    ],
    exercise: {
      prompt: "Design an in-memory LRU cache with `get(key)` and `put(key, value)` both in O(1). Sketch the data structures involved.",
      expected: "Hash map (key → node) + doubly-linked list (front = most recent)",
      solution: `from collections import OrderedDict
class LRU:
    def __init__(self, cap): self.cap = cap; self.d = OrderedDict()
    def get(self, k):
        if k not in self.d: return -1
        self.d.move_to_end(k)
        return self.d[k]
    def put(self, k, v):
        if k in self.d: self.d.move_to_end(k)
        self.d[k] = v
        if len(self.d) > self.cap: self.d.popitem(last=False)`,
    },
  },
};

export const courseExtras: Record<string, CourseExtras> = {
  java: javaExtras,
  c: cExtras,
  dsa: dsaExtras,
};

export function getChapterExtras(courseSlug: string, chapterId: number): ChapterExtras | undefined {
  return courseExtras[courseSlug]?.[chapterId];
}
