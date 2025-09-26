// src/components/Dashboard/ViewStorage/Banner.jsx
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useNavigate } from "react-router-dom";

export default function Banner() {
  const navigate = useNavigate();
  const [userStorage, setUserStorage] = useState(5); // Example: 5 GB used
  const totalStorage = 20;
  const [hoveredSegment, setHoveredSegment] = useState(null);

  useEffect(() => {
    const storedUserStorage = localStorage.getItem("userStorage");
    if (storedUserStorage !== null) {
      setUserStorage(Number(storedUserStorage));
    }
  }, []);

  const remainingStorage = Math.max(0, totalStorage - userStorage);
  const usedPercentage = Math.min(100, Math.max(0, (userStorage / totalStorage) * 100));
  const remainingPercentage = Math.round(100 - usedPercentage);

  // Donut chart calculations
  const radius = 80;
  const strokeWidth = 16;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const usedStrokeOffset = circumference - (usedPercentage / 100) * circumference;

  return (
    <Box
      sx={{
        backgroundColor: "#dbeafe",
        p: 4,
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "1200px",
        width: "100%",
        mx: "auto",
        my: 4,
        minHeight: "260px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      }}
    >
      <div className="flex items-center gap-12 w-full">
        {/* Donut Chart */}
        <div
          className="relative flex-shrink-0"
          onMouseEnter={() => setHoveredSegment("available")}
          onMouseLeave={() => setHoveredSegment(null)}
          onFocus={() => setHoveredSegment("available")}
          onBlur={() => setHoveredSegment(null)}
          tabIndex={0}
          role="group"
          aria-label={`Storage usage: ${Math.round(usedPercentage)}% used, ${remainingStorage} GB remaining`}
        >
          <svg
            height={radius * 2 + strokeWidth}
            width={radius * 2 + strokeWidth}
            className="transform -rotate-90 cursor-default"
            role="img"
            aria-hidden="false"
            aria-label={`${Math.round(usedPercentage)}% used`}
          >
            {/* Background circle (available) */}
            <circle
              stroke="#f1f5f9"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius + strokeWidth / 2}
              cy={radius + strokeWidth / 2}
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
              cx={radius + strokeWidth / 2}
              cy={radius + strokeWidth / 2}
              className="transition-all duration-500 ease-out"
              onMouseEnter={() => setHoveredSegment("used")}
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-2xl font-bold text-gray-900">{totalStorage} GB</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>

          {/* Tooltip for hovered segment */}
          {hoveredSegment && (
            <div
              className="absolute top-6 left-full ml-4 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg z-10 whitespace-nowrap"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${hoveredSegment === "used" ? "bg-blue-500" : "bg-gray-300"}`}
                />
                <span className="font-medium">
                  {hoveredSegment === "used" ? "Used Storage" : "Available Storage"}
                </span>
              </div>
              <div className="text-lg font-bold mt-1">
                {hoveredSegment === "used" ? userStorage : remainingStorage} GB
              </div>
              <div className="text-xs text-gray-300">
                {hoveredSegment === "used" ? Math.round(usedPercentage) : remainingPercentage}% of total
              </div>
            </div>
          )}
        </div>

        {/* Info + Button */}
        <div className="flex flex-col gap-6 flex-1">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">My Cloud Storage</h3>

            {/* Free Space */}
            <div className="flex items-center gap-2 mb-1 pl-7">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <p className="text-gray-700">
                <span className="font-medium text-blue-600">Free Space: {remainingStorage} GB</span>
              </p>
            </div>

            {/* Used Space */}
            <div className="flex items-center gap-2 pl-7">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <p className="text-gray-700">
                <span className="font-medium text-red-500">Used Space: {userStorage} GB</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard/upgrade")}
            className="self-start flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-200"
            aria-label="Upgrade plan"
            title="Upgrade plan"
          >
            <RocketLaunchIcon fontSize="small" />
            <span className="text-base">Upgrade Plan</span>
          </button>
        </div>
      </div>
    </Box>
  );
}
