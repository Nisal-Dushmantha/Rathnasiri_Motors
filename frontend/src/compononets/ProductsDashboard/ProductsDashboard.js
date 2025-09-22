import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ProductsDashboard() {
  const [totalBikes, setTotalBikes] = useState(0);
  const [totalStockUnits, setTotalStockUnits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lowStock, setLowStock] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false);

  const topCard = {
    title: "Add New Bikes",
    description: "Manage and view all available bikes in inventory",
  };

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        setLoading(true);
        const [newCountRes, usedCountRes, newQtyRes, lowStockRes] = await Promise.all([
          fetch("http://localhost:5000/newBs/count"),
          fetch("http://localhost:5000/usedBs/count"),
          fetch("http://localhost:5000/newBs/quantity-sum"),
          fetch("http://localhost:5000/newBs/low-stock?threshold=2"),
        ]);

        const [newCount, usedCount, newQty, lowStockJson] = await Promise.all([
          newCountRes.json(),
          usedCountRes.json(),
          newQtyRes.json(),
          lowStockRes.json(),
        ]);

        const catalogTotal = (newCount.count || 0) + (usedCount.count || 0);
        setTotalBikes(catalogTotal);

        // total stock units = sum of new quantities + number of used bikes (each 1)
        const stockUnits = (newQty.totalQuantity || 0) + (usedCount.count || 0);
        setTotalStockUnits(stockUnits);

        setLowStock(Array.isArray(lowStockJson.items) ? lowStockJson.items : []);
      } catch (error) {
        console.error("Error fetching totals:", error);
        setTotalBikes(0);
        setTotalStockUnits(0);
        setLowStock([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, []);

  return (
    <div className="flex-1 bg-white p-10 min-h-screen">
      {/* Header with Sales History and Customer Details buttons */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900">Products Dashboard</h1>
        <div className="flex items-center gap-3 relative">
          <button
            className="relative inline-flex items-center justify-center h-11 w-11 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
            onClick={() => setShowLowStock((s) => !s)}
            title="Low Stock Alerts"
          >
            <span className="text-xl">🔔</span>
            {!loading && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                {lowStock.length}
              </span>
            )}
          </button>
          <Link to="/BikesSalesHistory">
            <button className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-blue-700 font-semibold py-2 px-8 hover:bg-blue-50 transition shadow-sm">
              Sold Bikes
            </button>
          </Link>
          <Link to="/BikeSalesReport">
            <button className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-blue-700 font-semibold py-2 px-6 hover:bg-blue-50 transition shadow-sm">
              Sales Reports
            </button>
          </Link>
          {showLowStock && (
            <div className="absolute right-0 top-14 z-20 w-[28rem] bg-white rounded-xl shadow-2xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">🔔</span>
                  <h3 className="text-lg font-semibold text-blue-900">Low Stock Alerts</h3>
                </div>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowLowStock(false)}>✕</button>
              </div>
              {loading ? (
                <div className="text-gray-600">Loading…</div>
              ) : lowStock.length === 0 ? (
                <div className="text-gray-600">No low stock items.</div>
              ) : (
                <div className="max-h-64 overflow-auto -mx-2">
                  {lowStock.map((item) => (
                    <div key={`${item._id}`} className="px-2 py-2 border-t border-gray-100 first:border-t-0 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-blue-900">{item.model}</div>
                        <div className="text-sm text-gray-600">{item.type} · {item.color}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Qty</div>
                        <div className="text-base font-semibold text-red-600">{item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-3 text-right">
                <Link to="/NewBikes">
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm">Manage New Bikes</button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Catalog count */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2">
               Available Bikes in Catalog
              </h2>
              <p className="text-gray-600">All Bikes Count In The Catalog</p>
            </div>
            <div className="text-right">
              {loading ? (
                <div className="text-3xl font-bold text-blue-900 animate-pulse">
                  Loading...
                </div>
              ) : (
                <div className="text-4xl font-bold text-blue-900">
                  {totalBikes}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">Models</p>
            </div>
          </div>
        </div>

        {/* Total stock units */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2">
                Available Bikes in Store
              </h2>
              <p className="text-gray-600">All bikes Count In The Store</p>
            </div>
            <div className="text-right">
              {loading ? (
                <div className="text-3xl font-bold text-blue-900 animate-pulse">
                  Loading...
                </div>
              ) : (
                <div className="text-4xl font-bold text-blue-900">
                  {totalStockUnits}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">Units</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-lg border border-gray-100 p-8 transition-all min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            {topCard.title}
          </h2>
          <p className="text-gray-700 text-lg mb-6">{topCard.description}</p>

          {/* Sub-cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand New Bikes */}
            <div className="flex flex-col justify-between bg-white text-blue-800 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg text-blue-900">Add New Bikes</h3>
              <p className="text-sm mt-1 text-gray-600">View and manage new bike inventory</p>
              <Link to="/NewBikesForm">
                <button className="mt-4 inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm">
                  Add New Bike
                </button>
              </Link>
            </div>

            {/* Used Bikes */}
            <div className="flex flex-col justify-between bg-white text-blue-800 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg text-blue-900">Add Used Bikes</h3>
              <p className="text-sm mt-1 text-gray-600">View and manage used bike inventory</p>
              <Link to="/UsedBikesForm">
                <button className="mt-4 inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm">
                  Add Used Bike
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Vehicle Overview Card */}
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            Vehicle Overview
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            Comprehensive overview of all vehicles in the inventory including
            specifications, pricing, and availability status.
          </p>
          <div className="flex gap-4 mt-auto">
            <Link to="/NewBikes">
              <button className="bg-blue-600 text-white py-2 px-8 rounded-xl hover:bg-blue-700 transition w-full shadow-sm">
                New Bikes
              </button>
            </Link>
            <Link to="/UsedBikes">
              <button className="bg-blue-600 text-white py-2 px-8 rounded-xl hover:bg-blue-700 transition w-full shadow-sm">
                Used Bikes
              </button>
            </Link>
          </div>
        </div>

        {/* Reports Card */}
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            Summery and Report Generation
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            Generate detailed reports on sales performance and product
            analytics.
          </p>
          <div className="flex gap-4 mt-auto">
            <Link to="/SalesBikeForm">
              <button className="bg-blue-600 text-white py-2 px-8 rounded-xl hover:bg-blue-700 transition w-full shadow-sm">
                 Add Sales Report
              </button>
            </Link>
            <Link to="/bikeSummery">
              <button className="bg-blue-600 text-white py-2 px-8 rounded-xl hover:bg-blue-700 transition w-full shadow-sm">
                View Summery
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsDashboard;
