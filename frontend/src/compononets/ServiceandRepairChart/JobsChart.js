import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title, SubTitle } from 'chart.js';
import { CalendarIcon, Loader2 } from 'lucide-react';
import FallbackChart from './FallbackChart';

// Register the required chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title, SubTitle);

function JobsChart() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobsData, setJobsData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // Current year and 4 previous years
  
  const months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching job stats for month ${selectedMonth}/${selectedYear}`);
        const response = await fetch(`http://localhost:5000/job-stats/monthly?month=${selectedMonth}&year=${selectedYear}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch job statistics');
        }
        
        const data = await response.json();
        console.log('Received job stats data:', data);
        
        // Add a slight delay so the loading state is visible to users
        // This gives better feedback that something has changed when selecting a new month
        setTimeout(() => {
          setJobsData(data);
          setLoading(false);
        }, 300);
      } catch (err) {
        console.error('Error fetching job statistics:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedMonth, selectedYear]);
  
  // Make sure we have actual numbers for the chart
  const serviceCount = jobsData?.serviceCount || 0;
  const repairCount = jobsData?.repairCount || 0;
  
  console.log("Chart data values:", { serviceCount, repairCount });
  
  // Use the actual values for display, don't substitute with 1s
  const chartDataValues = [
    serviceCount,
    repairCount
  ];
  
  // Prepare chart data - if both values are 0, use placeholder values for visibility
  const shouldUsePlaceholders = serviceCount === 0 && repairCount === 0;
  
  const chartData = {
    labels: ['Service Jobs', 'Repair Jobs'],
    datasets: [
      {
        label: 'Number of Jobs',
        data: shouldUsePlaceholders ? [1, 1] : chartDataValues,
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)', // Blue for Service Jobs
          'rgba(255, 99, 132, 0.7)', // Red for Repair Jobs
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };
  
  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: `Job Distribution for ${months.find(m => m.value === selectedMonth)?.name} ${selectedYear}`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      subtitle: {
        display: true,
        text: 'Filter by month and year using the controls above',
        font: {
          size: 12,
          style: 'italic'
        },
        padding: {
          bottom: 10
        }
      },
      legend: {
        display: false // Hide legend since we have labels on X axis
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0 // Only show integer values
        },
        title: {
          display: true,
          text: 'Number of Jobs',
          font: {
            weight: 'bold'
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Job Type',
          font: {
            weight: 'bold'
          }
        }
      }
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900">Monthly Job Distribution</h2>
        
        <div className="flex flex-col sm:flex-row items-end gap-3">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-600 font-medium mb-1">Filter by Period</p>
            <div className="flex flex-wrap gap-2">
              {/* Month Selector */}
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-500" />
                <select 
                  className="rounded-lg border border-blue-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Year Selector */}
              <div>
                <select 
                  className="rounded-lg border border-blue-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-80">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500">Loading job statistics...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          <p>Failed to load job statistics: {error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-[400px] relative flex justify-center items-center bg-white p-4 rounded-xl border border-slate-200">
            {/* Bar chart for job distribution */}
            <div style={{ height: '350px', width: '100%', position: 'relative' }} className="chart-container">
              {(chartDataValues[0] > 0 || chartDataValues[1] > 0) ? (
                <>
                  <Bar data={chartData} options={chartOptions} />
                  <div className="absolute bottom-0 left-0 text-xs text-slate-500 p-1 bg-white/50">
                    Service: {jobsData?.serviceCount || 0}, Repair: {jobsData?.repairCount || 0}
                  </div>
                </>
              ) : (
                <FallbackChart 
                  serviceCount={jobsData?.serviceCount || 0} 
                  repairCount={jobsData?.repairCount || 0} 
                />
              )}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-5 border">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Service Jobs:</span>
                <span className="font-semibold text-blue-600">{jobsData?.serviceCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Repair Jobs:</span>
                <span className="font-semibold text-red-600">{jobsData?.repairCount || 0}</span>
              </div>
              <div className="border-t border-slate-200 my-2"></div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Jobs:</span>
                <span className="font-semibold">{(jobsData?.serviceCount || 0) + (jobsData?.repairCount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Service to Repair Ratio:</span>
                <span className="font-semibold">
                  {(jobsData && (jobsData.serviceCount + jobsData.repairCount) > 0) 
                    ? `${Math.round(jobsData.serviceCount / (jobsData.serviceCount + jobsData.repairCount) * 100)}% / ${Math.round(jobsData.repairCount / (jobsData.serviceCount + jobsData.repairCount) * 100)}%` 
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobsChart;
