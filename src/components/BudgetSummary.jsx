import React, { useState } from 'react';
import { formatCurrency, PAY_FREQUENCIES, CURRENCIES } from '../utils/currency';
import { BUDGET_RULES, PRESET_COLORS } from '../utils/rules';
import { Plus, Trash2, Scale, BookmarkPlus, Check, X } from 'lucide-react';

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
  customBuckets,
  setCustomBuckets,
  savedCustomRules = [],
  onSaveCustomRule,
  onDeleteCustomRule,
  activeBuckets
}) {
  const [hoveredBucketId, setHoveredBucketId] = useState(null);
  
  // Custom preset saving state
  const [presetNameInput, setPresetNameInput] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Active currency details
  const currDetails = CURRENCIES[currency] || CURRENCIES.RWF;

  // Preset amounts tailored to currency
  const presets = currency === 'RWF' 
    ? [300000, 600000, 1200000, 2500000, 5000000]
    : [2000, 3500, 5000, 8000, 12000];

  // Active rule description
  const getRuleDescription = () => {
    if (selectedRuleId === 'custom') {
      return 'Create your own custom percentage allocations below and save them as presets!';
    }
    const builtIn = BUDGET_RULES[selectedRuleId];
    if (builtIn) return builtIn.description;
    const userSaved = savedCustomRules.find(r => r.id === selectedRuleId);
    if (userSaved) return userSaved.description || `Saved Custom Preset: ${userSaved.name}`;
    return 'Custom budget distribution.';
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

  // Custom bucket handlers
  const handleUpdateBucketName = (id, newName) => {
    setCustomBuckets(customBuckets.map(b => b.id === id ? { ...b, name: newName } : b));
  };

  const handleUpdateBucketPct = (id, newPct) => {
    const val = Math.max(0, Math.min(100, parseInt(newPct) || 0));
    setCustomBuckets(customBuckets.map(b => b.id === id ? { ...b, pct: val } : b));
  };

  const handleUpdateBucketColor = (id, newColor) => {
    setCustomBuckets(customBuckets.map(b => b.id === id ? { ...b, color: newColor } : b));
  };

  const handleAddCustomBucket = () => {
    const newId = 'custom-' + Date.now();
    // Find first color from PRESET_COLORS not used in existing buckets
    const usedColors = new Set(customBuckets.map(b => (b.color || '').toLowerCase()));
    let nextColor = PRESET_COLORS.find(c => !usedColors.has(c.toLowerCase()));
    if (!nextColor) {
      const colorIdx = customBuckets.length % PRESET_COLORS.length;
      nextColor = PRESET_COLORS[colorIdx];
    }

    setCustomBuckets([
      ...customBuckets,
      {
        id: newId,
        name: `Category ${customBuckets.length + 1}`,
        pct: 10,
        color: nextColor,
        desc: 'Custom Category'
      }
    ]);
  };

  const handleDeleteCustomBucket = (id) => {
    if (customBuckets.length <= 1) return;
    setCustomBuckets(customBuckets.filter(b => b.id !== id));
  };

  const handleAutoBalance = () => {
    const total = customBuckets.reduce((sum, b) => sum + b.pct, 0);
    if (total === 0) return;
    let accumulated = 0;
    const balanced = customBuckets.map((b, idx) => {
      if (idx === customBuckets.length - 1) {
        return { ...b, pct: Math.max(0, 100 - accumulated) };
      }
      const newPct = Math.round((b.pct / total) * 100);
      accumulated += newPct;
      return { ...b, pct: newPct };
    });
    setCustomBuckets(balanced);
  };

  const handleSavePresetForm = (e) => {
    e.preventDefault();
    if (!presetNameInput.trim()) return;
    
    // Auto-balance if sum is not 100
    const totalSum = customBuckets.reduce((sum, b) => sum + b.pct, 0);
    let finalBuckets = customBuckets;
    if (totalSum !== 100) {
      handleAutoBalance();
    }

    onSaveCustomRule(presetNameInput.trim(), finalBuckets);
    setPresetNameInput('');
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const customSum = customBuckets.reduce((sum, b) => sum + b.pct, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
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

        {/* Rule Switcher Bar with Built-In Rules + User Saved Presets */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', overflowX: 'auto', paddingBottom: '4px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Rule:</span>
            <div className="segmented-control" style={{ display: 'flex', flexWrap: 'nowrap', gap: '4px' }}>
              
              {/* Built-In Rules */}
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

              {/* User Saved Presets */}
              {savedCustomRules.map((rule) => (
                <div 
                  key={rule.id}
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <button
                    type="button"
                    className={`segmented-btn ${selectedRuleId === rule.id ? 'active' : ''}`}
                    onClick={() => setSelectedRuleId(rule.id)}
                    style={{ paddingRight: '6px' }}
                  >
                    ★ {rule.name}
                  </button>

                  {/* Delete User Preset Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCustomRule(rule.id);
                    }}
                    title={`Delete preset "${rule.name}"`}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: '4px'
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {/* Custom Builder Button */}
              <button
                type="button"
                className={`segmented-btn ${selectedRuleId === 'custom' ? 'active' : ''}`}
                onClick={() => setSelectedRuleId('custom')}
              >
                + Custom Builder
              </button>
            </div>
          </div>

          <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', width: '100%' }}>
            {getRuleDescription()}
          </p>

        </div>

        {/* Dynamic Custom Category Builder & Save Preset Form */}
        {selectedRuleId === 'custom' && (
          <div style={{ marginTop: '18px', padding: '18px', background: 'var(--bg-surface-elevated)', borderRadius: '16px', border: '1px dashed var(--emerald-primary)' }}>
            
            {/* Top Bar: Title & Auto-Balance */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--emerald-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Custom Rule Builder ({customBuckets.length} categories)
              </span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 800, 
                  padding: '4px 10px', 
                  borderRadius: '999px',
                  background: customSum === 100 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                  color: customSum === 100 ? 'var(--emerald-primary)' : 'var(--rose-primary)',
                  border: customSum === 100 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)'
                }}>
                  Total: {customSum}% {customSum !== 100 && '(Must equal 100%)'}
                </span>

                <button
                  type="button"
                  onClick={handleAutoBalance}
                  style={{
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Scale percentages proportionally to sum to 100%"
                >
                  <Scale size={14} /> Auto-Balance
                </button>
              </div>
            </div>

            {/* List of Custom Categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {customBuckets.map((b) => (
                <div 
                  key={b.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
                    gap: '12px',
                    alignItems: 'center',
                    background: 'var(--bg-surface)',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {/* Category Name Input & Color Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: 1, minWidth: '220px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      flexWrap: 'wrap', 
                      padding: '4px 6px',
                      background: 'var(--bg-surface-elevated)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      {(() => {
                        const visibleCount = Math.min(PRESET_COLORS.length, customBuckets.length + 2);
                        let swatches = PRESET_COLORS.slice(0, visibleCount);
                        if (b.color && PRESET_COLORS.includes(b.color) && !swatches.includes(b.color)) {
                          swatches = [...swatches, b.color];
                        }
                        return swatches.map((c) => (
                          <span
                            key={c}
                            onClick={() => handleUpdateBucketColor(b.id, c)}
                            title={`Select color ${c}`}
                            style={{
                              width: '13px',
                              height: '13px',
                              borderRadius: '50%',
                              background: c,
                              cursor: 'pointer',
                              outline: (b.color || '').toLowerCase() === c.toLowerCase() ? '2px solid #fff' : 'none',
                              boxShadow: (b.color || '').toLowerCase() === c.toLowerCase() ? `0 0 6px ${c}` : 'none',
                              transition: 'all 0.15s ease'
                            }}
                          />
                        ));
                      })()}

                      {/* Custom Color Wheel Picker */}
                      <label title="Pick custom color" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', margin: 0, position: 'relative' }}>
                        <input 
                          type="color"
                          value={b.color || '#10b981'}
                          onChange={(e) => handleUpdateBucketColor(b.id, e.target.value)}
                          style={{
                            position: 'absolute',
                            opacity: 0,
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{
                          width: '13px',
                          height: '13px',
                          borderRadius: '50%',
                          background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                          display: 'inline-block',
                          border: '1px solid rgba(255,255,255,0.7)',
                          boxShadow: '0 0 3px rgba(0,0,0,0.5)',
                          cursor: 'pointer'
                        }} />
                      </label>
                    </div>

                    <input 
                      type="text"
                      value={b.name}
                      onChange={(e) => handleUpdateBucketName(b.id, e.target.value)}
                      placeholder="Category Name"
                      className="input-field"
                      style={{ padding: '6px 12px', fontSize: '0.875rem', fontWeight: 700, flex: 1, minWidth: '120px' }}
                    />
                  </div>

                  {/* Percentage Slider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={b.pct}
                      onChange={(e) => handleUpdateBucketPct(b.id, e.target.value)}
                      style={{ flex: 1, accentColor: b.color, cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: b.color, minWidth: '40px', textAlign: 'right' }}>
                      {b.pct}%
                    </span>
                  </div>

                  {/* Delete Button */}
                  {customBuckets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomBucket(b.id)}
                      title="Delete category"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--rose-primary)',
                        cursor: 'pointer',
                        padding: '6px',
                        display: 'grid',
                        placeItems: 'center'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Actions: Add Category + Save Preset Form */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              
              <button
                type="button"
                onClick={handleAddCustomBucket}
                style={{
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} color="var(--emerald-primary)" /> Add Category
              </button>

              {/* Save Preset Form */}
              <form onSubmit={handleSavePresetForm} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <input 
                  type="text"
                  placeholder="Preset Name (e.g. Student Budget)"
                  value={presetNameInput}
                  onChange={(e) => setPresetNameInput(e.target.value)}
                  className="input-field"
                  style={{ padding: '6px 12px', fontSize: '0.8125rem', width: '220px' }}
                  required
                />
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <BookmarkPlus size={16} /> Save Rule Preset
                </button>

                {showSaveSuccess && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--emerald-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={14} /> Preset Saved!
                  </span>
                )}
              </form>

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

        {/* Dynamic Progress Bar */}
        <div className="progress-bar-container">
          {activeBuckets.map((b) => {
            const bucketVal = (monthlyBase * (b.pct / 100));
            const activeVal = period === 'annual' ? bucketVal * 12 : period === 'paycheck' ? (bucketVal * 12) / periodsPerYr : bucketVal;

            return (
              <div 
                key={b.id}
                className="progress-seg"
                style={{ 
                  flex: b.pct > 0 ? b.pct : 0.001,
                  background: b.color,
                  opacity: hoveredBucketId && hoveredBucketId !== b.id ? 0.45 : 1,
                  padding: '4px 2px',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={() => setHoveredBucketId(b.id)}
                onMouseLeave={() => setHoveredBucketId(null)}
              >
                {b.pct > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1px', width: '100%', overflow: 'hidden', color: '#fff' }}>
                    
                    {/* Category Label */}
                    <span className="seg-label" style={{ 
                      fontSize: b.pct < 10 ? '0.6rem' : '0.725rem', 
                      fontWeight: 800, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.03em', 
                      opacity: 0.95,
                      lineHeight: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {b.name}
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

        {/* Dynamic Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          {activeBuckets.map((b) => (
            <div 
              key={b.id}
              onMouseEnter={() => setHoveredBucketId(b.id)}
              onMouseLeave={() => setHoveredBucketId(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                opacity: hoveredBucketId && hoveredBucketId !== b.id ? 0.45 : 1,
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

      {/* Dynamic Category Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`, gap: '16px' }}>
        {activeBuckets.map((b) => {
          const mBucketVal = monthlyBase * (b.pct / 100);
          const yBucketVal = mBucketVal * 12;
          const pcBucketVal = yBucketVal / periodsPerYr;

          const isHovered = hoveredBucketId === b.id;

          return (
            <div 
              key={b.id} 
              className="card-glass animate-fade-in"
              onMouseEnter={() => setHoveredBucketId(b.id)}
              onMouseLeave={() => setHoveredBucketId(null)}
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
                    {b.desc || `${b.pct}% allocation cap`}
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
