import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { CalendarIcon, Loader2 } from 'lucide-react';

// Register the required chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function EconomyChart() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // Current year and 4 previous years
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:5000/job-stats/revenue?year=${selectedYear}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch revenue statistics');
        }
        
        const data = await response.json();
        setRevenueData(data);
      } catch (err) {
        console.error('Error fetching revenue statistics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedYear]);

  // Prepare chart data
  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Service Revenue',
        data: revenueData?.serviceRevenue || Array(12).fill(0),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Repair Revenue',
        data: revenueData?.repairRevenue || Array(12).fill(0),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };
  
  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: `Monthly Revenue for ${selectedYear}`,
        font: {
          size: 16
        }
      },
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'LKR',
                minimumFractionDigits: 2
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          // Format the y-axis ticks as currency
          callback: function(value) {
            return 'Rs. ' + value.toLocaleString();
          }
        }
      }
    }
  };

  // Calculate total revenue
  const calculateTotals = () => {
    if (!revenueData) return { service: 0, repair: 0, total: 0 };
    
    const serviceTotalRevenue = revenueData.serviceRevenue.reduce((sum, value) => sum + value, 0);
    const repairTotalRevenue = revenueData.repairRevenue.reduce((sum, value) => sum + value, 0);
    const totalRevenue = serviceTotalRevenue + repairTotalRevenue;
    
    return {
      service: serviceTotalRevenue,
      repair: repairTotalRevenue,
      total: totalRevenue
    };
  };
  
  const totals = calculateTotals();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900">Revenue Analysis</h2>
        
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-slate-500" />
          <select 
            className="rounded-lg border border-slate-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-80">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500">Loading revenue data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          <p>Failed to load revenue data: {error}</p>
        </div>
      ) : revenueData && totals.total === 0 ? (
        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-200 text-center">
          <p>No revenue data available for {selectedYear}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-[400px] relative">
            <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="bg-slate-50 rounded-xl p-5 border">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Annual Summary for {selectedYear}</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Service Revenue:</span>
                <span className="font-semibold text-blue-600">{formatCurrency(totals.service)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Repair Revenue:</span>
                <span className="font-semibold text-red-600">{formatCurrency(totals.repair)}</span>
              </div>
              <div className="border-t border-slate-200 my-2"></div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Revenue:</span>
                <span className="font-semibold text-green-600">{formatCurrency(totals.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Service Contribution:</span>
                <span className="font-semibold">
                  {totals.total > 0 ? Math.round((totals.service / totals.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Repair Contribution:</span>
                <span className="font-semibold">
                  {totals.total > 0 ? Math.round((totals.repair / totals.total) * 100) : 0}%
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Highest Revenue Month</h4>
              {revenueData && (
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex justify-between items-center">
                    {(() => {
                      // Find the month with highest revenue
                      const monthlyTotals = revenueData.serviceRevenue.map((srv, i) => 
                        srv + revenueData.repairRevenue[i]);
                      const maxValue = Math.max(...monthlyTotals);
                      const maxMonth = monthlyTotals.indexOf(maxValue);
                      
                      return (
                        <>
                          <span className="font-medium">{months[maxMonth]}</span>
                          <span className="text-green-600 font-semibold">{formatCurrency(maxValue)}</span>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EconomyChart;
