import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function CloudStorage() {
  const [userStorage, setUserStorage] = useState(5); // Example: 5 GB used
  const totalStorage = 20;
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const storedUserStorage = localStorage.getItem("userStorage");
    if (storedUserStorage) {
      setUserStorage(Number(storedUserStorage));
    }
  }, []);
  
  const remainingStorage = totalStorage - userStorage;
  const usedPercentage = (userStorage / totalStorage) * 100;
  const remainingPercentage = (remainingStorage / totalStorage) * 100;

  // Create SVG donut chart
  const radius = 80;
  const strokeWidth = 16;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const usedStrokeOffset = circumference - (usedPercentage / 100) * circumference;

  return (
    <div className="flex justify-start p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-2xl">
        <div className="flex items-center justify-between gap-8">
          {/* Donut Chart */}
          <div 
            className="relative flex-shrink-0"
            onMouseEnter={() => setHoveredSegment('chart')}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <svg
              height={radius * 2 + strokeWidth}
              width={radius * 2 + strokeWidth}
              className="transform -rotate-90 cursor-pointer"
            >
              {/* Background circle */}
              <circle
                stroke="#f1f5f9"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius + strokeWidth * 0.5}
                cy={radius + strokeWidth * 0.5}
              />
              {/* Used storage arc */}
              <circle
                stroke="#3b82f6"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={usedStrokeOffset}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius + strokeWidth * 0.5}
                cy={radius + strokeWidth * 0.5}
                className="transition-all duration-500 ease-out hover:stroke-blue-600"
                onMouseEnter={() => setHoveredSegment('used')}
              />
              {/* Remaining storage arc (invisible but interactive) */}
              <circle
                stroke="transparent"
                fill="transparent"
                strokeWidth={strokeWidth + 4}
                strokeDasharray={`${(remainingPercentage / 100) * circumference} ${circumference}`}
                strokeDashoffset={-((usedPercentage / 100) * circumference)}
                r={normalizedRadius}
                cx={radius + strokeWidth * 0.5}
                cy={radius + strokeWidth * 0.5}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredSegment('remaining')}
              />
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-bold text-gray-900">{totalStorage} GB</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>

            {/* Hover tooltip */}
            {hoveredSegment && hoveredSegment !== 'chart' && (
              <div className="absolute top-4 left-full ml-4 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg z-10 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${hoveredSegment === 'used' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <span className="font-medium">
                    {hoveredSegment === 'used' ? 'Used Storage' : 'Available Storage'}
                  </span>
                </div>
                <div className="text-lg font-bold mt-1">
                  {hoveredSegment === 'used' ? userStorage : remainingStorage} GB
                </div>
                <div className="text-xs text-gray-300">
                  {hoveredSegment === 'used' ? Math.round(usedPercentage) : Math.round(remainingPercentage)}% of total
                </div>
                {/* Tooltip arrow */}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full">
                  <div className="w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-col gap-4 flex-1">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Available Cloud Storage
              </h3>
              <p className="text-gray-600 mb-1">
                <span className="font-medium text-gray-900">{userStorage} GB</span> used of {totalStorage} GB
              </p>
              <p className="text-sm text-gray-500">
                {Math.round(remainingPercentage)}% free
              </p>
            </div>
            
           {/* Action button */}
<button 
  onClick={() => navigate('/dashboard/view-storage')}
  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 self-start group"
>
  View Details
  <svg 
    className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-200" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
</button>
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default CloudStorage;