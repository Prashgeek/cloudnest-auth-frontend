import React from "react";
import { Star, MoreVertical } from "lucide-react";

const FileGrid = ({
  files,
  viewMode,
  selectedFiles,
  onFileSelect,
  onStarFile,
  searchQuery,
}) => {
  const getFileIcon = (type) => {
    switch (type) {
      case "folder":
        return "📁";
      case "pdf":
        return "📄";
      case "excel":
        return "📊";
      case "word":
        return "📝";
      default:
        return "📄";
    }
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6">
      <div
        className={`${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            : "space-y-2"
        }`}
      >
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className={`${
              viewMode === "grid"
                ? "p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group"
                : "flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group"
            } ${selectedFiles.has(file.id) ? "bg-blue-50 border-blue-300" : ""}`}
            onClick={() => onFileSelect(file.id)}
          >
            {viewMode === "grid" ? (
              <div className="text-center">
                <div className="text-4xl mb-2">{getFileIcon(file.type)}</div>
                <div className="text-sm font-medium text-gray-900 truncate mb-1">
                  {file.name}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {file.size} • {file.modified}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStarFile(file.id);
                    }}
                    className={`p-1 rounded ${
                      file.starred
                        ? "text-yellow-500"
                        : "text-gray-400 hover:text-yellow-500"
                    }`}
                  >
                    <Star
                      size={16}
                      fill={file.starred ? "currentColor" : "none"}
                    />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-2xl">{getFileIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500">{file.modified}</div>
                </div>
                <div className="text-sm text-gray-500 min-w-0">
                  {file.size}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStarFile(file.id);
                    }}
                    className={`p-1 rounded ${
                      file.starred
                        ? "text-yellow-500"
                        : "text-gray-400 hover:text-yellow-500"
                    }`}
                  >
                    <Star
                      size={16}
                      fill={file.starred ? "currentColor" : "none"}
                    />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "No files found" : "No files yet"}
          </h3>
          <p className="text-gray-500">
            {searchQuery
              ? `No files match "${searchQuery}"`
              : "Upload some files to get started"}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileGrid;
