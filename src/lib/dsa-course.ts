import type { Course, CourseChapter } from "./course-data";

// Data Structures & Algorithms — 20-chapter language-agnostic track.
// Notes + snippets live here. Quizzes + exercises live in course-extras.ts
// so we don't repeat the same pattern across files.

const dsaChapters: CourseChapter[] = [
  {
    id: 1, t: 0,
    title: "Big-O & How to Think About Speed",
    topic: "The vocabulary every serious engineer speaks.",
    notes: [
      "Big-O describes how runtime GROWS as input n grows — not exact ms.",
      "Drop constants and lower-order terms: 3n + 5 → O(n), n² + n → O(n²).",
      "Common families, slowest to fastest at scale: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!).",
      "Analyze the WORST case unless the problem says otherwise.",
      "Space complexity is measured the same way — how much extra memory grows with n.",
      "Amortized analysis averages the cost across many operations — a dynamic array's append is amortized O(1).",
    ],
    snippet: `# Which loop dominates?
for i in range(n):        # O(n)
    for j in range(n):    # O(n)
        do_work()         # nested → O(n²)
# Answer: O(n²)`,
  },
  {
    id: 2, t: 400,
    title: "Arrays & Dynamic Arrays",
    topic: "The workhorse data structure.",
    notes: [
      "Arrays are contiguous memory — arr[i] is O(1) address arithmetic.",
      "Fixed-size arrays can't grow. Dynamic arrays (Python list, Java ArrayList, C++ vector) double capacity when full.",
      "Insertion at end is amortized O(1); at the start it's O(n) because everything shifts.",
      "Deletion in the middle is O(n) — mind the shift.",
      "Cache-friendly: contiguous memory means predictable prefetching → arrays are often faster than 'better' structures in practice.",
    ],
    snippet: `# Grow a Python list — amortized O(1) per append
nums = []
for i in range(1_000_000):
    nums.append(i)`,
  },
  {
    id: 3, t: 800,
    title: "Strings",
    topic: "Character sequences and their gotchas.",
    notes: [
      "In Python, Java, JavaScript, C#: strings are IMMUTABLE — every 'edit' creates a new string.",
      "Building a string with += in a loop is O(n²). Collect chars in a list/StringBuilder and join at the end for O(n).",
      "Common operations: reverse, palindrome check, anagram, character frequency, substring search.",
      "For fixed lowercase alphabet, a length-26 count array is faster than a hash map.",
      "In C, strings are null-terminated char arrays — you manage memory yourself.",
    ],
    snippet: `# Fast palindrome check — two pointers
def is_pal(s):
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]: return False
        l += 1; r -= 1
    return True`,
  },
  {
    id: 4, t: 1200,
    title: "Hash Maps & Sets",
    topic: "Constant-time lookups.",
    notes: [
      "Hash maps store key → value with expected O(1) get/put — real magic of programming.",
      "Sets are hash maps that only track keys — for membership tests.",
      "Collisions happen — a good hash function keeps them rare.",
      "Keys must be hashable (immutable). In Python: tuples yes, lists no.",
      "Perfect for: counting, grouping, deduping, memoization, two-sum-style problems.",
    ],
    snippet: `# Count character frequency
from collections import Counter
freq = Counter("mississippi")
print(freq)  # {'i': 4, 's': 4, 'p': 2, 'm': 1}`,
  },
  {
    id: 5, t: 1600,
    title: "Two Pointers",
    topic: "Twin cursors, single pass.",
    notes: [
      "Two pointers walk an array in coordinated fashion — often O(n) instead of O(n²).",
      "Opposite ends: pair sum on a sorted array, palindrome check.",
      "Same direction (fast/slow): cycle detection, remove duplicates in place, sliding operations.",
      "Only works when the array is sorted or has some monotone property you can exploit.",
      "Constant extra space — huge win over hash sets in memory-tight scenarios.",
    ],
    snippet: `# Remove duplicates in-place from a sorted array
def dedupe(a):
    if not a: return 0
    k = 1
    for i in range(1, len(a)):
        if a[i] != a[i-1]:
            a[k] = a[i]; k += 1
    return k`,
  },
  {
    id: 6, t: 2000,
    title: "Sliding Window",
    topic: "Reuse work as the window moves.",
    notes: [
      "The window is a contiguous slice of the array. It expands (right pointer) and shrinks (left pointer).",
      "Fixed-size window: k elements at a time. Just slide, don't recompute — subtract leaving, add entering.",
      "Variable-size window: grow while a condition holds, shrink when it breaks.",
      "Turns O(n·k) or O(n²) into O(n) for many subarray / substring problems.",
      "Classic problems: max sum of size k, longest substring without repeats, minimum window substring.",
    ],
    snippet: `# Longest substring with all unique chars
def longest_unique(s):
    seen = {}; best = l = 0
    for r, ch in enumerate(s):
        if ch in seen and seen[ch] >= l:
            l = seen[ch] + 1
        seen[ch] = r
        best = max(best, r - l + 1)
    return best`,
  },
  {
    id: 7, t: 2400,
    title: "Stacks — LIFO",
    topic: "The last-in-first-out mindset.",
    notes: [
      "Push and pop happen at the same end — O(1) both.",
      "Backed by a dynamic array or a linked list. In Python: a plain list is fine.",
      "Classic uses: valid parentheses, expression evaluation, monotonic stack (next greater element), undo history.",
      "Every recursive call implicitly uses the CALL stack — a manual stack lets you convert recursion to iteration.",
      "Monotonic stacks (kept sorted) are a superpower for O(n) 'next greater/smaller' problems.",
    ],
    snippet: `# Next greater element — monotonic stack
def next_greater(a):
    res = [-1] * len(a); stack = []
    for i, x in enumerate(a):
        while stack and a[stack[-1]] < x:
            res[stack.pop()] = x
        stack.append(i)
    return res`,
  },
  {
    id: 8, t: 2800,
    title: "Queues & Deques",
    topic: "First-in-first-out, plus double-ended.",
    notes: [
      "Queue = FIFO. Enqueue at rear, dequeue from front. O(1) both.",
      "Never use `list.pop(0)` in Python — that's O(n). Use `collections.deque`.",
      "Deque = double-ended queue — push/pop from either end in O(1).",
      "Priority queue is different: it dequeues by PRIORITY, not order — backed by a heap.",
      "Queues shine in BFS, task scheduling, rate limiters, and streaming maximum problems.",
    ],
    snippet: `# BFS-style level counting
from collections import deque
q = deque([("start", 0)])
while q:
    node, depth = q.popleft()
    # ...enqueue neighbors...`,
  },
  {
    id: 9, t: 3200,
    title: "Linked Lists",
    topic: "Nodes and pointers.",
    notes: [
      "Node = value + next pointer (doubly = also prev).",
      "O(1) insert/remove at the head; O(n) to walk to index i.",
      "Great when you need frequent splicing at known positions (e.g. LRU cache internals).",
      "Reverse in place with three pointers: prev, curr, next. Practice this until it's muscle memory.",
      "Cycle detection: Floyd's fast/slow pointer — if they meet, there's a cycle.",
    ],
    snippet: `# Reverse a linked list in place
def reverse(head):
    prev = None
    while head:
        nxt = head.next
        head.next = prev
        prev = head
        head = nxt
    return prev`,
  },
  {
    id: 10, t: 3600,
    title: "Recursion & the Call Stack",
    topic: "Solving problems by shrinking them.",
    notes: [
      "Every recursion has: a base case (stops) and a recursive case (shrinks the problem).",
      "Missing base case → stack overflow.",
      "Space cost is often O(depth), not O(1) — each call adds a stack frame.",
      "Tree/graph traversal is naturally recursive.",
      "Convert to iteration with your own stack when depth is huge (Python default recursion limit is ~1000).",
      "Memoize when subproblems repeat — that's the doorway to dynamic programming.",
    ],
    snippet: `def factorial(n):
    if n <= 1: return 1
    return n * factorial(n - 1)`,
  },
  {
    id: 11, t: 4000,
    title: "Sorting Algorithms",
    topic: "Bubble, insertion, merge, quick, heap.",
    notes: [
      "Bubble/selection/insertion: O(n²). Teach the concept but never ship them.",
      "Merge sort: O(n log n) always. Stable. Uses O(n) extra memory.",
      "Quicksort: O(n log n) average, O(n²) worst. In-place. Not stable.",
      "Heapsort: O(n log n). In-place. Not stable. Predictable but slower in practice.",
      "Timsort (Python's `sorted`, Java's `Arrays.sort` on objects): hybrid merge + insertion — real-world fastest.",
      "Choose stable when equal keys must preserve order (e.g. sort by name, then by age).",
    ],
    snippet: `def merge_sort(a):
    if len(a) <= 1: return a
    m = len(a) // 2
    l, r = merge_sort(a[:m]), merge_sort(a[m:])
    return merge(l, r)

def merge(l, r):
    out = []; i = j = 0
    while i < len(l) and j < len(r):
        if l[i] <= r[j]: out.append(l[i]); i += 1
        else: out.append(r[j]); j += 1
    return out + l[i:] + r[j:]`,
  },
  {
    id: 12, t: 4400,
    title: "Binary Search",
    topic: "Halving the search space.",
    notes: [
      "Requires a sorted (or monotone) sequence.",
      "Loop invariant: the answer, if it exists, lies within [lo..hi].",
      "Prefer `mid = lo + (hi - lo) // 2` to avoid integer overflow.",
      "Off-by-one bugs are the #1 pain — practice both the closed [lo..hi] and half-open [lo..hi) forms.",
      "Binary-search-on-answer: search a possible answer, verify feasibility in O(n) — powerful pattern.",
    ],
    snippet: `def bsearch(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == target: return mid
        if a[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1`,
  },
  {
    id: 13, t: 4800,
    title: "Trees & Traversals",
    topic: "Hierarchy in every interview.",
    notes: [
      "A binary tree: each node has ≤ 2 children.",
      "Traversals: pre-order (NLR), in-order (LNR), post-order (LRN), level-order (BFS).",
      "In-order on a Binary Search Tree gives values in sorted order.",
      "Height: longest root-to-leaf edge count. Depth of a node: root-to-node edge count.",
      "Balanced trees have height ≈ log n; degenerate trees are essentially linked lists.",
    ],
    snippet: `class N:
    def __init__(self, v, l=None, r=None):
        self.v, self.l, self.r = v, l, r

def preorder(node, out):
    if not node: return
    out.append(node.v)
    preorder(node.l, out)
    preorder(node.r, out)`,
  },
  {
    id: 14, t: 5200,
    title: "Binary Search Trees",
    topic: "Ordered trees with O(log n) hopes.",
    notes: [
      "Invariant: left subtree < node < right subtree.",
      "Insert / search / delete: average O(log n), worst O(n) if unbalanced.",
      "Deletion is the tricky one — three cases: leaf, one child, two children (replace with in-order successor).",
      "Self-balancing variants (AVL, Red-Black) keep operations O(log n) worst case.",
      "In practice you'd use `TreeMap`/`SortedDict` from your language's std lib.",
    ],
    snippet: `def search(node, key):
    while node:
        if node.v == key: return node
        node = node.l if key < node.v else node.r
    return None`,
  },
  {
    id: 15, t: 5600,
    title: "Heaps & Priority Queues",
    topic: "Repeatedly grab the smallest (or largest).",
    notes: [
      "Binary heap: complete binary tree where every parent ≤ children (min-heap).",
      "Backed by a flat array — parent of i is (i-1)/2; children are 2i+1 and 2i+2.",
      "Push and pop: O(log n). Peek min: O(1).",
      "Build heap from n items: O(n). Heap sort: O(n log n) — not stable but in-place.",
      "Great for: top K elements, merging K sorted lists, Dijkstra's algorithm, scheduling.",
    ],
    snippet: `import heapq
h = []
for x in [4, 1, 7, 3]:
    heapq.heappush(h, x)
print(heapq.heappop(h))  # 1`,
  },
  {
    id: 16, t: 6000,
    title: "Graphs — BFS & DFS",
    topic: "Vertices, edges, and how to walk them.",
    notes: [
      "Represent with an adjacency list (`{node: [neighbors]}`) — flexible, memory-efficient.",
      "BFS: queue, level by level. Finds shortest path in UNWEIGHTED graphs.",
      "DFS: stack (or recursion). Great for connectivity, cycle detection, topological sort.",
      "Always mark visited — without it you'll loop forever on cycles.",
      "Complexity: O(V + E) — you touch each vertex once and traverse each edge once.",
    ],
    snippet: `def dfs(graph, src):
    seen, stack, out = set(), [src], []
    while stack:
        n = stack.pop()
        if n in seen: continue
        seen.add(n); out.append(n)
        for nb in graph.get(n, []):
            if nb not in seen: stack.append(nb)
    return out`,
  },
  {
    id: 17, t: 6400,
    title: "Backtracking",
    topic: "Try, recurse, undo.",
    notes: [
      "Backtracking = DFS over decisions + smart pruning.",
      "Template: choose → recurse → un-choose (restore state before returning).",
      "Prune early when the current partial choice cannot lead to a valid solution.",
      "Classic problems: N-Queens, Sudoku solver, permutations, combinations, word search, subset sum.",
      "Worst-case exponential, but pruning makes real-world instances tractable.",
    ],
    snippet: `def subsets(nums):
    res = []
    def bt(i, path):
        if i == len(nums):
            res.append(path[:]); return
        # exclude
        bt(i + 1, path)
        # include
        path.append(nums[i])
        bt(i + 1, path)
        path.pop()
    bt(0, [])
    return res`,
  },
  {
    id: 18, t: 6800,
    title: "Dynamic Programming — Intro",
    topic: "Remember to stop repeating yourself.",
    notes: [
      "DP applies when a problem has overlapping subproblems and optimal substructure.",
      "Top-down: recursion + memoization. Same shape as naive recursion, plus a cache.",
      "Bottom-up: fill a table iteratively from base cases. Usually faster, less memory overhead.",
      "Space optimization: if state[i] depends only on state[i-1] and state[i-2], keep two variables not a whole array.",
      "Practice trilogy: Fibonacci → climbing stairs → house robber.",
    ],
    snippet: `# Fibonacci — bottom-up, O(n) time, O(1) space
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`,
  },
  {
    id: 19, t: 7200,
    title: "DP Patterns You'll See Again",
    topic: "LCS, knapsack, coin change, edit distance.",
    notes: [
      "Longest Common Subsequence (LCS): 2D DP over string lengths. O(n·m).",
      "0/1 Knapsack: DP over (item index, remaining capacity). Cannot break items.",
      "Unbounded knapsack / coin change: same shape but you can reuse items.",
      "Edit distance (Levenshtein): 2D DP with insert / delete / replace as three transitions.",
      "Longest Increasing Subsequence: O(n²) DP or O(n log n) with binary search over patience piles.",
    ],
    snippet: `# Coin change — min coins to make amount
def coin_change(coins, amount):
    INF = float('inf')
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return -1 if dp[amount] == INF else dp[amount]`,
  },
  {
    id: 20, t: 7600,
    title: "System Design Lite for Coders",
    topic: "Data structures + tradeoffs, out in the wild.",
    notes: [
      "URL shortener: hash short_code → long_url in a KV store; add a reverse mapping to avoid re-hashing the same URL.",
      "Rate limiter: sliding-window log (deque of timestamps) or token bucket.",
      "Autocomplete: Trie for prefix lookup; rank candidates by frequency (heap).",
      "LRU cache: hash map + doubly linked list — O(1) get and put.",
      "Feed ranking: heap of top-scored items; recompute on write, not on read, when the feed is hot.",
      "First rule of scale: cache aggressively, eliminate unnecessary work, THEN think about more machines.",
    ],
    snippet: `# LRU cache with OrderedDict — O(1) get/put
from collections import OrderedDict
class LRU:
    def __init__(self, cap):
        self.cap = cap; self.d = OrderedDict()
    def get(self, k):
        if k not in self.d: return -1
        self.d.move_to_end(k); return self.d[k]
    def put(self, k, v):
        if k in self.d: self.d.move_to_end(k)
        self.d[k] = v
        if len(self.d) > self.cap:
            self.d.popitem(last=False)`,
  },
];

export const dsaCourse: Course = {
  slug: "dsa",
  language: "DSA",
  title: "Data Structures & Algorithms — Interview Ready",
  tagline: "20 chapters. Language-agnostic. Fully practiced.",
  description:
    "A focused, chapter-wise DSA track: complexity, arrays, strings, hashing, two-pointer, sliding window, stacks, queues, linked lists, recursion, sorting, binary search, trees, heaps, graphs, backtracking, DP, and a taste of system design.",
  emoji: "🧠",
  level: "Beginner → Advanced",
  hours: "Self-paced",
  instructor: "EMO Learners",
  videoId: "", // No single video — this is a curated track
  accent: "from-emerald-400 to-teal-600",
  chapters: dsaChapters,
};
