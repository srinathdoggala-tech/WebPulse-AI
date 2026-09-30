import React from 'react';
import { BarChart3, PieChart, ShieldCheck, Database } from 'lucide-react';

export default function AnalyticsView({ stats }) {
  if (!stats) return null;

  const sources = stats.sources_breakdown || {};
  const categories = stats.category_distribution || {};
  const sentiments = stats.sentiment_distribution || {};

  const maxSource = Math.max(...Object.values(sources), 1);
  const maxCat = Math.max(...Object.values(categories), 1);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
          Source & Sentiment Analytics
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Telemetry across the 5 collection engines, category concentrations, and sentiment dispersion.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Source Ingestion Breakdown */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Database size={18} color="#06b6d4" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Signals Ingested by Source</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(sources).map(([src, count]) => {
              const pct = Math.round((count / maxSource) * 100);
              return (
                <div key={src}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600 }}>{src}</span>
                    <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{count} signals</span>
                  </div>
                  <div className="match-bar-wrap" style={{ margin: 0 }}>
                    <div 
                      className="match-bar-fill" 
                      style={{ 
                        width: `${pct}%`, 
                        background: 'linear-gradient(90deg, #06b6d4, #3b82f6)' 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Representation */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <BarChart3 size={18} color="#8b5cf6" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Dominant Categories</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(categories).map(([cat, count]) => {
              const pct = Math.round((count / maxCat) * 100);
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600 }}>{cat}</span>
                    <span style={{ color: '#8b5cf6', fontFamily: 'var(--font-mono)' }}>{count} topics</span>
                  </div>
                  <div className="match-bar-wrap" style={{ margin: 0 }}>
                    <div 
                      className="match-bar-fill" 
                      style={{ 
                        width: `${pct}%`, 
                        background: 'linear-gradient(90deg, #8b5cf6, #ec4899)' 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sentiment Dispersion */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <PieChart size={18} color="#10b981" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Sentiment Dispersion</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(sentiments).map(([sent, count]) => {
              const color = sent === 'Positive' ? '#10b981' : sent === 'Neutral' ? '#94a3b8' : '#f59e0b';
              return (
                <div key={sent}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, color }}>{sent}</span>
                    <span style={{ color, fontFamily: 'var(--font-mono)' }}>{count}% of discourse</span>
                  </div>
                  <div className="match-bar-wrap" style={{ margin: 0 }}>
                    <div 
                      className="match-bar-fill" 
                      style={{ 
                        width: `${count}%`, 
                        background: color 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
