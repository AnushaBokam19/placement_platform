import React, { useEffect, useState } from "react";
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

  const { company, role, createdAt, extractedSkills, plan, checklist, questions, readinessScore } = entry;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{company || "Company"} — {role || "Role"}</h2>
          <div className="text-sm text-[rgba(17,17,17,0.6)]">{new Date(createdAt).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-[rgba(17,17,17,0.6)]">Readiness Score</div>
          <div className="text-3xl font-semibold">{readinessScore}</div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Key skills extracted</h3>
        <div className="flex flex-wrap gap-3">
          {Object.keys(extractedSkills).map((cat) => (
            <div key={cat} className="mr-4">
              <div className="text-sm font-medium">{cat}</div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {extractedSkills[cat].map((s) => (
                  <span key={s} className="px-2 py-1 border rounded-full text-sm" style={{ borderColor: "rgba(17,17,17,0.06)" }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
}

