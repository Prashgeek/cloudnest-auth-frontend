import React, { useState } from "react";
import {
  Plus,
  Home,
  Download,
  FileText,
  Settings,
  Search,
  Trash2,
  Star,
  MoreVertical,
  FolderPlus,
  Upload,
  Grid3X3,
  List,
  Filter,
} from "lucide-react";

const Dashboard = () => {
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("home");
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [trash, setTrash] = useState([]);


  const [files, setFiles] = useState(() => {
    const stored = localStorage.getItem("my_files");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("my_files", JSON.stringify(files));
  }, [files]);


  // select/deselect files
  const handleFileSelect = (fileId) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  // star/unstar file
  const handleStarFile = (fileId) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, starred: !file.starred } : file
      )
    );
  };

  // delete selected
  const handleDeleteSelected = () => {
    setFiles((prev) => {
      const toDelete = prev.filter((file) => selectedFiles.has(file.id));
      setTrash((t) => [...t, ...toDelete]); // move to trash
      return prev.filter((file) => !selectedFiles.has(file.id));
    });
    setSelectedFiles(new Set());
  };

  const handleRestoreFile = (fileId) => {
    const fileToRestore = trash.find((f) => f.id === fileId);
    if (fileToRestore) {
      setFiles((prev) => [...prev, fileToRestore]);
      setTrash((prev) => prev.filter((f) => f.id !== fileId));
    }
  };

  const handleDeleteForever = (fileId) => {
    setTrash((prev) => prev.filter((f) => f.id !== fileId));
  };


  // create new folder
  const handleNewFolder = () => {
    const name = prompt("Enter folder name:");
    if (name) {
      setFiles((prev) => [
        ...prev,
        {
          id: Date.now(),
          name,
          type: "folder",
          size: "0 items",
          modified: "Just now",
          starred: false,
        },
      ]);
    }
    setShowUploadMenu(false);
  };

  // upload single/multiple files
  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files).map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: getFileType(file.name),
      size: formatFileSize(file.size),
      modified: "Just now",
      starred: false,
      file,
      url: URL.createObjectURL(file), 
    }));

    setFiles((prev) => [...prev, ...uploadedFiles]);
    setShowUploadMenu(false);
  };

  // detect file type
  const getFileType = (filename) => {
    if (filename.endsWith(".pdf")) return "pdf";
    if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) return "excel";
    if (filename.endsWith(".doc") || filename.endsWith(".docx")) return "word";
    return "file";
  };

  const handleUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file), // create preview URL
    }));
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };
  

  // format bytes
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024)
      return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // file icons
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

  const sidebarItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "downloads", icon: Download, label: "Downloads" },
    { id: "files", icon: FileText, label: "Files" },
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "trash", icon: Trash2, label: "Recycle Bin" }

  ];

  const displayedFiles = currentView === "trash" ? trash : files;
  const filteredFiles = displayedFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* New Button */}
        <div className="p-4">
          <div className="relative">
            <button
              onClick={() => setShowUploadMenu(!showUploadMenu)}
              className="flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors w-full"
            >
              <Plus size={20} />
              New
            </button>

            {showUploadMenu && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={handleNewFolder}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 w-full text-left"
                >
                  <FolderPlus size={18} />
                  New folder
                </button>
                <label className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 w-full text-left cursor-pointer">
                  <Upload size={18} />
                  File upload
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors w-full text-left mb-1 ${currentView === item.id
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              {currentView !== "trash" && (
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search in Drive"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {currentView !== "trash" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  {viewMode === "grid" ? <List size={20} /> : <Grid3X3 size={20} />}
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Filter size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        {selectedFiles.size > 0 && currentView !== "trash" && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 font-medium">
                {selectedFiles.size} item{selectedFiles.size > 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    selectedFiles.forEach((fileId) => handleStarFile(fileId));
                    setSelectedFiles(new Set());
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-blue-700 hover:bg-blue-100 rounded-lg"
                >
                  <Star size={16} />
                  Star
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File / Trash View */}
        <div className="flex-1 p-6">
          {currentView === "trash" ? (
            // Recycle Bin
            <div className="space-y-2">
              {trash.length > 0 ? (
                trash.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getFileIcon(file.type)}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{file.name}</div>
                        <div className="text-xs text-gray-500">{file.size} • {file.modified}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRestoreFile(file.id)}
                        className="px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => handleDeleteForever(file.id)}
                        className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Delete Forever
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🗑️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Recycle Bin is empty
                  </h3>
                  <p className="text-gray-500">Deleted files will appear here</p>
                </div>
              )}
            </div>
          ) : (
            // Normal File View
            <div
              className={`${viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  : "space-y-2"
                }`}
            >
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`${viewMode === "grid"
                      ? "p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group"
                      : "flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group"
                    } ${selectedFiles.has(file.id) ? "bg-blue-50 border-blue-300" : ""
                    }`}
                  onClick={() => handleFileSelect(file.id)}
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
                            handleStarFile(file.id);
                          }}
                          className={`p-1 rounded ${file.starred
                              ? "text-yellow-500"
                              : "text-gray-400 hover:text-yellow-500"
                            }`}
                        >
                          <Star size={16} fill={file.starred ? "currentColor" : "none"} />
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
                      <div className="text-sm text-gray-500 min-w-0">{file.size}</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarFile(file.id);
                          }}
                          className={`p-1 rounded ${file.starred
                              ? "text-yellow-500"
                              : "text-gray-400 hover:text-yellow-500"
                            }`}
                        >
                          <Star size={16} fill={file.starred ? "currentColor" : "none"} />
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
            
          )}
        </div>
        {filteredFiles.length === 0 && (
                <div className="flex items-center justify-center h-[calc(100vh-100px)] w-full">
                  <div className="flex flex-col items-center text-center">
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
                </div>
              )}
      </div>
    </div>
  );

};

export default Dashboard;
