export type TopQuestion = {
  q: string;
  subject: string;
  unit: string;
  marks: number;
  probability: number; // 0-100
  tags: string[];
};

// Curated top 32 most-repeated questions across core B.Tech CSE/IT/AIML subjects
// (RGPV Bhopal + common Indian university patterns).
export const TOP_QUESTIONS: TopQuestion[] = [
  { q: "Explain the OSI reference model with functions of each layer.", subject: "Computer Networks", unit: "Unit 1", marks: 10, probability: 96, tags: ["OSI", "layers"] },
  { q: "Differentiate between TCP and UDP with real-world examples.", subject: "Computer Networks", unit: "Unit 3", marks: 7, probability: 94, tags: ["TCP", "UDP"] },
  { q: "Explain CSMA/CD and CSMA/CA with diagrams.", subject: "Computer Networks", unit: "Unit 2", marks: 7, probability: 88, tags: ["MAC"] },

  { q: "Explain ACID properties of transactions with examples.", subject: "DBMS", unit: "Unit 4", marks: 7, probability: 95, tags: ["ACID", "transactions"] },
  { q: "Normalize the given relation up to 3NF / BCNF (numerical).", subject: "DBMS", unit: "Unit 3", marks: 10, probability: 93, tags: ["normalization"] },
  { q: "Explain B+ tree indexing with insertion example.", subject: "DBMS", unit: "Unit 5", marks: 7, probability: 85, tags: ["indexing", "B+ tree"] },
  { q: "Write SQL queries for joins, group by, and nested queries.", subject: "DBMS", unit: "Unit 2", marks: 7, probability: 90, tags: ["SQL"] },

  { q: "Explain process states and PCB with a neat diagram.", subject: "Operating Systems", unit: "Unit 1", marks: 7, probability: 92, tags: ["process", "PCB"] },
  { q: "Solve Banker's algorithm for the given system state.", subject: "Operating Systems", unit: "Unit 3", marks: 10, probability: 91, tags: ["deadlock", "banker"] },
  { q: "Compare page replacement algorithms: FIFO, LRU, Optimal (numerical).", subject: "Operating Systems", unit: "Unit 4", marks: 10, probability: 94, tags: ["paging"] },
  { q: "Explain producer-consumer problem using semaphores.", subject: "Operating Systems", unit: "Unit 2", marks: 7, probability: 86, tags: ["synchronization"] },

  { q: "Explain time complexity of common sorting algorithms with derivations.", subject: "DSA", unit: "Unit 2", marks: 7, probability: 93, tags: ["sorting", "big-O"] },
  { q: "Implement and analyze Dijkstra's shortest path algorithm.", subject: "DSA", unit: "Unit 4", marks: 10, probability: 90, tags: ["graph", "shortest path"] },
  { q: "Explain AVL tree rotations with an insertion example.", subject: "DSA", unit: "Unit 3", marks: 7, probability: 84, tags: ["tree", "AVL"] },
  { q: "Solve the 0/1 knapsack problem using dynamic programming.", subject: "DSA", unit: "Unit 5", marks: 10, probability: 88, tags: ["DP", "knapsack"] },

  { q: "Explain the software development life cycle (SDLC) models and compare Waterfall vs Agile.", subject: "Software Engineering", unit: "Unit 1", marks: 7, probability: 89, tags: ["SDLC", "agile"] },
  { q: "Draw and explain a DFD (level 0 and 1) for a given system.", subject: "Software Engineering", unit: "Unit 2", marks: 7, probability: 82, tags: ["DFD"] },
  { q: "Explain black-box and white-box testing with examples.", subject: "Software Engineering", unit: "Unit 4", marks: 7, probability: 85, tags: ["testing"] },

  { q: "Explain pipelining hazards and how they are resolved.", subject: "Computer Organization", unit: "Unit 3", marks: 7, probability: 84, tags: ["pipelining"] },
  { q: "Design a 4-bit ALU or explain Booth's multiplication algorithm.", subject: "Computer Organization", unit: "Unit 2", marks: 10, probability: 82, tags: ["ALU", "Booth"] },
  { q: "Explain cache mapping techniques with a numerical example.", subject: "Computer Organization", unit: "Unit 4", marks: 7, probability: 80, tags: ["cache"] },

  { q: "Explain regular expressions and convert an NFA to DFA (numerical).", subject: "Theory of Computation", unit: "Unit 2", marks: 10, probability: 90, tags: ["automata", "NFA"] },
  { q: "State and prove the pumping lemma for regular languages.", subject: "Theory of Computation", unit: "Unit 3", marks: 7, probability: 78, tags: ["pumping lemma"] },
  { q: "Construct a Turing machine for the given language.", subject: "Theory of Computation", unit: "Unit 5", marks: 10, probability: 76, tags: ["Turing"] },

  { q: "Differentiate supervised, unsupervised and reinforcement learning with examples.", subject: "Machine Learning", unit: "Unit 1", marks: 7, probability: 95, tags: ["ML types"] },
  { q: "Explain the working of backpropagation with derivation.", subject: "Machine Learning", unit: "Unit 4", marks: 10, probability: 92, tags: ["neural net", "backprop"] },
  { q: "Explain bias-variance tradeoff and techniques to reduce overfitting.", subject: "Machine Learning", unit: "Unit 2", marks: 7, probability: 88, tags: ["overfitting"] },
  { q: "Compare decision trees, random forest and SVM classifiers.", subject: "Machine Learning", unit: "Unit 3", marks: 7, probability: 84, tags: ["classifiers"] },

  { q: "Explain agents and agent environments in AI (PEAS description).", subject: "Artificial Intelligence", unit: "Unit 1", marks: 7, probability: 87, tags: ["agents", "PEAS"] },
  { q: "Compare informed vs uninformed search with A* example.", subject: "Artificial Intelligence", unit: "Unit 2", marks: 10, probability: 90, tags: ["search", "A*"] },

  { q: "Explain OOP principles (encapsulation, inheritance, polymorphism, abstraction) with Java/C++ examples.", subject: "OOP", unit: "Unit 1", marks: 7, probability: 93, tags: ["OOP"] },
  { q: "Explain exception handling with try-catch-finally and custom exceptions.", subject: "OOP", unit: "Unit 3", marks: 7, probability: 82, tags: ["exceptions"] },
];
