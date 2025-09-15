import * as React from "react";
import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FaFileWord, FaFilePdf, FaFileExcel, FaFilePowerpoint, FaFileAlt } from "react-icons/fa";
import { Download, Share2 } from "lucide-react";

export default function FileList({ files = [] }) {
  const [showAll, setShowAll] = useState(false); // Added state for show more functionality
  const INITIAL_FILE_COUNT = 6; // Show 6 files initially
  
  // Helper to decide icon based on file extension
  const getFileIcon = (fileName) => {
    const extension = fileName.toLowerCase().split('.').pop();
    
    if (extension === "pdf") {
      return <FaFilePdf className="text-red-500 text-2xl" />;
    } else if (extension === "doc" || extension === "docx") {
      return <FaFileWord className="text-blue-500 text-2xl" />;
    } else if (extension === "xlsx" || extension === "xls") {
      return <FaFileExcel className="text-green-500 text-2xl" />;
    } else if (extension === "pptx" || extension === "ppt") {
      return <FaFilePowerpoint className="text-orange-500 text-2xl" />;
    }
    return <FaFileAlt className="text-gray-500 text-2xl" />;
  };

  // Helper to get file type badge color
  const getTypeBadgeColor = (type) => {
    switch(type) {
      case "received":
        return "bg-green-100 text-green-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Show empty state if no files
  if (files.length === 0) {
    return (
      <div className="w-[90%] max-w-7xl mt-6 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Recent Files</h2>
        </div>
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FaFileAlt className="text-gray-300 text-6xl mx-auto mb-4" />
          <Typography variant="h6" className="text-gray-500 mb-2">
            No files yet
          </Typography>
          <Typography variant="body2" className="text-gray-400">
            Files will appear here when you upload or receive them
          </Typography>
        </div>
      </div>
    );
  }

  // Determine which files to show
  const filesToShow = showAll ? files : files.slice(0, INITIAL_FILE_COUNT);
  const hasMoreFiles = files.length > INITIAL_FILE_COUNT;

  return (
    <div className="w-[90%] max-w-7xl mt-6 mx-auto">
      {/* Header with title and View all button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Recent Files</h2>
        {hasMoreFiles && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAll ? "Show less" : "View all"}
          </button>
        )}
      </div>
      
      {/* Files Grid */}
      <div className="space-y-3">
        {filesToShow.map((file, index) => (
          <div
            key={index}
            className="bg-blue-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: "#dbeafe" }} // Light sky blue background
          >
            <div className="flex items-center justify-between">
              {/* File icon and details */}
              <div className="flex items-center gap-3 flex-1">
                {getFileIcon(file.name)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {file.name}
                    </h3>
                    {file.type && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(file.type)}`}>
                        {file.type}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">
                    Size: {file.size} • Downloaded: {file.date}
                  </p>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-3 text-gray-600">
                <button className="p-2 hover:bg-blue-200 rounded-full transition-colors">
                  <Download className="w-4 h-4 hover:text-green-600" />
                </button>
                <button className="p-2 hover:bg-blue-200 rounded-full transition-colors">
                  <Share2 className="w-4 h-4 hover:text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
