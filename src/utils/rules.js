export const BUDGET_RULES = {
  '50-15-5-30': {
    id: '50-15-5-30',
    name: '50/15/5/30 Rule (MoneyLetter Standard)',
    description: 'Balanced approach dividing income into Needs (50%), Long-term Investments (15%), Emergency Fund (5%), and Lifestyle/Wants (30%).',
    buckets: [
      { id: 'needs', key: '50', name: 'Must-Haves & Needs', pct: 50, color: 'var(--c-needs)', desc: 'Rent, food, transport, bills & debt' },
      { id: 'invest', key: '15', name: 'Retirement & Investing', pct: 15, color: 'var(--c-invest)', desc: 'Stocks, mutual funds, real estate & business' },
      { id: 'emergency', key: '5', name: 'Emergency Savings', pct: 5, color: 'var(--c-emergency)', desc: 'Rainy-day liquid bank cushion' },
      { id: 'wants', key: '30', name: 'Wants & Lifestyle', pct: 30, color: 'var(--c-wants)', desc: 'Dining out, entertainment, travel & hobbies' }
    ]
  },
  '50-30-20': {
    id: '50-30-20',
    name: '50/30/20 Rule (Classic Financial Plan)',
    description: 'Classic framework allocating 50% to essential needs, 30% to wants, and 20% to savings/investments.',
    buckets: [
      { id: 'needs', key: '50', name: 'Essential Needs', pct: 50, color: 'var(--c-needs)', desc: 'Housing, food, health & utilities' },
      { id: 'wants', key: '30', name: 'Personal Wants', pct: 30, color: 'var(--c-wants)', desc: 'Shopping, entertainment & hobbies' },
      { id: 'invest', key: '15', name: 'Wealth & Investments', pct: 15, color: 'var(--c-invest)', desc: 'Stocks, pensions & growth' },
      { id: 'emergency', key: '5', name: 'Emergency Buffer', pct: 5, color: 'var(--c-emergency)', desc: 'Liquid bank savings' }
    ]
  },
  '70-20-10': {
    id: '70-20-10',
    name: '70/20/10 Rule (High Cost-of-Living)',
    description: 'Designed for high essential expenses: 70% to living costs, 20% to savings, and 10% to investments.',
    buckets: [
      { id: 'needs', key: '70', name: 'Living Expenses', pct: 70, color: 'var(--c-needs)', desc: 'All mandatory bills & obligations' },
      { id: 'invest', key: '10', name: 'Investments', pct: 10, color: 'var(--c-invest)', desc: 'Long-term investment capital' },
      { id: 'emergency', key: '10', name: 'Emergency & Debt', pct: 10, color: 'var(--c-emergency)', desc: 'Savings & loan payoffs' },
      { id: 'wants', key: '10', name: 'Discretionary Wants', pct: 10, color: 'var(--c-wants)', desc: 'Fun & personal items' }
    ]
  }
};
