import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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
  const [goldenMember, setGoldenMember] = useState(null);
  const [goldenLoading, setGoldenLoading] = useState(false);
  const [newCustomersThisMonth, setNewCustomersThisMonth] = useState(0);

  // Helpers
  const fmt = (n) => new Intl.NumberFormat().format(Number(n) || 0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchTotals = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/customers", { signal: controller.signal });
        if (!isMounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setTotalCustomers(list.length);
        // compute new customers in current month
        try {
          const now = new Date();
          const count = list.reduce((acc, cust) => {
            let created = null;
            if (cust.createdAt) created = new Date(cust.createdAt);
            else if (cust._id && typeof cust._id === 'string' && cust._id.length >= 8) {
              const ts = parseInt(cust._id.substring(0,8), 16) * 1000;
              created = new Date(ts);
            }
            if (!created) return acc;
            return (created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth()) ? acc + 1 : acc;
          }, 0);
          setNewCustomersThisMonth(count);
        } catch (e) {
          console.error('Failed to compute new customers this month', e);
          setNewCustomersThisMonth(0);
        }
        // Optionally fetch loyalty summary here if backend supports it
        setLoyaltyMembers((prev) => prev);
      } catch (e) {
        if (e.name !== "CanceledError" && e.name !== "AbortError") {
          console.error("Error fetching customer data:", e);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    const fetchGolden = async () => {
      try {
        setGoldenLoading(true);
        const res = await axios.get("http://localhost:5000/loyalty/top-members?limit=1");
        const m = res.data?.members?.[0] || null;
        if (isMounted) setGoldenMember(m);
      } catch (err) {
        console.error("Failed to fetch golden member", err);
        if (isMounted) setGoldenMember(null);
      } finally {
        if (isMounted) setGoldenLoading(false);
      }
    };

    fetchTotals();
    fetchGolden();

    // Refresh count on tab focus and periodically
    const onFocus = () => fetchTotals();
  const onFocusGolden = () => fetchGolden();
    window.addEventListener("focus", onFocus);
  window.addEventListener("focus", onFocusGolden);
    const interval = setInterval(fetchTotals, 10000);
  const goldenInterval = setInterval(fetchGolden, 10000);

    return () => {
      isMounted = false;
      controller.abort();
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("focus", onFocusGolden);
      clearInterval(interval);
      clearInterval(goldenInterval);
    };
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
              <ActionButton to="/AddCustomer" primary>
                <UserPlus className="w-5 h-5" />
                Add Customer
              </ActionButton>
              
              <ActionButton to="/AddLoyalty">
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
            title="New Customers"
            subtitle="This Month"
            value={newCustomersThisMonth}
            icon={Award}
            accent="bg-emerald-500"
          />
          <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition">
            <div className={`absolute inset-y-0 left-0 w-1.5 bg-yellow-400`} />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">Golden Member</h3>
                  <p className="text-xs text-slate-500">Top loyalty points</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div className="mt-4">
                {goldenLoading ? (
                  <div className="h-8 w-40 bg-slate-100 rounded animate-pulse" />
                ) : goldenMember ? (
                  <div>
                    <div className="text-lg font-semibold text-slate-900">{goldenMember.name}</div>
                    <div className="text-sm text-slate-600">{fmt(goldenMember.points)} pts</div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-600">No golden member yet</div>
                )}
              </div>
            </div>
          </div>
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
            <Link to="/loyalty-analytics" className="block group">
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
