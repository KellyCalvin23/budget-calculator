import React, { useState } from 'react';
import { formatCurrency, CURRENCIES } from '../utils/currency';
import { TrendingUp, Award, Zap } from 'lucide-react';

export default function WealthProjection({ monthlyIncome, currency, activeBuckets }) {
  const [investReturnRate, setInvestReturnRate] = useState(9.5); // 9.5% annual return
  const [savingsReturnRate, setSavingsReturnRate] = useState(6.0); // 6.0% annual savings rate

  // Identify investment and emergency/savings buckets dynamically
  const investBucket = activeBuckets.find(b => 
    b.id === 'invest' || b.name.toLowerCase().includes('invest') || b.name.toLowerCase().includes('wealth')
  ) || activeBuckets[1] || activeBuckets[0];

  const savingsBucket = activeBuckets.find(b => 
    b.id === 'emergency' || b.id === 'savings' || b.name.toLowerCase().includes('emergenc') || b.name.toLowerCase().includes('saving')
  ) || activeBuckets[2] || activeBuckets[0];

  const monthlyInvestVal = monthlyIncome * ((investBucket?.pct || 15) / 100);
  const monthlySavingsVal = monthlyIncome * ((savingsBucket?.pct || 5) / 100);

  // Helper for compound future value with monthly deposits: FV = P * (((1 + r)^n - 1) / r)
  const calculateFV = (monthlyContribution, annualRatePct, years) => {
    if (monthlyContribution <= 0 || years <= 0) return { total: 0, principal: 0, interest: 0 };
    
    const r = (annualRatePct / 100) / 12;
    const n = years * 12;
    
    let total = 0;
    if (r === 0) {
      total = monthlyContribution * n;
    } else {
      total = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    }
    
    const principal = monthlyContribution * n;
    const interest = Math.max(0, total - principal);
    
    return { total, principal, interest };
  };

  const timeframes = [1, 5, 10, 20, 30];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Summary */}
      <div className="card-glass" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp color="var(--emerald-primary)" size={22} /> Long-Term Wealth Growth Forecast
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Project how your monthly <b>{investBucket?.name || 'Investment'} ({investBucket?.pct || 15}%)</b> and <b>{savingsBucket?.name || 'Savings'} ({savingsBucket?.pct || 5}%)</b> compound over time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{investBucket?.name}</span>
            <div className="tabular-num" style={{ fontSize: '1rem', fontWeight: 800, color: investBucket?.color || 'var(--c-invest)' }}>
              {formatCurrency(monthlyInvestVal, currency)}/mo
            </div>
          </div>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{savingsBucket?.name}</span>
            <div className="tabular-num" style={{ fontSize: '1rem', fontWeight: 800, color: savingsBucket?.color || 'var(--c-emergency)' }}>
              {formatCurrency(monthlySavingsVal, currency)}/mo
            </div>
          </div>
        </div>
      </div>

      {/* Return Rate Customizers */}
      <div className="card-glass" style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        
        {/* Investment Return Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {investBucket?.name} Return (%/yr):
            </label>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: investBucket?.color || 'var(--c-invest)' }}>
              {investReturnRate}% / year
            </span>
          </div>
          <input 
            type="range"
            min="1"
            max="20"
            step="0.5"
            value={investReturnRate}
            onChange={(e) => setInvestReturnRate(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: investBucket?.color || 'var(--c-invest)', cursor: 'pointer' }}
          />
        </div>

        {/* Emergency Return Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {savingsBucket?.name} Interest (%/yr):
            </label>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: savingsBucket?.color || 'var(--c-emergency)' }}>
              {savingsReturnRate}% / year
            </span>
          </div>
          <input 
            type="range"
            min="0"
            max="15"
            step="0.5"
            value={savingsReturnRate}
            onChange={(e) => setSavingsReturnRate(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: savingsBucket?.color || 'var(--c-emergency)', cursor: 'pointer' }}
          />
        </div>

      </div>

      {/* Projection Milestone Cards (1, 5, 10, 20, 30 years) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {timeframes.map((yrs) => {
          const invRes = calculateFV(monthlyInvestVal, investReturnRate, yrs);
          const savRes = calculateFV(monthlySavingsVal, savingsReturnRate, yrs);
          const combinedTotal = invRes.total + savRes.total;
          const combinedInterest = invRes.interest + savRes.interest;

          return (
            <div key={yrs} className="card-glass" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge" style={{ background: 'var(--bg-surface-elevated)', color: 'var(--emerald-primary)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
                  {yrs} {yrs === 1 ? 'Year' : 'Years'}
                </span>
                <Award size={16} color="var(--emerald-primary)" />
              </div>

              {/* Combined Total */}
              <div>
                <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Total Wealth
                </span>
                <div className="tabular-num" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginTop: '2px' }}>
                  {formatCurrency(combinedTotal, currency)}
                </div>
              </div>

              {/* Breakdown List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78125rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }} className="tabular-num">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: investBucket?.color || 'var(--c-invest)' }}>{investBucket?.name}:</span>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(invRes.total, currency)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: savingsBucket?.color || 'var(--c-emergency)' }}>{savingsBucket?.name}:</span>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(savRes.total, currency)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-subtle)', paddingTop: '4px', marginTop: '2px' }}>
                  <span style={{ color: 'var(--emerald-primary)' }}>Interest Earned:</span>
                  <span style={{ fontWeight: 800, color: 'var(--emerald-primary)' }}>+{formatCurrency(combinedInterest, currency)}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* 30-Year Highlight Banner */}
      {(() => {
        const yr30 = calculateFV(monthlyInvestVal, investReturnRate, 30);
        return (
          <div className="card-glass" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(99, 102, 241, 0.12))', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--emerald-primary)', display: 'grid', placeItems: 'center', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)', flexShrink: 0 }}>
                <Zap size={24} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  30-Year Compound Growth Milestone
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Investing <b>{formatCurrency(monthlyInvestVal, currency)}</b> monthly for 30 years at {investReturnRate}% yields <b>+{formatCurrency(yr30.interest, currency)}</b> purely in compound interest returns!
                </p>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
