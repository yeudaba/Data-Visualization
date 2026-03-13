import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Report1 from "./pages/Report1";
import Report2 from "./pages/Report2";
import Report3 from "./pages/Report3";
import Report4 from "./pages/Report4";
import Report5 from "./pages/Report5";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/report1" element={<Report1 />} />
      <Route path="/report2" element={<Report2 />} />
      <Route path="/report3" element={<Report3 />} />
      <Route path="/report4" element={<Report4 />} />
      <Route path="/report5" element={<Report5 />} />
      


      {/* זמנית עד שתסיים את שאר הדוחות */}
      

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
