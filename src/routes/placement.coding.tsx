import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Code2 } from "lucide-react";

export const Route = createFileRoute("/placement/coding")({
  component: CodingPractice,
});

type Problem = { title: string; topic: string; difficulty: "Easy" | "Medium" | "Hard"; freq: number; url: string };

const problems: Problem[] = [
  { title: "Two Sum", topic: "Arrays / Hashing", difficulty: "Easy", freq: 95, url: "https://leetcode.com/problems/two-sum/" },
  { title: "Reverse Linked List", topic: "Linked List", difficulty: "Easy", freq: 92, url: "https://leetcode.com/problems/reverse-linked-list/" },
  { title: "Valid Parentheses", topic: "Stack", difficulty: "Easy", freq: 90, url: "https://leetcode.com/problems/valid-parentheses/" },
  { title: "Merge Two Sorted Lists", topic: "Linked List", difficulty: "Easy", freq: 88, url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { title: "Best Time to Buy and Sell Stock", topic: "DP / Arrays", difficulty: "Easy", freq: 87, url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { title: "Longest Substring Without Repeating Characters", topic: "Sliding Window", difficulty: "Medium", freq: 91, url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { title: "3Sum", topic: "Two Pointers", difficulty: "Medium", freq: 84, url: "https://leetcode.com/problems/3sum/" },
  { title: "Group Anagrams", topic: "Hashing", difficulty: "Medium", freq: 78, url: "https://leetcode.com/problems/group-anagrams/" },
  { title: "Number of Islands", topic: "Graph / DFS", difficulty: "Medium", freq: 83, url: "https://leetcode.com/problems/number-of-islands/" },
  { title: "Course Schedule", topic: "Graph / Topological Sort", difficulty: "Medium", freq: 76, url: "https://leetcode.com/problems/course-schedule/" },
  { title: "LRU Cache", topic: "Design / Hash + LL", difficulty: "Medium", freq: 82, url: "https://leetcode.com/problems/lru-cache/" },
  { title: "Kth Largest Element in an Array", topic: "Heap", difficulty: "Medium", freq: 74, url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
  { title: "Word Break", topic: "DP", difficulty: "Medium", freq: 70, url: "https://leetcode.com/problems/word-break/" },
  { title: "Coin Change", topic: "DP", difficulty: "Medium", freq: 72, url: "https://leetcode.com/problems/coin-change/" },
  { title: "Trapping Rain Water", topic: "Two Pointers / Stack", difficulty: "Hard", freq: 68, url: "https://leetcode.com/problems/trapping-rain-water/" },
  { title: "Median of Two Sorted Arrays", topic: "Binary Search", difficulty: "Hard", freq: 60, url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
];

const diffColor: Record<Problem["difficulty"], string> = {
  Easy: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  Medium: "text-amber-400 border-amber-400/40 bg-amber-400/10",
  Hard: "text-red-400 border-red-400/40 bg-red-400/10",
};

function CodingPractice() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <div className="flex items-center gap-3">
        <Code2 className="h-6 w-6 text-primary" />
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tighter md:text-5xl">
          Coding <span className="italic text-primary">Practice</span>
        </h1>
      </div>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Top patterns asked in Indian tech placements — TCS, Infosys, Wipro, Cognizant to Amazon, Microsoft, Google. Ranked by real interview frequency.
      </p>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span>Also see:</span>
        <Link to="/practice" className="text-primary underline">General practice</Link>
        <Link to="/challenge" className="text-primary underline">30-day Python challenge</Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface/60 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Problem</th>
              <th className="hidden px-4 py-3 text-left md:table-cell">Topic</th>
              <th className="px-4 py-3 text-left">Difficulty</th>
              <th className="px-4 py-3 text-left">Freq</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {problems.map((p, i) => (
              <tr key={p.title} className="border-t border-border transition-colors hover:bg-surface/40">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{p.topic}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${diffColor[p.difficulty]}`}>
                    {p.difficulty}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-primary">{p.freq}%</td>
                <td className="px-4 py-3 text-right">
                  <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary hover:border-primary">
                    Solve <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
