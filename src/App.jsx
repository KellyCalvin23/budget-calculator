import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BudgetSummary from './components/BudgetSummary';
import ItemizedPlanner from './components/ItemizedPlanner';
import WealthProjection from './components/WealthProjection';
import ExportModal from './components/ExportModal';
import { BUDGET_RULES } from './utils/rules';
import { PAY_FREQUENCIES, CURRENCIES, convertCurrency } from './utils/currency';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('sb_theme') || 'dark');
  
  // Tab state: 'calculator' | 'itemized' | 'wealth'
  const [activeTab, setActiveTab] = useState('calculator');
  
  // Currency state (Default to Rwandan Franc RWF!)
  const [currency, setCurrency] = useState(() => localStorage.getItem('sb_currency') || 'RWF');
  
  // Income amount (Default 1,200,000 RWF for RWF, or 5000 for USD)
  const [income, setIncome] = useState(() => {
    const savedInc = localStorage.getItem('sb_income');
    if (savedInc) return savedInc;
    return '1200000';
  });

  // Income period: 'monthly' | 'paycheck' | 'annual'
  const [period, setPeriod] = useState('monthly');

  // Pay frequency: 'biweekly' | 'monthly' | 'semimonthly' | 'weekly'
  const [freq, setFreq] = useState('biweekly');

  // Selected Rule ID
  const [selectedRuleId, setSelectedRuleId] = useState('50-15-5-30');

  // Custom bucket ratios if rule === 'custom'
  const [customRatios, setCustomRatios] = useState({
    needs: 50,
    invest: 15,
    emergency: 5,
    wants: 30
  });

  // Export Modal state
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Sync theme class to document body
  useEffect(() => {
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem('sb_theme', theme);
  }, [theme]);

  // Sync currency to localStorage
  useEffect(() => {
    localStorage.setItem('sb_currency', currency);
  }, [currency]);

  // Sync income to localStorage
  useEffect(() => {
    localStorage.setItem('sb_income', income);
  }, [income]);

  // Handle currency change with smart conversion if desired
  const handleCurrencyChange = (newCurrency) => {
    if (newCurrency === currency) return;
    const currentVal = parseFloat(income) || 0;
    if (currentVal > 0) {
      const converted = convertCurrency(currentVal, currency, newCurrency);
      if (newCurrency === 'RWF') {
        setIncome(Math.round(converted).toString());
      } else {
        setIncome((Math.round(converted * 100) / 100).toString());
      }
    }
    setCurrency(newCurrency);
  };

  // Compute current normalized monthly income in active currency
  const rawIncome = parseFloat(income) || 0;
  const periodsPerYr = PAY_FREQUENCIES[freq]?.periodsPerYear || 12;
  
  let monthlyIncomeBase = rawIncome;
  if (period === 'annual') {
    monthlyIncomeBase = rawIncome / 12;
  } else if (period === 'paycheck') {
    monthlyIncomeBase = (rawIncome * periodsPerYr) / 12;
  }

  // Active bucket percentages helper
  const getActiveBucketPcts = () => {
    if (selectedRuleId === 'custom') return customRatios;
    const def = BUDGET_RULES[selectedRuleId] || BUDGET_RULES['50-15-5-30'];
    const pcts = {};
    def.buckets.forEach(b => { pcts[b.id] = b.pct; });
    return pcts;
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Top Header Navbar */}
      <Navbar 
        currency={currency}
        setCurrency={handleCurrencyChange}
        theme={theme}
        setTheme={setTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportClick={() => setIsExportOpen(true)}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {activeTab === 'calculator' && (
          <BudgetSummary 
            income={income}
            setIncome={setIncome}
            currency={currency}
            period={period}
            setPeriod={setPeriod}
            freq={freq}
            setFreq={setFreq}
            selectedRuleId={selectedRuleId}
            setSelectedRuleId={setSelectedRuleId}
            customRatios={customRatios}
            setCustomRatios={setCustomRatios}
          />
        )}

        {activeTab === 'itemized' && (
          <ItemizedPlanner 
            monthlyIncome={monthlyIncomeBase}
            currency={currency}
            ruleBucketPcts={getActiveBucketPcts()}
          />
        )}

        {activeTab === 'wealth' && (
          <WealthProjection 
            monthlyIncome={monthlyIncomeBase}
            currency={currency}
            ruleBucketPcts={getActiveBucketPcts()}
          />
        )}

      </main>

      {/* Export Modal */}
      <ExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        income={income}
        currency={currency}
        period={period}
        freq={freq}
        selectedRuleId={selectedRuleId}
        customRatios={customRatios}
      />

    </div>
  );
}
