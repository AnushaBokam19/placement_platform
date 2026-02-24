import React from "react";
import TopBar from "./components/TopBar";
import SecondaryPanel from "./components/SecondaryPanel";
import ProofFooter from "./components/ProofFooter";
import Button from "./components/Button";

export default function App() {
  return (
    <div className="page">
      <TopBar projectName="KodNest Premium Build System" step="1 / 4" status="Not Started" />

      <div className="container">
        <section style={{ marginTop: 24 }}>
          <h1 className="context-headline">Create a dependable build</h1>
          <p className="context-subtext">A calm, focused environment for building production-ready artifacts.</p>
        </section>

        <main className="main">
          <div className="primary">
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ marginTop: 0 }}>Primary Workspace</h3>
              <p style={{ maxWidth: 720 }}>This is the primary workspace: clean cards, predictable components, and no crowding.</p>

              <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                <Button>Build</Button>
                <Button variant="secondary">Preview</Button>
              </div>
            </div>

            <div className="card">
              <h4 style={{ marginTop: 0 }}>Details</h4>
              <p style={{ maxWidth: 720 }}>Use this area to configure build inputs. The design system enforces spacing and type scale.</p>
            </div>
          </div>

          <SecondaryPanel stepExplanation="Step explanation and instructions." prompt="Generate production-ready build with these settings." />
        </main>
      </div>

      <ProofFooter />
    </div>
  );
}
