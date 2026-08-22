import React, { useState } from 'react';
import { formatCurrency, CURRENCIES } from '../utils/currency';
import { Plus, Trash2, AlertCircle, CheckCircle, ArrowUpRight } from 'lucide-react';

export default function ItemizedPlanner({ monthlyIncome, currency, ruleBucketPcts }) {
  // Pre-populated default sample expenses tailored to Rwandan Franc / General user
  const initialExpenses = currency === 'RWF' ? [
    { id: 1, name: 'House Rent (Kigali)', amount: 250000, category: 'needs' },
    { id: 2, name: 'Groceries & Food', amount: 120000, category: 'needs' },
    { id: 3, name: 'REG Electricity & Water', amount: 30000, category: 'needs' },
    { id: 4, name: 'Moto & Taxi Transport', amount: 50000, category: 'needs' },
    { id: 5, name: 'RNIT Mutual Fund / Shares', amount: 150000, category: 'invest' },
    { id: 6, name: 'Bank Emergency Deposit', amount: 50000, category: 'emergency' },
    { id: 7, name: 'Dining Out & Entertainment', amount: 100000, category: 'wants' },
  ] : [
    { id: 1, name: 'Apartment Rent', amount: 1500, category: 'needs' },
    { id: 2, name: 'Groceries & Household', amount: 600, category: 'needs' },
    { id: 3, name: 'Utilities & Internet', amount: 200, category: 'needs' },
    { id: 4, name: 'Index Fund Investment', amount: 750, category: 'invest' },
    { id: 5, name: 'High-Yield Emergency Savings', amount: 250, category: 'emergency' },
    { id: 6, name: 'Dining & Outings', amount: 400, category: 'wants' },
  ];

  const [expenses, setExpenses] = useState(initialExpenses);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('needs');

  // Handle item addition
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newItemName.trim() || isNaN(newItemAmount) || parseFloat(newItemAmount) <= 0) return;
    
    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        name: newItemName.trim(),
        amount: parseFloat(newItemAmount),
        category: newItemCategory
      }
    ]);
    setNewItemName('');
    setNewItemAmount('');
  };

  // Handle item deletion
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Compute category totals
  const categoryTotals = {
    needs: expenses.filter(e => e.category === 'needs').reduce((sum, e) => sum + e.amount, 0),
    invest: expenses.filter(e => e.category === 'invest').reduce((sum, e) => sum + e.amount, 0),
    emergency: expenses.filter(e => e.category === 'emergency').reduce((sum, e) => sum + e.amount, 0),
    wants: expenses.filter(e => e.category === 'wants').reduce((sum, e) => sum + e.amount, 0)
  };

  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  // Targets from monthly income
  const targets = {
    needs: monthlyIncome * ((ruleBucketPcts.needs || 50) / 100),
    invest: monthlyIncome * ((ruleBucketPcts.invest || 15) / 100),
    emergency: monthlyIncome * ((ruleBucketPcts.emergency || 5) / 100),
    wants: monthlyIncome * ((ruleBucketPcts.wants || 30) / 100)
  };

  const categories = [
    { id: 'needs', name: 'Must-Haves & Needs', pct: ruleBucketPcts.needs || 50, color: 'var(--c-needs)' },
    { id: 'invest', name: 'Retirement & Investing', pct: ruleBucketPcts.invest || 15, color: 'var(--c-invest)' },
    { id: 'emergency', name: 'Emergency Savings', pct: ruleBucketPcts.emergency || 5, color: 'var(--c-emergency)' },
    { id: 'wants', name: 'Wants & Lifestyle', pct: ruleBucketPcts.wants || 30, color: 'var(--c-wants)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Info Banner */}
      <div className="card-glass" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Itemized Expense Checker
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Compare your actual individual monthly expenses in {currency} against target 50/15/5/30 guidelines.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Itemized Spent
          </span>
          <div className="tabular-num" style={{ fontSize: '1.65rem', fontWeight: 800, color: totalSpent > monthlyIncome ? 'var(--rose-primary)' : 'var(--emerald-primary)' }}>
            {formatCurrency(totalSpent, currency)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Target Monthly Cap: {formatCurrency(monthlyIncome, currency)}
          </span>
        </div>
      </div>

      {/* 4 Category Target Comparison Grid */}
      <div className="grid-4">
        {categories.map((cat) => {
          const spent = categoryTotals[cat.id] || 0;
          const target = targets[cat.id] || 0;
          const diff = target - spent;
          const isOver = spent > target;

          return (
            <div key={cat.id} className="card-glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: cat.color }}>
                  {cat.name} ({cat.pct}%)
                </span>
                {isOver ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--rose-primary)', fontSize: '0.75rem', fontWeight: 700 }}>
                    <AlertCircle size={14} /> Over Target
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--emerald-primary)', fontSize: '0.75rem', fontWeight: 700 }}>
                    <CheckCircle size={14} /> Within Limit
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div>
                <div style={{ height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${Math.min(100, target > 0 ? (spent / target) * 100 : 0)}%`, 
                    background: isOver ? 'var(--rose-primary)' : cat.color,
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              {/* Values */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }} className="tabular-num">
                <span style={{ color: 'var(--text-secondary)' }}>Spent: <b>{formatCurrency(spent, currency)}</b></span>
                <span style={{ color: 'var(--text-muted)' }}>Target: <b>{formatCurrency(target, currency)}</b></span>
              </div>

              {/* Variance Tag */}
              <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78125rem', fontWeight: 700 }}>
                {isOver ? (
                  <span style={{ color: 'var(--rose-primary)' }}>
                    Over target by {formatCurrency(Math.abs(diff), currency)}
                  </span>
                ) : (
                  <span style={{ color: 'var(--emerald-primary)' }}>
                    {formatCurrency(diff, currency)} remaining under target
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Line Item Form & Expense Table */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Form */}
        <div className="card-glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} color="var(--emerald-primary)" /> Add Custom Expense Item
          </h3>

          <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Expense Name / Label
              </label>
              <input 
                type="text" 
                placeholder="e.g. Internet subscription, Gym, Moto"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.95rem', padding: '10px 14px' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
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
                style={{ fontSize: '0.95rem', padding: '10px 14px' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Budget Bucket Category
              </label>
              <select 
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.95rem', padding: '10px 14px' }}
              >
                <option value="needs" style={{ background: 'var(--bg-surface)' }}>Must-Haves & Needs (50%)</option>
                <option value="invest" style={{ background: 'var(--bg-surface)' }}>Retirement & Investing (15%)</option>
                <option value="emergency" style={{ background: 'var(--bg-surface)' }}>Emergency Savings (5%)</option>
                <option value="wants" style={{ background: 'var(--bg-surface)' }}>Wants & Lifestyle (30%)</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Plus size={18} /> Add to Itemized List
            </button>
          </form>
        </div>

        {/* Expense List Table */}
        <div className="card-glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Current Itemized Expenditures ({expenses.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
            {expenses.map((exp) => {
              const catObj = categories.find(c => c.id === exp.category);
              return (
                <div 
                  key={exp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {exp.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: catObj?.color }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {catObj?.name}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span className="tabular-num" style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      {formatCurrency(exp.amount, currency)}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      title="Remove expense"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--rose-primary)',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '6px',
                        display: 'grid',
                        placeItems: 'center'
                      }}
                    >
                      <Trash2 size={16} />
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
