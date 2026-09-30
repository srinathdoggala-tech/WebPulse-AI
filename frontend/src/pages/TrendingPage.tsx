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
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-secondary">Analyzing multi-source trend streams...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trending Topics Radar</h1>
          <p className="text-secondary mt-1">
            Real-time popularity, velocity, and sentiment across Hacker News, Reddit, GitHub, and Tech Feeds
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
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
        <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* Top Trends Comparison Bar Chart */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Volume & Momentum Leaderboard</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={topTrendsData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="topic" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Mention Volume" />
            <Bar dataKey="velocity" fill="#10b981" radius={[4, 4, 0, 0]} name="Velocity Rate" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Trends Table */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-semibold mb-4">Active Trends ({filteredTrends.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr className="text-left text-secondary font-medium">
                  <th className="py-3 px-2">Topic</th>
                  <th className="py-3 px-2 text-right">Volume</th>
                  <th className="py-3 px-2 text-right">Velocity</th>
                  <th className="py-3 px-2 text-right">Sentiment</th>
                  <th className="py-3 px-2 text-right">Score</th>
                  <th className="py-3 px-2">Sources</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrends.map((trend, i) => {
                  const isSelected = selectedTopic?.topic === trend.topic;
                  return (
                    <tr
                      key={i}
                      onClick={() => handleSelectTopic(trend)}
                      className={`border-b last:border-0 cursor-pointer transition-colors ${
                        isSelected ? "bg-blue-50 font-medium" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="py-3 px-2 text-primary">{trend.topic}</td>
                      <td className="py-3 px-2 text-right">{trend.volume}</td>
                      <td className="py-3 px-2 text-right">
                        <span className={trend.velocity >= 0 ? "text-green-600 font-medium" : "text-red-500"}>
                          {trend.velocity > 0 ? `+${trend.velocity.toFixed(2)}` : trend.velocity.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className={trend.sentiment >= 0 ? "text-green-600" : "text-red-500"}>
                          {trend.sentiment > 0 ? `+${trend.sentiment.toFixed(2)}` : trend.sentiment.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-primary">
                        {(trend.trend_score * 100).toFixed(0)}%
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex flex-wrap gap-1">
                          {trend.sources?.slice(0, 2).map((s, si) => (
                            <span key={si} className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">
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
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Topic Inspector</h2>
          {selectedTopic ? (
            <div>
              <div className="p-4 bg-gray-50 rounded-lg mb-6 border">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  {selectedTopic.category}
                </span>
                <h3 className="text-2xl font-bold text-primary mt-1">{selectedTopic.topic}</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-xs text-secondary">Mentions</div>
                    <div className="text-xl font-bold">{selectedTopic.volume}</div>
                  </div>
                  <div>
                    <div className="text-xs text-secondary">Velocity</div>
                    <div className="text-xl font-bold text-green-600">
                      {selectedTopic.velocity > 0 ? `+${selectedTopic.velocity}` : selectedTopic.velocity}
                    </div>
                  </div>
                </div>
              </div>

              {topicDetails && (
                <>
                  <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
                    24h Volume Timeline
                  </h4>
                  <div className="h-44 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={topicDetails.timeline}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="timestamp" hide />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
                    Related Concepts
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {topicDetails.related_topics?.map((rt: string, rti: number) => (
                      <span key={rti} className="text-xs px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                        {rt}
                      </span>
                    ))}
                  </div>

                  <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
                    Active Discussion Channels
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {topicDetails.sources?.map((src: string, srci: number) => (
                      <span key={srci} className="text-xs px-2.5 py-1 bg-gray-200 text-gray-800 rounded font-medium">
                        {src}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-secondary text-sm">Select any topic from the table to view real-time diagnostics.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;