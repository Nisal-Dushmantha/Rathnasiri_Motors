import React, { useState } from 'react';
import JobsChart from './JobsChart';
import EconomyChart from './EconomyChart';
import { BarChart2, PieChart, LayoutDashboard } from 'lucide-react';

function ServiceandRepairChart() {
  const [activeTab, setActiveTab] = useState('jobs');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Band */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600" />
        <div className="absolute inset-0 -z-10 opacity-15 mix-blend-soft-light bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-8 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl text-blue-900 font-extrabold tracking-tight">
                Job Statistics & Analytics
              </h1>
              <p className="mt-1 text-blue-900">
                Analyze service and repair data for insights
              </p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 justify-center rounded-xl border border-white bg-white/10 backdrop-blur-sm text-white font-semibold py-2 px-4 hover:bg-white/20 transition"
              >
                <LayoutDashboard className="h-4 w-4" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'jobs'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            <PieChart className="w-4 h-4" />
            Jobs Analysis
          </button>
          <button
            onClick={() => setActiveTab('economy')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'economy'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Revenue Analysis
          </button>
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          {activeTab === 'jobs' && <JobsChart />}
          {activeTab === 'economy' && <EconomyChart />}
        </div>
      </div>
    </div>
  );
}

export default ServiceandRepairChart;
