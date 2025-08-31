import React from "react";
import { Link } from "react-router-dom";

function UserDashboard() {
  const topCard = {
    title: "Customer Management",
    description: "Manage customers, loyalty programs, and rewards",
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-blue-100 to-blue-50 p-10 min-h-screen">
      <h1 className="text-4xl font-bold mb-12 text-blue-900 text-center">
        User Dashboard
      </h1>

      {/* Top Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            {topCard.title}
          </h2>
          <p className="text-gray-700 text-lg mb-6">{topCard.description}</p>

          {/* Sub-cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Loyalty */}
            <div className="flex flex-col justify-between bg-blue-800 text-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg">Customer Loyalty</h3>
              <p className="text-sm mt-1">Manage loyalty points & rewards</p>
              <Link to="/CustomerLoyalty">
                <button className="mt-4 bg-white text-blue-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition">
                  Go
                </button>
              </Link>
            </div>

            {/* Customer Details */}
            <div className="flex flex-col justify-between bg-blue-800 text-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg">Customer Details</h3>
              <p className="text-sm mt-1">View and manage customer profiles</p>
              <Link to="/CustomerDetails">
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
        {/* Vouchers & Offers */}
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            Vouchers & Offers
          </h2>
          <p className="text-gray-700 text-lg">
            Create and manage vouchers, discounts, and special offers.
          </p>
          <Link to="/VouchersOffers">
            <button className="mt-auto bg-blue-800 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition">
              Go
            </button>
          </Link>
        </div>

        {/* Reports */}
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Reports</h2>
          <p className="text-gray-700 text-lg">
            Generate and view detailed reports of customers, loyalty, and offers.
          </p>
          <Link to="/Reports">
            <button className="mt-auto bg-blue-800 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition">
              Go
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
