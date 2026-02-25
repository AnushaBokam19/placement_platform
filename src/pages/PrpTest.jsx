import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const STORAGE_KEY = "prp_test_checklist_v1";

const DEFAULT_TESTS = [
  { id: "t1", text: "JD required validation works", hint: "Leave JD empty and confirm Analyze is disabled" },
  { id: "t2", text: "Short JD warning shows for <200 chars", hint: "Paste a short JD and look for the calm warning" },
  { id: "t3", text: "Skills extraction groups correctly", hint: "Check extracted skill groups on Results" },
  { id: "t4", text: "Round mapping changes based on company + skills", hint: "Try Enterprise vs Startup company names" },
  { id: "t5", text: "Score calculation is deterministic", hint: "Analyze same JD twice and compare baseScore" },
  { id: "t6", text: "Skill toggles update score live", hint: "Toggle skills on Results and watch the score" },
  { id: "t7", text: "Changes persist after refresh", hint: "Toggle skills, refresh, and confirm state persists" },
  { id: "t8", text: "History saves and loads correctly", hint: "Create analysis and open History to find it" },
  { id: "t9", text: "Export buttons copy the correct content", hint: "Use Copy buttons on Results and paste elsewhere" },
  { id: "t10", text: "No console errors on core pages", hint: "Open DevTools and navigate core pages" },
];

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_TESTS.map((t) => ({ ...t, checked: false }));
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("invalid");
    return parsed;
  } catch {
    return DEFAULT_TESTS.map((t) => ({ ...t, checked: false }));
  }
}

function save(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

export default function PrpTest() {
  const [items, setItems] = useState(load());
  const navigate = useNavigate();

  useEffect(() => {
    save(items);
  }, [items]);

  const passed = items.filter((i) => i.checked).length;
  const allPassed = passed === items.length;

  function toggle(id) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p)));
  }

  function reset() {
    const resetItems = DEFAULT_TESTS.map((t) => ({ ...t, checked: false }));
    setItems(resetItems);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">PRP Test Checklist</h2>
          <div className="text-sm text-[rgba(17,17,17,0.7)]">Tests Passed: {passed} / {items.length}</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary" onClick={reset}>Reset checklist</button>
          <Link to="/dashboard" className="btn btn-secondary">Back</Link>
        </div>
      </div>

      {passed < items.length ? (
        <div className="card mb-4 text-sm text-[rgba(17,17,17,0.8)]">Fix issues before shipping.</div>
      ) : (
        <div className="card mb-4 text-sm text-[rgba(17,17,17,0.8)]">All tests passed — ready to ship.</div>
      )}

      <div className="card">
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.id} className="flex items-start gap-4">
              <input type="checkbox" checked={!!it.checked} onChange={() => toggle(it.id)} />
              <div>
                <div className="font-medium">{it.text}</div>
                {it.hint ? <div className="text-sm text-[rgba(17,17,17,0.6)] mt-1">How to test: {it.hint}</div> : null}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <button className="btn btn-primary" onClick={() => navigate("/prp/08-ship")} disabled={!allPassed}>
          Proceed to Ship
        </button>
      </div>
    </div>
  );
}

