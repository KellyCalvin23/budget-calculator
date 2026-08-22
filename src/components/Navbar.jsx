import React from 'react';
import { Wallet, Globe, Moon, Sun, Download, Sparkles, Sliders } from 'lucide-react';
import { CURRENCIES } from '../utils/currency';

export default function Navbar({ 
  currency, 
  setCurrency, 
  theme, 
  setTheme, 
  activeTab, 
  setActiveTab,
  onExportClick
}) {
  return (
    <header className="card-glass" style={{ borderRadius: '0 0 24px 24px', padding: '16px 24px', marginBottom: '28px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Top Row: Logo + Currency & Theme Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              flexShrink: 0
            }}>
              <Wallet size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  SmartBudget
                </span>
                <span className="badge badge-rwf" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  RWF & Global
                </span>
              </div>
              <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                50/15/5/30 Planner & Growth Engine
              </p>
            </div>
          </div>

          {/* Quick Actions (Currency + Theme + Export) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            
            {/* Currency Select Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-surface-elevated)', padding: '6px 10px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <Globe size={14} color="var(--text-secondary)" />
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontWeight: 700, cursor: 'pointer', outline: 'none', fontSize: '0.85rem' }}
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
              style={{ 
                background: 'var(--bg-surface-elevated)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '12px', 
                width: '36px', 
                height: '36px', 
                display: 'grid', 
                placeItems: 'center', 
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Export PDF Button */}
            <button 
              onClick={onExportClick}
              className="pulse-button"
              style={{ 
                background: 'linear-gradient(135deg, #10b981, #059669)', 
                border: 'none', 
                color: '#fff', 
                padding: '7px 14px', 
                borderRadius: '12px', 
                fontWeight: 700, 
                fontSize: '0.8125rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
              }}
            >
              <Download size={14} />
              PDF
            </button>

          </div>

        </div>

        {/* Bottom Row: Tab Navigation (Horizontally scrollable on mobile) */}
        <div className="segmented-control" style={{ width: '100%', justifyContent: 'stretch' }}>
          <button 
            className={`segmented-btn ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculator')}
            style={{ flex: 1, textAlign: 'center' }}
          >
            <Sliders size={15} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
            Budget Calculator
          </button>
          <button 
            className={`segmented-btn ${activeTab === 'itemized' ? 'active' : ''}`}
            onClick={() => setActiveTab('itemized')}
            style={{ flex: 1, textAlign: 'center' }}
          >
            <Sparkles size={15} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
            Itemized Tracker
          </button>
          <button 
            className={`segmented-btn ${activeTab === 'wealth' ? 'active' : ''}`}
            onClick={() => setActiveTab('wealth')}
            style={{ flex: 1, textAlign: 'center' }}
          >
            Wealth Growth Forecast
          </button>
        </div>

      </div>
    </header>
  );
}
