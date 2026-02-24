import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, Code, Video, BarChart2, User } from "lucide-react";

function NavItem({ to, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded ${isActive ? "bg-[color:var(--color-bg)] font-semibold" : "text-[rgba(17,17,17,0.8)]"}`
      }
    >
      <Icon size={18} />
      {children}
    </NavLink>
  );
}

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-[rgba(17,17,17,0.06)] bg-white p-4">
        <div className="mb-6 font-semibold">Placement Prep</div>
        <nav className="flex flex-col gap-1">
          <NavItem to="/dashboard" icon={Home}>Dashboard</NavItem>
          <NavItem to="/dashboard/practice" icon={Code}>Practice</NavItem>
          <NavItem to="/dashboard/assessments" icon={Video}>Assessments</NavItem>
          <NavItem to="/dashboard/resources" icon={BarChart2}>Resources</NavItem>
          <NavItem to="/dashboard/profile" icon={User}>Profile</NavItem>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b border-[rgba(17,17,17,0.06)] bg-[var(--color-bg)]">
          <div className="text-lg font-semibold">Placement Prep</div>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-white border border-[rgba(17,17,17,0.06)] flex items-center justify-center">A</div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

