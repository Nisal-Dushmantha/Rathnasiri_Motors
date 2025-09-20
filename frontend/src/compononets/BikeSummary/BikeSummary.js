import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function BikeSummary() {
  const [availableBikes, setAvailableBikes] = useState(0);
  const [soldBikes, setSoldBikes] = useState(0);
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

        // Get sold bikes count
        const soldBikesCount = Array.isArray(soldBikesData.newBsH) ? soldBikesData.newBsH.length : 0;

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading bike summary...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
          <div className="text-center">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            🏍️ Bike Inventory Summary
          </h1>
          <p className="text-gray-600 text-lg">
            Overview of available and sold bikes in your inventory
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-100 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-800 mb-2">
              {availableBikes}
            </div>
            <div className="text-blue-600 font-semibold">Available Bikes</div>
            <div className="text-sm text-gray-600 mt-1">
              Currently in stock
            </div>
          </div>
          
          <div className="bg-green-100 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-800 mb-2">
              {soldBikes}
            </div>
            <div className="text-green-600 font-semibold">Sold Bikes</div>
            <div className="text-sm text-gray-600 mt-1">
              Successfully sold
            </div>
          </div>
          
          <div className="bg-purple-100 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-800 mb-2">
              {availableBikes + soldBikes}
            </div>
            <div className="text-purple-600 font-semibold">Total Bikes</div>
            <div className="text-sm text-gray-600 mt-1">
              All time inventory
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📊 Inventory Distribution
          </h2>
          <div className="h-96 w-full">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              📈 Sales Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sales Rate:</span>
                <span className="font-bold text-green-600">
                  {availableBikes + soldBikes > 0 
                    ? ((soldBikes / (availableBikes + soldBikes)) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Available Rate:</span>
                <span className="font-bold text-blue-600">
                  {availableBikes + soldBikes > 0 
                    ? ((availableBikes / (availableBikes + soldBikes)) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              📋 Quick Actions
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/NewBikes'}
                className="w-full bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                View New Bikes
              </button>
              <button 
                onClick={() => window.location.href = '/UsedBikes'}
                className="w-full bg-green-800 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
              >
                View Used Bikes
              </button>
              <button 
                onClick={() => window.location.href = '/BikesSalesHistory'}
                className="w-full bg-purple-800 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
              >
                View Sales History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BikeSummary;
