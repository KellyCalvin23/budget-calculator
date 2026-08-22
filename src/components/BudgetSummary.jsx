import React, { useState } from 'react';
import { formatCurrency, PAY_FREQUENCIES, CURRENCIES } from '../utils/currency';
import { BUDGET_RULES } from '../utils/rules';
import { Info, HelpCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function BudgetSummary({ 
  income, 
  setIncome, 
  currency, 
  period, 
  setPeriod, 
  freq, 
  setFreq, 
  selectedRuleId, 
  setSelectedRuleId,
  customRatios,
  setCustomRatios
}) {
  const [hoveredBucket, setHoveredBucket] = useState(null);

  // Active currency details
  const currDetails = CURRENCIES[currency] || CURRENCIES.RWF;

  // Preset amounts tailored to currency
  const presets = currency === 'RWF' 
    ? [300000, 600000, 1200000, 2500000, 5000000]
    : [2000, 3500, 5000, 8000, 12000];

  // Active rule definition
  const currentRuleDef = BUDGET_RULES[selectedRuleId] || BUDGET_RULES['50-15-5-30'];

  // Resolve percentages from rule or custom
  const getBucketPct = (bucketId) => {
    if (selectedRuleId === 'custom') {
      return customRatios[bucketId] || 25;
    }
    const b = currentRuleDef.buckets.find(item => item.id === bucketId);
    return b ? b.pct : 25;
  };

  // Convert raw income into normalized monthly base
  const rawIncome = parseFloat(income) || 0;
  const periodsPerYr = PAY_FREQUENCIES[freq]?.periodsPerYear || 12;

  let monthlyBase = rawIncome;
  if (period === 'annual') {
    monthlyBase = rawIncome / 12;
  } else if (period === 'paycheck') {
    monthlyBase = (rawIncome * periodsPerYr) / 12;
  }

  const annualTotal = monthlyBase * 12;
  const paycheckTotal = annualTotal / periodsPerYr;

  // Buckets configuration
  const buckets = [
    { id: 'needs', key: '50', name: 'Must-Haves & Needs', color: 'var(--c-needs)', desc: 'Housing, rent, utilities, food, transport & debt payments' },
    { id: 'invest', key: '15', name: 'Retirement & Investing', color: 'var(--c-invest)', desc: 'Stocks, mutual funds, real estate & wealth building' },
    { id: 'emergency', key: '5', name: 'Emergency Savings', color: 'var(--c-emergency)', desc: 'Rainy-day liquid savings & safety cushion' },
    { id: 'wants', key: '30', name: 'Wants & Lifestyle', color: 'var(--c-wants)', desc: 'Dining out, travel, entertainment & hobbies' }
  ].map(b => ({
    ...b,
    pct: getBucketPct(b.id)
  }));

  // Total custom ratio check
  const customSum = Object.values(customRatios).reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Input Controls Card */}
      <div className="card-glass" style={{ padding: '24px' }}>
        
        {/* Top Controls Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', alignItems: 'end' }}>
          
          {/* Income Amount */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Take-Home Income ({currency})
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                position: 'absolute', 
                left: '14px', 
                fontWeight: 800, 
                color: 'var(--emerald-primary)',
                fontSize: '1.05rem' 
              }}>
                {currDetails.symbol}
              </span>
              <input 
                type="number"
                min="0"
                step="any"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="0"
                className="input-field tabular-num"
                style={{ paddingLeft: '50px' }}
              />
            </div>
            
            {/* Presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {presets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setIncome(val.toString())}
                  style={{
                    background: income === val.toString() ? 'var(--emerald-primary)' : 'var(--bg-surface-elevated)',
                    color: income === val.toString() ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '0.725rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {formatCurrency(val, currency)}
                </button>
              ))}
            </div>
          </div>

          {/* Income Input Period */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Income Frequency Entered
            </label>
            <div className="segmented-control" style={{ width: '100%' }}>
              <button 
                type="button"
                className={`segmented-btn ${period === 'paycheck' ? 'active' : ''}`}
                onClick={() => setPeriod('paycheck')}
                style={{ flex: 1, textAlign: 'center' }}
              >
                Paycheck
              </button>
              <button 
                type="button"
                className={`segmented-btn ${period === 'monthly' ? 'active' : ''}`}
                onClick={() => setPeriod('monthly')}
                style={{ flex: 1, textAlign: 'center' }}
              >
                Monthly
              </button>
              <button 
                type="button"
                className={`segmented-btn ${period === 'annual' ? 'active' : ''}`}
                onClick={() => setPeriod('annual')}
                style={{ flex: 1, textAlign: 'center' }}
              >
                Annual
              </button>
            </div>
          </div>

          {/* Pay Schedule / Frequency */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Pay Schedule
            </label>
            <select
              value={freq}
              onChange={(e) => setFreq(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.875rem', padding: '10px 14px' }}
            >
              {Object.entries(PAY_FREQUENCIES).map(([key, item]) => (
                <option key={key} value={key} style={{ background: 'var(--bg-surface)' }}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Rule Switcher Bar */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', overflowX: 'auto' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Rule:</span>
            <div className="segmented-control">
              {Object.values(BUDGET_RULES).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`segmented-btn ${selectedRuleId === r.id ? 'active' : ''}`}
                  onClick={() => setSelectedRuleId(r.id)}
                >
                  {r.id.toUpperCase().replace(/-/g, '/')}
                </button>
              ))}
              <button
                type="button"
                className={`segmented-btn ${selectedRuleId === 'custom' ? 'active' : ''}`}
                onClick={() => setSelectedRuleId('custom')}
              >
                Custom
              </button>
            </div>
          </div>

          <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', width: '100%' }}>
            {selectedRuleId === 'custom' 
              ? 'Adjust sliders below to create custom ratio allocations.' 
              : currentRuleDef.description}
          </p>

        </div>

        {/* Custom Sliders Panel (If custom rule selected) */}
        {selectedRuleId === 'custom' && (
          <div style={{ marginTop: '16px', padding: '14px', background: 'var(--bg-surface-elevated)', borderRadius: '14px', border: '1px dashed var(--emerald-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--emerald-primary)' }}>
                Customize Ratios
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: customSum === 100 ? 'var(--emerald-primary)' : 'var(--rose-primary)' }}>
                Total: {customSum}% {customSum !== 100 && '(Must = 100%)'}
              </span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {buckets.map((b) => (
                <div key={b.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '2px' }}>
                    <span>{b.name}</span>
                    <span style={{ color: b.color }}>{customRatios[b.id] || 0}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={customRatios[b.id] || 0}
                    onChange={(e) => setCustomRatios({ ...customRatios, [b.id]: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', accentColor: b.color, cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Visual Proportion Bar Card */}
      <div className="card-glass" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Allocation Breakdown
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--emerald-primary)' }} className="tabular-num">
            {period === 'monthly' && `Monthly: ${formatCurrency(monthlyBase, currency)}`}
            {period === 'paycheck' && `Paycheck: ${formatCurrency(paycheckTotal, currency)}`}
            {period === 'annual' && `Annual: ${formatCurrency(annualTotal, currency)}`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          {buckets.map((b) => {
            const bucketVal = (monthlyBase * (b.pct / 100));
            const activeVal = period === 'annual' ? bucketVal * 12 : period === 'paycheck' ? (bucketVal * 12) / periodsPerYr : bucketVal;
            
            const shortLabels = {
              needs: 'Needs',
              invest: 'Invest',
              emergency: 'Savings',
              wants: 'Wants'
            };

            return (
              <div 
                key={b.id}
                className={`progress-seg seg-${b.id}`}
                style={{ 
                  flex: b.pct > 0 ? b.pct : 0.001,
                  opacity: hoveredBucket && hoveredBucket !== b.id ? 0.45 : 1,
                  padding: '4px 2px',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={() => setHoveredBucket(b.id)}
                onMouseLeave={() => setHoveredBucket(null)}
              >
                {b.pct > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1px', width: '100%', overflow: 'hidden' }}>
                    
                    {/* Category Label */}
                    <span className="seg-label" style={{ 
                      fontSize: b.pct < 10 ? '0.6rem' : '0.7rem', 
                      fontWeight: 800, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.03em', 
                      opacity: 0.9,
                      lineHeight: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {shortLabels[b.id]}
                    </span>

                    {/* Percentage */}
                    <span className="seg-pct" style={{ 
                      fontSize: b.pct < 10 ? '0.85rem' : '1.05rem', 
                      fontWeight: 800, 
                      lineHeight: 1 
                    }}>
                      {b.pct}%
                    </span>

                    {/* Formatted Amount */}
                    <span className="seg-val tabular-num" style={{ 
                      fontSize: b.pct < 10 ? '0.625rem' : '0.725rem', 
                      fontWeight: 700, 
                      opacity: 0.95,
                      lineHeight: 1
                    }}>
                      {formatCurrency(activeVal, currency)}
                    </span>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          {buckets.map((b) => (
            <div 
              key={b.id}
              onMouseEnter={() => setHoveredBucket(b.id)}
              onMouseLeave={() => setHoveredBucket(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                opacity: hoveredBucket && hoveredBucket !== b.id ? 0.45 : 1,
                transition: 'opacity 0.2s ease'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: b.color, display: 'inline-block' }} />
              <span style={{ fontSize: '0.78125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {b.name} <span style={{ color: b.color }}>({b.pct}%)</span>
              </span>
            </div>
          ))}
        </div>
        
      </div>

      {/* 4 Category Breakdown Cards */}
      <div className="grid-4">
        {buckets.map((b) => {
          const mBucketVal = monthlyBase * (b.pct / 100);
          const yBucketVal = mBucketVal * 12;
          const pcBucketVal = yBucketVal / periodsPerYr;

          const isHovered = hoveredBucket === b.id;

          return (
            <div 
              key={b.id} 
              className="card-glass animate-fade-in"
              onMouseEnter={() => setHoveredBucket(b.id)}
              onMouseLeave={() => setHoveredBucket(null)}
              style={{ 
                padding: '20px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '14px',
                borderColor: isHovered ? b.color : 'var(--border-subtle)',
                boxShadow: isHovered ? `0 0 20px ${b.color}25` : 'var(--shadow-lg)',
                transform: isHovered ? 'translateY(-2px)' : 'none'
              }}
            >
              
              {/* Header Badge & Name */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ 
                  background: b.color, 
                  color: '#fff', 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '12px', 
                  display: 'grid', 
                  placeItems: 'center', 
                  fontWeight: 800, 
                  fontSize: '0.95rem',
                  flexShrink: 0,
                  boxShadow: `0 4px 10px ${b.color}40`
                }}>
                  {b.pct}%
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {b.name}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.25 }}>
                    {b.desc}
                  </p>
                </div>
              </div>

              {/* Table Rows for Cadences */}
              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                
                {/* Per Paycheck */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '6px 8px',
                  borderRadius: '8px',
                  background: period === 'paycheck' ? 'var(--bg-surface-elevated)' : 'transparent',
                  border: period === 'paycheck' ? `1px solid ${b.color}40` : '1px solid transparent'
                }}>
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: period === 'paycheck' ? b.color : 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Paycheck
                  </span>
                  <span className="tabular-num" style={{ fontWeight: 700, fontSize: period === 'paycheck' ? '1.05rem' : '0.875rem', color: period === 'paycheck' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {formatCurrency(pcBucketVal, currency)}
                  </span>
                </div>

                {/* Per Month */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '6px 8px',
                  borderRadius: '8px',
                  background: period === 'monthly' ? 'var(--bg-surface-elevated)' : 'transparent',
                  border: period === 'monthly' ? `1px solid ${b.color}40` : '1px solid transparent'
                }}>
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: period === 'monthly' ? b.color : 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Month
                  </span>
                  <span className="tabular-num" style={{ fontWeight: 700, fontSize: period === 'monthly' ? '1.05rem' : '0.875rem', color: period === 'monthly' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {formatCurrency(mBucketVal, currency)}
                  </span>
                </div>

                {/* Per Year */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '6px 8px',
                  borderRadius: '8px',
                  background: period === 'annual' ? 'var(--bg-surface-elevated)' : 'transparent',
                  border: period === 'annual' ? `1px solid ${b.color}40` : '1px solid transparent'
                }}>
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: period === 'annual' ? b.color : 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Year
                  </span>
                  <span className="tabular-num" style={{ fontWeight: 700, fontSize: period === 'annual' ? '1.05rem' : '0.875rem', color: period === 'annual' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {formatCurrency(yBucketVal, currency)}
                  </span>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Summary Footer Box */}
      <div className="card-glass" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
            Allocation Summary
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Calculated in {currDetails.name} ({currency}).
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Active Income Total
          </span>
          <div className="tabular-num" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--emerald-primary)' }}>
            {period === 'monthly' && formatCurrency(monthlyBase, currency)}
            {period === 'paycheck' && formatCurrency(paycheckTotal, currency)}
            {period === 'annual' && formatCurrency(annualTotal, currency)}
          </div>
        </div>
      </div>

    </div>
  );
}
