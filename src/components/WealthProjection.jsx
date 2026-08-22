import React, { useState } from 'react';
import { formatCurrency, CURRENCIES } from '../utils/currency';
import { TrendingUp, ShieldCheck, Zap, Award } from 'lucide-react';

export default function WealthProjection({ monthlyIncome, currency, ruleBucketPcts }) {
  const [investReturnRate, setInvestReturnRate] = useState(9.5); // 9.5% annual return
  const [savingsReturnRate, setSavingsReturnRate] = useState(6.0); // 6.0% annual savings rate

  // Calculate monthly contributions
  const investPct = ruleBucketPcts.invest || 15;
  const emergencyPct = ruleBucketPcts.emergency || 5;

  const monthlyInvestVal = monthlyIncome * (investPct / 100);
  const monthlyEmergencyVal = monthlyIncome * (emergencyPct / 100);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Summary */}
      <div className="card-glass" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp color="var(--emerald-primary)" size={24} /> Long-Term Wealth Growth Forecast
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Project how your monthly <b>{investPct}% Investment</b> ({formatCurrency(monthlyInvestVal, currency)}/mo) and <b>{emergencyPct}% Savings</b> ({formatCurrency(monthlyEmergencyVal, currency)}/mo) compound over time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Investment</span>
            <div className="tabular-num" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--c-invest)' }}>
              {formatCurrency(monthlyInvestVal, currency)}/mo
            </div>
          </div>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Emergency</span>
            <div className="tabular-num" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--c-emergency)' }}>
              {formatCurrency(monthlyEmergencyVal, currency)}/mo
            </div>
          </div>
        </div>
      </div>

      {/* Return Rate Customizers */}
      <div className="card-glass" style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        {/* Investment Return Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Expected Investment Return (Annual %):
            </label>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--c-invest)' }}>
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
            style={{ width: '100%', accentColor: 'var(--c-invest)', cursor: 'pointer' }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Standard stock index funds / mutual funds historically deliver 8%–12% average annual growth.
          </p>
        </div>

        {/* Emergency Return Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Emergency Savings Interest (Annual %):
            </label>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--c-emergency)' }}>
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
            style={{ width: '100%', accentColor: 'var(--c-emergency)', cursor: 'pointer' }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            High-yield savings accounts or money market accounts typically yield 4%–7% interest.
          </p>
        </div>

      </div>

      {/* Projection Milestone Cards (1, 5, 10, 20, 30 years) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px' }}>
        {timeframes.map((yrs) => {
          const invRes = calculateFV(monthlyInvestVal, investReturnRate, yrs);
          const savRes = calculateFV(monthlyEmergencyVal, savingsReturnRate, yrs);
          const combinedTotal = invRes.total + savRes.total;
          const combinedPrincipal = invRes.principal + savRes.principal;
          const combinedInterest = invRes.interest + savRes.interest;

          return (
            <div key={yrs} className="card-glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge" style={{ background: 'var(--bg-surface-elevated)', color: 'var(--emerald-primary)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                  {yrs} {yrs === 1 ? 'Year' : 'Years'} Horizon
                </span>
                <Award size={18} color="var(--emerald-primary)" />
              </div>

              {/* Combined Total */}
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Total Wealth Accumulated
                </span>
                <div className="tabular-num" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginTop: '2px' }}>
                  {formatCurrency(combinedTotal, currency)}
                </div>
              </div>

              {/* Breakdown List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }} className="tabular-num">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--c-invest)' }}>Investing Portfolio:</span>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(invRes.total, currency)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--c-emergency)' }}>Emergency Cushion:</span>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(savRes.total, currency)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-subtle)', paddingTop: '6px', marginTop: '2px' }}>
                  <span style={{ color: 'var(--emerald-primary)' }}>Compound Interest Earned:</span>
                  <span style={{ fontWeight: 800, color: 'var(--emerald-primary)' }}>+{formatCurrency(combinedInterest, currency)}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* 30-Year Deep Growth Highlight Banner */}
      {(() => {
        const yr30 = calculateFV(monthlyInvestVal, investReturnRate, 30);
        return (
          <div className="card-glass" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(99, 102, 241, 0.12))', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: 'var(--emerald-primary)', display: 'grid', placeItems: 'center', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)' }}>
                <Zap size={28} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  The Magic of Compound Interest (30-Year Milestone)
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  By consistently investing <b>{formatCurrency(monthlyInvestVal, currency)}</b> every month for 30 years at {investReturnRate}%, your contributions of {formatCurrency(yr30.principal, currency)} will yield an extra <b>+{formatCurrency(yr30.interest, currency)}</b> purely in compound returns!
                </p>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
