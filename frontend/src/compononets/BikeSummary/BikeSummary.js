import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function BikeSummary() {
  const [availableBikes, setAvailableBikes] = useState(0);
  const [soldBikes, setSoldBikes] = useState(0);
  const [allSoldRecords, setAllSoldRecords] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch available bikes data
        const [newBikesRes, usedBikesRes, soldBikesRes] = await Promise.all([
          fetch("http://localhost:5000/newBs/quantity-sum"),
          fetch("http://localhost:5000/usedBs/count"),
          fetch("http://localhost:5000/newBsH")
        ]);

        const [newBikesData, usedBikesData, soldBikesData] = await Promise.all([
          newBikesRes.json(),
          usedBikesRes.json(),
          soldBikesRes.json()
        ]);

        // Calculate available bikes (new bike quantities + used bike count)
        const newBikesQuantity = newBikesData.totalQuantity || 0;
        const usedBikesCount = usedBikesData.count || 0;
        const totalAvailable = newBikesQuantity + usedBikesCount;

        // Keep all sold records for month filtering
        const soldRecords = Array.isArray(soldBikesData.newBsH) ? soldBikesData.newBsH : [];
        setAllSoldRecords(soldRecords);

        // derive month options from soldRecords (format YYYY-MM)
        const monthsSet = new Set();
        soldRecords.forEach((r) => {
          if (r.date) {
            const d = new Date(r.date);
            if (!isNaN(d)) {
              const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`;
              monthsSet.add(m);
            }
          }
        });
        const months = Array.from(monthsSet).sort((a,b) => b.localeCompare(a));
        setMonthOptions(months);

        // default: show total sold count across all time
        const soldBikesCount = soldRecords.length;

        setAvailableBikes(totalAvailable);
        setSoldBikes(soldBikesCount);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
        setAvailableBikes(0);
        setSoldBikes(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart data
  const chartData = {
    labels: ['Available Bikes', 'Sold Bikes'],
    datasets: [
      {
        data: [availableBikes, soldBikes],
        backgroundColor: [
          '#4169E1', // Dark blue for available
          '#90EE90', // Dark green for sold
        ],
        borderColor: [
          '#000000', // Darker blue border
          '#000000', // Darker green border
        ],
        borderWidth: 1,
        hoverBackgroundColor: [
          '#1D4ED8', // Slightly lighter blue on hover
          '#059669', // Slightly lighter green on hover
        ],
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = availableBikes + soldBikes;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} bikes (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading bike summary...</p>
        </div>
      </div>
    );
  }

  // handle month selection
  const handleMonthChange = (e) => {
    const val = e.target.value;
    setSelectedMonth(val);
    if (!val) {
      setSoldBikes(allSoldRecords.length);
      return;
    }
    // compute sold in that month
    const [y, m] = val.split('-').map(Number);
    const count = allSoldRecords.reduce((acc, r) => {
      if (!r.date) return acc;
      const d = new Date(r.date);
      if (d.getFullYear() === y && (d.getMonth()+1) === m) return acc + 1;
      return acc;
    }, 0);
    setSoldBikes(count);
  };

  // derive sold list for selected month
  const soldListForMonth = (() => {
    if (!selectedMonth) return allSoldRecords;
    const [y, m] = selectedMonth.split('-').map(Number);
    return allSoldRecords.filter((r) => {
      if (!r.date) return false;
      const d = new Date(r.date);
      return d.getFullYear() === y && (d.getMonth()+1) === m;
    });
  })();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-10 border border-gray-200 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 mb-2 tracking-tight">
              🏍 Bike Inventory Summary
            </h1>
            <p className="text-gray-700 text-lg">
              Overview of available and sold bikes in your inventory
            </p>
          </div>
          <div className="flex gap-4 items-center">
            {/* Month filter dropdown */}
            <div>
              <select value={selectedMonth} onChange={handleMonthChange} className="px-3 py-2 border rounded-lg">
                <option value="">All Months</option>
                {monthOptions.map((m) => {
                  const display = new Date(`${m}-01`).toLocaleString('default', { month: 'long', year: 'numeric' });
                  return <option key={m} value={m}>{display}</option>;
                })}
              </select>
            </div>

          
            <button onClick={() => window.location.href = '/NewBikes'} className="bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-blue-800 transition">New Bikes</button>
            <button onClick={() => window.location.href = '/UsedBikes'} className="bg-green-700 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-green-800 transition">Used Bikes</button>
            <button onClick={() => window.location.href = '/BikesSalesHistory'} className="bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-purple-800 transition"> Monthly Sales History</button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-blue-50 rounded-2xl p-8 text-center shadow-md flex flex-col items-center">
            <div className="text-5xl font-extrabold text-blue-800 mb-2">{availableBikes}</div>
            <div className="text-blue-700 font-semibold text-lg">Available Bikes</div>
            <div className="text-sm text-gray-500 mt-1">Currently in stock</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-8 text-center shadow-md flex flex-col items-center">
            <div className="text-5xl font-extrabold text-green-800 mb-2">{soldBikes}</div>
            <div className="text-green-700 font-semibold text-lg">Sold Bikes</div>
            <div className="text-sm text-gray-500 mt-1">Successfully sold</div>
          </div>
          <div className="bg-purple-50 rounded-2xl p-8 text-center shadow-md flex flex-col items-center">
            <div className="text-5xl font-extrabold text-purple-800 mb-2">{availableBikes + soldBikes}</div>
            <div className="text-purple-700 font-semibold text-lg">Total Bikes</div>
            <div className="text-sm text-gray-500 mt-1">All time inventory</div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📊 Inventory Distribution</h2>
          <div className="h-96 w-full max-w-lg mx-auto">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col gap-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">📈 Sales Performance</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sales Rate:</span>
              <span className="font-bold text-green-600 text-lg">
                {availableBikes + soldBikes > 0 
                  ? ((soldBikes / (availableBikes + soldBikes)) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available Rate:</span>
              <span className="font-bold text-blue-600 text-lg">
                {availableBikes + soldBikes > 0 
                  ? ((availableBikes / (availableBikes + soldBikes)) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col gap-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">  Insights</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Keep your available bikes above 20% for healthy inventory.</li>
              <li>Monitor sales trends to optimize stock levels.</li>
              <li>Use quick actions above to manage inventory efficiently.</li>
            </ul>
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Sold Bikes ({selectedMonth ? new Date(`${selectedMonth}-01`).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'All'})</h4>
              {soldListForMonth.length === 0 ? (
                <div className="text-sm text-gray-500">No sold bikes for this period.</div>
              ) : (
                <ul className="text-sm text-gray-700 list-disc pl-6 space-y-1 max-h-40 overflow-auto">
                  {soldListForMonth.map((r) => (
                    <li key={r._id}>{r.buyer_name ? `${r.buyer_name} — ` : ''}{r.model || r.bike_model || 'Unknown Model'} — Rs. {r.last_price}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BikeSummary;