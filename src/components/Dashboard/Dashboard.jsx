import React, { useState } from "react";
import Sidebar from "./Sidebar";
import FileGrid from "./FileGrid";
import Header from "./Header";
import FilePreview from "./FilePreview";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState("home");
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [previewFile, setPreviewFile] = useState(null);

  // --- Upload Handlers ---
  const handleFileUpload = (fileList) => {
    Array.from(fileList).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile = {
          id: Date.now() + index,
          name: file.name,
          type: file.type.includes("pdf")
            ? "pdf"
            : file.type.includes("sheet")
            ? "excel"
            : file.type.includes("word")
            ? "word"
            : file.type.startsWith("image")
            ? "image"
            : file.type.startsWith("text")
            ? "text"
            : "file",
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          modified: "Just now",
          starred: false,
          content: e.target.result, // ✅ store actual content
        };
        setFiles((prev) => [...prev, newFile]);
      };
      reader.readAsArrayBuffer(file); // read as raw binary
    });
  };

  const handleFolderUpload = (fileList) => {
    const folderName =
      fileList[0]?.webkitRelativePath.split("/")[0] || "New Folder";
    const newFolder = {
      id: Date.now(),
      name: folderName,
      type: "folder",
      size: `${fileList.length} items`,
      modified: "Just now",
      starred: false,
    };
    setFiles((prev) => [...prev, newFolder]);
  };

  // --- File actions ---
  const handleFileSelect = (fileId) => {
    const file = files.find((f) => f.id === fileId);
    setPreviewFile(file); // open preview when clicked

    const newSelected = new Set(selectedFiles);
    newSelected.has(fileId)
      ? newSelected.delete(fileId)
      : newSelected.add(fileId);
    setSelectedFiles(newSelected);
  };

  const handleStarFile = (fileId) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, starred: !file.starred } : file
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onFileUpload={handleFileUpload}
        onFolderUpload={handleFolderUpload}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedFiles={selectedFiles}
          onStarSelected={() => {
            selectedFiles.forEach((id) => handleStarFile(id));
          }}
          onDeleteSelected={() => {
            setFiles((prev) => prev.filter((f) => !selectedFiles.has(f.id)));
            setSelectedFiles(new Set());
          }}
        />

        <div className="flex-1 p-6 overflow-y-auto">
          {currentView === "home" && (
            <FileGrid
              files={files}
              viewMode={viewMode}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelect}
              onStarFile={handleStarFile}
              searchQuery={searchQuery}
            />
          )}
          {currentView === "downloads" && <h1 className="text-2xl">⬇️ Downloads</h1>}
          {currentView === "files" && (
            <FileGrid
              files={files}
              viewMode={viewMode}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelect}
              onStarFile={handleStarFile}
              searchQuery={searchQuery}
            />
          )}
          {currentView === "trash" && <h1 className="text-2xl">🗑️ Trash</h1>}
          {currentView === "settings" && <h1 className="text-2xl">⚙️ Settings</h1>}
        </div>
      </div>

      {/* Open in new tab */}
      {previewFile && (
        <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
};

export default Dashboard;
