import React, { useState } from "react";
import {
  Plus,
  Home,
  Download,
  FileText,
  Settings,
  Trash2,
  FolderPlus,
  Upload,
} from "lucide-react";

const Sidebar = ({ currentView, setCurrentView, onFileUpload, onFolderUpload }) => {
  const [showUploadMenu, setShowUploadMenu] = useState(false);

  const sidebarItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "downloads", icon: Download, label: "Downloads" },
    { id: "files", icon: FileText, label: "Files" },
    { id: "trash", icon: Trash2, label: "Trash" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Upload Button */}
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
              {/* Hidden file input */}
              <input
                type="file"
                multiple
                className="hidden"
                id="fileUploadInput"
                onChange={(e) => onFileUpload(e.target.files)}
              />
              <input
                type="file"
                webkitdirectory="true"
                directory=""
                multiple
                className="hidden"
                id="folderUploadInput"
                onChange={(e) => onFolderUpload(e.target.files)}
              />

              <button
                onClick={() => document.getElementById("fileUploadInput").click()}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 w-full text-left"
              >
                <Upload size={18} />
                File upload
              </button>
              <button
                onClick={() => document.getElementById("folderUploadInput").click()}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 w-full text-left"
              >
                <FolderPlus size={18} />
                Folder upload
              </button>
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
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors w-full text-left mb-1 ${
              currentView === item.id
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
  );
};

export default Sidebar;
