import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { 
  Shield, 
  FileText, 
  Calendar, 
  Bell,
  PlusCircle,
  RefreshCw,
  Clock
} from "lucide-react";

function InsuranceAndRegistrationDashboard() {
  const [loading, setLoading] = useState(true);
  const [insuranceCount, setInsuranceCount] = useState(0);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [upcomingRenewals, setUpcomingRenewals] = useState(0);
  
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API fetch
        setTimeout(() => {
          setInsuranceCount(85);
          setRegistrationCount(112);
          setUpcomingRenewals(14);
          setLoading(false);
        }, 800);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("Error fetching insurance and registration data:", e);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  // UI Components
  const MetricCard = ({ title, subtitle, value, icon: Icon, accent }) => (
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
              {value}
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
            ? "bg-purple-600 border-purple-700 text-white hover:bg-purple-700" 
            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
        } font-semibold py-2 px-6 transition shadow-sm`}
      >
        {children}
      </button>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Band */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-600" />
        <div className="absolute inset-0 -z-10 opacity-15 mix-blend-soft-light bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-8 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl text-blue-900 font-extrabold tracking-tight">
                Insurance & Registration
              </h1>
              <p className="mt-1 text-white/80">
                Manage vehicle documentation and renewals
              </p>
            </div>
            
            <div className="flex gap-3">
              <ActionButton to="/AddInsurance" primary>
                <PlusCircle className="w-5 h-5" />
                New Insurance
              </ActionButton>
              
              <ActionButton to="/AddRegistration">
                <FileText className="w-5 h-5" />
                New Registration
              </ActionButton>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-14 -mt-6">
        {/* Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard
            title="Insurance Policies"
            subtitle="Active policies"
            value={insuranceCount}
            icon={Shield}
            accent="bg-purple-500"
          />
          <MetricCard
            title="Vehicle Registrations"
            subtitle="Registered vehicles"
            value={registrationCount}
            icon={FileText}
            accent="bg-blue-500"
          />
          <MetricCard
            title="Upcoming Renewals"
            subtitle="Next 30 days"
            value={upcomingRenewals}
            icon={Calendar}
            accent="bg-amber-500"
          />
        </section>

        {/* Management Section */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Document Management</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/InsuranceManagement" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-purple-400 group-hover:shadow-md group-hover:bg-purple-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Insurance Management
                </div>
                <div className="text-slate-600 text-sm">View and manage insurance policies</div>
              </div>
            </Link>
            <Link to="/RegistrationManagement" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-purple-400 group-hover:shadow-md group-hover:bg-purple-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  Registration Management
                </div>
                <div className="text-slate-600 text-sm">Track vehicle registrations</div>
              </div>
            </Link>
            <Link to="/RenewalCalendar" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-purple-400 group-hover:shadow-md group-hover:bg-purple-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Renewal Calendar
                </div>
                <div className="text-slate-600 text-sm">View upcoming renewal deadlines</div>
              </div>
            </Link>
          </div>
        </section>

        {/* Reports & Notifications */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Reports & Notifications</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/RenewalReminders" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-purple-400 group-hover:shadow-md group-hover:bg-purple-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <Bell className="w-4 h-4 mr-1" />
                  Renewal Reminders
                </div>
                <div className="text-slate-600 text-sm">Configure customer notifications</div>
              </div>
            </Link>
            <Link to="/ExpirationReport" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-purple-400 group-hover:shadow-md group-hover:bg-purple-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Expiration Report
                </div>
                <div className="text-slate-600 text-sm">View and export expiration dates</div>
              </div>
            </Link>
            <Link to="/RenewalHistory" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-purple-400 group-hover:shadow-md group-hover:bg-purple-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Renewal History
                </div>
                <div className="text-slate-600 text-sm">Track historical renewals</div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default InsuranceAndRegistrationDashboard;
