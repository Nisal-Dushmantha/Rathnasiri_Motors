import React from 'react'
import { Link } from "react-router-dom"; 
import { FaMotorcycle, FaWarehouse, FaChartBar } from "react-icons/fa";

function  InventoryDashboard() {
  return (
    <div className="flex-1 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col gap-16">
        {/* Section: Inventory Management */}
        <section className="bg-white/90 rounded-2xl shadow-lg border border-blue-100 p-10">
          <h2 className="text-2xl font-bold text-blue-900 mb-8">Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <FaMotorcycle className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">New Bikes</h3>
              <p className="text-gray-600 text-center">Add and manage brand new bikes.</p>
              <Link to="/NewBikesForm">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Go</button>
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <FaMotorcycle className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Used Bikes</h3>
              <p className="text-gray-600 text-center">Add and manage used bikes.</p>
              <Link to="/UsedBikes">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Go</button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section: Storage and Reports */}
        <section className="bg-white/90 rounded-2xl shadow-lg border border-blue-100 p-10">
          <h2 className="text-2xl font-bold text-blue-900 mb-8">Storage & Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <FaWarehouse className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Spare Parts</h3>
              <p className="text-gray-600 text-center">Manage spare parts inventory.</p>
              <Link to="/SpareParts">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Go</button>
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <FaChartBar className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Reports</h3>
              <p className="text-gray-600 text-center">Inventory and sales performance.</p>
              <div className="flex gap-4">
                <Link to="/InventoryReports">
                  <button className="bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">Inventory</button>
                </Link>
                <Link to="/SalesReports">
                  <button className="bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">Sales</button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default InventoryDashboard
