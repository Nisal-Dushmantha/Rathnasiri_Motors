import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { 
  DollarSign, 
  CreditCard, 
  BarChart2, 
  PlusCircle,
  ArrowDownCircle,
  ArrowUpCircle
} from "lucide-react";
import axios from "axios";


// UI Components
const MetricCard = ({ title, subtitle, value, icon: Icon, accent, loading, fmt }) => (
  <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition">
    <div className={`absolute inset-y-0 left-0 w-1.5 ${accent}`} />
    <div className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="h-8 w-24 bg-slate-100 rounded animate-pulse" />
        ) : (
          <div className="text-4xl font-extrabold text-slate-900 tabular-nums">
            Rs {fmt(value)}
          </div>
        )}
      </div>
    </div>
  </div>
);

const ActionButton = ({ to, children, primary }) => (
  <Link to={to || "#"} className="block group">
    <button 
      className={`inline-flex items-center justify-center gap-2 rounded-xl border ${
        primary 
          ? "bg-blue-600 border-blue-700 text-white hover:bg-blue-700" 
          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
      } font-semibold py-2 px-6 transition shadow-sm`}
    >
      {children}
    </button>
  </Link>
);

function FinanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const fmt = (n) => new Intl.NumberFormat().format(Number(n) || 0);

 
  useEffect(() => {
    const controller = new AbortController();

    const fetchFinanceData = async () => {
      try {
        setLoading(true);

        // Fetch expenses from backend
        const res = await axios.get("http://localhost:5000/api/expenses", {
          signal: controller.signal,
        });
        const allExpenses = res.data || [];

        // Current month and year
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Filter expenses for current month
        const monthlyExpenses = allExpenses.filter((exp) => {
          const date = new Date(exp.date);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        // Total expenses
        const totalExpensesThisMonth = monthlyExpenses.reduce(
          (sum, exp) => sum + Number(exp.amount),
          0
        );

        setTotalExpenses(totalExpensesThisMonth);

        // For demo: total revenue (you can fetch dynamically later)
        const totalRevenueThisMonth = 1245000; 
        setTotalRevenue(totalRevenueThisMonth);

        // Net profit = revenue - expenses
        setNetProfit(totalRevenueThisMonth - totalExpensesThisMonth);

        setLoading(false);
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
        setLoading(false);
      }
    };

    fetchFinanceData();

    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Band */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600" />
        <div className="absolute inset-0 -z-10 opacity-15 mix-blend-soft-light bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-8 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl text-blue-900 font-extrabold tracking-tight">
                Finance Dashboard
              </h1>
              <p className="mt-1 text-white/80">
                Revenue • Expenses • Analytics
              </p>
            </div>
            <div className="flex gap-3">
              <ActionButton to="/RevenueManagement" primary>
                <ArrowUpCircle className="w-5 h-5" />
                Add Revenue
              </ActionButton>
              <ActionButton to="/Expenses">
                <ArrowDownCircle className="w-5 h-5" />
                Add Expense
              </ActionButton>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-14 -mt-6">
        {/* Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard
            title="Total Revenue"
            subtitle="Current month"
            value={totalRevenue}
            icon={ArrowUpCircle}
            accent="bg-emerald-500"
            loading={loading}
            fmt={fmt}
          />
          <MetricCard
            title="Total Expenses"
            subtitle="Current month"
            value={totalExpenses}
            icon={ArrowDownCircle}
            accent="bg-red-500"
            loading={loading}
            fmt={fmt}
          />
          <MetricCard
            title="Net Profit"
            subtitle="Current month"
            value={netProfit}
            icon={DollarSign}
            accent="bg-blue-500"
            loading={loading}
            fmt={fmt}
          />
        </section>

        {/* Finance Management */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Finance Management</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/RevenueManagement" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <ArrowUpCircle className="w-4 h-4 mr-1" />
                  Revenue
                </div>
                <div className="text-slate-600 text-sm">Track all revenue sources</div>
              </div>
            </Link>
            <Link to="/Expenses" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <ArrowDownCircle className="w-4 h-4 mr-1" />
                  Expenses
                </div>
                <div className="text-slate-600 text-sm">Manage all expenses</div>
              </div>
            </Link>
            <Link to="/CashFlow" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <CreditCard className="w-4 h-4 mr-1" />
                  Cash Flow
                </div>
                <div className="text-slate-600 text-sm">Track money in and out</div>
              </div>
            </Link>
          </div>
        </section>

        {/* Reports Section */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Reports & Analytics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/MonthlyReport" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <BarChart2 className="w-4 h-4 mr-1" />
                  Monthly Report
                </div>
                <div className="text-slate-600 text-sm">Export monthly finance summaries</div>
              </div>
            </Link>
            <Link to="/CustomReport" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Custom Report
                </div>
                <div className="text-slate-600 text-sm">Build reports by date and type</div>
              </div>
            </Link>
            <Link to="/FinancialSummary" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1">Financial Summary</div>
                <div className="text-slate-600 text-sm">Overview of financial performance</div>
              </div>
            </Link>
          </div>
        </section>
      </main>


    </div>
  );
}

export default FinanceDashboard;
