import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wrench, BarChart2, History, FilePlus2, FileBarChart } from "lucide-react";

function Dashboard() {
  const [serviceCount, setServiceCount] = useState(null);
  const [repairCount, setRepairCount] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Helper for formatting numbers
  const fmt = (n) => new Intl.NumberFormat().format(Number(n) || 0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const [svcRes, repRes] = await Promise.all([
          fetch('http://localhost:5000/services/count', { signal: controller.signal }),
          fetch('http://localhost:5000/repairs/count', { signal: controller.signal }),
        ]);
        
        if (svcRes.ok && repRes.ok) {
          const svc = await svcRes.json();
          const rep = await repRes.json();
          setServiceCount(svc.count || 0);
          setRepairCount(rep.count || 0);
        } else {
          console.error("Error fetching counts:", svcRes.status, repRes.status);
          setServiceCount(0);
          setRepairCount(0);
        }
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("Error fetching job counts:", e);
          setServiceCount(0);
          setRepairCount(0);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
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
                Service & Repair Dashboard
              </h1>
              <p className="mt-1 text-white/80">
                View and manage all service and repair jobs
              </p>
            </div>
            <div className="flex gap-3">
              <ActionButton to="/ServiceJobCard" primary>
                <FilePlus2 className="w-5 h-5" />
                New Service Job
              </ActionButton>
              <ActionButton to="/RepairJobCard">
                <Wrench className="w-5 h-5" />
                New Repair Job
              </ActionButton>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-6 pb-14 -mt-6">
        {/* Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard
            title="Service Jobs"
            subtitle="All service records"
            value={serviceCount}
            icon={FileBarChart}
            accent="bg-blue-500"
          />
          <MetricCard
            title="Repair Jobs"
            subtitle="All repair records"
            value={repairCount}
            icon={Wrench}
            accent="bg-indigo-500"
          />
          <MetricCard
            title="Total Jobs"
            subtitle="Service + Repairs"
            value={(serviceCount || 0) + (repairCount || 0)}
            icon={BarChart2}
            accent="bg-teal-500"
          />
        </section>

        {/* Job Management */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Job Management</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/AllServiceJobs" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1">View Service Jobs</div>
                <div className="text-slate-600 text-sm">Manage all service records</div>
              </div>
            </Link>
            <Link to="/AllRepairJobs" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1">View Repair Jobs</div>
                <div className="text-slate-600 text-sm">Manage all repair records</div>
              </div>
            </Link>
            <Link to="/VehicleHistory" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <History className="w-4 h-4 mr-1" />
                  Vehicle History
                </div>
                <div className="text-slate-600 text-sm">View complete service history</div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
