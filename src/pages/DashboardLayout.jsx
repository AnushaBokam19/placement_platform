import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, Code, Video, BarChart2, User } from "lucide-react";

function NavItem({ to, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block w-full flex items-center gap-3 rounded-md ${isActive ? "bg-[rgba(139,0,0,0.04)] font-semibold" : "text-[rgba(17,17,17,0.8)] hover:bg-[rgba(17,17,17,0.02)]"} px-3 py-2`
      }
    >
      <Icon size={18} />
      {children}
    </NavLink>
  );
}

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      <aside style={{width:"20%"}} className="w-64 border-r border-[rgba(17,17,17,0.06)] bg-white p-6">
        <div className="mb-6 font-semibold text-lg">Placement Prep</div>
        <nav className="flex flex-col gap-2 mt-4">
          <NavItem to="/dashboard" icon={Home}>Dashboard</NavItem>
          <NavItem to="/dashboard/practice" icon={Code}>Practice</NavItem>
          <NavItem to="/dashboard/assessments" icon={Video}>Assessments</NavItem>
          <NavItem to="/dashboard/resources" icon={BarChart2}>Resources</NavItem>
          <NavItem to="/dashboard/profile" icon={User}>Profile</NavItem>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b border-[rgba(17,17,17,0.06)] bg-[var(--color-bg)]">
          <div className="container flex items-center justify-between" style={{ paddingLeft: "2%", paddingRight: "4%" }}>
            <div className="py-4 text-lg font-semibold">Placement Prep</div>
            <div className="flex items-center gap-4 py-4">
              <div className="w-9 h-9 rounded-full bg-white border border-[rgba(17,17,17,0.06)] flex items-center justify-center">A</div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

