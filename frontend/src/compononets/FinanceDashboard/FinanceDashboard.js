import React from 'react'

function FinanceDashboard() {
  return (
    <div className="flex-1 bg-gradient-to-b from-sky-100 to-sky-50 p-10 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900">Finance Dashboard</h1>
        <div className="flex gap-4">
          <button className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-xl hover:bg-sky-600 transition">Revenue</button>
          <button className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-xl hover:bg-sky-600 transition">Expenses</button>
        </div>
      </div>

      {/* Metric Panel */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-sky-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Monthly Financial Summary</h2>
              <p className="text-gray-600">Key totals for the current month</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-900">—</div>
              <p className="text-sm text-gray-500 mt-1">Overview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 transition-all min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-sky-800">Overview</h2>
          <p className="text-gray-700 text-lg mb-6">Track revenue and expenses</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col justify-between bg-blue-800 text-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg">Revenue</h3>
              <p className="text-sm mt-1">Daily and monthly income</p>
              <button className="mt-4 bg-white text-sky-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition">View</button>
            </div>
            <div className="flex flex-col justify-between bg-blue-800 text-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg">Expenses</h3>
              <p className="text-sm mt-1">Monitor operational spending</p>
              <button className="mt-4 bg-white text-sky-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition">View</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-sky-800">Monthly Report</h2>
          <p className="text-gray-700 text-lg">Export monthly finance summaries.</p>
          <button className="mt-auto bg-blue-800 text-white py-2 px-4 rounded-xl hover:bg-sky-600 transition">Generate</button>
        </div>
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-sky-800">Custom Report</h2>
          <p className="text-gray-700 text-lg">Build reports by date and type.</p>
          <button className="mt-auto bg-blue-800 text-white py-2 px-4 rounded-xl hover:bg-sky-600 transition">Build</button>
        </div>
      </div>
    </div>
  )
}

export default FinanceDashboard
