import React from 'react'

function FinanceDashboard() {
  return (
    <div className="flex-1 bg-white p-10 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900">Finance Dashboard</h1>
        <div className="flex gap-3">
          <button className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-blue-700 font-semibold py-2 px-6 hover:bg-blue-50 transition shadow-sm">Revenue</button>
          <button className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-blue-700 font-semibold py-2 px-6 hover:bg-blue-50 transition shadow-sm">Expenses</button>
        </div>
      </div>

      {/* Metric Panel */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
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
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-lg border border-gray-100 p-8 transition-all min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-sky-800">Overview</h2>
          <p className="text-gray-700 text-lg mb-6">Track revenue and expenses</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col justify-between bg-white text-blue-800 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg text-blue-900">Revenue</h3>
              <p className="text-sm mt-1 text-gray-600">Daily and monthly income</p>
              <button className="mt-4 inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm">View</button>
            </div>
            <div className="flex flex-col justify-between bg-white text-blue-800 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg text-blue-900">Expenses</h3>
              <p className="text-sm mt-1 text-gray-600">Monitor operational spending</p>
              <button className="mt-4 inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm">View</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-sky-800">Monthly Report</h2>
          <p className="text-gray-700 text-lg">Export monthly finance summaries.</p>
          <button className="mt-auto inline-flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition shadow-sm">Generate</button>
        </div>
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-sky-800">Custom Report</h2>
          <p className="text-gray-700 text-lg">Build reports by date and type.</p>
          <button className="mt-auto inline-flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition shadow-sm">Build</button>
        </div>
      </div>
    </div>
  )
}

export default FinanceDashboard
