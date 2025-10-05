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

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Fetch expenses
        const expensesRes = await axios.get("http://localhost:5000/api/expenses", { signal: controller.signal });
        const allExpenses = expensesRes.data || [];

        const monthlyExpenses = allExpenses.filter(exp => {
          const date = new Date(exp.date);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const totalExpensesThisMonth = monthlyExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
        setTotalExpenses(totalExpensesThisMonth);

        // Fetch income sources
        const [bikesRes, spareRes, servicesRes, insuranceRes] = await Promise.all([
          axios.get("http://localhost:5000/newBsH"),
          axios.get("http://localhost:5000/spb"),
          axios.get("http://localhost:5000/service-repair-bills"),
          axios.get("http://localhost:5000/api/bills"),
        ]);

        const filterByMonth = (items, dateField) => items.filter(item => {
          const date = new Date(item[dateField]);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const bikes = filterByMonth(bikesRes.data.newBsH || [], "date");
        const totalBikesIncome = bikes.reduce((sum, b) => sum + Number(b.last_price || 0), 0);

        const rawSpare = spareRes.data.spb || [];
        const groupedSpare = rawSpare.reduce((acc, item) => {
          let bill = acc.find(b => b.bill_no === item.bill_no);
          if (!bill) {
            bill = { bill_no: item.bill_no, date: item.date, items: [] };
            acc.push(bill);
          }
          bill.items.push({ quantity: Number(item.quantity), price: Number(item.price) });
          return acc;
        }, []);
        const spareParts = filterByMonth(groupedSpare, "date");
        const totalSpareIncome = spareParts.reduce((sum, b) => sum + b.items.reduce((s, it) => s + it.quantity * it.price, 0), 0);

        const services = filterByMonth(servicesRes.data || [], "date");
        const totalServicesIncome = services.reduce((sum, s) => sum + Number(s.total || 0), 0);

        const insuranceBills = filterByMonth(insuranceRes.data.bills || [], "createdAt");
        const totalInsuranceService = insuranceBills.reduce((sum, b) => sum + Number(b.serviceCharge || 0), 0);

        const totalRevenueThisMonth = totalBikesIncome + totalSpareIncome + totalServicesIncome + totalInsuranceService;
        setTotalRevenue(totalRevenueThisMonth);
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
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600" />
        <div className="max-w-7xl mx-auto px-6 py-8 text-white flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl text-blue-900 font-extrabold tracking-tight">
              Finance Dashboard
            </h1>
            <p className="mt-1 text-white/80">Revenue • Expenses • Analytics</p>
          </div>
          <div className="flex gap-3">
            <ActionButton to="/MonthlyIncomeReport" primary>
              <ArrowUpCircle className="w-5 h-5" /> Add Revenue
            </ActionButton>
            <ActionButton to="/Expenses">
              <ArrowDownCircle className="w-5 h-5" /> Add Expense
            </ActionButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-14 -mt-6">
        {/* Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard
            title="Total Revenue"
            subtitle="Current Month"
            value={totalRevenue}
            icon={ArrowUpCircle}
            accent="bg-emerald-500"
            loading={loading}
            fmt={fmt}
          />
          <MetricCard
            title="Total Expenses"
            subtitle="Current Month"
            value={totalExpenses}
            icon={ArrowDownCircle}
            accent="bg-red-500"
            loading={loading}
            fmt={fmt}
          />
          <MetricCard
            title="Net Profit"
            subtitle="Current Month"
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
            <Link to="/MonthlyIncomeReport" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <ArrowUpCircle className="w-4 h-4 mr-1" />
                  Revenue
                </div>
                <div className="text-slate-600 text-sm">Track all revenue sources</div>
              </div>
            </Link>
            {/*<Link to="/Expenses" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <ArrowDownCircle className="w-4 h-4 mr-1" />
                  Expenses
                </div>
                <div className="text-slate-600 text-sm">Manage all expenses</div>
              </div>
            </Link>*/}
            <Link to="/Expenses" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <CreditCard className="w-4 h-4 mr-1" />
                  Expenses
                </div>
                <div className="text-slate-600 text-sm">Manage all expenses</div>
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
