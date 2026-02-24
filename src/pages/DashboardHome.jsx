import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const radarData = [
  { subject: "DSA", A: 75 },
  { subject: "System Design", A: 60 },
  { subject: "Communication", A: 80 },
  { subject: "Resume", A: 85 },
  { subject: "Aptitude", A: 70 },
];

function CircularReadiness({ value = 72, size = 180, stroke = 12 }) {
  const [animated, setAnimated] = useState(false);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  useEffect(() => {
    // allow mount before animating
    requestAnimationFrame(() => setAnimated(true));
  }, []);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs />
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle
            r={radius}
            fill="transparent"
            stroke="rgba(17,17,17,0.06)"
            strokeWidth={stroke}
          />
          <circle
            r={radius}
            fill="transparent"
            stroke="hsl(245 58% 51%)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? offset : circumference}
            style={{ transition: "stroke-dashoffset 900ms ease-in-out" }}
            transform="rotate(-90)"
          />
        </g>
      </svg>
      <div className="mt-[-110px] flex flex-col items-center pointer-events-none">
        <div className="text-3xl font-semibold">{value}</div>
        <div className="text-sm text-[rgba(17,17,17,0.7)]">Readiness Score</div>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const continueProgress = (3 / 10) * 100;
  const weeklyProgress = (12 / 20) * 100;
  const filledDays = [true, true, true, false, true, true, false]; // Mon-Sun

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left column */}
      <div className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Overall Readiness</h3>
          <div className="flex items-center justify-center">
            <CircularReadiness value={72} />
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Skill Breakdown</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="You"
                  dataKey="A"
                  stroke="hsl(245 58% 51%)"
                  fill="hsl(245 58% 51%)"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-3">Continue Practice</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[rgba(17,17,17,0.8)]">Last topic</div>
              <div className="font-medium">Dynamic Programming</div>
              <div className="text-sm text-[rgba(17,17,17,0.6)] mt-2">Progress: 3 / 10</div>
              <div className="w-full bg-[rgba(17,17,17,0.06)] h-3 rounded-full mt-3">
                <div
                  className="h-3 rounded-full"
                  style={{ width: `${continueProgress}%`, background: "hsl(245 58% 51%)" }}
                />
              </div>
            </div>
            <div>
              <button className="btn btn-primary">Continue</button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-3">Weekly Goals</h3>
          <div className="text-sm text-[rgba(17,17,17,0.8)]">Problems Solved: 12 / 20 this week</div>
          <div className="w-full bg-[rgba(17,17,17,0.06)] h-3 rounded-full mt-3">
            <div
              className="h-3 rounded-full"
              style={{ width: `${weeklyProgress}%`, background: "hsl(245 58% 51%)" }}
            />
          </div>

          <div className="mt-4 flex items-center gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
              <div key={d} className="flex flex-col items-center text-xs">
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                    filledDays[i] ? "bg-[hsl(245,58%,51%)] text-white" : "bg-white"
                  }`}
                >
                  {d.slice(0, 1)}
                </div>
                <div className="mt-1 text-[rgba(17,17,17,0.6)]">{d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-3">Upcoming Assessments</h3>
          <ul className="space-y-3">
            <li className="flex items-start justify-between">
              <div>
                <div className="font-medium">DSA Mock Test</div>
                <div className="text-sm text-[rgba(17,17,17,0.6)]">Tomorrow, 10:00 AM</div>
              </div>
              <div className="text-sm text-[rgba(17,17,17,0.6)]">DSA</div>
            </li>
            <li className="flex items-start justify-between">
              <div>
                <div className="font-medium">System Design Review</div>
                <div className="text-sm text-[rgba(17,17,17,0.6)]">Wed, 2:00 PM</div>
              </div>
              <div className="text-sm text-[rgba(17,17,17,0.6)]">Design</div>
            </li>
            <li className="flex items-start justify-between">
              <div>
                <div className="font-medium">HR Interview Prep</div>
                <div className="text-sm text-[rgba(17,17,17,0.6)]">Friday, 11:00 AM</div>
              </div>
              <div className="text-sm text-[rgba(17,17,17,0.6)]">HR</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

