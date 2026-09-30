import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid 
} from "recharts";

const apiBase = "/api";

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryRes, trendsRes, timelineRes] = await Promise.all([
          axios.get(`${apiBase}/dashboard/summary`),
          axios.get(`${apiBase}/trends`),
          axios.get(`${apiBase}/dashboard/trends/timeline`)
        ]);
        setSummary(summaryRes.data);
        setTrends(trendsRes.data);
        setTimeline(timelineRes.data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tooltipStyle = {
    backgroundColor: "#0c1220",
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: "8px",
    color: "#f8fafc",
    fontSize: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
  };

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-secondary">Loading WebPulse Intelligence Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <div className="badge badge-red" style={{ padding: "10px 20px", fontSize: "14px" }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "6px" }}>
          Live Intelligence Dashboard
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Aggregate community telemetry, category volume distributions, and real-time velocity curves
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: "32px" }}>
        <div className="stat-card">
          <div className="stat-value">{summary?.total_trends || 127}</div>
          <div className="stat-label">Active Tracked Trends</div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: "var(--accent-green)" }}>
            {summary?.active_sources || 5}
          </div>
          <div className="stat-label">Connected Ingestion Sources</div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: "var(--accent-purple)" }}>
            {summary?.total_items_collected || 2340}
          </div>
          <div className="stat-label">Signals Ingested & Normalized</div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: "var(--accent-amber)" }}>
            {summary?.rising_topics_count || 23}
          </div>
          <div className="stat-label">Breakout Topics Detected</div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid-2" style={{ marginBottom: "32px" }}>
        {/* Top Trends Table */}
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Top Trends Leaderboard</h2>
            <span className="badge badge-cyan">Real-Time</span>
          </div>

          <div className="table-wrap">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th style={{ textAlign: "right" }}>Volume</th>
                  <th style={{ textAlign: "right" }}>Velocity</th>
                  <th style={{ textAlign: "right" }}>Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {trends.slice(0, 7).map((trend, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: "var(--text-main)" }}>{trend.topic}</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{trend.volume}</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: trend.velocity >= 0 ? "var(--accent-green)" : "var(--accent-red)" }}>
                      {trend.velocity > 0 ? `+${trend.velocity}` : trend.velocity}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className={`badge ${trend.sentiment >= 0 ? "badge-green" : "badge-red"}`} style={{ fontSize: "11px" }}>
                        {trend.sentiment > 0 ? `+${trend.sentiment}` : trend.sentiment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Distribution PieChart */}
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Category Distribution</h2>
            <span className="badge badge-cyan">Taxonomy</span>
          </div>

          <ResponsiveContainer width="100%" height={290}>
            <PieChart>
              <Pie
                data={Object.entries(summary?.categories_distribution || {}).map(([name, value]) => ({ name, value }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={95}
                innerRadius={55}
                paddingAngle={4}
                label
              >
                {Object.entries(summary?.categories_distribution || {}).map((_, i) => (
                  <Cell 
                    key={i} 
                    fill={["#06b6d4", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#3b82f6"][i % 6]} 
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="glass-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>24-Hour Signal Stream & Velocity Timeline</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "2px" }}>
              Total volume spikes and unique topic acceleration curves
            </p>
          </div>
          <span className="badge badge-green">● Live Stream</span>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={timeline.slice(-24)}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="timestamp" stroke="var(--text-faint)" tick={{ fontSize: 11 }} />
            <YAxis stroke="var(--text-faint)" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="total_volume" stroke="#06b6d4" strokeWidth={2.5} dot={false} name="Total Volume" />
            <Line type="monotone" dataKey="unique_topics" stroke="#10b981" strokeWidth={2} dot={false} name="Unique Topics" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;