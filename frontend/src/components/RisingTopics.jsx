import React from 'react';
import { TrendingUp, Sparkles, AlertCircle, ArrowUp } from 'lucide-react';

export default function RisingTopics({ trends }) {
  const risingTrends = trends.filter((t) => t.is_rising || t.velocity > 120);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
          Rising Topics & Velocity Spikes
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Real-time anomaly detection identifying breakthrough technologies experiencing exponential discussion velocity (>120% acceleration over baseline).
        </p>
      </div>

      <div className="trends-grid">
        {risingTrends.map((trend) => (
          <div 
            key={trend.id} 
            className="glass-card trend-card"
            style={{ 
              borderColor: 'rgba(16, 185, 129, 0.4)', 
              background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, rgba(15, 23, 42, 0.75) 100%)' 
            }}
          >
            <div>
              <div className="trend-card-top">
                <span 
                  className="score-badge" 
                  style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                >
                  <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  BREAKOUT TOPIC
                </span>

                <span className="velocity-badge" style={{ fontSize: '14px', color: '#10b981' }}>
                  <ArrowUp size={16} />
                  +{trend.velocity}% VELOCITY
                </span>
              </div>

              <h3 className="trend-title" style={{ marginTop: '8px' }}>{trend.topic}</h3>
              <p className="trend-desc">{trend.summary}</p>
            </div>

            <div className="trend-meta-row">
              <div className="source-badges">
                {trend.sources.map((s, idx) => (
                  <span key={idx} className="source-tag">{s}</span>
                ))}
              </div>

              <span className={`sentiment-chip sentiment-${trend.sentiment}`}>
                {trend.sentiment} Sentiment
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
