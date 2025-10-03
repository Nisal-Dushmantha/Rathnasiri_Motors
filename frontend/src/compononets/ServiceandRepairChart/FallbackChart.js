import React from 'react';

// This is a simple fallback component that will display a visual representation
// of service and repair jobs when the chart.js component fails to render
function FallbackChart({ serviceCount = 0, repairCount = 0 }) {
  // Calculate percentages for visualization
  const total = Math.max(serviceCount + repairCount, 1); // Avoid division by zero
  const servicePercentage = Math.round((serviceCount / total) * 100);
  const repairPercentage = Math.round((repairCount / total) * 100);
  
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-center mb-4">Job Distribution</h3>
      
      <div className="flex flex-col gap-4">
        {/* Service Jobs Bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Service Jobs</span>
            <span className="text-sm font-medium">{serviceCount} ({servicePercentage}%)</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-6">
            <div 
              className="bg-blue-600 h-6 rounded-full" 
              style={{ width: `${servicePercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Repair Jobs Bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Repair Jobs</span>
            <span className="text-sm font-medium">{repairCount} ({repairPercentage}%)</span>
          </div>
          <div className="w-full bg-red-100 rounded-full h-6">
            <div 
              className="bg-red-500 h-6 rounded-full" 
              style={{ width: `${repairPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Total Jobs: {serviceCount + repairCount}
      </div>
    </div>
  );
}

export default FallbackChart;
