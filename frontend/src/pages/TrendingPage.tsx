import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  LineChart, 
  Line 
} from "recharts";

const apiBase = "/api";

interface Trend {
  topic: string;
  category: string;
  volume: number;
  velocity: number;
  sentiment: number;
  trend_score: number;
  sources: string[];
  first_seen?: string;
  last_seen?: string;
}

const TrendingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<Trend | null>(null);
  const [topicDetails, setTopicDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrends();
  }, [selectedCategory]);

  const fetchTrends = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === "all" 
        ? `${apiBase}/trends` 
        : `${apiBase}/trends?category=${selectedCategory}`;
      const res = await axios.get(url);
      setTrends(res.data);
      if (res.data.length > 0 && !selectedTopic) {
        handleSelectTopic(res.data[0]);
      }
    } catch (err) {
      setError("Failed to load trending data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopic = async (trend: Trend) => {
    setSelectedTopic(trend);
    try {
      const res = await axios.get(`${apiBase}/trends/topics/${encodeURIComponent(trend.topic)}`);
      setTopicDetails(res.data);
    } catch (err) {
      console.error("Failed to load topic details", err);
    }
  };

  const filteredTrends = trends.filter((t) => {
    const matchesSearch = t.topic.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Top 8 trends by volume for the comparison bar chart
  const topTrendsData = [...filteredTrends]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 8);

  if (loading && trends.length === 0) {
    return (
      <div className="container py-12 text-center">
        <div style={{
          display: "inline-block",
          width: "40px",
          height: "40px",
          border: "3px solid rgba(6, 182, 212, 0.2)",
          borderTopColor: "#06b6d4",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <p style={{ marginTop: "16px", color: "var(--text-muted)", fontSize: "14px" }}>
          Analyzing multi-source trend streams...
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px", marginBottom: "32px" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontSize: "12px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
            <span>⚡ Real-Time Stream</span>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.5px" }}>Trending Topics Radar</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            Popularity volume, acceleration velocity, and sentiment across Hacker News, Reddit, GitHub, and Tech Feeds
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search topics (e.g. LLMs, Rust)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: "240px" }}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
          >
            <option value="all">All Categories</option>
            <option value="technology">Technology</option>
            <option value="business">Business</option>
            <option value="science">Science</option>
            <option value="jobs">Jobs</option>
          </select>
        </div>
      </div>

      {error && (
        <div style={{ padding: "14px 18px", marginBottom: "24px", background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", color: "#f87171", fontSize: "13px" }}>
          {error}
        </div>
      )}

      {/* Top Trends Comparison Bar Chart */}
      <div className="glass-card" style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Volume & Momentum Leaderboard</h2>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Top high-frequency topics ranked by total mentions & normalized velocity</p>
          </div>
          <span className="badge badge-cyan">{topTrendsData.length} Ranked</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={topTrendsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="topic" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={0} angle={-12} textAnchor="end" height={55} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#0c1220", borderColor: "rgba(255,255,255,0.15)", borderRadius: "8px", color: "#f8fafc" }}
            />
            <Bar dataKey="volume" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Mentions" />
            <Bar dataKey="velocity" fill="#10b981" radius={[6, 6, 0, 0]} name="Velocity Rate" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Main Grid: Trends Table + Topic Inspector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px", alignItems: "start" }}>
        {/* Main Trends Table */}
        <div className="glass-card" style={{ gridColumn: "span 2" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Active Tracked Trends ({filteredTrends.length})</h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Click any topic row to inspect deep timeline telemetry</p>
            </div>
          </div>
          
          <div className="table-wrap">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th style={{ textAlign: "right" }}>Volume</th>
                  <th style={{ textAlign: "right" }}>Velocity</th>
                  <th style={{ textAlign: "right" }}>Sentiment</th>
                  <th style={{ textAlign: "right" }}>Trend Score</th>
                  <th>Sources</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrends.map((trend, i) => {
                  const isSelected = selectedTopic?.topic === trend.topic;
                  return (
                    <tr
                      key={i}
                      onClick={() => handleSelectTopic(trend)}
                      style={{
                        cursor: "pointer",
                        background: isSelected ? "rgba(6, 182, 212, 0.12)" : "transparent",
                        borderLeft: isSelected ? "3px solid var(--primary)" : "3px solid transparent"
                      }}
                    >
                      <td style={{ fontWeight: 600, color: isSelected ? "var(--primary)" : "var(--text-main)" }}>
                        {trend.topic}
                        <div style={{ fontSize: "10px", color: "var(--text-faint)", textTransform: "capitalize" }}>
                          {trend.category}
                        </div>
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                        {trend.volume}
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>
                        <span className={`badge ${trend.velocity >= 0 ? "badge-green" : "badge-red"}`}>
                          {trend.velocity > 0 ? `+${trend.velocity.toFixed(2)}` : trend.velocity.toFixed(2)}
                        </span>
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>
                        <span style={{ color: trend.sentiment >= 0 ? "#34d399" : "#f87171", fontWeight: 600 }}>
                          {trend.sentiment > 0 ? `+${trend.sentiment.toFixed(2)}` : trend.sentiment.toFixed(2)}
                        </span>
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--primary)" }}>
                        {(trend.trend_score * 100).toFixed(0)}%
                      </td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {trend.sources?.slice(0, 2).map((s, si) => (
                            <span key={si} style={{ fontSize: "11px", padding: "2px 8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", color: "var(--text-muted)" }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Topic Deep Dive Inspector */}
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Topic Inspector</h2>
            {selectedTopic && <span className="badge badge-cyan">{selectedTopic.category}</span>}
          </div>

          {selectedTopic ? (
            <div>
              <div style={{ 
                padding: "16px", 
                background: "rgba(255, 255, 255, 0.03)", 
                borderRadius: "var(--radius-sm)", 
                border: "1px solid var(--bg-card-border)", 
                marginBottom: "20px" 
              }}>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "var(--primary)" }}>{selectedTopic.topic}</h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px" }}>
                  <div style={{ padding: "10px", background: "rgba(0,0,0,0.25)", borderRadius: "8px" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Mentions</div>
                    <div style={{ fontSize: "20px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "#fff" }}>
                      {selectedTopic.volume}
                    </div>
                  </div>
                  <div style={{ padding: "10px", background: "rgba(0,0,0,0.25)", borderRadius: "8px" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Velocity</div>
                    <div style={{ fontSize: "20px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "#34d399" }}>
                      {selectedTopic.velocity > 0 ? `+${selectedTopic.velocity}` : selectedTopic.velocity}
                    </div>
                  </div>
                </div>
              </div>

              {topicDetails && (
                <>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                    24h Volume Timeline
                  </div>
                  <div style={{ height: "160px", marginBottom: "24px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={topicDetails.timeline}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                        <XAxis dataKey="timestamp" hide />
                        <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#0c1220", borderColor: "rgba(255,255,255,0.15)", borderRadius: "8px", color: "#f8fafc" }}
                        />
                        <Line type="monotone" dataKey="volume" stroke="#06b6d4" strokeWidth={2.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                    Related Concepts
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                    {topicDetails.related_topics?.map((rt: string, rti: number) => (
                      <span key={rti} style={{ fontSize: "11px", padding: "4px 10px", background: "rgba(139, 92, 246, 0.15)", border: "1px solid rgba(139, 92, 246, 0.3)", color: "#c4b5fd", borderRadius: "9999px", fontWeight: 500 }}>
                        {rt}
                      </span>
                    ))}
                  </div>

                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                    Active Ingestion Channels
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {topicDetails.sources?.map((src: string, srci: number) => (
                      <span key={srci} style={{ fontSize: "11px", padding: "4px 10px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--bg-card-border)", color: "var(--text-muted)", borderRadius: "6px", fontWeight: 500 }}>
                        {src}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <p style={{ color: "var(--text-faint)", fontSize: "13px" }}>
              Select any topic from the table to view real-time diagnostics.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;