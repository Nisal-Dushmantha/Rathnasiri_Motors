import React from "react";
import { Link } from "react-router-dom";

function ProductsDashboard() {
  const topCard = {
    title: "Add New Bikes",
    description: "Manage and view all available bikes in inventory",
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-blue-100 to-blue-50 p-10 min-h-screen">
      <h1 className="text-4xl font-bold mb-12 text-blue-900 text-center">
        Products Dashboard
      </h1>

      {/* Top Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 transition-all min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            {topCard.title}
          </h2>
          <p className="text-gray-700 text-lg mb-6">{topCard.description}</p>

          {/* Sub-cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand New Bikes */}
            <div className="flex flex-col justify-between bg-blue-800 text-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg">Brand New Bikes</h3>
              <p className="text-sm mt-1">View and manage new bike inventory</p>
              <Link to="/NewBikesForm">
                <button className="mt-4 bg-white text-blue-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition">
                  Go
                </button>
              </Link>
            </div>

            {/* Used Bikes */}
            <div className="flex flex-col justify-between bg-blue-800 text-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg">Used Bikes</h3>
              <p className="text-sm mt-1">View and manage used bike inventory</p>
              <Link to="/UsedBikes">
                <button className="mt-4 bg-white text-blue-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition">
                  Go
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Vehicle Overview Card */}
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            Vehicle Overview
          </h2>
          <p className="text-gray-700 text-lg">
            Comprehensive overview of all vehicles in the inventory including specifications, pricing, and availability status.
          </p>
          <Link to="/NewBikes">
            <button className="mt-auto bg-blue-800 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition">
              Go
            </button>
          </Link>
        </div>

        {/* Reports Card */}
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Reports</h2>
          <p className="text-gray-700 text-lg">
            Generate detailed reports on inventory, sales performance, and product analytics.
          </p>
          <div className="mt-auto space-y-2">
            <Link to="/InventoryReports">
              <button className="w-full bg-blue-800 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition">
                Inventory Reports
              </button>
            </Link>
            <Link to="/SalesReports">
              <button className="w-full bg-blue-800 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition">
                Sales Reports
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsDashboard;

