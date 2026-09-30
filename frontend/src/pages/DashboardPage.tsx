import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";

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

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-value text-primary">{summary?.total_trends || 0}</div>
          <div className="stat-label">Total Trends</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-green-600">{summary?.active_sources || 0}</div>
          <div className="stat-label">Active Sources</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-blue-600">{summary?.total_items_collected || 0}</div>
          <div className="stat-label">Items Collected</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-orange-500">{summary?.rising_topics_count || 0}</div>
          <div className="stat-label">Rising Topics</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Top Trends</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Topic</th>
                  <th className="py-2 text-right">Volume</th>
                  <th className="py-2 text-right">Velocity</th>
                  <th className="py-2 text-right">Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {trends.map((trend, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2">{trend.topic}</td>
                    <td className="py-2 text-right">{trend.volume}</td>
                    <td className="py-2 text-right">{trend.velocity}</td>
                    <td className="py-2 text-right">{trend.sentiment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={Object.entries(summary?.categories_distribution || {}).map(([name, value]) => ({ name, value }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {Object.entries(summary?.categories_distribution || {}).map((_, i) => (
                  <Cell key={i} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][i % 5]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Trend Timeline</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeline.slice(-24)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total_volume" stroke="#3b82f6" />
            <Line type="monotone" dataKey="unique_topics" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;