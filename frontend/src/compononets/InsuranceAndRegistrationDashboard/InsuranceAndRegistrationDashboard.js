
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  ShieldCheck, 
  FileText, 
  Calendar, 
  PlusCircle,
  ClipboardList,
  AlertTriangle
} from "lucide-react";

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
            {fmt(value)}
          </div>
        )}
      </div>
    </div>
  </div>
);

const ActionButton = ({ to, children, primary }) => (
  <Link to={to} className="block group">
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


function InsuranceAndRegistrationDashboard() {
  const [loading, setLoading] = useState(true);
  //const [totalActive, setTotalActive] = useState(0);
  //const [expiringSoon, setExpiringSoon] = useState(0);
  //const [renewedThisMonth, setRenewedThisMonth] = useState(0);
  const [insurances, setInsurances] = useState([]);
  const fmt = (n) => new Intl.NumberFormat().format(Number(n) || 0);

 useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/insurances", {
          signal: controller.signal
        });
        setInsurances(res.data.insurances || []);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("Error fetching insurance data:", e);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  // 🔹 Calculate metrics
  const today = new Date();

  const activeCount = insurances.filter(
    (item) => new Date(item.StartDate) <= today && new Date(item.EndDate) >= today
  ).length;

  const expiringSoon = insurances.filter((item) => {
    const end = new Date(item.EndDate);
    const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  }).length;

  const renewedThisMonth = insurances.filter((item) => {
    const start = new Date(item.StartDate);
    return (
      start.getMonth() === today.getMonth() &&
      start.getFullYear() === today.getFullYear()
    );
  }).length;

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
                Insurance & Registration
              </h1>
              <p className="mt-1 text-white/80">
                Policies • Vehicle Registration • Renewals
              </p>
            </div>
            <div className="flex gap-3">
              <ActionButton to="/NewInsurances" primary>
                <PlusCircle className="w-5 h-5" />
                Add New Insurance
              </ActionButton>
              <div className="text-right">
                {/*<div className="text-4xl font-bold text-blue-600">{loading ? "-" : insurances.filter(
                  (item) =>
                    new Date(item.StartDate) <= new Date() &&
                    new Date(item.EndDate) >= new Date()
                ).length}</div>*/}
                {/*<p className="text-sm text-gray-500 mt-1">Records</p>*/}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-14 -mt-6">
        {/* Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard
            title="Active Policies"
            subtitle="Total registrations"
            value={activeCount}
            icon={ShieldCheck}
            accent="bg-blue-500"
            loading={loading}
            fmt={fmt}
          />
          <MetricCard
            title="Expiring Soon"
            subtitle="Next 30 days"
            value={expiringSoon}
            icon={AlertTriangle}
            accent="bg-amber-500"
            loading={loading}
            fmt={fmt}
          />
          <MetricCard
            title="Renewed"
            subtitle="This month"
            value={renewedThisMonth}
            icon={Calendar}
            accent="bg-emerald-500"
            loading={loading}
            fmt={fmt}
          />
        </section>

        {/* Insurance Management */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Insurance Management</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/NewInsurances" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <PlusCircle className="w-4 h-4 mr-1" />
                  New Insurance
                </div>
                <div className="text-slate-600 text-sm">Create a new policy</div>
              </div>
            </Link>
            <Link to="/InsurancesAll" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <ClipboardList className="w-4 h-4 mr-1" />
                  All Insurances
                </div>
                <div className="text-slate-600 text-sm">View all insurance records</div>
              </div>
            </Link>
            <Link to="/ExpiringInsurancesPage" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Expiring Soon
                </div>
                <div className="text-slate-600 text-sm">Policies needing renewal</div>
              </div>
            </Link>
          </div>
        </section>

        {/* Reports Section */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Reports & History</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/InsuranceHistory" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  Insurance History
                </div>
                <div className="text-slate-600 text-sm">View detailed policy history</div>
              </div>
            </Link>
            <Link to="/ViewBills" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1">Insurance Bill History</div>
                <div className="text-slate-600 text-sm">Insurance Bill Tracker</div>
              </div>
            </Link>
            <Link to="/BillGenerator" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1">Bill Generator</div>
                <div className="text-slate-600 text-sm">Generate insurance analytics</div>
              </div>
            </Link>
          </div>
          {/*<div className="mt-auto flex gap-4">
            <Link to="/InsurancesAll" className="flex-1">
              <button className="w-full bg-blue-800 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition">Insurances</button>
            </Link>
            <Link to="/BillGenerator" className="flex-1">
              <button className="w-full bg-blue-800 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition">Generate Bill</button>
            </Link>
          </div>*/}
        </section>
      </main>
    </div>
  );
}

export default InsuranceAndRegistrationDashboard;
