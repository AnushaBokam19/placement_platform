import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { extractSkills, flattenCategories, generateChecklist, generatePlan, generateQuestions, scoreReadiness } from "../utils/analyzer";

function saveHistory(entry) {
  const raw = localStorage.getItem("analysis_history");
  const arr = raw ? JSON.parse(raw) : [];
  arr.push(entry);
  localStorage.setItem("analysis_history", JSON.stringify(arr));
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function Practice() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const analyze = () => {
    setLoading(true);
    const found = extractSkills(jd);
    const flattened = flattenCategories(found);
    const checklist = generateChecklist(found);
    const plan = generatePlan(found);
    const questions = generateQuestions(found);
    const readinessScore = scoreReadiness({
      foundCategories: Object.keys(flattened),
      company,
      role,
      jdText: jd,
    });

    // build default skillConfidenceMap (default: "practice")
    const allSkills = Object.values(flattened).flat();
    const skillConfidenceMap = {};
    allSkills.forEach((s) => {
      skillConfidenceMap[s] = "practice";
    });

    const entry = {
      id: uid(),
      createdAt: new Date().toISOString(),
      company,
      role,
      jdText: jd,
      extractedSkills: flattened,
      skillConfidenceMap,
      plan,
      checklist,
      questions,
      readinessScore,
    };

    saveHistory(entry);
    setLoading(false);
    // navigate to results for this id
    navigate(`/dashboard/results/${entry.id}`);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Practice & JD Analyzer</h2>
        <div>
          <Link to="/dashboard/practice/history" className="btn btn-secondary mr-2">History</Link>
        </div>
      </div>

      <div className="card">
        <label className="block mb-2 font-medium">Company (optional)</label>
        <input value={company} onChange={(e) => setCompany(e.target.value)} className="input mb-3" placeholder="Company name" />

        <label className="block mb-2 font-medium">Role (optional)</label>
        <input value={role} onChange={(e) => setRole(e.target.value)} className="input mb-3" placeholder="Role / Title" />

        <label className="block mb-2 font-medium">Job Description / JD text</label>
        <textarea style={{width:"70%",border:"1px solid #000"}} value={jd} onChange={(e) => setJd(e.target.value)} rows={10} className="input mb-4" placeholder="Paste JD here..." />

        <div className="flex gap-3">
          <button className="btn btn-primary" onClick={analyze} disabled={loading}>{loading ? "Analyzing..." : "Analyze"}</button>
          <Link to="/dashboard" className="btn btn-secondary">Back</Link>
        </div>
      </div>
    </div>
  );
}

