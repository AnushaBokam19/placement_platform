import React from "react";

export default function TopBar({ projectName = "KodNest", step = "1 / 3", status = "Not Started" }) {
  return (
    <header className="topbar">
      <div className="left">{projectName}</div>
      <div className="center">Step {step}</div>
      <div className="right">
        <div className="status-badge">{status}</div>
      </div>
    </header>
  );
}
