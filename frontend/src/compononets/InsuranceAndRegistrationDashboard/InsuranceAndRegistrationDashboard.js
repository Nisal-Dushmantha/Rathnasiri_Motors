import React from 'react'
import { Link } from "react-router-dom";
import { FaClipboardList, FaRegIdCard } from "react-icons/fa";

function InsuranceAndRegistrationDashboard() {
  return (
    <div className="flex-1 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col gap-16">
        {/* Section: Job Cards */}
        <section className="bg-white/90 rounded-2xl shadow-lg border border-blue-100 p-10">
          <h2 className="text-2xl font-bold text-blue-900 mb-8">Job Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <FaRegIdCard className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Service Job Card</h3>
              <p className="text-gray-600 text-center">Create and manage service job cards.</p>
              <Link to="/ServiceJobCard">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Go</button>
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <FaRegIdCard className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Repair Job Card</h3>
              <p className="text-gray-600 text-center">Create and manage repair job cards.</p>
              <Link to="/RepairJobCard">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Go</button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section: History and All Jobs */}
        <section className="bg-white/90 rounded-2xl shadow-lg border border-blue-100 p-10">
          <h2 className="text-2xl font-bold text-blue-900 mb-8">Records</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <FaClipboardList className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Vehicle History</h3>
              <p className="text-gray-600 text-center">View detailed service and repair history.</p>
              <Link to="/VehicleHistory">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Go</button>
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <FaClipboardList className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">All Jobs</h3>
              <p className="text-gray-600 text-center">Browse all completed jobs.</p>
              <div className="flex gap-4">
                <Link to="/AllServiceJobs">
                  <button className="bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">Service Jobs</button>
                </Link>
                <Link to="/AllRepairJobs">
                  <button className="bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">Repair Jobs</button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default InsuranceAndRegistrationDashboard;
