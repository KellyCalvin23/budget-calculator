import React, { useState } from 'react';
import { formatCurrency, CURRENCIES } from '../utils/currency';
import { Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

export default function ItemizedPlanner({ monthlyIncome, currency, activeBuckets }) {
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

  // Compute category totals dynamically
  const categoryTotals = {};
  activeBuckets.forEach(b => {
    categoryTotals[b.id] = expenses
      .filter(e => e.categoryId === b.id)
      .reduce((sum, e) => sum + e.amount, 0);
  });

  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  // Handle addition
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newItemName.trim() || isNaN(newItemAmount) || parseFloat(newItemAmount) <= 0) return;
    
    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        name: newItemName.trim(),
        amount: parseFloat(newItemAmount),
        categoryId: newItemCategory || activeBuckets[0]?.id
      }
    ]);
    setNewItemName('');
    setNewItemAmount('');
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Info Banner */}
      <div className="card-glass" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Itemized Expense Checker
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Track actual monthly line-item expenditures against active target budget limits.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Itemized Spent
          </span>
          <div className="tabular-num" style={{ fontSize: '1.5rem', fontWeight: 800, color: totalSpent > monthlyIncome ? 'var(--rose-primary)' : 'var(--emerald-primary)' }}>
            {formatCurrency(totalSpent, currency)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Monthly Budget Cap: {formatCurrency(monthlyIncome, currency)}
          </span>
        </div>
      </div>

      {/* Target Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`, gap: '16px' }}>
        {activeBuckets.map((cat) => {
          const spent = categoryTotals[cat.id] || 0;
          const target = monthlyIncome * (cat.pct / 100);
          const diff = target - spent;
          const isOver = spent > target;

          return (
            <div key={cat.id} className="card-glass" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: cat.color }}>
                  {cat.name} ({cat.pct}%)
                </span>
                {isOver ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--rose-primary)', fontSize: '0.725rem', fontWeight: 700 }}>
                    <AlertCircle size={13} /> Over
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--emerald-primary)', fontSize: '0.725rem', fontWeight: 700 }}>
                    <CheckCircle size={13} /> OK
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div style={{ height: '6px', background: 'var(--bg-surface-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${Math.min(100, target > 0 ? (spent / target) * 100 : 0)}%`, 
                  background: isOver ? 'var(--rose-primary)' : cat.color,
                  borderRadius: '3px',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              {/* Values */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }} className="tabular-num">
                <span style={{ color: 'var(--text-secondary)' }}>Spent: <b>{formatCurrency(spent, currency)}</b></span>
                <span style={{ color: 'var(--text-muted)' }}>Cap: <b>{formatCurrency(target, currency)}</b></span>
              </div>

              {/* Variance Tag */}
              <div style={{ marginTop: 'auto', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', fontWeight: 700 }}>
                {isOver ? (
                  <span style={{ color: 'var(--rose-primary)' }}>
                    +{formatCurrency(Math.abs(diff), currency)} over cap
                  </span>
                ) : (
                  <span style={{ color: 'var(--emerald-primary)' }}>
                    {formatCurrency(diff, currency)} under cap
                  </span>
                )}
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
                placeholder="e.g. Internet, Gym, Moto, Rent"
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
                Category Bucket
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
              <Plus size={16} /> Add Expense
            </button>
          </form>
        </div>

        {/* Expense List Table */}
        <div className="card-glass" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
            Current Itemized List ({expenses.length})
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
                      title="Remove expense"
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
