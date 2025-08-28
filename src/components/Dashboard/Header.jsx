import React from "react";
import { Search, Grid3X3, List, Filter, Star, Trash2 } from "lucide-react";

const Header = ({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  selectedFiles,
  onStarSelected,
  onDeleteSelected,
}) => {
  return (
    <>
      {/* Main Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search in Drive"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setViewMode(viewMode === "grid" ? "list" : "grid")
              }
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {viewMode === "grid" ? <List size={20} /> : <Grid3X3 size={20} />}
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      {selectedFiles.size > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-blue-700 font-medium">
              {selectedFiles.size} item{selectedFiles.size > 1 ? "s" : ""}{" "}
              selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onStarSelected}
                className="flex items-center gap-2 px-3 py-1.5 text-blue-700 hover:bg-blue-100 rounded-lg"
              >
                <Star size={16} />
                Star
              </button>
              <button
                onClick={onDeleteSelected}
                className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
