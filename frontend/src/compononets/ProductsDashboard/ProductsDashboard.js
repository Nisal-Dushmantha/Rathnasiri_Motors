import React from "react";
import { Link } from "react-router-dom";
import { FaMotorcycle, FaClipboardList } from "react-icons/fa";

function ProductsDashboard() {
  return (
    <div className="flex-1 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col gap-16">
        {/* Section: Bikes */}
        <section className="bg-white/90 rounded-2xl shadow-lg border border-blue-100 p-10">
          <h2 className="text-2xl font-bold text-blue-900 mb-8">Bikes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <FaMotorcycle className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Brand New Bikes</h3>
              <p className="text-gray-600 text-center">Manage new bike inventory.</p>
              <Link to="/NewBikesForm">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Go</button>
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <FaMotorcycle className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Used Bikes</h3>
              <p className="text-gray-600 text-center">Manage used bike inventory.</p>
              <Link to="/UsedBikesForm">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Go</button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section: Reports */}
        <section className="bg-white/90 rounded-2xl shadow-lg border border-blue-100 p-10">
          <h2 className="text-2xl font-bold text-blue-900 mb-8">Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <FaClipboardList className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Inventory Reports</h3>
              <p className="text-gray-600 text-center">Product stock and availability.</p>
              <Link to="/InventoryReports">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Open</button>
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <FaClipboardList className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Sales Reports</h3>
              <p className="text-gray-600 text-center">Sales performance and analytics.</p>
              <Link to="/SalesReports">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Open</button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductsDashboard;
