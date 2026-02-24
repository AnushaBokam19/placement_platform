import React from "react";
import { Link } from "react-router-dom";
import { Code, Video, BarChart2 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <header className="py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Placement Readiness</div>
            <nav>
              <Link to="/dashboard" className="text-sm text-[color:var(--color-text)]">Dashboard</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold leading-tight">Ace Your Placement</h1>
              <p className="mt-4 text-lg max-w-prose">Practice, assess, and prepare for your dream job</p>
              <div className="mt-6">
                <Link to="/dashboard" className="btn btn-primary">Get Started</Link>
              </div>
            </div>
            <div>
              <div className="w-full h-56 bg-white border border-[rgba(17,17,17,0.06)] rounded-base flex items-center justify-center">
                <span className="text-sm text-[rgba(17,17,17,0.5)]">Hero illustration placeholder</span>
              </div>
            </div>
          </div>

          <section className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card flex flex-col items-start gap-3">
                <Code />
                <h3 className="text-lg font-semibold">Practice Problems</h3>
                <p className="text-sm text-[rgba(17,17,17,0.7)]">Curated problems to sharpen your skills.</p>
              </div>
              <div className="card flex flex-col items-start gap-3">
                <Video />
                <h3 className="text-lg font-semibold">Mock Interviews</h3>
                <p className="text-sm text-[rgba(17,17,17,0.7)]">Realistic interview scenarios and feedback.</p>
              </div>
              <div className="card flex flex-col items-start gap-3">
                <BarChart2 />
                <h3 className="text-lg font-semibold">Track Progress</h3>
                <p className="text-sm text-[rgba(17,17,17,0.7)]">Visualize growth and milestones.</p>
              </div>
            </div>
          </section>
        </section>
      </main>

      <footer className="py-8">
        <div className="container mx-auto px-6 text-center text-sm text-[rgba(17,17,17,0.6)]">
          © {new Date().getFullYear()} Placement Readiness Platform
        </div>
      </footer>
    </div>
  );
}

