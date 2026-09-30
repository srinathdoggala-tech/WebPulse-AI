import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  const sources = [
    {
      name: "Hacker News",
      desc: "Top stories, community discussions & YC sentiment via Firebase API",
      status: "Active (5m poll)",
      tag: "tech_news",
      icon: "⚡"
    },
    {
      name: "GitHub Trending",
      desc: "Developer repositories, language adoption spikes, and star acceleration",
      status: "Active (15m poll)",
      tag: "open_source",
      icon: "🐙"
    },
    {
      name: "Reddit Communities",
      desc: "Discussions across r/LocalLLaMA, r/MachineLearning, and r/webdev",
      status: "Active (10m poll)",
      tag: "community",
      icon: "💬"
    },
    {
      name: "ATS Job Boards",
      desc: "Live tech openings from Greenhouse, Lever, and Ashby ATS endpoints",
      status: "Active (30m poll)",
      tag: "jobs",
      icon: "💼"
    },
    {
      name: "ArXiv & Tech News",
      desc: "Research pre-prints (CS.AI, CS.CL) and TechCrunch intelligence feeds",
      status: "Active (15m poll)",
      tag: "research",
      icon: "📡"
    }
  ];

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero-box">
        <div className="hero-pill">
          <span>✨</span>
          <span>AUTONOMOUS COMMUNITY INTELLIGENCE</span>
        </div>

        <h1 className="hero-title">
          WebPulse AI: Real-Time Web Trend & Intelligence Tracker
        </h1>

        <p className="hero-subtitle">
          Continuously collecting, normalizing, and scoring technical shifts across 
          developer ecosystems, pre-prints, and ATS hiring demands with statistical velocity calculus.
        </p>

        <div className="hero-buttons">
          <Link to="/dashboard" className="btn-primary" style={{ padding: "12px 28px", fontSize: "15px" }}>
            Explore Live Dashboard →
          </Link>
          <Link to="/jobs" className="btn-secondary" style={{ padding: "12px 24px", fontSize: "15px" }}>
            Test ATS Resume Matcher
          </Link>
          <Link to="/trending" className="btn-secondary" style={{ padding: "12px 24px", fontSize: "15px" }}>
            Trending Radar
          </Link>
        </div>
      </section>

      {/* Metric Counters Banner */}
      <div className="grid-4" style={{ marginBottom: "48px" }}>
        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Ingestion Sources
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--primary)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
            5 Active
          </div>
          <div style={{ fontSize: "12px", color: "var(--accent-green)", marginTop: "2px" }}>
            ● Continuous Async Polling
          </div>
        </div>

        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Average Velocity
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--accent-green)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
            +184.2%
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            Rate over 24h baseline
          </div>
        </div>

        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Deduplication Rate
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--accent-purple)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
            32.4%
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            SHA-256 Fingerprint Filtering
          </div>
        </div>

        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Scored Tech Topics
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--accent-amber)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
            127 Active
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            Across 5 categories
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px" }}>
          Architecture & Engineering Signals
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" }}>
          Decoupling semantic LLM understanding from rigorous statistical measurement.
        </p>

        <div className="grid-3">
          <div className="glass-card">
            <div style={{ fontSize: "32px", marginBottom: "14px" }}>📡</div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
              Multi-Source Ingestion Pipeline
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: "1.6" }}>
              Asynchronous collectors pulling real signals from Hacker News, GitHub repositories, 
              Reddit feeds, technical pre-prints, and ATS job boards with canonical deduplication.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ fontSize: "32px", marginBottom: "14px" }}>📐</div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
              Statistical Trend Calculus
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: "1.6" }}>
              Trend scores calculated via engagement intensity, exponential recency half-life, 
              and cross-source diversity multipliers rather than arbitrary model generation.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ fontSize: "32px", marginBottom: "14px" }}>🎯</div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
              ATS Skill & Gap Matcher
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: "1.6" }}>
              Transparent candidate skill extraction comparing resumes against active engineering 
              openings, highlighting matched skills, missing technical gaps, and fit percentage.
            </p>
          </div>
        </div>
      </div>

      {/* Connected Feeds Overview */}
      <div style={{ marginBottom: "48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 800 }}>Connected Data Sources</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Real-time telemetry across our 5 collector engines.</p>
          </div>
          <Link to="/config" className="btn-secondary" style={{ fontSize: "13px" }}>
            Manage Feeds & Intervals →
          </Link>
        </div>

        <div className="grid-3">
          {sources.map((src, i) => (
            <div key={i} className="glass-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{ fontSize: "24px" }}>{src.icon}</span>
                <span className="badge badge-green" style={{ fontSize: "10px" }}>
                  {src.status}
                </span>
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "6px" }}>{src.name}</h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px", lineHeight: "1.5" }}>
                {src.desc}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--bg-card-border)", fontSize: "11px", color: "var(--text-faint)" }}>
                <span>Tag: #{src.tag}</span>
                <span style={{ color: "var(--primary)" }}>Online</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;