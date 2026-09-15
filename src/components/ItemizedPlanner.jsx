import React, { useState } from 'react';
import { formatCurrency, CURRENCIES } from '../utils/currency';
import { PRESET_COLORS } from '../utils/rules';
import { Plus, Trash2, AlertCircle, CheckCircle, FolderPlus, DollarSign, Wallet, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function ItemizedPlanner({ 
  monthlyIncome, 
  currency, 
  activeBuckets, 
  selectedRuleId, 
  setSelectedRuleId, 
  customBuckets, 
  setCustomBuckets 
}) {
  // Pre-populated default sample expenses
  const initialExpenses = currency === 'RWF' ? [
    { id: 1, name: 'House Rent (Kigali)', amount: 250000, categoryId: activeBuckets[0]?.id || 'b1' },
    { id: 2, name: 'Groceries & Food', amount: 120000, categoryId: activeBuckets[0]?.id || 'b1' },
    { id: 3, name: 'REG Electricity & Water', amount: 30000, categoryId: activeBuckets[0]?.id || 'b1' },
    { id: 4, name: 'RNIT Mutual Fund / Shares', amount: 150000, categoryId: activeBuckets[1]?.id || 'b2' },
    { id: 5, name: 'Bank Emergency Deposit', amount: 50000, categoryId: activeBuckets[2]?.id || 'b3' },
    { id: 6, name: 'Dining Out & Entertainment', amount: 100000, categoryId: activeBuckets[3]?.id || 'b4' },
  ] : [
    { id: 1, name: 'Apartment Rent', amount: 1500, categoryId: activeBuckets[0]?.id || 'b1' },
    { id: 2, name: 'Groceries & Household', amount: 600, categoryId: activeBuckets[0]?.id || 'b1' },
    { id: 3, name: 'Index Fund Investment', amount: 750, categoryId: activeBuckets[1]?.id || 'b2' },
    { id: 4, name: 'Emergency Savings', amount: 250, categoryId: activeBuckets[2]?.id || 'b3' },
    { id: 5, name: 'Dining & Outings', amount: 400, categoryId: activeBuckets[3]?.id || 'b4' },
  ];

  const [expenses, setExpenses] = useState(initialExpenses);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(activeBuckets[0]?.id || '');

  // Add Bucket modal/form toggle state
  const [isAddingBucket, setIsAddingBucket] = useState(false);
  const [newBucketName, setNewBucketName] = useState('');
  const [newBucketPct, setNewBucketPct] = useState('10');
  const [newBucketColor, setNewBucketColor] = useState(PRESET_COLORS[0]);

  // Compute category totals dynamically
  const categoryTotals = {};
  activeBuckets.forEach(b => {
    categoryTotals[b.id] = expenses
      .filter(e => e.categoryId === b.id)
      .reduce((sum, e) => sum + e.amount, 0);
  });

  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  const totalRemaining = monthlyIncome - totalSpent;

  // Handle adding individual item
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newItemName.trim() || isNaN(newItemAmount) || parseFloat(newItemAmount) <= 0) return;
    
    const catId = newItemCategory || activeBuckets[0]?.id;
    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        name: newItemName.trim(),
        amount: parseFloat(newItemAmount),
        categoryId: catId
      }
    ]);
    setNewItemName('');
    setNewItemAmount('');
  };

  // Handle deleting expense item
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Handle adding a brand new category bucket directly inside the tracker!
  const handleCreateNewBucket = (e) => {
    e.preventDefault();
    if (!newBucketName.trim()) return;

    const newId = 'custom-tracker-' + Date.now();
    const newBucketObj = {
      id: newId,
      name: newBucketName.trim(),
      pct: parseInt(newBucketPct) || 10,
      color: newBucketColor,
      desc: 'Custom Category Bucket'
    };

    // If custom mode isn't active, initialize customBuckets from activeBuckets first
    let updatedList = [];
    if (selectedRuleId !== 'custom') {
      updatedList = [...activeBuckets, newBucketObj];
      setSelectedRuleId('custom');
    } else {
      updatedList = [...customBuckets, newBucketObj];
    }

    setCustomBuckets(updatedList);
    setNewItemCategory(newId);
    setNewBucketName('');
    setIsAddingBucket(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Overview & Summary Metrics Header Banner */}
      <div className="card-glass" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Itemized Expense & Cap Tracker
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Track real-time spending vs. remaining budget allocations for every category bucket.
            </p>
          </div>

          <button
            onClick={() => setIsAddingBucket(!isAddingBucket)}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)'
            }}
          >
            <FolderPlus size={18} /> {isAddingBucket ? 'Cancel' : '+ Add Category Bucket'}
          </button>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          
          {/* Monthly Budget Cap */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Monthly Income
            </span>
            <div className="tabular-num" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {formatCurrency(monthlyIncome, currency)}
            </div>
          </div>

          {/* Amount Spent */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowDownRight size={14} color="var(--rose-primary)" /> Total Itemized Spent
            </span>
            <div className="tabular-num" style={{ fontSize: '1.35rem', fontWeight: 800, color: totalSpent > monthlyIncome ? 'var(--rose-primary)' : 'var(--text-primary)', marginTop: '2px' }}>
              {formatCurrency(totalSpent, currency)}
            </div>
          </div>

          {/* Amount Remaining */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpRight size={14} color="var(--emerald-primary)" /> Total Cash Remaining
            </span>
            <div className="tabular-num" style={{ fontSize: '1.35rem', fontWeight: 800, color: totalRemaining < 0 ? 'var(--rose-primary)' : 'var(--emerald-primary)', marginTop: '2px' }}>
              {formatCurrency(totalRemaining, currency)}
            </div>
          </div>

        </div>

        {/* Inline Add Category Bucket Panel */}
        {isAddingBucket && (
          <form 
            onSubmit={handleCreateNewBucket} 
            style={{ 
              marginTop: '18px', 
              padding: '18px', 
              background: 'var(--bg-surface-elevated)', 
              borderRadius: '16px', 
              border: '1.5px dashed var(--indigo-primary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--indigo-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FolderPlus size={16} /> Create New Category Bucket
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78125rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Bucket Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. School Fees, Charity, Side Biz"
                  value={newBucketName}
                  onChange={(e) => setNewBucketName(e.target.value)}
                  className="input-field"
                  style={{ padding: '8px 12px', fontSize: '0.875rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78125rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Allocation %
                </label>
                <input 
                  type="number" 
                  min="1"
                  max="100"
                  value={newBucketPct}
                  onChange={(e) => setNewBucketPct(e.target.value)}
                  className="input-field tabular-num"
                  style={{ padding: '8px 12px', fontSize: '0.875rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78125rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Category Color
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {PRESET_COLORS.map((c) => (
                    <span
                      key={c}
                      onClick={() => setNewBucketColor(c)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: c,
                        cursor: 'pointer',
                        outline: newBucketColor === c ? '2px solid #fff' : 'none',
                        outlineOffset: '2px'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsAddingBucket(false)}
                style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ background: 'var(--indigo-primary)', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Save Category Bucket
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Target Comparison Cards Grid with SPENT vs REMAINING */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(230px, 1fr))`, gap: '16px' }}>
        {activeBuckets.map((cat) => {
          const spent = categoryTotals[cat.id] || 0;
          const targetCap = monthlyIncome * (cat.pct / 100);
          const remaining = targetCap - spent;
          const isOver = spent > targetCap;
          const pctUsed = targetCap > 0 ? (spent / targetCap) * 100 : 0;

          return (
            <div 
              key={cat.id} 
              className="card-glass" 
              style={{ 
                padding: '20px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                borderColor: isOver ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-subtle)'
              }}
            >
              
              {/* Card Header: Category Name & Status Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color, display: 'inline-block', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                      {cat.name}
                    </h3>
                    <span style={{ fontSize: '0.725rem', color: cat.color, fontWeight: 700 }}>
                      {cat.pct}% Allocated Budget
                    </span>
                  </div>
                </div>

                {isOver ? (
                  <span style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--rose-primary)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '2px 8px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>
                    Over Budget
                  </span>
                ) : (
                  <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-primary)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>
                    On Track
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{ height: '7px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden', marginBottom: '4px' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${Math.min(100, pctUsed)}%`, 
                    background: isOver ? 'var(--rose-primary)' : cat.color,
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right', fontWeight: 600 }}>
                  {pctUsed.toFixed(0)}% of cap used
                </div>
              </div>

              {/* 3 Metric Line Items: CAP, SPENT, REMAINING */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--bg-surface-elevated)', padding: '10px 12px', borderRadius: '10px', fontSize: '0.8125rem' }} className="tabular-num">
                
                {/* 1. Allocated Cap */}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Allocated Budget Cap:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(targetCap, currency)}</span>
                </div>

                {/* 2. Amount Spent */}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Amount Spent:</span>
                  <span style={{ fontWeight: 800, color: spent > 0 ? (isOver ? 'var(--rose-primary)' : 'var(--text-primary)') : 'var(--text-muted)' }}>
                    {formatCurrency(spent, currency)}
                  </span>
                </div>

                {/* 3. Amount Remaining / Over Budget */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-subtle)', paddingTop: '6px', marginTop: '2px' }}>
                  <span style={{ fontWeight: 700, color: isOver ? 'var(--rose-primary)' : 'var(--emerald-primary)' }}>
                    {isOver ? 'Over Budget By:' : 'Amount Remaining:'}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: isOver ? 'var(--rose-primary)' : 'var(--emerald-primary)' }}>
                    {isOver ? `+${formatCurrency(Math.abs(remaining), currency)}` : formatCurrency(remaining, currency)}
                  </span>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Add New Line Item Form & Expense Table */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Form */}
        <div className="card-glass" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} color="var(--emerald-primary)" /> Add Expense Item
          </h3>

          <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78125rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Expense Item Name
              </label>
              <input 
                type="text" 
                placeholder="e.g. House Rent, Internet, Groceries, Moto"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.875rem', padding: '8px 12px' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78125rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Monthly Amount ({currency})
              </label>
              <input 
                type="number" 
                min="0"
                step="any"
                placeholder="0"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
                className="input-field tabular-num"
                style={{ fontSize: '0.875rem', padding: '8px 12px' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78125rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Assign to Category Bucket
              </label>
              <select 
                value={newItemCategory || activeBuckets[0]?.id || ''}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.875rem', padding: '8px 12px' }}
              >
                {activeBuckets.map(b => (
                  <option key={b.id} value={b.id} style={{ background: 'var(--bg-surface)' }}>
                    {b.name} ({b.pct}%)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} /> Add Expense Item
            </button>
          </form>
        </div>

        {/* Expense List Table */}
        <div className="card-glass" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
            Itemized Line Expenditures ({expenses.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
            {expenses.map((exp) => {
              const catObj = activeBuckets.find(c => c.id === exp.categoryId) || activeBuckets[0];
              return (
                <div 
                  key={exp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {exp.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: catObj?.color || '#10b981' }} />
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {catObj?.name || 'Category'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="tabular-num" style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {formatCurrency(exp.amount, currency)}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      title="Remove expense item"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--rose-primary)',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
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
