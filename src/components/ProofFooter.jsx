import React from "react";

export default function ProofFooter() {
  return (
    <footer className="proof-footer">
      <div className="proof-checklist">
        <label className="proof-item"><input type="checkbox" /> UI Built</label>
        <label className="proof-item"><input type="checkbox" /> Logic Working</label>
        <label className="proof-item"><input type="checkbox" /> Test Passed</label>
        <label className="proof-item"><input type="checkbox" /> Deployed</label>
      </div>
      <div>
        <small style={{ color: "rgba(17,17,17,0.6)" }}>Each checkbox requires proof (screenshot, logs, or URL)</small>
      </div>
    </footer>
  );
}

