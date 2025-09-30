// src/utils/fileManager.js

const KEY = "fileStorage";
const DOWNLOADS_KEY = "downloadsStorage";

const safeParse = (s) => {
  try {
    return JSON.parse(s || "[]");
  } catch (e) {
    return [];
  }
};

const load = () => safeParse(localStorage.getItem(KEY));
const save = (files) => {
  localStorage.setItem(KEY, JSON.stringify(files));
  try {
    window.dispatchEvent(new Event("storageUpdated"));
  } catch (e) {}
};

// --- Helpers that other components import ---
export const formatFileSize = (bytes) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

// --- Updated getFileIcon to cover more file types ---
export const getFileIcon = (fileName) => {
  if (!fileName) return "📄";
  const ext = fileName.split(".").pop().toLowerCase();
  switch (ext) {
    case "pdf":
      return "📕"; // PDF
    case "doc":
    case "docx":
      return "📄"; // Word document
    case "xls":
    case "xlsx":
      return "📊"; // Excel spreadsheet
    case "ppt":
    case "pptx":
      return "📈"; // PowerPoint presentation
    case "txt":
      return "📝"; // Text file
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
      return "🖼️"; // Image
    case "mp4":
    case "mov":
    case "avi":
    case "mkv":
      return "🎥"; // Video
    case "mp3":
    case "wav":
    case "ogg":
      return "🎵"; // Audio
    case "zip":
    case "rar":
    case "7z":
      return "🗜️"; // Compressed archive
    case "json":
    case "xml":
    case "csv":
      return "📑"; // Data / code file
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "html":
    case "css":
      return "💻"; // Code file
    case "folder":
      return "📁"; // Folder
    default:
      return "📄"; // Default generic file
  }
};

// --- Main FileManager object ---
const FileManager = {
  getFiles() {
    return load();
  },

  addFile(fileObj = {}) {
    const files = load();
    const id = fileObj.id || Date.now() + Math.floor(Math.random() * 9999);
    const item = {
      id,
      name: fileObj.name || "Untitled",
      size: fileObj.size || fileObj.sizeText || "1.0 MB",
      type: fileObj.type || "file",
      lastModified: fileObj.lastModified || new Date().toISOString(),
      folder: fileObj.folder || null,
      sharedWith: fileObj.sharedWith || [],
      dataUrl: fileObj.dataUrl || null,
      hasPassword: !!fileObj.hasPassword,
      password: fileObj.password || null,
    };
    files.push(item);
    save(files);
    return item;
  },

  setPassword(id, password) {
    const files = load();
    const idx = files.findIndex((f) => String(f.id) === String(id));
    if (idx >= 0) {
      files[idx].hasPassword = !!password;
      files[idx].password = password || null;
      save(files);
      return true;
    }
    return false;
  },

  verifyPassword(id, pw) {
    const files = load();
    const f = files.find((x) => String(x.id) === String(id));
    if (!f) return false;
    if (!f.hasPassword) return true;
    return f.password === pw;
  },

  downloadFile(file) {
    const downloads = safeParse(localStorage.getItem(DOWNLOADS_KEY));
    
    // Save complete file data for downloads
    const downloadItem = {
      id: file.id || Date.now(),
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified || new Date().toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
      }),
      dataUrl: file.dataUrl || null,
      url: file.url || null,
      objectUrl: file.objectUrl || null,
      sharedWith: file.sharedWith || [],
      hasPassword: file.hasPassword || false,
      addedAt: new Date().toISOString(),
    };

    downloads.unshift(downloadItem);
    localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));
    
    try {
      window.dispatchEvent(new Event("storageUpdated"));
    } catch (e) {}
    
    return true;
  },

  saveAll(filesArray) {
    save(filesArray || []);
  },

  clear() {
    localStorage.removeItem(KEY);
    try {
      window.dispatchEvent(new Event("storageUpdated"));
    } catch (e) {}
  },
};

export default FileManager;
