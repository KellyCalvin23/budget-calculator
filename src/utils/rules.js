export const BUDGET_RULES = {
  '50-15-5-30': {
    id: '50-15-5-30',
    name: '50/15/5/30 Rule (MoneyLetter Standard)',
    description: 'Balanced approach dividing income into Needs (50%), Long-term Investments (15%), Emergency Fund (5%), and Lifestyle/Wants (30%).',
    buckets: [
      { id: 'needs', name: 'Must-Haves & Needs', pct: 50, color: '#10b981', desc: 'Rent, food, transport, bills & debt' },
      { id: 'invest', name: 'Retirement & Investing', pct: 15, color: '#3b82f6', desc: 'Stocks, mutual funds, real estate & business' },
      { id: 'emergency', name: 'Emergency Savings', pct: 5, color: '#f59e0b', desc: 'Rainy-day liquid bank cushion' },
      { id: 'wants', name: 'Wants & Lifestyle', pct: 30, color: '#8b5cf6', desc: 'Dining out, entertainment, travel & hobbies' }
    ]
  },
  '50-30-20': {
    id: '50-30-20',
    name: '50/30/20 Rule (Classic Financial Plan)',
    description: 'Classic framework allocating 50% to essential needs, 30% to wants, and 20% to savings/investments.',
    buckets: [
      { id: 'needs', name: 'Essential Needs', pct: 50, color: '#10b981', desc: 'Housing, food, health & utilities' },
      { id: 'wants', name: 'Personal Wants', pct: 30, color: '#8b5cf6', desc: 'Shopping, entertainment & hobbies' },
      { id: 'savings', name: 'Savings & Investments', pct: 20, color: '#3b82f6', desc: 'Stocks, wealth, emergency fund & growth' }
    ]
  },
  '70-20-10': {
    id: '70-20-10',
    name: '70/20/10 Rule (High Cost-of-Living)',
    description: 'Designed for high essential expenses: 70% to living costs, 20% to savings, and 10% to investments.',
    buckets: [
      { id: 'needs', name: 'Living Expenses', pct: 70, color: '#10b981', desc: 'All mandatory bills & obligations' },
      { id: 'savings', name: 'Savings & Emergency', pct: 20, color: '#f59e0b', desc: 'Savings & loan payoffs' },
      { id: 'invest', name: 'Investments & Growth', pct: 10, color: '#3b82f6', desc: 'Long-term investment capital' }
    ]
  }
};

export const INITIAL_CUSTOM_BUCKETS = [
  { id: 'custom-1', name: 'Must-Haves & Needs', pct: 50, color: '#10b981', desc: 'Housing, bills, groceries' },
  { id: 'custom-2', name: 'Retirement & Investing', pct: 15, color: '#3b82f6', desc: 'Stocks & growth' },
  { id: 'custom-3', name: 'Emergency Savings', pct: 5, color: '#f59e0b', desc: 'Liquid buffer' },
  { id: 'custom-4', name: 'Wants & Lifestyle', pct: 30, color: '#8b5cf6', desc: 'Entertainment & travel' }
];

export const PRESET_COLORS = [
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#64748b'  // Slate
];
