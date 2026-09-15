/**
 * Date and Month utilities for tracking multi-month history
 */

export function getCurrentMonthKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function formatMonthKey(monthKey) {
  if (!monthKey || !monthKey.includes('-')) return monthKey;
  const [yearStr, monthStr] = monthKey.split('-');
  const date = new Date(parseInt(yearStr), parseInt(monthStr) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getPreviousMonthKey(monthKey) {
  const [yearStr, monthStr] = monthKey.split('-');
  let y = parseInt(yearStr);
  let m = parseInt(monthStr) - 1;
  if (m < 1) {
    m = 12;
    y -= 1;
  }
  return `${y}-${String(m).padStart(2, '0')}`;
}

export function getNextMonthKey(monthKey) {
  const [yearStr, monthStr] = monthKey.split('-');
  let y = parseInt(yearStr);
  let m = parseInt(monthStr) + 1;
  if (m > 12) {
    m = 1;
    y += 1;
  }
  return `${y}-${String(m).padStart(2, '0')}`;
}

export function generateMonthOptions() {
  const options = [];
  const now = new Date();
  
  // 12 months in the past up to 6 months in the future
  for (let i = -12; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const key = `${year}-${month}`;
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    options.push({ key, label });
  }
  
  return options;
}
