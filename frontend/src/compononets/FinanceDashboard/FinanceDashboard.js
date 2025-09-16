import React from 'react'
import { FaDollarSign, FaChartLine, FaFileInvoice } from "react-icons/fa";

function FinanceDashboard() {
  return (
    <div className="flex-1 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col gap-16">
        {/* Section: Overview */}
        <section className="bg-white/90 rounded-2xl shadow-lg border border-blue-100 p-10">
          <h2 className="text-2xl font-bold text-blue-900 mb-8">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center justify-center gap-3">
              <FaDollarSign className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Revenue</h3>
              <p className="text-gray-600 text-center">Track daily and monthly income.</p>
              <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">View</button>
            </div>
            <div className="flex flex-col items-center justify-center gap-3">
              <FaFileInvoice className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Expenses</h3>
              <p className="text-gray-600 text-center">Monitor operational spending.</p>
              <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">View</button>
            </div>
            <div className="flex flex-col items-center justify-center gap-3">
              <FaChartLine className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Trends</h3>
              <p className="text-gray-600 text-center">Analyze cash flow and KPIs.</p>
              <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Analyze</button>
            </div>
          </div>
        </section>

        {/* Section: Reports */}
        <section className="bg-white/90 rounded-2xl shadow-lg border border-blue-100 p-10">
          <h2 className="text-2xl font-bold text-blue-900 mb-8">Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <FaFileInvoice className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Monthly Report</h3>
              <p className="text-gray-600 text-center">Export monthly finance summaries.</p>
              <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Generate</button>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <FaChartLine className="text-blue-800 text-5xl" />
              <h3 className="text-lg font-bold text-blue-800">Custom Report</h3>
              <p className="text-gray-600 text-center">Build reports by date and type.</p>
              <button className="mt-2 bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Build</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default FinanceDashboard
