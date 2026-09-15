import React, { useState } from 'react';
import { X, FileText, Download, Check, Loader2 } from 'lucide-react';
import { formatCurrency, PAY_FREQUENCIES, CURRENCIES } from '../utils/currency';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ExportModal({ 
  isOpen, 
  onClose, 
  income, 
  currency, 
  period, 
  freq, 
  selectedRuleId, 
  activeBuckets 
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const currDetails = CURRENCIES[currency] || CURRENCIES.RWF;
  const rawIncome = parseFloat(income) || 0;
  const periodsPerYr = PAY_FREQUENCIES[freq]?.periodsPerYear || 12;

  let monthlyBase = rawIncome;
  if (period === 'annual') monthlyBase = rawIncome / 12;
  else if (period === 'paycheck') monthlyBase = (rawIncome * periodsPerYr) / 12;

  const annualTotal = monthlyBase * 12;
  const paycheckTotal = annualTotal / periodsPerYr;

  // CSV Downloader
  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Category,Percentage,Per Paycheck,Per Month,Per Year\n";

    activeBuckets.forEach((b) => {
      const mVal = monthlyBase * (b.pct / 100);
      const yVal = mVal * 12;
      const pcVal = yVal / periodsPerYr;
      csvContent += `"${b.name}",${b.pct}%,${pcVal.toFixed(2)},${mVal.toFixed(2)},${yVal.toFixed(2)}\n`;
    });

    csvContent += `\n"Total Income",100%,${paycheckTotal.toFixed(2)},${monthlyBase.toFixed(2)},${annualTotal.toFixed(2)}\n`;
    csvContent += `"Currency",${currency},,,,\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SmartBudget_${currency}_Breakdown.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Generator using html2canvas & jsPDF
  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const reportElement = document.getElementById('pdf-report-preview');
      if (!reportElement) return;

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SmartBudget_${currency}_Financial_Plan.pdf`);
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('PDF Generation Failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'grid',
      placeItems: 'center',
      padding: '20px'
    }}>
      
      <div className="card-glass" style={{ width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', background: 'var(--bg-surface)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Export Financial Plan Report
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Download official PDF budget sheet or export CSV data.
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Printable Preview Sheet Container */}
        <div 
          id="pdf-report-preview" 
          style={{ 
            background: '#ffffff', 
            color: '#0f172a', 
            padding: '30px', 
            borderRadius: '14px', 
            marginBottom: '20px',
            border: '1px solid #e2e8f0',
            fontFamily: 'sans-serif'
          }}
        >
          {/* Document Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #10b981', paddingBottom: '14px', marginBottom: '16px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#0c4637', fontWeight: 800 }}>
                SmartBudget Financial Plan
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '0.825rem', color: '#64748b' }}>
                Rule: {selectedRuleId.toUpperCase()} • Pay Schedule: {PAY_FREQUENCIES[freq]?.label}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Currency
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981' }}>
                {currency} ({currDetails.symbol})
              </div>
            </div>
          </div>

          {/* Income Summary Table */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#f8fafc', padding: '14px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center' }}>
            <div>
              <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Per Paycheck</span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                {formatCurrency(paycheckTotal, currency)}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Income</span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>
                {formatCurrency(monthlyBase, currency)}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Annual Income</span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                {formatCurrency(annualTotal, currency)}
              </div>
            </div>
          </div>

          {/* Category Breakdown Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#0c4637', color: '#ffffff', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px', borderRadius: '6px 0 0 6px' }}>Category</th>
                <th style={{ padding: '8px 12px' }}>Allocation</th>
                <th style={{ padding: '8px 12px' }}>Per Paycheck</th>
                <th style={{ padding: '8px 12px' }}>Per Month</th>
                <th style={{ padding: '8px 12px', borderRadius: '0 6px 6px 0' }}>Per Year</th>
              </tr>
            </thead>
            <tbody>
              {activeBuckets.map((b, idx) => {
                const mVal = monthlyBase * (b.pct / 100);
                const yVal = mVal * 12;
                const pcVal = yVal / periodsPerYr;
                return (
                  <tr key={b.id} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>{b.name}</td>
                    <td style={{ padding: '8px 12px', fontWeight: 800, color: b.color || '#10b981' }}>{b.pct}%</td>
                    <td style={{ padding: '8px 12px' }}>{formatCurrency(pcVal, currency)}</td>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>{formatCurrency(mVal, currency)}</td>
                    <td style={{ padding: '8px 12px' }}>{formatCurrency(yVal, currency)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footer note */}
          <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #cbd5e1', fontSize: '0.725rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
            <span>SmartBudget Planner • Rwandan Franc (RWF) & Multi-Currency Engine</span>
            <span>Generated on {new Date().toLocaleDateString()}</span>
          </div>

        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={downloadCSV}
            style={{
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={16} /> Export CSV
          </button>

          <button
            onClick={generatePDF}
            disabled={isGenerating}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Preparing PDF...
              </>
            ) : downloadSuccess ? (
              <>
                <Check size={16} /> PDF Downloaded!
              </>
            ) : (
              <>
                <Download size={16} /> Download PDF
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
