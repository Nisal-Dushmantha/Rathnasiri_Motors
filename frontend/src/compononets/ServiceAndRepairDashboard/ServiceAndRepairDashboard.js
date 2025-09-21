import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [serviceCount, setServiceCount] = useState(null);
  const [repairCount, setRepairCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const [svcRes, repRes] = await Promise.all([
          fetch('http://localhost:5000/services/count'),
          fetch('http://localhost:5000/repairs/count'),
        ]);
        const svc = await svcRes.json();
        const rep = await repRes.json();
        setServiceCount(svc.count || 0);
        setRepairCount(rep.count || 0);
      } catch (e) {
        setServiceCount(0);
        setRepairCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="flex-1 bg-gradient-to-b from-blue-100 to-blue-50 p-10 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900">Service & Repair Dashboard</h1>
        <div className="flex gap-4">
          <Link to="/ServiceJobCard">
            <button className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-700 transition">Service Jobs</button>
          </Link>
          <Link to="/RepairJobCard">
            <button className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-700 transition">Repair Jobs</button>
          </Link>
        </div>
      </div>

      {/* Metric Panel */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-blue-900 mb-1">Total Service Jobs</h2>
                <p className="text-gray-600">Completed and ongoing</p>
              </div>
              <div className="text-right">
                {loading ? (
                  <div className="text-3xl font-bold text-blue-600 animate-pulse">Loading...</div>
                ) : (
                  <div className="text-4xl font-bold text-blue-600">{serviceCount}</div>
                )}
                <p className="text-sm text-gray-500 mt-1">Services</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-blue-900 mb-1">Total Repair Jobs</h2>
                <p className="text-gray-600">Completed and ongoing</p>
              </div>
              <div className="text-right">
                {loading ? (
                  <div className="text-3xl font-bold text-blue-600 animate-pulse">Loading...</div>
                ) : (
                  <div className="text-4xl font-bold text-blue-600">{repairCount}</div>
                )}
                <p className="text-sm text-gray-500 mt-1">Repairs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 transition-all min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Job Cards</h2>
          <p className="text-gray-700 text-lg mb-6">Create and manage service and repair job cards</p>

          {/* Sub-cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col justify-between bg-blue-800 text-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg">Service Jobs</h3>
              <p className="text-sm mt-1">Track service jobs</p>
              <Link to="/ServiceJobCard">
                <button className="mt-4 bg-white text-blue-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition">Add Service</button>
              </Link>
            </div>
            <div className="flex flex-col justify-between bg-blue-800 text-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg">Repair Jobs</h3>
              <p className="text-sm mt-1">Track repair jobs</p>
              <Link to="/RepairJobCard">
                <button className="mt-4 bg-white text-blue-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition">Add Repaire</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Vehicle History</h2>
          <p className="text-gray-700 text-lg">View detailed history of services and repairs for each vehicle.</p>
          <Link to="/VehicleHistory">
            <button className="mt-auto bg-blue-800 text-white py-2 px-8 rounded-xl  hover:bg-blue-700 transition">View Details</button>
          </Link>
        </div>

        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">All Jobs</h2>
          <p className="text-gray-700 text-lg">Browse all completed service and repair jobs.</p>
          <div className="mt-auto flex gap-4">
            <Link to="/AllServiceJobs" className="flex-1">
              <button className="w-full bg-blue-800 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition">Service Jobs</button>
            </Link>
            <Link to="/AllRepairJobs" className="flex-1">
              <button className="w-full bg-blue-800 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition">Repair Jobs</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
