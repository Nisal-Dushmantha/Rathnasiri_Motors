import React from 'react'
import { Link } from "react-router-dom";

function InsuranceAndRegistrationDashboard() {
  const topCard = {
    title: "Job Cards",
    description: "Add New Service and Repair Job Cards",
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-blue-100 to-blue-50 p-10 min-h-screen">
      <h1 className="text-4xl font-bold mb-12 text-blue-900 text-center">
        Insurance And Registration Dashboard
      </h1>

      {/* Top Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 transition-all min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            {topCard.title}
          </h2>
          <p className="text-gray-700 text-lg mb-6">{topCard.description}</p>

          {/* Sub-cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Job Card */}
            <div className="flex flex-col justify-between bg-blue-800 text-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg">Service Job Card</h3>
              <p className="text-sm mt-1">Track service jobs</p>
              <Link to="/ServiceJobCard">
                <button className="mt-4 bg-white text-blue-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition">
                  Go
                </button>
              </Link>
            </div>

            {/* Repair Job Card */}
            <div className="flex flex-col justify-between bg-blue-800 text-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg">Repair Job Card</h3>
              <p className="text-sm mt-1">Track repair jobs</p>
              <Link to="/RepairJobCard">
                <button className="mt-4 bg-white text-blue-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition">
                  Go
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card Layer */}
      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Vehicle History Card */}
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            Vehicle History
          </h2>
          <p className="text-gray-700 text-lg">
            View detailed history of services and repairs for each vehicle.
          </p>
          <Link to="/VehicleHistory">
          <button className="mt-auto bg-blue-800 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition">
            Go
          </button>
          </Link> 
        </div>

        {/* All Jobs Card*/}
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">All Jobs</h2>
          <p className="text-gray-700 text-lg">
            View All the Jobs that are completed including service and repair
            jobs.
          </p>
          <Link to="/AllServiceJobs">
            <button className="mt-auto bg-blue-800 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition">
              Service Job Details
            </button>
          </Link>
          <Link to="/AllRepairJobs">
            <button className="mt-auto bg-blue-800 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition">
              Repair Job Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InsuranceAndRegistrationDashboard;
