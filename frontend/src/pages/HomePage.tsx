import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome to TrendRadar-AI
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-6 bg-white rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">What is TrendRadar-AI?</h2>
          <p className="mb-4">
            TrendRadar-AI is an AI-powered community intelligence platform that
            collects, analyzes, and visualizes trends from multiple data sources
            including Hacker News, Reddit, GitHub, job boards, and RSS feeds.
          </p>
          <Link to="/dashboard" className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
            Explore Dashboard
          </Link>
        </div>

        <div className="p-6 bg-white rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Key Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Multi-source data collection</li>
            <li>AI-powered topic extraction and sentiment analysis</li>
            <li>Real-time trend detection and tracking</li>
            <li>Historical comparisons and velocity tracking</li>
            <li>Interactive dashboard with charts and visualizations</li>
            <li>Job market intelligence and opportunity tracking</li>
          </ul>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Data Sources</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded border">
            <h3 className="font-medium mb-2">Hacker News</h3>
            <p className="text-sm">
              Technology news and discussions from Y Combinator's platform
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded border">
            <h3 className="font-medium mb-2">Reddit</h3>
            <p className="text-sm">
              Tech and programming subreddits for community insights
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded border">
            <h3 className="font-medium mb-2">GitHub</h3>
            <p className="text-sm">
              Trending repositories and developer activity
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded border">
            <h3 className="font-medium mb-2">Job Boards</h3>
            <p className="text-sm">
              Tech job postings from LinkedIn, Indeed, and more
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded border">
            <h3 className="font-medium mb-2">RSS Feeds</h3>
            <p className="text-sm">
              Curated tech and AI news sources from around the web
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded border">
            <h3 className="font-medium mb-2">AI Analysis</h3>
            <p className="text-sm">
              LLM-powered topic extraction, sentiment analysis, and summarization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;