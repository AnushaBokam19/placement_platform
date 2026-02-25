import React from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "prp_test_checklist_v1";

function loadPassed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return false;
    return arr.every((t) => t.checked);
  } catch {
    return false;
  }
}

export default function PrpShip() {
  const unlocked = loadPassed();

  if (!unlocked) {
    return (
      <div>
        <div className="card">
          <h2 className="text-2xl font-semibold">Shipping Locked</h2>
          <p className="mt-3 text-[rgba(17,17,17,0.8)]">Fix issues before shipping.</p>
          <div className="mt-4 flex gap-2">
            <Link to="/prp/07-test" className="btn btn-secondary">Open Test Checklist</Link>
            <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2 className="text-2xl font-semibold">Ship — Unlocked</h2>
        <p className="mt-3 text-[rgba(17,17,17,0.8)]">All tests passed. You may proceed to ship.</p>
        <div className="mt-4">
          <button className="btn btn-primary" onClick={() => alert("Ship action simulated — build locked until real release flow.")}>Ship</button>
          <Link to="/dashboard" className="btn btn-secondary" style={{ marginLeft: 8 }}>Back</Link>
        </div>
      </div>
    </div>
  );
}

