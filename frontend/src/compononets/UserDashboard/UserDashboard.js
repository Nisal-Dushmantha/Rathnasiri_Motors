import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Award, 
  BarChart2, 
  UserPlus,
  Percent
} from "lucide-react";

function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loyaltyMembers, setLoyaltyMembers] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);

  // Helpers
  const fmt = (n) => new Intl.NumberFormat().format(Number(n) || 0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTotals = async () => {
      try {
        setLoading(true);
        // In a real implementation, these would be actual API calls
        // Simulating API response for demonstration
        setTimeout(() => {
          setTotalCustomers(246);
          setLoyaltyMembers(128);
          setActiveCustomers(98);
          setLoading(false);
        }, 800);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("Error fetching customer data:", e);
        }
      }
    };

    fetchTotals();
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
                User Management
              </h1>
              <p className="mt-1 text-white/80">
                Customers • Loyalty • Analytics
              </p>
            </div>
            
            <div className="flex gap-3">
              <ActionButton to="/CustomerDetails" primary>
                <UserPlus className="w-5 h-5" />
                Add Customer
              </ActionButton>
              
              <ActionButton to="/CustomerLoyalty">
                <Award className="w-5 h-5" />
                Loyalty Program
              </ActionButton>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 pb-14 -mt-6">
        {/* Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard
            title="Total Customers"
            subtitle="Registered users"
            value={totalCustomers}
            icon={Users}
            accent="bg-blue-500"
          />
          <MetricCard
            title="Loyalty Members"
            subtitle="Active members"
            value={loyaltyMembers}
            icon={Award}
            accent="bg-emerald-500"
          />
          <MetricCard
            title="Active Now"
            subtitle="Recent activity"
            value={activeCustomers}
            icon={Users}
            accent="bg-purple-500"
          />
        </section>

        {/* Customer Management */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Customer Management</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/CustomerDetails" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1">Customer Details</div>
                <div className="text-slate-600 text-sm">Manage customer profiles</div>
              </div>
            </Link>
            <Link to="/CustomerLoyalty" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1">Customer Loyalty</div>
                <div className="text-slate-600 text-sm">Points and rewards program</div>
              </div>
            </Link>
            <Link to="/CustomerOffers" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <Percent className="w-4 h-4 mr-1" />
                  Discounts & Offers
                </div>
                <div className="text-slate-600 text-sm">Special deals for customers</div>
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
            <Link to="/CustomerReport" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <BarChart2 className="w-4 h-4 mr-1" />
                  Customer Analytics
                </div>
                <div className="text-slate-600 text-sm">Detailed customer statistics</div>
              </div>
            </Link>
            <Link to="/LoyaltyReport" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  Loyalty Analytics
                </div>
                <div className="text-slate-600 text-sm">Loyalty program performance</div>
              </div>
            </Link>
            <Link to="/Reports" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1">Summary Report</div>
                <div className="text-slate-600 text-sm">Overview of all user activity</div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;
