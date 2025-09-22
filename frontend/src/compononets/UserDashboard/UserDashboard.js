import React from "react";
import { Link } from "react-router-dom";

function UserDashboard() {
  return (
    <div className="flex-1 bg-white p-10 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900">User Management</h1>
        <div className="flex gap-3">
          <Link to="/CustomerDetails">
            <button className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-blue-700 font-semibold py-2 px-6 hover:bg-blue-50 transition shadow-sm">Customers</button>
          </Link>
          <Link to="/CustomerLoyalty">
            <button className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-blue-700 font-semibold py-2 px-6 hover:bg-blue-50 transition shadow-sm">Loyalty</button>
          </Link>
        </div>
      </div>

      {/* Metric Panel */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Total Registered Customers</h2>
              <p className="text-gray-600">Including active loyalty members</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-900">—</div>
              <p className="text-sm text-gray-500 mt-1">Total Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-lg border border-gray-100 p-8 transition-all min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Customer Management</h2>
          <p className="text-gray-700 text-lg mb-6">Manage customers and loyalty</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col justify-between bg-white text-blue-800 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg text-blue-900">Customer Details</h3>
              <p className="text-sm mt-1 text-gray-600">Profiles and basic info</p>
              <Link to="/CustomerDetails">
                <button className="mt-4 inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm">Open</button>
              </Link>
            </div>
            <div className="flex flex-col justify-between bg-white text-blue-800 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg text-blue-900">Customer Loyalty</h3>
              <p className="text-sm mt-1 text-gray-600">Points and rewards</p>
              <Link to="/CustomerLoyalty">
                <button className="mt-4 inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm">Open</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Discounts & Offers</h2>
          <p className="text-gray-700 text-lg">Create and manage discounts and offers.</p>
          <Link to="/CustomerOffers">
            <button className="mt-auto inline-flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition shadow-sm">Open</button>
          </Link>
        </div>
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Reports</h2>
          <p className="text-gray-700 text-lg">Detailed analytics on customers and rewards.</p>
          <Link to="/Reports">
            <button className="mt-auto inline-flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition shadow-sm">Open</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
