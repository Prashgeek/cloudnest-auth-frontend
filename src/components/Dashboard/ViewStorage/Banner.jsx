import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

export default function Banner() {
    const [userStorage, setUserStorage] = useState(5); // Example: 5 GB used
    const totalStorage = 20;
    const [hoveredSegment, setHoveredSegment] = useState(null);

    useEffect(() => {
        const storedUserStorage = localStorage.getItem("userStorage");
        if (storedUserStorage) {
            setUserStorage(Number(storedUserStorage));
        }
    }, []);

    const remainingStorage = totalStorage - userStorage;
    const usedPercentage = (userStorage / totalStorage) * 100;
    const remainingPercentage = (remainingStorage / totalStorage) * 100;

    // Donut chart calculations
    const radius = 80;
    const strokeWidth = 16;
    const normalizedRadius = radius - strokeWidth * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;
    const usedStrokeOffset =
        circumference - (usedPercentage / 100) * circumference;

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
                width: "70%",
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
                    onMouseEnter={() => setHoveredSegment("chart")}
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
                            onMouseEnter={() => setHoveredSegment("used")}
                        />
                    </svg>

                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="text-2xl font-bold text-gray-900">{totalStorage} GB</div>
                        <div className="text-sm text-gray-500">Total</div>
                    </div>

                    {/* Tooltip */}
                    {hoveredSegment && hoveredSegment !== "chart" && (
                        <div className="absolute top-6 left-full ml-4 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg z-10 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-3 h-3 rounded-full ${hoveredSegment === "used" ? "bg-blue-500" : "bg-gray-300"
                                        }`}
                                ></div>
                                <span className="font-medium">
                                    {hoveredSegment === "used"
                                        ? "Used Storage"
                                        : "Available Storage"}
                                </span>
                            </div>
                            <div className="text-lg font-bold mt-1">
                                {hoveredSegment === "used" ? userStorage : remainingStorage} GB
                            </div>
                            <div className="text-xs text-gray-300">
                                {hoveredSegment === "used"
                                    ? Math.round(usedPercentage)
                                    : Math.round(remainingPercentage)}
                                % of total
                            </div>
                        </div>
                    )}
                </div>

                {/* Info + Button */}
                <div className="flex flex-col gap-6 flex-1">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            My Cloud Storage
                        </h3>

                        {/* Free Space */}
                        <div className="flex items-center gap-2 mb-1 pl-7">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                            <p className="text-gray-700">
                                <span className="font-medium text-blue-600">
                                    Free Space: {remainingStorage} GB
                                </span>
                            </p>
                        </div>

                        {/* Used Space */}
                        <div className="flex items-center gap-2 pl-7">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                            <p className="text-gray-700">
                                <span className="font-medium text-red-500">
                                    Used Space: {userStorage} GB
                                </span>
                            </p>
                        </div>
                    </div>


                    <button className="self-start flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-200">
                        <RocketLaunchIcon className="text-lg" />
                        <span className="text-base">Upgrade Plan</span>
                    </button>
                </div>
            </div>
        </Box>
    );
}
