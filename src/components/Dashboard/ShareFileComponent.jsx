// src/components/Dashboard/ShareFileComponent.jsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DragDropIcon, PasswordIcon, ShareIcon, UploadIcon } from "../CustomIcons";
import FileManager from "../../utils/fileManager";
// NOTE: removed useNotifications import — notifications are handled on SharePage now

// Import MUI icons for files
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import FolderIcon from "@mui/icons-material/Folder";
import ArchiveIcon from "@mui/icons-material/Archive";
import CodeIcon from "@mui/icons-material/Code";

export default function ShareFileComponent({ onFileUploaded }) {
  const navigate = useNavigate();
  const location = useLocation();
  // const { helpers } = useNotifications(); // <- removed

  const initialFiles = location.state?.uploadedFiles || [];
  const passwordSetFromNav = Boolean(location.state?.passwordSet);
  const passwordValueFromNav = location.state?.passwordValue || "";

  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState(() =>
    Array.isArray(initialFiles) ? initialFiles : []
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [shareUrl, setShareUrl] = useState("");
  const [passwordSet, setPasswordSet] = useState(passwordSetFromNav);
  const [passwordValue, setPasswordValue] = useState(passwordValueFromNav);

  // file icon + helper functions (unchanged)
  const getFileIcon = (fileName) => {
    if (!fileName) return <DescriptionIcon />;
    const ext = fileName.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf": return <PictureAsPdfIcon color="error" />;
      case "doc": case "docx": return <DescriptionIcon color="primary" />;
      case "xls": case "xlsx": return <DescriptionIcon sx={{ color: "#1a73e8" }} />;
      case "ppt": case "pptx": return <DescriptionIcon sx={{ color: "#d44638" }} />;
      case "txt": return <DescriptionIcon color="disabled" />;
      case "jpg": case "jpeg": case "png": case "gif": case "bmp": return <ImageIcon color="secondary" />;
      case "mp4": case "mov": case "avi": case "mkv": return <VideoLibraryIcon color="action" />;
      case "mp3": case "wav": case "ogg": return <AudiotrackIcon color="success" />;
      case "zip": case "rar": case "7z": return <ArchiveIcon color="disabled" />;
      case "js": case "jsx": case "ts": case "tsx": case "html": case "css": case "json": case "xml": return <CodeIcon color="warning" />;
      case "folder": return <FolderIcon color="primary" />;
      default: return <DescriptionIcon />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes == null || isNaN(bytes)) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    i = Math.min(i, sizes.length - 1);
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  useEffect(() => {
    if (location.state) {
      const navFiles = Array.isArray(location.state.uploadedFiles)
        ? location.state.uploadedFiles
        : [];
      if (navFiles.length) {
        setSelectedFiles(prev => {
          const merged = [...prev];
          navFiles.forEach(nf => {
            if (!merged.some(f => f.name === nf.name && f.size === nf.size)) {
              merged.push(nf);
            }
          });
          return merged;
        });
      }
      if (location.state.passwordSet) {
        setPasswordSet(true);
        setPasswordValue(location.state.passwordValue || "");
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.key]);

  useEffect(() => {
    if (!selectedFiles.length) {
      setPasswordSet(false);
      setPasswordValue("");
    }
  }, [selectedFiles]);

  const handleFileSelect = useCallback(files => {
    const incoming = Array.from(files || []);
    if (!incoming.length) return;
    setSelectedFiles(prev => {
      const merged = [...prev];
      incoming.forEach(f => {
        if (!merged.some(x => x.name === f.name && x.size === f.size)) {
          merged.push(f);
        }
      });
      return merged;
    });
  }, []);

  const handleDragOver = useCallback(e => {
    e.preventDefault(); setIsDragOver(true);
  }, []);
  const handleDragLeave = useCallback(e => {
    e.preventDefault(); setTimeout(() => setIsDragOver(false), 50);
  }, []);
  const handleDrop = useCallback(e => {
    e.preventDefault(); setIsDragOver(false);
    if (e.dataTransfer?.files?.length) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = e => {
    if (e.target.files?.length) handleFileSelect(e.target.files);
    e.target.value = "";
  };

  const handleSetPassword = () => {
    if (!selectedFiles.length) return;
    navigate("/dashboard/set-password", {
      state: {
        uploadedFiles: selectedFiles,
        fileName: selectedFiles[0].name,
        returnTo: location.pathname,
        passwordValue,
      },
    });
  };

  const handleShareClick = () => {
    if (!selectedFiles.length) return;
    if (!passwordSet) {
      handleSetPassword();
      return;
    }

    // Persist passwords for files already stored in FileManager (have an id)
    // and attach password info to in-memory file objects that don't have an id yet.
    selectedFiles.forEach(file => {
      if (file.id) {
        try {
          FileManager.setPassword(file.id, passwordValue);
        } catch (e) {
          // ignore if FileManager operation fails for some reason
          console.error("FileManager.setPassword failed:", e);
        }
      } else {
        // attach password properties to the file object itself so pendingFiles
        // carry the correct password into SharePage
        file.hasPassword = !!passwordValue;
        file.password = passwordValue || null;
      }
    });

    // Pass the actual password value so SharePage can store it on the shared files.
    navigate("/dashboard/share", {
      state: {
        pendingFiles: selectedFiles,
        passwordSet: true,
        passwordValue: passwordValue || null,
      },
    });
  };

  const hasFiles = selectedFiles.length > 0;
  const canShare = hasFiles && uploadStatus !== "uploading" && passwordSet;

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3">
            <UploadIcon className="w-14 h-15 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">File Upload</h1>
          </div>
        </div>

        {/* Drag & Drop */}
        <div
          role="button" tabIndex={0}
          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") fileInputRef.current.click(); }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className={`rounded-2rem transition-all duration-300 cursor-pointer ${
            isDragOver ? "bg-blue-50 scale-1.02" : "bg-gray-50 hover:bg-blue-50"
          }`}
          style={{ height: "340px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
        >
          <DragDropIcon
            className={`${isDragOver ? "text-blue-600 scale-110" : "text-blue-500"} transition-all duration-300`}
            style={{ width: "13.5rem", height: "13.5rem" }}
          />
          <h2 className={`text-xl font-semibold mb-2 ${isDragOver ? "text-blue-700" : "text-gray-800"}`}>
            {isDragOver ? "Drop files here" : hasFiles ? `${selectedFiles.length} files selected` : "Drag and Drop file"}
          </h2>
          {hasFiles && !isDragOver && (
            <p className="text-gray-500 text-sm">Click to add more files or use the buttons below</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-40 mb-12 mt-6">
          {/* Upload */}
          <div className="text-center">
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={uploadStatus === "uploading"}
              style={{ borderRadius: "20%" }}
              className="w-24 h-24 bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl"
            >
              <UploadIcon className="w-14 h-14 text-white" />
            </button>
            <span className="block mt-4 font-semibold text-gray-800 text-base">Upload File</span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              accept="*/*"
            />
          </div>

          {/* Set Password */}
          <div className="text-center">
            <button
              type="button"
              disabled={!hasFiles || uploadStatus === "uploading"}
              onClick={handleSetPassword}
              style={{ borderRadius: "20%" }}
              className={`w-24 h-24 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
                !hasFiles || uploadStatus === "uploading"
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              <PasswordIcon className="w-14 h-14 text-white" />
            </button>
            <span className="block mt-4 font-semibold text-gray-800 text-base">Set Password</span>
          </div>

          {/* Share */}
          <div className="text-center">
            <button
              onClick={handleShareClick}
              disabled={!canShare}
              style={{ borderRadius: "20%" }}
              className={`w-24 h-24 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
                canShare ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {uploadStatus === "uploading" ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShareIcon className="w-14 h-14 text-white" />
              )}
            </button>
            <span className="block mt-4 font-semibold text-gray-800 text-base">
              {uploadStatus === "uploading" ? "Sharing..." : "Share"}
            </span>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="card p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">
              Selected Files ({selectedFiles.length})
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {selectedFiles.map((file, index) => {
                const fileName = file.name || "Unnamed file";
                const fileSize = file.size || 0;
                return (
                  <div
                    key={`${fileName}-${fileSize}-${index}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getFileIcon(fileName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 truncate">{fileName}</p>
                        <p className="text-sm text-gray-600">{formatFileSize(fileSize)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
                      }
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove file"
                      aria-label={`Remove ${fileName}`}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
