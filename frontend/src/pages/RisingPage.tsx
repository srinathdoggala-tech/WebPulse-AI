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
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-secondary">Detecting breakout velocity anomalies...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span className="text-red-500">🔥</span> Rising Topics & Velocity Spikes
          </h1>
          <p className="text-secondary mt-1">
            Fastest accelerating developer topics, early signals, and emerging technologies
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-secondary font-medium">Window:</span>
          <div className="flex border rounded-md overflow-hidden bg-white">
            {[12, 24, 72, 168].map((hours) => (
              <button
                key={hours}
                onClick={() => setTimeWindow(hours)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  timeWindow === hours 
                    ? "bg-primary text-white" 
                    : "text-secondary hover:bg-gray-50"
                }`}
              >
                {hours === 168 ? "7d" : `${hours}h`}
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

      {/* Velocity Spikes Chart */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Acceleration Magnitude (Top Velocity)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="velocity" fill="#ef4444" radius={[4, 4, 0, 0]} name="Velocity Rate (x Baseline)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Grid of Breakout Topic Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {risingTopics.map((topic, idx) => (
          <div key={idx} className="card border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 font-semibold rounded-full uppercase">
                Breakout Signal
              </span>
              <span className="text-sm font-bold text-red-600">
                +{topic.velocity.toFixed(2)}x
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{topic.topic}</h3>
            
            <div className="grid grid-cols-3 gap-2 py-3 border-y my-3 text-center">
              <div>
                <div className="text-xs text-secondary">Volume</div>
                <div className="text-sm font-semibold">{topic.volume}</div>
              </div>
              <div>
                <div className="text-xs text-secondary">Sentiment</div>
                <div className={`text-sm font-semibold ${topic.sentiment >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {topic.sentiment > 0 ? `+${topic.sentiment.toFixed(2)}` : topic.sentiment.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-secondary">Category</div>
                <div className="text-xs font-semibold capitalize truncate">{topic.category}</div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-secondary mt-2">
              <span>Sources: {topic.sources?.join(", ")}</span>
              <span className="font-medium text-primary">Score: {(topic.trend_score * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RisingPage;
