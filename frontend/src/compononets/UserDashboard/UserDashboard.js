import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaGift, FaIdCard, FaChartBar } from "react-icons/fa";

function UserDashboard() {
  return (
    <div className="flex-1 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col gap-16">
        {/* Section: Customer Management */}
        <section className="bg-white/90 rounded-2xl shadow-lg border border-blue-100 p-10">
          <h2 className="text-2xl font-bold text-blue-900 mb-8">Customer Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <FaUsers className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Customer Details</h3>
              <p className="text-gray-600 text-center">View and manage customer profiles.</p>
              <Link to="/CustomerDetails">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Open</button>
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <FaIdCard className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Customer Loyalty</h3>
              <p className="text-gray-600 text-center">Manage loyalty points & rewards.</p>
              <Link to="/CustomerLoyalty">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Open</button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section: Offers & Reports */}
        <section className="bg-white/90 rounded-2xl shadow-lg border border-blue-100 p-10">
          <h2 className="text-2xl font-bold text-blue-900 mb-8">Offers & Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <FaGift className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Vouchers & Offers</h3>
              <p className="text-gray-600 text-center">Create and manage discounts and offers.</p>
              <Link to="/VouchersOffers">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Open</button>
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <FaChartBar className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Reports</h3>
              <p className="text-gray-600 text-center">Detailed analytics on customers and rewards.</p>
              <Link to="/Reports">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Open</button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserDashboard;
