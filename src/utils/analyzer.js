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

// --- Company intel heuristics and round mapping ---
const KNOWN_ENTERPRISES = [
  "amazon",
  "google",
  "microsoft",
  "facebook",
  "meta",
  "apple",
  "infosys",
  "tcs",
  "wipro",
  "accenture",
  "ibm",
  "oracle",
];

function inferCompanySize(companyName = "") {
  const name = (companyName || "").toLowerCase();
  if (!name) return "Startup";
  for (const k of KNOWN_ENTERPRISES) {
    if (name.includes(k)) return "Enterprise";
  }
  // simple heuristic: names containing 'solutions', 'systems', 'technologies' -> Mid-size
  if (name.includes("solutions") || name.includes("systems") || name.includes("technologies") || name.includes("labs")) {
    return "Mid-size";
  }
  return "Startup";
}

function inferIndustry(companyName = "", jdText = "") {
  const text = ((companyName || "") + " " + (jdText || "")).toLowerCase();
  if (text.includes("bank") || text.includes("finance") || text.includes("financial")) return "Financial Services";
  if (text.includes("health") || text.includes("healthcare") || text.includes("medical")) return "Healthcare";
  if (text.includes("e-commerce") || text.includes("ecommerce") || text.includes("retail")) return "E-commerce / Retail";
  if (text.includes("education") || text.includes("edtech")) return "Education / EdTech";
  if (text.includes("telecom") || text.includes("network")) return "Telecommunications";
  return "Technology Services";
}

function generateCompanyIntel(companyName = "", jdText = "") {
  const name = companyName || "";
  const sizeCategory = inferCompanySize(name);
  const industry = inferIndustry(name, jdText);
  const typicalHiringFocus =
    sizeCategory === "Enterprise"
      ? "Structured interviews focusing on DSA, system design and process adherence."
      : "Practical problem solving, product focus, and deep ownership of the stack.";

  return {
    name,
    industry,
    sizeCategory,
    typicalHiringFocus,
    note: "Demo Mode: Company intel generated heuristically.",
  };
}

function mapRounds(found, companyIntel) {
  const rounds = [];
  const hasDSA = (found["Core CS"] || []).map(s => s.toLowerCase()).includes("dsa") || (found["Core CS"] || []).length > 0;
  const hasWeb = (found["Web"] || []).length > 0;
  const size = (companyIntel && companyIntel.sizeCategory) || "Startup";

  if (size === "Enterprise") {
    // Enterprise default flow
    rounds.push({
      title: "Round 1: Online Test (DSA + Aptitude)",
      why: "Standardized screening for algorithmic skills and aptitude.",
    });
    rounds.push({
      title: "Round 2: Technical (DSA + Core CS)",
      why: "Deeper evaluation of algorithms, data structures and CS fundamentals.",
    });
    rounds.push({
      title: "Round 3: Tech + Projects",
      why: "Assess system design, project ownership and stack expertise.",
    });
    rounds.push({
      title: "Round 4: HR / Managerial",
      why: "Culture fit, career goals and logistical questions.",
    });
    // tweak for cloud/devops presence
    if ((found["Cloud/DevOps"] || []).length > 0) {
      rounds.splice(2, 0, {
        title: "Infrastructure / DevOps Round",
        why: "Assess deployment, CI/CD and production operations knowledge.",
      });
    }
  } else if (size === "Mid-size") {
    rounds.push({
      title: "Round 1: Practical coding / take-home",
      why: "Evaluate hands-on problem solving with real-world tasks.",
    });
    rounds.push({
      title: "Round 2: Technical deep-dive",
      why: "Assess core CS understanding and system components.",
    });
    rounds.push({
      title: "Round 3: System discussion + projects",
      why: "Evaluate design thinking and project alignment.",
    });
    rounds.push({
      title: "Round 4: HR",
      why: "Final alignment and fit.",
    });
  } else {
    // Startup
    if (hasWeb) {
      rounds.push({
        title: "Round 1: Practical coding (stack-focused)",
        why: "Hands-on task to verify practical ability on the company's stack.",
      });
      rounds.push({
        title: "Round 2: System discussion",
        why: "Discuss architecture choices and trade-offs for product features.",
      });
      rounds.push({
        title: "Round 3: Culture fit / Founder interview",
        why: "Evaluate ownership mindset and team fit.",
      });
    } else if (hasDSA) {
      rounds.push({
        title: "Round 1: Coding test",
        why: "Quick filter on algorithmic problem solving.",
      });
      rounds.push({
        title: "Round 2: Technical interview",
        why: "Assess core CS and implementation choices.",
      });
      rounds.push({
        title: "Round 3: HR / Fit",
        why: "Final discussion on role and expectations.",
      });
    } else {
      rounds.push({
        title: "Round 1: Practical assessment",
        why: "Task-based evaluation to understand practical skills.",
      });
      rounds.push({
        title: "Round 2: Technical + Projects",
        why: "Review past work and technical depth.",
      });
      rounds.push({
        title: "Round 3: HR",
        why: "Confirm fit and logistics.",
      });
    }
  }

  return rounds;
}

export {
  extractSkills,
  flattenCategories,
  generateChecklist,
  generatePlan,
  generateQuestions,
  scoreReadiness,
  CATEGORIES,
  generateCompanyIntel,
  mapRounds,
  inferCompanySize,
  inferIndustry,
};


