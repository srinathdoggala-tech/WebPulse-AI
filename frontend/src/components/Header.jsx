import React from 'react';
import { 
  Radar, 
  Activity, 
  TrendingUp, 
  Briefcase, 
  Rss, 
  Cpu, 
  BarChart3, 
  RefreshCw 
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  isCollecting, 
  onTriggerCollect 
}) {
  const tabs = [
    { id: 'trending', label: 'Trending Radar', icon: Activity },
    { id: 'rising', label: 'Rising Topics', icon: TrendingUp },
    { id: 'jobs', label: 'Job & Skill Matcher', icon: Briefcase },
    { id: 'feed', label: 'Unified Feed', icon: Rss },
    { id: 'digest', label: 'AI Intelligence Digest', icon: Cpu },
    { id: 'analytics', label: 'Source Analytics', icon: BarChart3 },
  ];

  return (
    <header className="header-wrapper">
      <div className="header-top">
        <div className="brand-section">
          <div className="brand-radar-icon">
            <div className="radar-ping"></div>
            <Radar size={24} color="#06b6d4" />
          </div>
          <div>
            <h1 className="brand-title">TrendRadar AI</h1>
            <p className="brand-subtitle">WebPulse Intelligence • 5 Sources Connected • Multi-Agent Pipeline</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="status-badge">
            <span className="pulse-dot"></span>
            <span>ENGINES ACTIVE</span>
          </div>

          <button 
            className="action-btn btn-primary"
            onClick={onTriggerCollect}
            disabled={isCollecting}
          >
            <RefreshCw size={14} className={isCollecting ? 'animate-spin' : ''} />
            <span>{isCollecting ? 'Collecting & Analyzing...' : 'Run Pipeline'}</span>
          </button>
        </div>
      </div>

      <nav className="nav-tabs" aria-label="Navigation Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
