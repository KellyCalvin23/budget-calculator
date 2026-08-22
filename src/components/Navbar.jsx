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
    <header className="card-glass" style={{ borderRadius: '0 0 24px 24px', padding: '16px 28px', marginBottom: '32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '14px', 
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)'
          }}>
            <Wallet size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SmartBudget
              </span>
              <span className="badge badge-rwf">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                RWF & Global
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              50/15/5/30 Financial Planner & Wealth Growth Engine
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="segmented-control">
          <button 
            className={`segmented-btn ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            <Sliders size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Budget Calculator
          </button>
          <button 
            className={`segmented-btn ${activeTab === 'itemized' ? 'active' : ''}`}
            onClick={() => setActiveTab('itemized')}
          >
            <Sparkles size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Itemized Tracker
          </button>
          <button 
            className={`segmented-btn ${activeTab === 'wealth' ? 'active' : ''}`}
            onClick={() => setActiveTab('wealth')}
          >
            Wealth Growth Forecast
          </button>
        </div>

        {/* Currency & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Currency Select Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface-elevated)', padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <Globe size={16} color="var(--text-secondary)" />
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontWeight: 700, cursor: 'pointer', outline: 'none' }}
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                  {c.code} ({c.symbol}) - {c.name}
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
              width: '38px', 
              height: '38px', 
              display: 'grid', 
              placeItems: 'center', 
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Export PDF Button */}
          <button 
            onClick={onExportClick}
            className="pulse-button"
            style={{ 
              background: 'linear-gradient(135deg, #10b981, #059669)', 
              border: 'none', 
              color: '#fff', 
              padding: '8px 18px', 
              borderRadius: '12px', 
              fontWeight: 700, 
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Download size={16} />
            Export PDF
          </button>

        </div>

      </div>
    </header>
  );
}
