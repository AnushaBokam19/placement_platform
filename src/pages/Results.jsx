import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

function loadHistory() {
  const out = [];
  try {
    const raw = localStorage.getItem("analysis_history");
    if (!raw) return out;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return out;
    arr.forEach((item) => {
      try {
        if (!item || !item.id || !item.createdAt) throw new Error("invalid");
        out.push(item);
      } catch {
        // skip corrupted entry
      }
    });
    return out;
  } catch {
    return out;
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
    setAdjustedScore(entry.finalScore ?? entry.readinessScore ?? entry.baseScore ?? 0);
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
    const base = entry.baseScore ?? entry.readinessScore ?? 0;
    let newScore = base + plus - minus;
    newScore = Math.max(0, Math.min(100, newScore));
    setAdjustedScore(newScore);

    // persist change into localStorage for this entry
    try {
      const raw = localStorage.getItem("analysis_history");
      const arr = raw ? JSON.parse(raw) : [];
      const idx = arr.findIndex((a) => a.id === entry.id);
      if (idx !== -1) {
        arr[idx].skillConfidenceMap = skillConfidenceMap;
        arr[idx].finalScore = newScore;
        arr[idx].updatedAt = new Date().toISOString();
        localStorage.setItem("analysis_history", JSON.stringify(arr));
        // also update local entry state so UI reflects saved score
        setEntry(arr[idx]);
      }
    } catch (e) {
      // ignore
    }
  }, [skillConfidenceMap]);
  const { company, role, createdAt, extractedSkills, plan7Days, checklist, questions, baseScore, finalScore } = entry || {};

  const allSkills = useMemo(() => {
    if (!extractedSkills) return [];
    return [].concat(
      extractedSkills.coreCS || [],
      extractedSkills.languages || [],
      extractedSkills.web || [],
      extractedSkills.data || [],
      extractedSkills.cloud || [],
      extractedSkills.testing || [],
      extractedSkills.other || []
    );
  }, [extractedSkills]);

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
    if (!plan7Days) return "";
    return plan7Days.map((p) => `Day ${p.day}: ${p.focus}\n- ${p.tasks.join("\n- ")}`).join("\n\n");
  }

  function buildChecklistText() {
    if (!checklist) return "";
    return checklist.map((c) => `${c.roundTitle}\n- ${c.items.join("\n- ")}`).join("\n\n");
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
          <div className="text-3xl font-semibold">{adjustedScore ?? finalScore ?? baseScore ?? 0}</div>
        </div>
      </div>

      {/* Company Intel */}
      {entry.companyIntel && entry.companyIntel.name ? (
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-[rgba(17,17,17,0.6)]">Company</div>
              <div className="text-lg font-semibold">{entry.companyIntel.name}</div>
              <div className="mt-2 text-sm text-[rgba(17,17,17,0.7)]">Industry: {entry.companyIntel.industry}</div>
              <div className="mt-1 text-sm text-[rgba(17,17,17,0.7)]">Size: {entry.companyIntel.sizeCategory}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[rgba(17,17,17,0.6)]">Typical Hiring Focus</div>
              <div className="mt-2 text-sm" style={{ maxWidth: 420 }}>{entry.companyIntel.typicalHiringFocus}</div>
              <div className="mt-3 text-xs text-[rgba(17,17,17,0.5)]">{entry.companyIntel.note}</div>
            </div>
          </div>

          {/* Round Mapping timeline */}
          {entry.roundMapping && (
            <div className="mt-6">
              <div className="text-sm font-medium mb-3">Predicted interview flow</div>
              <div className="flex flex-col gap-4">
                {entry.roundMapping.map((r, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div style={{ minWidth: 36 }}>
                      <div className="w-8 h-8 rounded-full bg-[var(--color-bg)] border flex items-center justify-center text-sm font-semibold">{i + 1}</div>
                    </div>
                    <div>
                      <div className="font-medium">{r.roundTitle || r.title}</div>
                      <div className="text-sm text-[rgba(17,17,17,0.7)] mt-1">{r.whyItMatters || r.why}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Key skills extracted</h3>
        <div className="flex flex-wrap gap-3">
          {extractedSkills &&
            Object.entries(extractedSkills).map(([cat, list]) => {
              const labels = {
                coreCS: "Core CS",
                languages: "Languages",
                web: "Web",
                data: "Data",
                cloud: "Cloud/DevOps",
                testing: "Testing",
                other: "Other",
              };
              if (!list || !list.length) return null;
              return (
                <div key={cat} className="mr-4">
                  <div className="text-sm font-medium">{labels[cat] || cat}</div>
                  <div className="mt-2 flex gap-2 flex-wrap items-center">
                    {list.map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <span className="px-2 py-1 border rounded-full text-sm" style={{ borderColor: "rgba(17,17,17,0.06)" }}>{s}</span>
                        <button
                          className="btn btn-secondary"
                          onClick={() => toggleSkill(s)}
                          aria-pressed={skillConfidenceMap[s] === "know"}
                        >
                          {skillConfidenceMap[s] === "know" ? "I know this" : "Need practice"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="cols-equal">
        <div className="card">
        <h3 className="text-lg font-semibold mb-3">Round-wise checklist</h3>
          {(Array.isArray(checklist) ? checklist : []).map((c) => (
            <div key={c.roundTitle} className="mb-4">
              <div className="font-medium">{c.roundTitle}</div>
              <ul className="list-disc ml-5 mt-2">
                {(c.items || []).map((it, i) => <li key={i} className="text-sm text-[rgba(17,17,17,0.8)]">{it}</li>)}
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
            {(Array.isArray(plan7Days) ? plan7Days : []).map((p) => (
              <li key={p.day} className="mb-3">
                <div className="font-medium">{`Day ${p.day}: ${p.focus}`}</div>
                <div className="text-sm text-[rgba(17,17,17,0.8)]">{(p.tasks || []).join(" · ")}</div>
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

