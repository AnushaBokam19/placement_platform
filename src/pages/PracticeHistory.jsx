import React from "react";
import { Link } from "react-router-dom";

function loadHistorySafe() {
  const out = { entries: [], corrupted: 0 };
  try {
    const raw = localStorage.getItem("analysis_history");
    if (!raw) return out;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return out;
    arr.forEach((item) => {
      try {
        // basic validation - must have id and createdAt
        if (!item || !item.id || !item.createdAt) throw new Error("invalid");
        out.entries.push(item);
      } catch {
        out.corrupted += 1;
      }
    });
    out.entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return out;
  } catch {
    return out;
  }
}

export default function PracticeHistory() {
  const { entries: history, corrupted } = loadHistorySafe();

  if (!history.length) {
    return (
      <div>
        <h2 className="text-2xl font-semibold">History</h2>
        <p className="mt-4 text-[rgba(17,17,17,0.7)]">No analyses yet — analyze a JD from Practice to get started.</p>
        {corrupted ? <p className="text-sm text-[rgba(17,17,17,0.7)] mt-2">One saved entry couldn't be loaded. Create a new analysis.</p> : null}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Analysis History</h2>
      {corrupted ? <div className="text-sm text-[rgba(17,17,17,0.7)] mb-4">One saved entry couldn't be loaded. Create a new analysis.</div> : null}
      <ul className="space-y-3">
        {history.map((item) => (
          <li key={item.id} className="card flex items-center justify-between">
            <div>
              <div className="font-medium">{item.company || "Unknown company"} — {item.role || "Role"}</div>
              <div className="text-sm text-[rgba(17,17,17,0.6)]">{new Date(item.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{item.finalScore ?? item.readinessScore ?? item.baseScore ?? 0}</div>
              <div className="mt-2">
                <Link className="btn btn-secondary" to={`/dashboard/results/${item.id}`}>View</Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

