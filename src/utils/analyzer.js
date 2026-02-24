const CATEGORIES = {
  "Core CS": ["DSA", "OOP", "DBMS", "OS", "Networks"],
  Languages: ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Go"],
  Web: ["React", "Next.js", "Node.js", "Express", "REST", "GraphQL"],
  Data: ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis"],
  "Cloud/DevOps": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux"],
  Testing: ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest"],
};

function extractSkills(jdText) {
  const text = (jdText || "").toLowerCase();
  const found = {};
  Object.keys(CATEGORIES).forEach((cat) => {
    found[cat] = [];
    CATEGORIES[cat].forEach((kw) => {
      const kwNorm = kw.toLowerCase();
      // match whole word or with dots/hyphens (e.g., next.js)
      if (text.includes(kwNorm)) {
        found[cat].push(kw);
      }
    });
  });

  // If none found, add general fresher stack
  const anyFound = Object.values(found).some((arr) => arr.length > 0);
  if (!anyFound) {
    found["General"] = ["General fresher stack"];
  }
  return found;
}

function flattenCategories(found) {
  const map = {};
  Object.keys(found).forEach((cat) => {
    if (found[cat] && found[cat].length) {
      map[cat] = found[cat];
    }
  });
  return map;
}

function generateChecklist(found) {
  // Base rounds
  const rounds = {
    "Round 1: Aptitude / Basics": [
      "Practice numerical aptitude",
      "Brush up core computer science fundamentals",
      "Revise basic data structures (arrays, lists)",
      "Time management and mock timed tests",
      "Review common interview puzzles",
    ],
    "Round 2: DSA + Core CS": [
      "Solve array & string problems",
      "Practice recursion & dynamic programming",
      "Revise trees and graphs basics",
      "Understand complexity analysis",
      "Work on common system problems",
    ],
    "Round 3: Tech interview (projects + stack)": [
      "Prepare project walkthroughs",
      "Align resume with project technologies",
      "Review system design basics",
      "Prepare architecture diagrams for projects",
      "Practice explaining trade-offs",
    ],
    "Round 4: Managerial / HR": [
      "Prepare STAR format answers",
      "Rehearse common HR questions",
      "Discuss career goals clearly",
      "Be ready to explain gaps or transitions",
      "Prepare salary and notice period info",
    ],
  };

  // Add skill-based augmentations
  Object.keys(found).forEach((cat) => {
    (found[cat] || []).forEach((skill) => {
      const s = skill.toLowerCase();
      if (["react", "next.js", "node.js", "express"].includes(s)) {
        rounds["Round 3: Tech interview (projects + stack)"].push(
          "Revise component structure and state management"
        );
      }
      if (["sql", "mongodb", "postgresql", "mysql", "redis"].includes(s)) {
        rounds["Round 2: DSA + Core CS"].push("Practice database queries and indexing");
        rounds["Round 3: Tech interview (projects + stack)"].push("Prepare data modeling examples");
      }
      if (["aws", "docker", "kubernetes", "ci/cd"].includes(s)) {
        rounds["Round 3: Tech interview (projects + stack)"].push("Explain deployment and CI/CD pipeline");
      }
      if (["dsA".toLowerCase(), "dsa"].includes(s) || s === "dsa") {
        rounds["Round 2: DSA + Core CS"].push("Practice advanced algorithmic problems");
      }
      if (["java", "python", "javascript", "typescript", "c++", "go"].includes(s)) {
        rounds["Round 3: Tech interview (projects + stack)"].push(`Prepare language-specific implementation details for ${skill}`);
      }
    });
  });

  // trim to 5-8 items each
  const trimmed = {};
  Object.keys(rounds).forEach((r) => {
    trimmed[r] = rounds[r].slice(0, 8);
  });
  return trimmed;
}

function generatePlan(found) {
  const plan = [
    { day: 1, title: "Basics + core CS", tasks: ["Revise fundamentals", "Short quizzes"] },
    { day: 2, title: "Basics + core CS", tasks: ["Continue fundamentals", "Flashcards"] },
    { day: 3, title: "DSA + coding practice", tasks: ["Solve medium problems", "Practice on platform"] },
    { day: 4, title: "DSA + coding practice", tasks: ["Timed practice", "Debugging"] },
    { day: 5, title: "Project + resume alignment", tasks: ["Update resume", "Align projects to JD"] },
    { day: 6, title: "Mock interview questions", tasks: ["Take a mock interview", "Review feedback"] },
    { day: 7, title: "Revision + weak areas", tasks: ["Revise weak topics", "Plan next week"] },
  ];

  // adapt based on skills
  if (found["Web"] && found["Web"].length) {
    plan[2].tasks.push("Frontend focused problems (React)");
    plan[4].tasks.push("Frontend project polish");
  }
  if (found["Data"] && found["Data"].length) {
    plan[2].tasks.push("Database query practice");
    plan[5].tasks.push("Data modeling mock questions");
  }
  if (found["Cloud/DevOps"] && found["Cloud/DevOps"].length) {
    plan[5].tasks.push("Deploy a sample app (Docker)");
  }

  return plan;
}

function generateQuestions(found) {
  const qs = [];
  // for each detected skill, add a focused question
  Object.keys(found).forEach((cat) => {
    (found[cat] || []).forEach((skill) => {
      const s = skill.toLowerCase();
      if (s === "sql") qs.push("Explain indexing and when it helps.");
      else if (s === "react") qs.push("Explain state management options in React and when to use each.");
      else if (s === "dsa") qs.push("How would you optimize search in sorted data?");
      else if (s === "docker") qs.push("How do you containerize a web application and manage environments?");
      else if (s === "aws") qs.push("Describe how you would design a scalable web service on AWS.");
      else if (s === "java") qs.push("Explain Java memory management and garbage collection basics.");
      else if (s === "python") qs.push("Discuss Python GIL and implications for concurrency.");
      else if (s === "node.js") qs.push("How does the Node.js event loop work?");
      else if (s === "mongodb") qs.push("When would you choose MongoDB over a relational database?");
      else if (s === "kubernetes") qs.push("Explain how Kubernetes handles rolling updates and pods.");
      else if (s === "selenium") qs.push("How would you design an end-to-end test suite using Selenium?");
      else qs.push(`Explain your experience and approach with ${skill}.`);
    });
  });

  // ensure 10 questions: pad with generic but specific ones
  const generic = [
    "Explain a challenging bug you fixed and how you diagnosed it.",
    "Walk through a system you designed and the trade-offs you made.",
    "How do you measure and improve performance in a web application?",
    "Describe your approach to testing and CI/CD.",
  ];
  for (let i = 0; qs.length < 10 && i < generic.length; i++) qs.push(generic[i]);

  return qs.slice(0, 10);
}

function scoreReadiness({ foundCategories = [], company = "", role = "", jdText = "" }) {
  let score = 35;
  const uniqueCategories = foundCategories.length;
  score += Math.min(30, uniqueCategories * 5);
  if (company && company.trim()) score += 10;
  if (role && role.trim()) score += 10;
  if ((jdText || "").length > 800) score += 10;
  return Math.min(100, score);
}

export {
  extractSkills,
  flattenCategories,
  generateChecklist,
  generatePlan,
  generateQuestions,
  scoreReadiness,
  CATEGORIES,
};

