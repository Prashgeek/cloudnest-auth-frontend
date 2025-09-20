import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DragDropIcon, PasswordIcon, ShareIcon, UploadIcon } from "../CustomIcons";

export default function ShareFileComponent({ onFileUploaded }) {
  const navigate = useNavigate();
  const location = useLocation();

  const initialFiles = location.state?.uploadedFiles || [];
  const passwordSetFromNav = Boolean(location.state?.passwordSet);

  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState(() =>
    Array.isArray(initialFiles) ? initialFiles : []
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [shareUrl, setShareUrl] = useState("");
  const [passwordSet, setPasswordSet] = useState(passwordSetFromNav);

  useEffect(() => {
    if (location.state) {
      const navFiles = Array.isArray(location.state.uploadedFiles)
        ? location.state.uploadedFiles
        : [];
      if (navFiles.length > 0) {
        setSelectedFiles((prev) => {
          const merged = [...prev];
          navFiles.forEach((nf) => {
            const exists = merged.some(
              (ef) => ef.name === nf.name && ef.size === nf.size
            );
            if (!exists) merged.push(nf);
          });
          return merged;
        });
      }
      if (location.state.passwordSet) setPasswordSet(true);

      // Clear navigation state to avoid re-processing on refresh / revisit.
      try {
        // only replace state once (prevents unnecessary routing loops)
        navigate(location.pathname, { replace: true, state: {} });
      } catch (err) {
        // swallow navigation errors silently
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, location.pathname]);

  useEffect(() => {
    if (selectedFiles.length === 0) setPasswordSet(false);
  }, [selectedFiles]);

  const handleFileSelect = useCallback((files) => {
    const incoming = Array.from(files || []);
    if (incoming.length === 0) return;
    setSelectedFiles((prev) => {
      const merged = [...prev];
      incoming.forEach((newFile) => {
        const exists = merged.some(
          (existingFile) =>
            existingFile.name === newFile.name &&
            existingFile.size === newFile.size
        );
        if (!exists) merged.push(newFile);
      });
      return merged;
    });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setTimeout(() => setIsDragOver(false), 50);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (e.dataTransfer?.files?.length) handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleFileInputChange = (e) => {
    if (e.target?.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
    // reset so same file can be chosen again
    if (e.target) e.target.value = "";
  };

  const handleSetPassword = () => {
    if (!selectedFiles.length) return;
    navigate("/dashboard/set-password", {
      state: {
        uploadedFiles: selectedFiles,
        fileName: selectedFiles[0]?.name || "",
        returnTo: location.pathname || "/dashboard/share-file",
      },
    });
  };

  const handleShareClick = async () => {
    if (!selectedFiles.length) return;
    if (!passwordSet) {
      handleSetPassword();
      return;
    }

    // Navigate to the Share Page where user selects recipients and confirms permissions
    navigate("/dashboard/share", {
      state: { pendingFiles: selectedFiles, passwordSet: true },
    });
  };

  const hasFiles = selectedFiles.length > 0;
  const canShare = hasFiles && uploadStatus !== "uploading" && passwordSet;

  // small helper — formats bytes; defensive for absent numbers
  const formatFileSize = (bytes) => {
    if (bytes == null || Number.isNaN(bytes)) return "0 Bytes";
    const k = 1024;
    if (bytes < k) return `${bytes} Bytes`;
    const sizes = ["KB", "MB", "GB", "TB"];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    if (i <= 0) i = 0;
    const value = bytes / Math.pow(k, i + 1 - 1); // adjusted to return readable number
    // ensure index is within range
    i = Math.min(i, sizes.length - 1);
    // round to 2 decimals
    const display = (bytes / Math.pow(k, i + 1 - 1)).toFixed(2);
    return `${display} ${sizes[i]}`;
  };

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

        {/* Upload Progress */}
        {uploadStatus === "uploading" && (
          <div className="mb-6 card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="font-medium">Uploading files... {uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Success message */}
        {uploadStatus === "success" && (
          <div className="mb-6 card p-6 border-green-200 bg-green-50">
            <div className="flex items-center gap-3 mb-4">
              <ShareIcon className="w-6 h-6 text-green-600" />
              <span className="font-medium text-green-800">
                Upload successful! Files added to recent files.
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm break-all flex-1">
                {shareUrl}
              </div>
              <button
                onClick={() => {
                  if (navigator.clipboard && shareUrl) {
                    navigator.clipboard
                      .writeText(shareUrl)
                      .catch(() => {}); // ignore clipboard errors
                  }
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Drag & Drop zone */}
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={(e) => {
            const targetTag = e.target?.tagName?.toLowerCase();
            if (targetTag === "button" || targetTag === "input") return;
            fileInputRef.current?.click();
          }}
          className={`rounded-2rem transition-all duration-300 cursor-pointer ${
            isDragOver ? "bg-blue-50 scale-1.02" : "bg-gray-50 hover:bg-blue-50"
          }`}
          style={{
            height: "340px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="mb-8 transition-all duration-300">
            <DragDropIcon
              className={`${
                isDragOver ? "text-blue-600 scale-110" : "text-blue-500"
              } transition-all duration-300`}
              style={{ width: "13.5rem", height: "13.5rem" }}
            />
          </div>
          <h2
            className={`text-xl font-semibold mb-2 ${
              isDragOver ? "text-blue-700" : "text-gray-800"
            }`}
          >
            {isDragOver
              ? "Drop files here"
              : hasFiles
              ? `${selectedFiles.length} files selected`
              : "Drag and Drop file"}
          </h2>
          {hasFiles && !isDragOver && (
            <p className="text-gray-500 text-sm">
              Click to add more files or use the buttons below
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-40 mb-12 mt-6">
          {/* Upload File */}
          <div className="text-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadStatus === "uploading"}
              style={{ borderRadius: "20%" }}
              className="w-24 h-24 bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl"
            >
              <UploadIcon className="w-14 h-14 text-white" />
            </button>
            <span className="block mt-4 font-semibold text-gray-800 text-base">
              Upload File
            </span>
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
            <span className="block mt-4 font-semibold text-gray-800 text-base">
              Set Password
            </span>
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
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${file.size}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      📄
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 truncate">{file.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove file"
                    aria-label={`Remove ${file.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
