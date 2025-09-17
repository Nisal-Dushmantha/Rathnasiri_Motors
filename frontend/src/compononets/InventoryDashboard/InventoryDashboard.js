import React from 'react'
import { Link } from "react-router-dom"; 

function  InventoryDashboard() {
  return (
    <div className="flex-1 bg-gradient-to-b from-blue-100 to-blue-50 p-10 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900">Inventory Dashboard</h1>
        <div className="flex gap-4">
          <Link to="/NewBikesForm">
            <button className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-700 transition">Add New</button>
          </Link>
          <Link to="/UsedBikes">
            <button className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-700 transition">Add Used</button>
          </Link>
        </div>
      </div>

      {/* Metric Panel */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Total Items in Inventory</h2>
              <p className="text-gray-600">New bikes, used bikes, and parts</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600">—</div>
              <p className="text-sm text-gray-500 mt-1">Total Units</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 transition-all min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Inventory</h2>
          <p className="text-gray-700 text-lg mb-6">Add and manage inventory</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col justify-between bg-blue-800 text-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg">New Bikes</h3>
              <p className="text-sm mt-1">Add brand new bikes</p>
              <Link to="/NewBikesForm">
                <button className="mt-4 bg-white text-blue-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition">Go</button>
              </Link>
            </div>
            <div className="flex flex-col justify-between bg-blue-800 text-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg">Used Bikes</h3>
              <p className="text-sm mt-1">Add used bikes</p>
              <Link to="/UsedBikes">
                <button className="mt-4 bg-white text-blue-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition">Go</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Spare Parts</h2>
          <p className="text-gray-700 text-lg">Manage spare parts inventory.</p>
          <Link to="/SpareParts">
            <button className="mt-auto bg-blue-800 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition">Open</button>
          </Link>
        </div>
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Reports</h2>
          <p className="text-gray-700 text-lg">Inventory and sales performance.</p>
          <div className="mt-auto space-y-2">
            <Link to="/InventoryReports">
              <button className="w-full bg-blue-800 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition">Inventory Reports</button>
            </Link>
            <Link to="/SalesReports">
              <button className="w-full bg-blue-800 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition">Sales Reports</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryDashboard
