import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

function loadHistory() {
  try {
    const raw = localStorage.getItem("analysis_history");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [skillConfidenceMap, setSkillConfidenceMap] = useState({});
  const [adjustedScore, setAdjustedScore] = useState(null);

  useEffect(() => {
    const history = loadHistory();
    if (!id) {
      // show latest
      if (history.length) setEntry(history[history.length - 1]);
    } else {
      const found = history.find((h) => h.id === id);
      if (found) setEntry(found);
    }
  }, [id]);

  // initialize skillConfidenceMap from entry (or default to "practice")
  useEffect(() => {
    if (!entry) return;
    if (entry.skillConfidenceMap) {
      setSkillConfidenceMap(entry.skillConfidenceMap);
    } else {
      const map = {};
      Object.values(entry.extractedSkills || {}).flat().forEach((s) => {
        map[s] = "practice";
      });
      setSkillConfidenceMap(map);
    }
    setAdjustedScore(entry.readinessScore);
  }, [entry]);

  // compute adjusted score whenever skillConfidenceMap changes
  useEffect(() => {
    if (!entry) return;
    const skills = Object.keys(skillConfidenceMap || {});
    let plus = 0;
    let minus = 0;
    skills.forEach((s) => {
      if (skillConfidenceMap[s] === "know") plus += 2;
      else if (skillConfidenceMap[s] === "practice") minus += 2;
    });
    let newScore = entry.readinessScore + plus - minus;
    newScore = Math.max(0, Math.min(100, newScore));
    setAdjustedScore(newScore);

    // persist change into localStorage for this entry
    try {
      const raw = localStorage.getItem("analysis_history");
      const arr = raw ? JSON.parse(raw) : [];
      const idx = arr.findIndex((a) => a.id === entry.id);
      if (idx !== -1) {
        arr[idx].skillConfidenceMap = skillConfidenceMap;
        arr[idx].readinessScore = newScore;
        localStorage.setItem("analysis_history", JSON.stringify(arr));
        // also update local entry state so UI reflects saved score
        setEntry(arr[idx]);
      }
    } catch (e) {
      // ignore
    }
  }, [skillConfidenceMap]);
  const { company, role, createdAt, extractedSkills, plan, checklist, questions, readinessScore } = entry || {};

  const allSkills = useMemo(() => Object.values((extractedSkills || {})).flat(), [extractedSkills]);

  function toggleSkill(skill) {
    setSkillConfidenceMap((prev) => {
      const next = { ...(prev || {}) };
      next[skill] = next[skill] === "know" ? "practice" : "know";
      return next;
    });
  }

  function copyText(text) {
    navigator.clipboard?.writeText(text || "");
  }

  function build7DayText() {
    if (!plan) return "";
    return plan.map((p) => `Day ${p.day}: ${p.title}\n- ${p.tasks.join("\n- ")}`).join("\n\n");
  }

  function buildChecklistText() {
    if (!checklist) return "";
    return Object.keys(checklist).map((r) => `${r}\n- ${checklist[r].join("\n- ")}`).join("\n\n");
  }

  function buildQuestionsText() {
    if (!questions) return "";
    return questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
  }

  function downloadTxt() {
    const sections = [
      `Company: ${company || ""} — Role: ${role || ""}`,
      `Readiness Score: ${adjustedScore}`,
      `\nKey skills:\n${(allSkills || []).join(", ")}`,
      `\n7-day plan:\n${build7DayText()}`,
      `\nRound checklist:\n${buildChecklistText()}`,
      `\n10 Questions:\n${buildQuestionsText()}`,
    ];
    const blob = new Blob([sections.join("\n\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(company || "analysis").replace(/\s+/g, "_")}_analysis.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (!entry) {
    return (
      <div>
        <h2 className="text-2xl font-semibold">Results</h2>
        <p className="mt-4 text-[rgba(17,17,17,0.7)]">No analysis found. Run an analysis from Practice first.</p>
        <div className="mt-4">
          <button className="btn btn-secondary" onClick={() => navigate("/dashboard/practice")}>Go to Practice</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{company || "Company"} — {role || "Role"}</h2>
          <div className="text-sm text-[rgba(17,17,17,0.6)]">{new Date(createdAt).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-[rgba(17,17,17,0.6)]">Readiness Score</div>
          <div className="text-3xl font-semibold">{adjustedScore ?? readinessScore}</div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Key skills extracted</h3>
        <div className="flex flex-wrap gap-3">
          {Object.keys(extractedSkills).map((cat) => (
            <div key={cat} className="mr-4">
              <div className="text-sm font-medium">{cat}</div>
              <div className="mt-2 flex gap-2 flex-wrap items-center">
                {extractedSkills[cat].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <span className="px-2 py-1 border rounded-full text-sm" style={{ borderColor: "rgba(17,17,17,0.06)" }}>{s}</span>
                    <button
                      className={`btn ${skillConfidenceMap[s] === "know" ? "btn-secondary" : "btn-secondary"}`}
                      onClick={() => toggleSkill(s)}
                      aria-pressed={skillConfidenceMap[s] === "know"}
                    >
                      {skillConfidenceMap[s] === "know" ? "I know this" : "Need practice"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cols-equal">
        <div className="card">
          <h3 className="text-lg font-semibold mb-3">Round-wise checklist</h3>
          {Object.keys(checklist).map((r) => (
            <div key={r} className="mb-4">
              <div className="font-medium">{r}</div>
              <ul className="list-disc ml-5 mt-2">
                {checklist[r].map((it, i) => <li key={i} className="text-sm text-[rgba(17,17,17,0.8)]">{it}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-3">7-day plan (summary)</h3>
          <div className="mb-3 flex gap-2">
            <button className="btn btn-secondary" onClick={() => copyText(build7DayText())}>Copy 7-day plan</button>
            <button className="btn btn-secondary" onClick={() => copyText(buildChecklistText())}>Copy round checklist</button>
            <button className="btn btn-secondary" onClick={() => copyText(buildQuestionsText())}>Copy 10 questions</button>
            <button className="btn btn-primary" onClick={downloadTxt}>Download as TXT</button>
          </div>
          <ol className="list-decimal ml-5">
            {plan.map((p) => (
              <li key={p.day} className="mb-3">
                <div className="font-medium">{`Day ${p.day}: ${p.title}`}</div>
                <div className="text-sm text-[rgba(17,17,17,0.8)]">{p.tasks.join(" · ")}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-3">10 likely interview questions</h3>
        <ol className="list-decimal ml-5">
          {questions.map((q, i) => <li key={i} className="mb-2 text-[rgba(17,17,17,0.85)]">{q}</li>)}
        </ol>
      </div>

      {/* Action Next box: top 3 weak skills and suggestion */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-2">Action Next</h3>
        {(() => {
          const weak = Object.entries(skillConfidenceMap || {})
            .filter(([, v]) => v === "practice")
            .map(([k]) => k)
            .slice(0, 3);
          return (
            <div>
              <div className="text-sm text-[rgba(17,17,17,0.8)] mb-3">Top weak skills</div>
              <div className="flex gap-2 mb-3">
                {weak.length ? weak.map((w) => <span key={w} className="px-2 py-1 border rounded-full text-sm" style={{ borderColor: "rgba(17,17,17,0.06)" }}>{w}</span>) : <div className="text-sm text-[rgba(17,17,17,0.6)]">No weak skills — great!</div>}
              </div>
              <div className="text-sm mb-3">Suggested next action: <strong>Start Day 1 plan now.</strong></div>
              <div>
                <button className="btn btn-primary" onClick={() => navigate("/dashboard/practice")}>Start Day 1</button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

