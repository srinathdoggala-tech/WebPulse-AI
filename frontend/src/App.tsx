import "./index.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import TrendingPage from "./pages/TrendingPage";
import RisingPage from "./pages/RisingPage";
import TrackingPage from "./pages/TrackingPage";
import JobsPage from "./pages/JobsPage";
import ConfigPage from "./pages/ConfigPage";

function Navigation() {
  const location = useLocation();

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/trending", label: "Trending Topics" },
    { path: "/rising", label: "Rising Spikes" },
    { path: "/tracking", label: "Historical Tracking" },
    { path: "/jobs", label: "Job & Skill Matcher" },
    { path: "/config", label: "Data Sources" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-extrabold text-primary flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
            TrendRadar AI
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-primary font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            ● Ingestion Online
          </span>
          <Link
            to="/config"
            className="text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 font-medium text-gray-700"
          >
            System Status
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navigation />

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/rising" element={<RisingPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/config" element={<ConfigPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;