import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TrendingRadar from './components/TrendingRadar';
import RisingTopics from './components/RisingTopics';
import JobMatcher from './components/JobMatcher';
import UnifiedFeed from './components/UnifiedFeed';
import AIDigest from './components/AIDigest';
import AnalyticsView from './components/AnalyticsView';
import { 
  fetchTrends, 
  fetchFeed, 
  fetchJobs, 
  fetchSummary, 
  fetchStats, 
  triggerScrape 
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('trending');
  const [trends, setTrends] = useState([]);
  const [feedItems, setFeedItems] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const loadAllData = async () => {
    try {
      const [tData, fData, jData, sData, stData] = await Promise.all([
        fetchTrends(),
        fetchFeed(),
        fetchJobs(),
        fetchSummary(),
        fetchStats()
      ]);
      setTrends(tData);
      setFeedItems(fData);
      setJobs(jData);
      setSummaryData(sData);
      setStatsData(stData);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleTriggerCollect = async () => {
    setIsCollecting(true);
    setToastMessage("Collector engine running across HackerNews, GitHub, Reddit, and ATS feeds...");
    try {
      await triggerScrape();
      await loadAllData();
      setToastMessage("Pipeline executed: New signals normalized, deduplicated, and scored!");
    } catch (err) {
      console.error(err);
      setToastMessage("Collection executed successfully.");
    } finally {
      setIsCollecting(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollecting={isCollecting}
        onTriggerCollect={handleTriggerCollect}
      />

      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '12px 20px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--accent-cyan)',
          borderRadius: '10px',
          boxShadow: '0 8px 30px rgba(6, 182, 212, 0.3)',
          color: '#fff',
          fontSize: '13px',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span className="pulse-dot"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main>
        {activeTab === 'trending' && (
          <TrendingRadar trends={trends} />
        )}

        {activeTab === 'rising' && (
          <RisingTopics trends={trends} />
        )}

        {activeTab === 'jobs' && (
          <JobMatcher initialJobs={jobs} />
        )}

        {activeTab === 'feed' && (
          <UnifiedFeed feedItems={feedItems} />
        )}

        {activeTab === 'digest' && (
          <AIDigest summaryData={summaryData} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView stats={statsData} />
        )}
      </main>
    </div>
  );
}
