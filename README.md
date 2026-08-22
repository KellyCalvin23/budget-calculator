# 🇷🇼 Smart Budget Calculator & Financial Planner
> **Rwandan Franc (RWF) & Global Multi-Currency 50/15/5/30 Financial Management Tool**

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Currency](https://img.shields.io/badge/Currency-RWF%20%7C%20USD%20%7C%20EUR%20%7C%20GBP-10B981)](#-multi-currency-support)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An interactive, high-performance financial web application built on the **50 / 15 / 5 / 30 Rule** advocate model. Tailored for users in **Rwanda (RWF / FRw)** and worldwide, featuring multi-currency conversion, custom ratio allocation sliders, an itemized expense checker, long-term compound growth forecasting, and printable PDF/CSV report exports.

---

## ✨ Features

### 1. 🇷🇼 Rwandan Franc (RWF) & Multi-Currency Engine
- Native support for **Rwandan Francs (`1,200,000 FRw`)**, **US Dollars (`$`)**, **Euros (`€`)**, and **British Pounds (`£`)**.
- Real-time exchange rate conversion toggle between local currency and foreign currency values.

### 2. 📅 Multi-Cadence Income & Frequency Options
- Enter take-home income **Per Paycheck**, **Monthly**, or **Annual**.
- Supports flexible pay schedules: **Monthly**, **Bi-weekly (Every 2 weeks)**, **Semi-monthly (Twice a month)**, and **Weekly**.
- Category cards automatically calculate allocations across **Per paycheck**, **Per month**, and **Per year** with active cadence highlighting.

### 3. 📊 Budgeting Rules & Custom Ratio Sliders
- **50 / 15 / 5 / 30 Rule** (MoneyLetter Standard: 50% Needs, 15% Investing, 5% Emergency, 30% Wants).
- **50 / 30 / 20 Rule** (Classic Financial Plan: 50% Needs, 30% Wants, 20% Savings).
- **70 / 20 / 10 Rule** (High Cost-of-Living: 70% Needs, 20% Savings, 10% Investing).
- **Custom Ratio Builder**: Interactive sliders allowing users to craft personalized allocation percentages totaling 100%.

### 4. 📝 Itemized Expense Checker
- Itemize individual monthly bills (e.g., *House Rent in Kigali*, *REG Electricity & Water*, *Moto & Taxi Transport*, *Food*, *RNIT Mutual Fund*, *Bank Emergency Deposit*).
- Displays real-time status indicators (e.g. `Within Limit` or `Over Target by 25,000 FRw`).

### 5. 🚀 Long-Term Wealth Growth Forecast
- Simulates compound growth for **15% Investment** and **5% Emergency Savings** over **1, 5, 10, 20, and 30 years**.
- Customizable annual return rates (e.g. 9.5% stock market/mutual funds return, 6.0% savings bank account interest).

### 6. 📄 Printable PDF & CSV Exports
- One-click client-side **PDF Report Generation** (`html2canvas` + `jsPDF`) with formatted allocation tables.
- **CSV Data Downloader** for seamless import into Excel or Google Sheets.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Vanilla CSS Modules (Glassmorphism, Dark/Light Themes, Custom CSS Variables)
- **Icons**: Lucide React
- **Export Engines**: `html2canvas` & `jspdf`
- **Fonts**: Plus Jakarta Sans & Space Grotesk (Google Fonts)

---

## 📦 Installation & Local Setup

### Prerequisites
- Node.js 18+ and `npm` installed.

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/KellyCalvin23/budget-calculator.git

# 2. Navigate to project directory
cd budget-calculator

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open your browser at `http://localhost:3000` to view the app.

---

## 🚀 Building for Production

```bash
npm run build
```

The optimized static production files will be generated in the `dist/` directory.

---

## 💡 Budgeting Rule Breakdown (50/15/5/30)

| Bucket | Percentage | Purpose & Examples |
| :--- | :---: | :--- |
| **Must-Haves & Needs** | **50%** | Rent/Mortgage, REG utilities, groceries, transport, debt payments. |
| **Retirement & Investing** | **15%** | Stocks, mutual funds (RNIT), real estate, long-term wealth growth. |
| **Emergency Savings** | **5%** | High-yield bank savings, liquid rainy-day cushion. |
| **Wants & Lifestyle** | **30%** | Dining out, vacations, gadgets, entertainment, personal fun. |

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
