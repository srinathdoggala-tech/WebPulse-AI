import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from "recharts";

const apiBase = "/api";

interface RisingTopic {
  topic: string;
  category: string;
  volume: number;
  velocity: number;
  sentiment: number;
  trend_score: number;
  sources: string[];
  first_seen?: string;
}

const RisingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [risingTopics, setRisingTopics] = useState<RisingTopic[]>([]);
  const [timeWindow, setTimeWindow] = useState<number>(24);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRisingTopics();
  }, [timeWindow]);

  const fetchRisingTopics = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiBase}/trends/rising?hours=${timeWindow}&limit=30`);
      setRisingTopics(res.data);
    } catch (err) {
      setError("Failed to fetch rising topics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = risingTopics.slice(0, 10).map((t) => ({
    name: t.topic,
    velocity: t.velocity,
    volume: t.volume
  }));

  if (loading && risingTopics.length === 0) {
    return (
      <div className="container py-12 text-center">
        <div style={{
          display: "inline-block",
          width: "40px",
          height: "40px",
          border: "3px solid rgba(239, 68, 68, 0.2)",
          borderTopColor: "#ef4444",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <p style={{ marginTop: "16px", color: "var(--text-muted)", fontSize: "14px" }}>
          Detecting breakout velocity anomalies...
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header & Window Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px", marginBottom: "32px" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#f87171", fontSize: "12px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
            <span>🔥 Velocity Spike Engine</span>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.5px" }}>Rising Topics & Breakouts</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            Fastest accelerating developer topics, early signals, and emerging technologies
          </p>
        </div>

        {/* Time Window Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>Window:</span>
          <div style={{ display: "flex", background: "rgba(255, 255, 255, 0.04)", padding: "4px", borderRadius: "8px", border: "1px solid var(--bg-card-border)" }}>
            {[12, 24, 72, 168].map((hours) => {
              const isActive = timeWindow === hours;
              return (
                <button
                  key={hours}
                  onClick={() => setTimeWindow(hours)}
                  style={{
                    padding: "6px 14px",
                    fontSize: "12px",
                    fontWeight: 600,
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: isActive ? "linear-gradient(135deg, #ef4444, #f97316)" : "transparent",
                    color: isActive ? "#ffffff" : "var(--text-muted)",
                    boxShadow: isActive ? "0 0 12px rgba(239, 68, 68, 0.35)" : "none"
                  }}
                >
                  {hours === 168 ? "7d" : `${hours}h`}
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

      {/* Acceleration Magnitude Chart */}
      <div className="glass-card" style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Acceleration Magnitude (Top Velocity)</h2>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Multipliers compared against 14-day rolling baseline volume</p>
          </div>
          <span className="badge badge-red">⚡ Outlier Signals</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={0} angle={-12} textAnchor="end" height={55} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#0c1220", borderColor: "rgba(255,255,255,0.15)", borderRadius: "8px", color: "#f8fafc" }}
            />
            <Bar dataKey="velocity" fill="#ef4444" radius={[6, 6, 0, 0]} name="Velocity Rate (x Baseline)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Grid of Breakout Topic Cards */}
      <div className="grid-3">
        {risingTopics.map((topic, idx) => (
          <div key={idx} className="glass-card" style={{ borderLeft: "3px solid #ef4444" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span className="badge badge-red">Breakout Signal</span>
              <span style={{ fontSize: "14px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "#f87171" }}>
                +{topic.velocity.toFixed(2)}x
              </span>
            </div>

            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px", color: "#fff" }}>
              {topic.topic}
            </h3>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr 1fr", 
              gap: "8px", 
              padding: "12px 8px", 
              background: "rgba(0,0,0,0.25)", 
              borderRadius: "8px", 
              textAlign: "center", 
              margin: "12px 0" 
            }}>
              <div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Volume</div>
                <div style={{ fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#fff" }}>
                  {topic.volume}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Sentiment</div>
                <div style={{ fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-mono)", color: topic.sentiment >= 0 ? "#34d399" : "#f87171" }}>
                  {topic.sentiment > 0 ? `+${topic.sentiment.toFixed(2)}` : topic.sentiment.toFixed(2)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Domain</div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--primary)", textTransform: "capitalize", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {topic.category}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--text-muted)", marginTop: "12px" }}>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {topic.sources?.slice(0, 2).map((s, si) => (
                  <span key={si} style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: "4px" }}>
                    {s}
                  </span>
                ))}
              </div>
              <span style={{ fontWeight: 600, color: "var(--primary)" }}>
                Score: {(topic.trend_score * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RisingPage;
