import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  CarFront, 
  Package, 
  ClipboardCheck, 
  AlertTriangle,
  PlusCircle,
  BarChart2
} from "lucide-react";

function ProductsDashboard() {
  const [totalBikes, setTotalBikes] = useState(0);
  const [totalStockUnits, setTotalStockUnits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lowStock, setLowStock] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false);

  // Helpers
  const fmt = (n) => new Intl.NumberFormat().format(Number(n) || 0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTotals = async () => {
      try {
        setLoading(true);
        const [newCountRes, usedCountRes, newQtyRes, lowStockRes] = await Promise.all([
          fetch("http://localhost:5000/newBs/count", { signal: controller.signal }),
          fetch("http://localhost:5000/usedBs/count", { signal: controller.signal }),
          fetch("http://localhost:5000/newBs/quantity-sum", { signal: controller.signal }),
          fetch("http://localhost:5000/newBs/low-stock?threshold=2", { signal: controller.signal }),
        ]);

        if (newCountRes.ok && usedCountRes.ok && newQtyRes.ok && lowStockRes.ok) {
          const [newCount, usedCount, newQty, lowStockJson] = await Promise.all([
            newCountRes.json(),
            usedCountRes.json(),
            newQtyRes.json(),
            lowStockRes.json(),
          ]);

          const newBikeCount = newCount.count || 0;
          const usedBikeCount = usedCount.count || 0;
          
          const catalogTotal = newBikeCount + usedBikeCount;
          setTotalBikes(catalogTotal);

          // total stock units = sum of new quantities + number of used bikes (each 1)
          const stockUnits = (newQty.totalQuantity || 0) + (usedCount.count || 0);
          setTotalStockUnits(stockUnits);

          // Set low stock items
          setLowStock(lowStockJson.items || []);
        }
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("Error fetching product data:", e);
        }
      } finally {
        setLoading(false);
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
                Products Dashboard
              </h1>
              <p className="mt-1 text-white/80">
                Manage new bikes, used bikes, and inventory
              </p>
            </div>
            
            <div className="flex gap-3">
              <ActionButton to="/NewBikesForm" primary>
                <PlusCircle className="w-5 h-5" />
                Add New Bike
              </ActionButton>
              
              <ActionButton to="/UsedBikesForm">
                <CarFront className="w-5 h-5" />
                Add Used Bike
              </ActionButton>
              
              <button
                className="relative w-10 h-10 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                onClick={() => setShowLowStock((s) => !s)}
                title="Low Stock Alerts"
                aria-label="Low stock notifications"
              >
                <AlertTriangle className="h-5 w-5 text-slate-700" />
                {!loading && lowStock.length > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full">
                    {lowStock.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Low Stock Alert Popup */}
      {showLowStock && (
        <div className="fixed right-8 top-32 z-20 w-[28rem] bg-white rounded-xl shadow-2xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Low Stock Alerts</h3>
            </div>
            <button 
              className="text-slate-500 hover:text-slate-700" 
              onClick={() => setShowLowStock(false)}
            >
              <span className="sr-only">Close</span>
              ✕
            </button>
          </div>
          {loading ? (
            <div className="p-4 text-slate-600">Loading...</div>
          ) : lowStock.length === 0 ? (
            <div className="p-4 text-slate-600">No low stock items.</div>
          ) : (
            <div className="max-h-64 overflow-auto -mx-2">
              {lowStock.map((item) => (
                <div key={`${item._id}`} className="px-2 py-2 border-t border-slate-100 first:border-t-0 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-800">{item.model}</div>
                    <div className="text-sm text-slate-500">{item.type} · {item.color}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Qty</div>
                    <div className="text-base font-semibold text-red-600">{item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 text-right">
            <Link to="/NewBikes">
              <button className="inline-flex items-center gap-2 justify-center rounded-xl border border-blue-600 bg-blue-50 text-blue-700 font-semibold py-2 px-4 hover:bg-blue-100 transition">
                <PlusCircle className="h-4 w-4" />
                Manage New Bikes
              </button>
            </Link>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-6 pb-14">
        {/* Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard
            title="Available Models"
            subtitle="Catalog count"
            value={totalBikes}
            icon={CarFront}
            accent="bg-blue-500"
          />
          <MetricCard
            title="In Stock"
            subtitle="Total units available" 
            value={totalStockUnits}
            icon={Package}
            accent="bg-emerald-500"
          />
          <MetricCard
            title="Low Stock Items"
            subtitle="Items below threshold"
            value={lowStock.length}
            icon={AlertTriangle}
            accent={lowStock.length > 0 ? "bg-red-500" : "bg-slate-500"}
          />
        </section>

        {/* Bike Management */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Bike Management</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/NewBikes" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1">View New Bikes</div>
                <div className="text-slate-600 text-sm">Manage new bike inventory</div>
              </div>
            </Link>
            <Link to="/UsedBikes" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1">View Used Bikes</div>
                <div className="text-slate-600 text-sm">Manage used bike inventory</div>
              </div>
            </Link>
            <Link to="/BikesSalesHistory" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <ClipboardCheck className="w-4 h-4 mr-1" />
                  View Monthly Sales History
                </div>
                <div className="text-slate-600 text-sm">View sold bikes history</div>
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
            <Link to="/SalesBikeForm" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <BarChart2 className="w-4 h-4 mr-1" />
                  Generate a Sales Bill
                </div>
                <div className="text-slate-600 text-sm">Record bike sales</div>
              </div>
            </Link>
            <Link to="/BikeSalesReport" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1 flex items-center">
                  <ClipboardCheck className="w-4 h-4 mr-1" />
                  View Genarated Sales Bills
                </div>
                <div className="text-slate-600 text-sm">See all bike sales records</div>
              </div>
            </Link>
            <Link to="/bikeSummery" className="block group">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50/50 transition-all">
                <div className="text-slate-900 font-semibold mb-1">View Summary of Products</div>
                <div className="text-slate-600 text-sm">Overview of product performance</div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProductsDashboard;
