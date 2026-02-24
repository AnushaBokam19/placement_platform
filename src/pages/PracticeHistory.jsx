import React from "react";
import { Link } from "react-router-dom";

function loadHistory() {
  try {
    const raw = localStorage.getItem("analysis_history");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function PracticeHistory() {
  const history = loadHistory().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!history.length) {
    return (
      <div>
        <h2 className="text-2xl font-semibold">History</h2>
        <p className="mt-4 text-[rgba(17,17,17,0.7)]">No analyses yet — analyze a JD from Practice to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Analysis History</h2>
      <ul className="space-y-3">
        {history.map((item) => (
          <li key={item.id} className="card flex items-center justify-between">
            <div>
              <div className="font-medium">{item.company || "Unknown company"} — {item.role || "Role"}</div>
              <div className="text-sm text-[rgba(17,17,17,0.6)]">{new Date(item.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{item.readinessScore}</div>
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

