import React from "react";
import { Link } from "react-router-dom";
import { FaTools, FaHistory, FaClipboardList, FaWrench } from "react-icons/fa";

function Dashboard() {
  return (
    <div className="flex-1 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col gap-16">
        {/* Section: Jobs */}
        <section className="bg-white/90 rounded-2xl shadow-lg border border-blue-100 p-10">
          <h2 className="text-2xl font-bold text-blue-900 mb-8">Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Service Jobs */}
            <div className="flex flex-col items-center justify-center gap-4">
              <FaTools className="text-blue-800 text-5xl mb-2" />
              <h3 className="text-lg font-bold text-blue-800">Service Jobs</h3>
              <p className="text-gray-600 text-center">
                Track and manage all service jobs efficiently.
              </p>
              <Link to="/ServiceJobCard">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                  Go to Service Jobs
                </button>
              </Link>
            </div>
            {/* Repair Jobs */}
            <div className="flex flex-col items-center justify-center gap-4">
              <FaWrench className="text-blue-800 text-5xl mb-2" />
              <h3 className="text-lg font-bold text-blue-800">Repair Jobs</h3>
              <p className="text-gray-600 text-center">
                Track and manage all repair jobs efficiently.
              </p>
              <Link to="/RepairJobCard">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                  Go to Repair Jobs
                </button>
              </Link>
            </div>
          </div>
        </section>
        {/* Section: History */}
        <section className="bg-white/90 rounded-2xl shadow-lg border border-blue-100 p-10">
          <h2 className="text-2xl font-bold text-blue-900 mb-8">History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Vehicle History */}
            <div className="flex flex-col items-center justify-center gap-4">
              <FaHistory className="text-blue-800 text-5xl mb-2" />
              <h3 className="text-lg font-bold text-blue-800">Vehicle History</h3>
              <p className="text-gray-600 text-center">
                View detailed history of services and repairs for each vehicle.
              </p>
              <Link to="/VehicleHistory">
                <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                  Go to Vehicle History
                </button>
              </Link>
            </div>
            {/* All Jobs */}
            <div className="flex flex-col items-center justify-center gap-4">
              <FaClipboardList className="text-blue-800 text-5xl mb-2" />
              <h3 className="text-lg font-bold text-blue-800">All Jobs</h3>
              <p className="text-gray-600 text-center">
                View all completed service and repair jobs.
              </p>
              <div className="flex gap-4">
                <Link to="/AllServiceJobs">
                  <button className="bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                    Service Jobs
                  </button>
                </Link>
                <Link to="/AllRepairJobs">
                  <button className="bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                    Repair Jobs
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
