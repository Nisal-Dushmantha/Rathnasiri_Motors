import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CarFront,
  Wrench,
  Package,
  Layers,
  ShieldCheck,
  ClipboardList,
  Gauge,
  CalendarClock,
} from "lucide-react";

/**
 * Modern Admin Dashboard (Vehicle Sales + Service)
 * - Tailwind-only styling
 * - No new deps
 * - Works with your existing endpoints
 */

function Homepage() {
  const [loading, setLoading] = useState(true);
  const [svcCount, setSvcCount] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [catalogTotal, setCatalogTotal] = useState(0);
  const [storeUnits, setStoreUnits] = useState(0);
  const [invItemCount, setInvItemCount] = useState(0);
  const [invTotalUnits, setInvTotalUnits] = useState(0);
  const [insActive, setInsActive] = useState(0);

  // Helpers
  const get = (obj, path) => {
    try {
      return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
    } catch {
      return undefined;
    }
  };
  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const fmt = (n) => new Intl.NumberFormat().format(toNum(n));

  useEffect(() => {
    const controller = new AbortController();
    const fetchAll = async () => {
      try {
        setLoading(true);
        const urls = [
          "http://localhost:5000/services/count",
          "http://localhost:5000/repairs/count",
          "http://localhost:5000/newBs/count",
          "http://localhost:5000/usedBs/count",
          "http://localhost:5000/newBs/quantity-sum",
          "http://localhost:5000/sp",
          "http://localhost:5000/insurances/total/count",
        ];

        const responses = await Promise.allSettled(
          urls.map((u) => fetch(u, { signal: controller.signal }))
        );

        const parse = async (entry, label) => {
          if (entry.status !== "fulfilled") {
            console.error(`[Homepage] Fetch failed for ${label}:`, entry.reason);
            return null;
          }
          const res = entry.value;
          if (!res.ok) {
            console.error(`[Homepage] Non-OK response for ${label}:`, res.status, res.statusText);
            return null;
          }
          try {
            const j = await res.json();
            console.log(`[Homepage] ${label} ->`, j);
            return j;
          } catch (e) {
            console.error(`[Homepage] JSON parse failed for ${label}:`, e);
            return null;
          }
        };

        const [
          svcJson,
          repJson,
          newCountJson,
          usedCountJson,
          newQtyJson,
          spJson,
          insJson,
        ] = await Promise.all([
          parse(responses[0], "services/count"),
          parse(responses[1], "repairs/count"),
          parse(responses[2], "newBs/count"),
          parse(responses[3], "usedBs/count"),
          parse(responses[4], "newBs/quantity-sum"),
          parse(responses[5], "sp"),
          parse(responses[6], "insurances/total/count"),
        ]);

        setSvcCount(toNum(get(svcJson, "count")) || toNum(get(svcJson, "total")));
        setRepCount(toNum(get(repJson, "count")) || toNum(get(repJson, "total")));

        const catTotal = toNum(get(newCountJson, "count")) + toNum(get(usedCountJson, "count"));
        setCatalogTotal(catTotal);

        const units =
          toNum(get(newQtyJson, "totalQuantity")) + toNum(get(usedCountJson, "count"));
        setStoreUnits(units);

        const spItems = Array.isArray(spJson?.sp)
          ? spJson.sp
          : Array.isArray(spJson?.items)
          ? spJson.items
          : [];
        setInvItemCount(spItems.length);
        const sumUnits = spItems.reduce((acc, it) => acc + (Number(it.Quentity) || 0), 0);
        setInvTotalUnits(sumUnits);

        setInsActive(toNum(get(insJson, "total")) || toNum(get(insJson, "count")));
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("[Homepage] Unexpected error during fetchAll:", e);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    return () => controller.abort();
  }, []);

  // ----- UI Pieces -----
  const Pill = ({ children }) => (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/60 text-slate-700 px-3 py-1 text-xs font-medium border border-slate-200">
      {children}
    </span>
  );

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

  const QuickAction = ({ to, title, desc }) => (
    <Link to={to} className="block group">
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
        <div className="text-slate-900 font-semibold mb-1">{title}</div>
        <div className="text-slate-600 text-sm">{desc}</div>
      </div>
    </Link>
  );

  const totalJobs = (svcCount || 0) + (repCount || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Band */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600" />
        {/* subtle pattern */}
        <div className="absolute inset-0 -z-10 opacity-15 mix-blend-soft-light bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-8 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#0B3954" }}>Dashboard Overview</h1>
              <p style={{ color: "#0B3954" }}>Welcome to your Rathnasiri Motors management dashboard</p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill>
                  <Gauge className="h-3.5 w-3.5" />
                  Live KPIs
                </Pill>
                <Pill>
                  <CalendarClock className="h-3.5 w-3.5" />
                  Today Snapshot
                </Pill>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-6 pb-14 -mt-6">
        {/* KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Total Jobs"
            subtitle="Service + Repairs (all statuses)"
            value={totalJobs}
            icon={Wrench}
            accent="bg-blue-500"
          />
          <MetricCard
            title="Vehicles in Catalog"
            subtitle="New + Used models"
            value={catalogTotal}
            icon={CarFront}
            accent="bg-indigo-500"
          />
          <MetricCard
            title="Units in Store"
            subtitle="Current stock (all)"
            value={storeUnits}
            icon={Package}
            accent="bg-teal-500"
          />
          <MetricCard
            title="Inventory Items"
            subtitle="Spare parts categories"
            value={invItemCount}
            icon={Layers}
            accent="bg-cyan-500"
          />
          <MetricCard
            title="Inventory Units"
            subtitle="Total spare-part quantity"
            value={invTotalUnits}
            icon={ClipboardList}
            accent="bg-purple-500"
          />
          <MetricCard
            title="Active Policies"
            subtitle="Insurance & registrations"
            value={insActive}
            icon={ShieldCheck}
            accent="bg-rose-500"
          />
        </section>

        {/* Quick Actions */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickAction
              to="/NewBikesForm"
              title="Add New Vehicle"
              desc="Create a fresh catalog entry"
            />
            <QuickAction
              to="/SparePartsForm"
              title="Add Spare Part"
              desc="Update inventory with a new part"
            />
            <QuickAction
              to="/ServiceJobCard"
              title="New Service Job"
              desc="Create a service/repair job card"
            />
            <QuickAction
              to="/NewInsurances"
              title="New Insurance"
              desc="Add a policy / registration"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Homepage;