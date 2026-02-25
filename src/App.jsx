import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import Practice from "./pages/Practice";
import PracticeHistory from "./pages/PracticeHistory";
import Results from "./pages/Results";
import Assessments from "./pages/Assessments";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PrpTest from "./pages/PrpTest";
import PrpShip from "./pages/PrpShip";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="practice" element={<Practice />} />
          <Route path="practice/history" element={<PracticeHistory />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="resources" element={<Resources />} />
          <Route path="profile" element={<Profile />} />
          <Route path="results/:id?" element={<Results />} />
        </Route>
        <Route path="/404" element={<NotFound />} />
        <Route path="/prp/07-test" element={<PrpTest />} />
        <Route path="/prp/08-ship" element={<PrpShip />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
