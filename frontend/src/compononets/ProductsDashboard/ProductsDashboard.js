import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMotorcycle, FaClipboardList } from "react-icons/fa";

function ProductsDashboard() {
  const [totalBikes, setTotalBikes] = useState(0);
  const [loading, setLoading] = useState(true);

  const topCard = {
    title: "Add New Bikes",
    description: "Manage and view all available bikes in inventory",
  };

  useEffect(() => {
    const fetchTotalBikes = async () => {
      try {
        setLoading(true);
        // Fetch new bikes count
        const newBikesResponse = await fetch('http://localhost:5000/newBs/count');
        const newBikesData = await newBikesResponse.json();
        
        // Fetch used bikes count
        const usedBikesResponse = await fetch('http://localhost:5000/usedBs/count');
        const usedBikesData = await usedBikesResponse.json();
        
        // Calculate total
        const total = (newBikesData.count || 0) + (usedBikesData.count || 0);
        setTotalBikes(total);
      } catch (error) {
        console.error('Error fetching bike counts:', error);
        setTotalBikes(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalBikes();
  }, []);

  return (
    <div className="flex-1 bg-gradient-to-b from-blue-100 to-blue-50 p-10 min-h-screen">
      {/* Header with Sales History and Customer Details buttons */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900">
          Products Dashboard
        </h1>
        <div className="flex gap-4">
          <Link to="/BikesSalesHistory">
            <button className="bg-blue-800 text-white font-semibold py-2 px-8 rounded-xl hover:bg-blue-700 transition">
              Sales History
            </button>
          </Link>
          <Link to="/CustomerDetails">
            <button className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-700 transition">
              Customer Details
            </button>
          </Link>
        </div>
      </div>

      {/* Total Bikes Quantity Display */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Total Bikes in a Catalogue</h2>
              <p className="text-gray-600">Quantity of new and used bikes</p>
            </div>
            <div className="text-right">
              {loading ? (
                <div className="text-3xl font-bold text-blue-600 animate-pulse">Loading...</div>
              ) : (
                <div className="text-4xl font-bold text-blue-600">{totalBikes}</div>
              )}
              <p className="text-sm text-gray-500 mt-1">Total Units</p>
            </div>
          </div>
        </div>
      </div>

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
              <h3 className="font-semibold text-lg">Add New Bikes</h3>
              <p className="text-sm mt-1">View and manage new bike inventory</p>
              <Link to="/NewBikesForm">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Go</button>
              </Link>
            </div>

            {/* Used Bikes */}
            <div className="flex flex-col justify-between bg-blue-800 text-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg">Add Used Bikes</h3>
              <p className="text-sm mt-1">View and manage used bike inventory</p>
              <Link to="/UsedBikesForm">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Go</button>
              </Link>
            </div>
          </div>
        </section>

      {/* Bottom Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Vehicle Overview Card */}
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            Vehicle Overview
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            Comprehensive overview of all vehicles in the inventory including specifications, pricing, and availability status.
          </p>
          <div className="flex gap-4 mt-auto">
            <Link to="/NewBikes">
              <button className="bg-blue-800 text-white py-2 px-8 rounded-xl hover:bg-blue-700 transition w-full">
                New Bikes
              </button>
            </Link>
            <Link to="/UsedBikes">
              <button className="bg-blue-800 text-white py-2 px-8 rounded-xl hover:bg-blue-700 transition w-full">
                Used Bikes
              </button>
            </Link>
          </div>
        </div>

        {/* Reports Card */}
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Reports</h2>
          <p className="text-gray-700 text-lg">
            Generate detailed reports on sales performance and product analytics.
          </p>
          <div className="mt-auto">
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
