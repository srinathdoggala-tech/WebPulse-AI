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
    <header className="navbar-wrapper">
      <div className="container navbar-inner">
        <Link to="/" className="brand-wrap">
          <div className="brand-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 12 19 5" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <span className="brand-text">WebPulse AI</span>
        </Link>

        <nav className="nav-links-wrap" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link-item ${isActive ? "active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="nav-right-items">
          <div className="status-indicator-pill">
            <span className="pulse-dot-anim"></span>
            <span>5 FEEDS ACTIVE</span>
          </div>

          <Link
            to="/config"
            className="btn-secondary"
            style={{ padding: "7px 14px", fontSize: "12px", borderRadius: "8px" }}
          >
            System Status
          </Link>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navigation />

        <main style={{ flex: 1, paddingBottom: "60px" }}>
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