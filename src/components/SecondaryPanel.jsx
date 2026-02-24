import React from "react";
import Button from "./Button";

export default function SecondaryPanel({ stepExplanation = "Short step explanation goes here.", prompt = "Copyable prompt text." }) {
  return (
    <aside className="secondary">
      <div className="card">
        <h4 style={{ marginTop: 0 }}>Step</h4>
        <p style={{ marginTop: 0 }}>{stepExplanation}</p>

        <label style={{ display: "block", marginTop: "16px", marginBottom: "8px" }}>Prompt</label>
        <textarea className="input" readOnly value={prompt} rows={6} style={{ resize: "vertical" }} />

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <Button onClick={() => navigator?.clipboard?.writeText(prompt)}>Copy</Button>
          <Button variant="secondary">Build in Lovable</Button>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <Button variant="secondary">It Worked</Button>
          <Button variant="secondary">Error</Button>
          <Button variant="secondary">Add Screenshot</Button>
        </div>
      </div>
    </aside>
  );
}
