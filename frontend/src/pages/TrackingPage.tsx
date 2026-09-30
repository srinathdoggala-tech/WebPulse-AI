import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from "recharts";

const apiBase = "/api";

const TrackingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [topicsToCompare, setTopicsToCompare] = useState<string>("Large Language Models, AI Agents, Vector Databases");
  const [period, setPeriod] = useState<string>("7d");
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [newTopics, setNewTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("Large Language Models");
  const [singleTopicHistory, setSingleTopicHistory] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComparison();
    fetchNewTopics();
  }, [period]);

  useEffect(() => {
    if (selectedTopic) {
      fetchSingleHistory(selectedTopic);
    }
  }, [selectedTopic]);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiBase}/tracking/comparison?topics=${encodeURIComponent(topicsToCompare)}&period=${period}`);
      const rawComparison = res.data.comparison || {};
      
      // Transform comparison dictionary into Recharts multi-line format
      const topics = Object.keys(rawComparison);
      if (topics.length > 0) {
        const firstTopicDates = rawComparison[topics[0]] || [];
        const mergedTimeline = firstTopicDates.map((item: any, idx: number) => {
          const point: any = {
            date: new Date(item.date).toLocaleDateString([], { month: "short", day: "numeric" })
          };
          topics.forEach((t) => {
            const series = rawComparison[t] || [];
            point[t] = series[idx]?.volume || 0;
          });
          return point;
        });
        setComparisonData(mergedTimeline);
      }
    } catch (err) {
      setError("Failed to load topic comparison");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewTopics = async () => {
    try {
      const res = await axios.get(`${apiBase}/tracking/new-topics?hours=48`);
      setNewTopics(res.data);
    } catch (err) {
      console.error("Failed to fetch new topics", err);
    }
  };

  const fetchSingleHistory = async (topic: string) => {
    try {
      const res = await axios.get(`${apiBase}/tracking/topic/${encodeURIComponent(topic)}/history?days=30`);
      setSingleTopicHistory(res.data);
    } catch (err) {
      console.error("Failed to load topic history", err);
    }
  };

  const colors = ["#06b6d4", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <div className="container py-8">
      {/* Header & Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px", marginBottom: "32px" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--accent-purple)", fontSize: "12px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
            <span>📈 Longitudinal Analytics</span>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.5px" }}>Historical Tracking & Comparative Lifecycles</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            Compare topic lifecycles, volume trajectories, and analyze novel vs recurring developer discussions
          </p>
        </div>

        {/* Period Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>Timeframe:</span>
          <div style={{ display: "flex", background: "rgba(255, 255, 255, 0.04)", padding: "4px", borderRadius: "8px", border: "1px solid var(--bg-card-border)" }}>
            {["1d", "7d", "30d"].map((p) => {
              const isActive = period === p;
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    padding: "6px 14px",
                    fontSize: "12px",
                    fontWeight: 600,
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: isActive ? "rgba(6, 182, 212, 0.2)" : "transparent",
                    color: isActive ? "#06b6d4" : "var(--text-muted)",
                    border: isActive ? "1px solid rgba(6, 182, 212, 0.4)" : "1px solid transparent"
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: "14px 18px", marginBottom: "24px", background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", color: "#f87171", fontSize: "13px" }}>
          {error}
        </div>
      )}

      {/* Multi-Topic Comparative Line Graph */}
      <div className="glass-card" style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Comparative Trajectory Analysis</h2>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Cross-topic mention progression over selected timeframe</p>
          </div>
          
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="text"
              value={topicsToCompare}
              onChange={(e) => setTopicsToCompare(e.target.value)}
              placeholder="Comma separated topics..."
              className="form-input"
              style={{ width: "320px" }}
            />
            <button
              onClick={fetchComparison}
              className="btn-primary"
              style={{ padding: "10px 18px", fontSize: "13px" }}
            >
              Compare
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#0c1220", borderColor: "rgba(255,255,255,0.15)", borderRadius: "8px", color: "#f8fafc" }}
            />
            <Legend wrapperStyle={{ paddingTop: "12px" }} />
            {Object.keys(comparisonData[0] || {})
              .filter((k) => k !== "date")
              .map((topicKey, idx) => (
                <Line
                  key={topicKey}
                  type="monotone"
                  dataKey={topicKey}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: colors[idx % colors.length] }}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
        {/* Single Topic Deep History */}
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Topic Lifecycle Profile</h2>
            <span className="badge badge-cyan">30d Rolling</span>
          </div>

          <div style={{ marginBottom: "18px" }}>
            <input
              type="text"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              placeholder="Inspect specific topic history..."
              className="form-input"
            />
          </div>

          {singleTopicHistory ? (
            <div>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr 1fr", 
                gap: "10px", 
                padding: "14px", 
                background: "rgba(0,0,0,0.25)", 
                borderRadius: "var(--radius-sm)", 
                border: "1px solid var(--bg-card-border)", 
                marginBottom: "20px", 
                textAlign: "center" 
              }}>
                <div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Mentions</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--primary)", marginTop: "2px" }}>
                    {singleTopicHistory.summary?.total_mentions || 0}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Avg Sentiment</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "#34d399", marginTop: "2px" }}>
                    {singleTopicHistory.summary?.avg_sentiment > 0 ? "+" : ""}
                    {singleTopicHistory.summary?.avg_sentiment || 0}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Peak Volume</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "#c4b5fd", marginTop: "2px" }}>
                    {singleTopicHistory.summary?.peak_volume || 0}
                  </div>
                </div>
              </div>

              <div style={{ height: "200px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={singleTopicHistory.history || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="date" hide />
                    <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0c1220", borderColor: "rgba(255,255,255,0.15)", borderRadius: "8px", color: "#f8fafc" }}
                    />
                    <Line type="monotone" dataKey="volume" stroke="#06b6d4" strokeWidth={2} dot={false} name="Volume" />
                    <Line type="monotone" dataKey="sentiment" stroke="#10b981" strokeWidth={1.5} dot={false} name="Sentiment" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
              Enter a topic to load historical volume and sentiment curves.
            </p>
          )}
        </div>

        {/* New vs Recurring Topics */}
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>New vs Recurring Discussions</h2>
            <span className="badge badge-green">Last 48 Hours</span>
          </div>

          <div className="table-wrap">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th style={{ textAlign: "center" }}>Status</th>
                  <th style={{ textAlign: "right" }}>Initial Vol</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {newTopics.map((nt, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: "#fff" }}>{nt.topic}</td>
                    <td style={{ textAlign: "center" }}>
                      <span className={`badge ${nt.is_recurring ? "badge-cyan" : "badge-green"}`}>
                        {nt.is_recurring ? "Recurring" : "New Novel"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                      {nt.initial_volume}
                    </td>
                    <td style={{ textTransform: "uppercase", fontSize: "11px", color: "var(--text-muted)" }}>
                      {nt.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
