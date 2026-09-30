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

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Historical State & Comparisons</h1>
          <p className="text-secondary mt-1">
            Compare topic lifecycles, volume trajectories, and evaluate new versus recurring technical discussions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-secondary font-medium">Period:</span>
          <div className="flex border rounded-md overflow-hidden bg-white">
            {["1d", "7d", "30d"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium ${
                  period === p ? "bg-primary text-white" : "text-secondary hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* Multi-Topic Comparative Line Graph */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold">Comparative Trajectory Analysis</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={topicsToCompare}
              onChange={(e) => setTopicsToCompare(e.target.value)}
              placeholder="Comma separated topics..."
              className="px-3 py-1.5 text-sm border rounded-md w-72 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={fetchComparison}
              className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90"
            >
              Compare
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(comparisonData[0] || {})
              .filter((k) => k !== "date")
              .map((topicKey, idx) => (
                <Line
                  key={topicKey}
                  type="monotone"
                  dataKey={topicKey}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Single Topic Deep History */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Topic Lifecycle Profile</h2>
          <div className="mb-4">
            <input
              type="text"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              placeholder="Inspect topic history..."
              className="px-3 py-1.5 text-sm border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {singleTopicHistory ? (
            <div>
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-6 border text-center">
                <div>
                  <div className="text-xs text-secondary">Total Mentions</div>
                  <div className="text-lg font-bold text-primary">
                    {singleTopicHistory.summary?.total_mentions || 0}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-secondary">Average Sentiment</div>
                  <div className="text-lg font-bold text-green-600">
                    {singleTopicHistory.summary?.avg_sentiment > 0 ? "+" : ""}
                    {singleTopicHistory.summary?.avg_sentiment || 0}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-secondary">Peak Volume</div>
                  <div className="text-lg font-bold text-blue-600">
                    {singleTopicHistory.summary?.peak_volume || 0}
                  </div>
                </div>
              </div>

              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={singleTopicHistory.history || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" hide />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="sentiment" stroke="#10b981" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <p className="text-secondary text-sm">Enter a topic to load historical volume and sentiment curves.</p>
          )}
        </div>

        {/* New vs Recurring Topics */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">New vs Recurring Discussions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr className="text-left text-secondary font-medium">
                  <th className="py-2.5 px-2">Topic</th>
                  <th className="py-2.5 px-2 text-center">Status</th>
                  <th className="py-2.5 px-2 text-right">Initial Vol</th>
                  <th className="py-2.5 px-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {newTopics.map((nt, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2.5 px-2 font-medium text-gray-900">{nt.topic}</td>
                    <td className="py-2.5 px-2 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        nt.is_recurring 
                          ? "bg-purple-100 text-purple-700" 
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {nt.is_recurring ? "Recurring" : "New Novel"}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium">{nt.initial_volume}</td>
                    <td className="py-2.5 px-2 text-secondary text-xs uppercase">{nt.source}</td>
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
