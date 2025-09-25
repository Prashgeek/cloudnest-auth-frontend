import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Download, Share2, Folder, MoreVertical, Edit, Trash2, Plus, ArrowLeft, Upload, File, Image, Video, FileText, X, Check, Eye } from 'lucide-react';

export default function Files() {
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState('Source');
  const [selectedType, setSelectedType] = useState('Type');
  const [editingFileId, setEditingFileId] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [removingFiles, setRemovingFiles] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderSelector, setShowFolderSelector] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [pendingSharedFiles, setPendingSharedFiles] = useState([]);
  const [selectedDestinationFolder, setSelectedDestinationFolder] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [viewingFile, setViewingFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const sourceOptions = [
    'All',
    'Folders',
    'Documents',
    'Videos',
    'Photos & Images',
    'PDFs',
    'Archives (zip)'
  ];

  const typeOptions = [
    'All',
    'Date Modified',
    'Size',
    'Name',
    'Day',
    'Month',
    'Alphabetical Order'
  ];

  // Helper function to convert data URL to Blob
  const dataURLtoBlob = (dataURL) => {
    if (!dataURL) return null;

    try {
      const parts = dataURL.split(';base64,');
      if (parts.length !== 2) return null;

      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const uInt8Array = new Uint8Array(raw.length);

      for (let i = 0; i < raw.length; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      return new Blob([uInt8Array], { type: contentType });
    } catch (error) {
      console.error('Error converting data URL to blob:', error);
      return null;
    }
  };

  // Helper function to create object URL from data URL
  const createObjectUrlFromDataUrl = (dataUrl) => {
    if (!dataUrl) return null;

    const blob = dataURLtoBlob(dataUrl);
    if (!blob) return null;

    try {
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error creating object URL:', error);
      return null;
    }
  };

  // Initialize files in memory using useState
  const [files, setFiles] = useState(() => {
    // Try to load from memory first, then fallback to initialFiles
    try {
      const stored = sessionStorage.getItem("files");
      if (stored) {
        const parsedFiles = JSON.parse(stored);
        // Recursively recreate object URLs from data URLs for files that have them
        const recreateObjectUrls = (fileList) => {
          return fileList.map(file => {
            if (file.isFolder && file.children) {
              return {
                ...file,
                children: recreateObjectUrls(file.children)
              };
            } else if (file.dataUrl && !file.isFolder) {
              return {
                ...file,
                objectUrl: createObjectUrlFromDataUrl(file.dataUrl)
              };
            }
            return file;
          });
        };
        return recreateObjectUrls(parsedFiles);
      }
    } catch (error) {
      console.error('Error loading files from sessionStorage:', error);
    }
    return [];
  });

  // Ensure Downloads folder exists
  useEffect(() => {
    const downloadsFolderExists = files.some(file => file.id === 8 && file.isFolder);
    if (!downloadsFolderExists) {
      const downloadsFolder = {
        id: 8,
        name: 'Downloads',
        type: 'File Folder',
        size: '0 MB',
        lastModified: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        isFolder: true,
        children: []
      };
      setFiles(prev => [...prev, downloadsFolder]);
    }
  }, [files]);

  // Save files to sessionStorage whenever files change
  useEffect(() => {
    try {
      // Create a clean version of files without object URLs and file objects for storage
      const cleanFiles = files.map(file => {
        const cleanFile = (f) => {
          const { objectUrl, file: fileObj, ...rest } = f;
          if (rest.children) {
            return {
              ...rest,
              children: rest.children.map(cleanFile)
            };
          }
          return rest;
        };
        return cleanFile(file);
      });

      sessionStorage.setItem("files", JSON.stringify(cleanFiles));
    } catch (error) {
      console.error('Error saving files to sessionStorage:', error);
    }
  }, [files]);

  // Check for pending shared files from ShareFile component
  useEffect(() => {
    const checkForSharedFiles = () => {
      try {
        const sharedFiles = sessionStorage.getItem("pendingSharedFiles");
        if (sharedFiles) {
          const parsedFiles = JSON.parse(sharedFiles);
          if (parsedFiles.length > 0) {
            setPendingSharedFiles(parsedFiles);
            setShowFolderSelector(true);
            // Clear the pending files from sessionStorage
            sessionStorage.removeItem("pendingSharedFiles");
          }
        }
      } catch (error) {
        console.error("Error parsing shared files:", error);
      }
    };

    checkForSharedFiles();
    // Check periodically for new shared files
    const interval = setInterval(checkForSharedFiles, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save dropdown selections to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem("selectedSource", selectedSource);
      sessionStorage.setItem("selectedType", selectedType);
    } catch (error) {
      console.error('Error saving dropdown selections:', error);
    }
  }, [selectedSource, selectedType]);

  // Load dropdown selections from sessionStorage
  useEffect(() => {
    try {
      const savedSource = sessionStorage.getItem("selectedSource");
      const savedType = sessionStorage.getItem("selectedType");
      if (savedSource && savedSource !== "Source") setSelectedSource(savedSource);
      if (savedType && savedType !== "Type") setSelectedType(savedType);
    } catch (error) {
      console.error('Error loading dropdown selections:', error);
    }
  }, []);

  // Focus and select text when editing
  useEffect(() => {
    if (editingFileId !== null) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [editingFileId]);

  // In the Files component, add an effect to listen for changes in downloads localStorage

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "downloads") {
        try {
          const newDownloads = JSON.parse(e.newValue) || [];
          // Get the current Downloads folder contents
          const downloadsFolder = findFolderById(files, 8);
          if (downloadsFolder.folder) {
            // Create a new array for the Downloads folder children
            const newChildren = newDownloads.map(download => ({
              id: download.id,
              name: download.name,
              type: "Downloaded File",
              size: download.size,
              lastModified: download.date,
              isFolder: false,
              dataUrl: download.url.startsWith('data:') ? download.url : null,
              objectUrl: !download.url.startsWith('data:') ? download.url : null
            }));

            // Update the files state
            setFiles(prev => updateFileInTree(prev, 8, {
              children: newChildren
            }));
          }
        } catch (error) {
          console.error("Error updating Downloads folder from localStorage:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [files]);

  // In the Files component, add an effect to listen for downloads updates

  useEffect(() => {
    const handleDownloadsUpdate = () => {
      try {
        const newDownloads = JSON.parse(localStorage.getItem("downloads")) || [];
        // Get the current Downloads folder contents
        const downloadsFolder = findFolderById(files, 8);
        if (downloadsFolder.folder) {
          // Create a new array for the Downloads folder children
          const newChildren = newDownloads.map(download => ({
            id: download.id,
            name: download.name,
            type: "Downloaded File",
            size: download.size,
            lastModified: download.date,
            isFolder: false,
            dataUrl: download.url.startsWith('data:') ? download.url : null,
            objectUrl: !download.url.startsWith('data:') ? download.url : null
          }));

          // Update the files state
          setFiles(prev => updateFileInTree(prev, 8, {
            children: newChildren
          }));
        }
      } catch (error) {
        console.error("Error updating Downloads folder from custom event:", error);
      }
    };

    window.addEventListener("downloadsUpdated", handleDownloadsUpdate);
    return () => window.removeEventListener("downloadsUpdated", handleDownloadsUpdate);
  }, [files]);

  // Close dropdowns when clicking outside
  const closeDropdowns = () => {
    setSourceDropdownOpen(false);
    setTypeDropdownOpen(false);
    setMenuOpen(null);
  };

  // Get current folder and its contents
  const getCurrentFolder = () => {
    if (!currentFolderId) return { folder: null, contents: files };
    return findFolderById(files, currentFolderId);
  };

  const findFolderById = (fileList, id) => {
    for (let file of fileList) {
      if (file.id === id && file.isFolder) {
        return { folder: file, contents: file.children || [] };
      }
      if (file.isFolder && file.children) {
        const result = findFolderById(file.children, id);
        if (result.folder) return result;
      }
    }
    return { folder: null, contents: [] };
  };

  // Get all folders recursively for folder selector
  const getAllFolders = (fileList = files, depth = 0) => {
    let folders = [];
    fileList.forEach(file => {
      if (file.isFolder) {
        folders.push({ ...file, depth });
        if (file.children && file.children.length > 0) {
          folders.push(...getAllFolders(file.children, depth + 1));
        }
      }
    });
    return folders;
  };

  // Get folder path for breadcrumb in selector
  const getFolderPath = (fileList, targetId, currentPath = []) => {
    for (let file of fileList) {
      if (file.id === targetId && file.isFolder) {
        return [...currentPath, file];
      }
      if (file.isFolder && file.children) {
        const result = getFolderPath(file.children, targetId, [...currentPath, file]);
        if (result.length > currentPath.length) return result;
      }
    }
    return currentPath;
  };

  // Get file icon based on type
  const getFileIcon = (file) => {
    if (file.isFolder) return <Folder className="w-5 h-5 text-blue-600" />;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
      return <Image className="w-5 h-5 text-green-600" />;
    }
    if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(ext)) {
      return <Video className="w-5 h-5 text-red-600" />;
    }
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext)) {
      return <FileText className="w-5 h-5 text-orange-600" />;
    }
    return <File className="w-5 h-5 text-gray-600" />;
  };

  // Filter and sort files based on selected source and type
  const filterAndSortFiles = (fileList) => {
    let filteredFiles = [...fileList];

    // Apply source filter
    if (selectedSource !== 'Source') {
      filteredFiles = filteredFiles.filter(file => {
        if (selectedSource === 'Folders') {
          return file.isFolder;
        } else if (selectedSource === 'Documents') {
          const ext = file.name.split('.').pop()?.toLowerCase();
          return ['txt', 'doc', 'docx', 'rtf', 'odt', 'tex'].includes(ext);
        } else if (selectedSource === 'Videos') {
          const ext = file.name.split('.').pop()?.toLowerCase();
          return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext);
        } else if (selectedSource === 'Photos & Images') {
          const ext = file.name.split('.').pop()?.toLowerCase();
          return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext);
        } else if (selectedSource === 'PDFs') {
          const ext = file.name.split('.').pop()?.toLowerCase();
          return ext === 'pdf';
        } else if (selectedSource === 'Archives (zip)') {
          const ext = file.name.split('.').pop()?.toLowerCase();
          return ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext);
        }
        return true;
      });
    }

    // Apply type sort
    if (selectedType !== 'Type') {
      filteredFiles.sort((a, b) => {
        if (selectedType === 'Date Modified') {
          const dateA = new Date(a.lastModified);
          const dateB = new Date(b.lastModified);
          return dateB - dateA; // newest first
        } else if (selectedType === 'Size') {
          const parseSize = (sizeStr) => {
            const match = sizeStr.match(/(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)/i);
            if (!match) return 0;
            const value = parseFloat(match[1]);
            const unit = match[2].toUpperCase();
            if (unit === 'KB') return value * 1024;
            if (unit === 'MB') return value * 1024 * 1024;
            if (unit === 'GB') return value * 1024 * 1024 * 1024;
            return value;
          };
          const sizeA = parseSize(a.size);
          const sizeB = parseSize(b.size);
          return sizeB - sizeA; // largest first
        } else if (selectedType === 'Name') {
          return a.name.localeCompare(b.name);
        } else if (selectedType === 'Day') {
          const dayA = new Date(a.lastModified).getDate();
          const dayB = new Date(b.lastModified).getDate();
          return dayB - dayA;
        } else if (selectedType === 'Month') {
          const monthA = new Date(a.lastModified).getMonth();
          const monthB = new Date(b.lastModified).getMonth();
          return monthB - monthA;
        } else if (selectedType === 'Alphabetical Order') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
    }

    return filteredFiles;
  };

  // Handle folder click
  const handleFolderClick = (file) => {
    if (file.isFolder) {
      setCurrentFolderId(file.id);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    setCurrentFolderId(null);
  };

  // Handle file name editing
  const handleEditFile = (file) => {
    setEditingFileId(file.id);
    setNewFileName(file.name);
    setMenuOpen(null);
  };

  // Save edited file name
  const saveFileName = () => {
    const trimmed = (newFileName || "").trim();
    if (!trimmed) {
      setEditingFileId(null);
      return;
    }

    setFiles(prev => updateFileInTree(prev, editingFileId, { name: trimmed }));
    setEditingFileId(null);
  };

  // Update file in nested tree structure
  const updateFileInTree = (fileList, targetId, updates) => {
    return fileList.map(file => {
      if (file.id === targetId) {
        return { ...file, ...updates };
      }
      if (file.isFolder && file.children) {
        return {
          ...file,
          children: updateFileInTree(file.children, targetId, updates)
        };
      }
      return file;
    });
  };

  // Add new file/folder
  const handleAddFile = () => {
    const { contents } = getCurrentFolder();
    const newId = Math.max(...files.map(f => f.id), ...getAllChildIds(files), 0) + 1;
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newFile = {
      id: newId,
      name: 'New Folder',
      type: 'File Folder',
      size: '0 MB',
      lastModified: currentDate,
      isFolder: true,
      children: []
    };

    if (currentFolderId) {
      // Add to current folder
      setFiles(prev => updateFileInTree(prev, currentFolderId, {
        children: [...(findFolderById(prev, currentFolderId).contents), newFile]
      }));
    } else {
      // Add to root
      setFiles(prev => [...prev, newFile]);
    }

    setEditingFileId(newId);
    setNewFileName("New Folder");
  };

  // Get all child IDs for ID generation
  const getAllChildIds = (fileList) => {
    let ids = [];
    fileList.forEach(file => {
      ids.push(file.id);
      if (file.children) {
        ids.push(...getAllChildIds(file.children));
      }
    });
    return ids;
  };

  // In the Files component, update the handleDeleteFile function:

  const handleDeleteFile = (fileId) => {
    // Find the file to get its details before deletion
    const fileToDelete = currentContents.find(f => f.id === fileId);

    if (fileToDelete) {
      // Add to trash
      try {
        const storedTrash = JSON.parse(localStorage.getItem("trashItems")) || [];
        const deletedWithTimestamp = {
          ...fileToDelete,
          deletedAt: new Date().toISOString().split("T")[0],
        };
        const updatedTrash = [...storedTrash, deletedWithTimestamp];
        localStorage.setItem("trashItems", JSON.stringify(updatedTrash));

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent("trashUpdated"));
      } catch (error) {
        console.error("Error adding file to trash:", error);
      }
    }

    // Proceed with the deletion animation and removal from the file tree
    setRemovingFiles(prev => [...prev, fileId]);
    setMenuOpen(null);

    setTimeout(() => {
      if (currentFolderId) {
        setFiles(prev => updateFileInTree(prev, currentFolderId, {
          children: findFolderById(prev, currentFolderId).contents.filter(f => f.id !== fileId)
        }));
      } else {
        setFiles(prev => prev.filter(f => f.id !== fileId));
      }

      // Revoke the object URL to prevent memory leaks
      if (fileToDelete && fileToDelete.objectUrl) {
        URL.revokeObjectURL(fileToDelete.objectUrl);
      }

      setRemovingFiles(prev => prev.filter(id => id !== fileId));
    }, 300);
  };

  const handleFileUpload = async (uploadedFiles) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    try {
      const processFilePromises = Array.from(uploadedFiles).map(async (file, index) => {
        // Create object URL for immediate use
        const objectUrl = URL.createObjectURL(file);

        // Create a data URL for persistence across sessions
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (e) => {
            // Generate unique ID using timestamp and random number
            const uniqueId = Date.now() + Math.random() * 1000 + index;

            resolve({
              id: uniqueId,
              name: file.name,
              type: getFileType(file),
              size: formatFileSize(file.size),
              lastModified: currentDate,
              isFolder: false,
              objectUrl: objectUrl,
              dataUrl: e.target.result, // Store data URL for persistence
              file: file
            });
          };

          reader.onerror = () => {
            console.error(`Error reading file: ${file.name}`);
            reject(new Error(`Failed to read ${file.name}`));
          };

          reader.readAsDataURL(file);
        });
      });

      // Handle all promises
      const processedFiles = await Promise.all(processFilePromises);

      // Update files state
      if (currentFolderId) {
        const { contents } = getCurrentFolder();
        setFiles(prev => updateFileInTree(prev, currentFolderId, {
          children: [...contents, ...processedFiles]
        }));
      } else {
        setFiles(prev => [...prev, ...processedFiles]);
      }

      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Some files failed to upload. Please try again.');
    }
  };

  // Handle shared files upload to selected folder
  const handleSharedFilesUpload = () => {
    if (pendingSharedFiles.length === 0) return;

    if (selectedDestinationFolder) {
      // Add to the selected folder
      setFiles(prev =>
        updateFileInTree(prev, selectedDestinationFolder, {
          children: [
            ...(findFolderById(prev, selectedDestinationFolder).contents),
            ...pendingSharedFiles,
          ],
        })
      );
    } else {
      // Add to root if no folder selected
      setFiles(prev => [...prev, ...pendingSharedFiles]);
    }

    // Clear pending state
    setPendingSharedFiles([]);
    setSelectedDestinationFolder(null);
    setShowFolderSelector(false);
  };

  // Get file type from file object
  const getFileType = (file) => {
    const type = file.type;
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Audio';
    if (type === 'application/pdf') return 'PDF Document';
    if (type.includes('document') || type.includes('text')) return 'Document';
    return 'File';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  // In the Files component, update the handleDownloadFile function:

  const handleDownloadFile = (file) => {
    let url = null;
    let needsCleanup = false;

    // Try to get a valid URL
    if (file.objectUrl) {
      url = file.objectUrl;
    } else if (file.dataUrl) {
      // Convert data URL to blob for download
      const blob = dataURLtoBlob(file.dataUrl);
      if (blob) {
        url = URL.createObjectURL(blob);
        needsCleanup = true;
      }
    }

    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // If we created a temporary URL, revoke it
      if (needsCleanup) {
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    } else {
      console.log(`Downloading ${file.name}`);
    }

    // Add file to Downloads folder and localStorage
    const downloadsFolderId = 8; // The Downloads folder has id 8

    // Check if Downloads folder exists, if not create it
    const downloadsFolder = findFolderById(files, downloadsFolderId);
    if (!downloadsFolder.folder) {
      const newDownloadsFolder = {
        id: 8,
        name: 'Downloads',
        type: 'File Folder',
        size: '0 MB',
        lastModified: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        isFolder: true,
        children: []
      };
      setFiles(prev => [...prev, newDownloadsFolder]);
    }

    // Create a new file object for the Downloads folder
    const newFileForDownloads = {
      ...file,
      id: Date.now() + Math.random() * 1000, // Generate a new unique ID
      objectUrl: null, // We don't need to store the objectUrl in the folder
      file: null, // We don't store the File object in the folder
    };

    // Add to the Downloads folder in the files state
    setFiles(prev => updateFileInTree(prev, downloadsFolderId, {
      children: [...(findFolderById(prev, downloadsFolderId).contents), newFileForDownloads]
    }));

    // Also, add to localStorage for the Downloads component
    try {
      const currentDownloads = JSON.parse(localStorage.getItem("downloads")) || [];
      const downloadItem = {
        id: newFileForDownloads.id,
        name: file.name,
        size: file.size,
        date: new Date().toLocaleDateString('en-CA'), // Format as YYYY-MM-DD
        url: file.dataUrl || file.objectUrl // Use dataUrl if available, otherwise objectUrl
      };

      const updatedDownloads = [...currentDownloads, downloadItem];
      localStorage.setItem("downloads", JSON.stringify(updatedDownloads));
    } catch (error) {
      console.error("Error saving to downloads localStorage:", error);
    }

    setMenuOpen(null);
  };

  // Share file (placeholder functionality)
  const handleShareFile = (file) => {
    console.log(`Sharing ${file.name}`);
    setMenuOpen(null);
  };

  // View file function with proper URL handling
  const handleViewFile = (file) => {
    setMenuOpen(null);

    if (file.isFolder) {
      handleFolderClick(file);
      return;
    }

    // Try to get a valid URL
    let url = null;
    let needsCleanup = false;

    if (file.objectUrl) {
      url = file.objectUrl;
    } else if (file.dataUrl) {
      // Create a temporary object URL from the data URL
      const blob = dataURLtoBlob(file.dataUrl);
      if (blob) {
        url = URL.createObjectURL(blob);
        needsCleanup = true;
      }
    }

    if (!url) {
      alert('This file cannot be viewed. Please download it to view.');
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    // For PDFs, create a new window with embedded PDF viewer
    if (ext === 'pdf') {
      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        alert('Please allow popups to view files.');
        if (needsCleanup) URL.revokeObjectURL(url);
        return;
      }

      // Create HTML content with embedded PDF viewer
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${file.name}</title>
          <meta charset="utf-8">
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              height: 100vh; 
              overflow: hidden; 
              font-family: Arial, sans-serif;
            }
            .pdf-container {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
            }
            .pdf-header {
              padding: 10px 20px;
              background-color: #f5f5f5;
              border-bottom: 1px solid #ddd;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .pdf-title {
              font-weight: bold;
            }
            .pdf-actions {
              display: flex;
              gap: 10px;
            }
            .pdf-actions a {
              padding: 5px 10px;
              background-color: #4285f4;
              color: white;
              text-decoration: none;
              border-radius: 4px;
            }
            .pdf-actions a:hover {
              background-color: #3367d6;
            }
            .pdf-viewer {
              flex: 1;
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
        </head>
        <body>
          <div class="pdf-container">
            <div class="pdf-header">
              <div class="pdf-title">${file.name}</div>
              <div class="pdf-actions">
                <a href="${url}" download="${file.name}">Download</a>
              </div>
            </div>
            <iframe 
              src="${url}" 
              class="pdf-viewer"
              title="${file.name}"
            >
              <p>
                Your browser does not support PDFs. 
                <a href="${url}" download="${file.name}">Download the PDF</a>.
              </p>
            </iframe>
          </div>
        </body>
        </html>
      `);
      newWindow.document.close();

      // If we created a temporary URL, revoke it when the window is closed
      if (needsCleanup) {
        newWindow.addEventListener('beforeunload', () => {
          URL.revokeObjectURL(url);
        });
      }
      return;
    }

    // For images, open directly in a new tab with enhanced viewer
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) {
      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        alert('Please allow popups to view files.');
        if (needsCleanup) URL.revokeObjectURL(url);
        return;
      }

      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${file.name}</title>
          <meta charset="utf-8">
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              background: #000;
              display: flex;
              flex-direction: column;
              height: 100vh;
              font-family: Arial, sans-serif;
            }
            .header {
              background: rgba(0,0,0,0.8);
              color: white;
              padding: 10px 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .title {
              font-weight: bold;
            }
            .actions a {
              color: #4285f4;
              text-decoration: none;
              padding: 5px 10px;
              border: 1px solid #4285f4;
              border-radius: 4px;
              margin-left: 10px;
            }
            .actions a:hover {
              background: #4285f4;
              color: white;
            }
            .image-container {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: auto;
            }
            .image-container img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${file.name}</div>
            <div class="actions">
              <a href="${url}" download="${file.name}">Download</a>
            </div>
          </div>
          <div class="image-container">
            <img src="${url}" alt="${file.name}" />
          </div>
        </body>
        </html>
      `);
      newWindow.document.close();

      if (needsCleanup) {
        newWindow.addEventListener('beforeunload', () => {
          URL.revokeObjectURL(url);
        });
      }
      return;
    }

    // For videos, open directly in a new tab
    if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext)) {
      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        alert('Please allow popups to view files.');
        if (needsCleanup) URL.revokeObjectURL(url);
        return;
      }

      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${file.name}</title>
          <meta charset="utf-8">
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              background: #000;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              font-family: Arial, sans-serif;
            }
            .header {
              color: white;
              margin-bottom: 20px;
              text-align: center;
            }
            video {
              max-width: 90vw;
              max-height: 80vh;
            }
            .download-link {
              color: #4285f4;
              text-decoration: none;
              margin-top: 20px;
              padding: 10px 20px;
              border: 1px solid #4285f4;
              border-radius: 4px;
            }
            .download-link:hover {
              background: #4285f4;
              color: white;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${file.name}</h2>
          </div>
          <video controls>
            <source src="${url}" type="${file.type || 'video/' + ext}">
            Your browser does not support the video tag.
          </video>
          <a href="${url}" download="${file.name}" class="download-link">Download Video</a>
        </body>
        </html>
      `);
      newWindow.document.close();

      if (needsCleanup) {
        newWindow.addEventListener('beforeunload', () => {
          URL.revokeObjectURL(url);
        });
      }
      return;
    }

    // For text files, create a new window with content
    if (['txt', 'md', 'csv', 'json', 'xml', 'html', 'css', 'js', 'log'].includes(ext)) {
      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        alert('Please allow popups to view files.');
        if (needsCleanup) URL.revokeObjectURL(url);
        return;
      }

      // Fetch the content and display it
      fetch(url)
        .then(response => response.text())
        .then(content => {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>${file.name}</title>
              <meta charset="utf-8">
              <style>
                body { 
                  font-family: 'Courier New', monospace; 
                  margin: 0;
                  background: #f5f5f5;
                }
                .header {
                  padding: 10px 20px;
                  background-color: #fff;
                  border-bottom: 1px solid #ddd;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  position: sticky;
                  top: 0;
                  z-index: 100;
                }
                .title {
                  font-weight: bold;
                  font-family: Arial, sans-serif;
                }
                .actions {
                  display: flex;
                  gap: 10px;
                }
                .actions a {
                  padding: 5px 10px;
                  background-color: #4285f4;
                  color: white;
                  text-decoration: none;
                  border-radius: 4px;
                  font-family: Arial, sans-serif;
                }
                .actions a:hover {
                  background-color: #3367d6;
                }
                .content {
                  padding: 20px;
                  white-space: pre-wrap;
                  line-height: 1.4;
                  background: white;
                  margin: 0;
                  min-height: calc(100vh - 60px);
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="title">${file.name}</div>
                <div class="actions">
                  <a href="${url}" download="${file.name}">Download</a>
                </div>
              </div>
              <div class="content">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </body>
            </html>
          `);
          newWindow.document.close();
        })
        .catch(error => {
          console.error('Error loading file content:', error);
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Error</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                .error-container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  padding: 40px;
                  background: #fff;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .download-btn { 
                  display: inline-block; 
                  margin-top: 20px; 
                  padding: 12px 24px; 
                  background-color: #4CAF50; 
                  color: white; 
                  text-decoration: none; 
                  border-radius: 4px;
                  font-weight: bold;
                }
                .download-btn:hover {
                  background-color: #45a049;
                }
              </style>
            </head>
            <body>
              <div class="error-container">
                <h1>Error loading file</h1>
                <p>The file content could not be displayed.</p>
                <a href="${url}" download="${file.name}" class="download-btn">Download File</a>
              </div>
            </body>
            </html>
          `);
          newWindow.document.close();
        });

      if (needsCleanup) {
        newWindow.addEventListener('beforeunload', () => {
          URL.revokeObjectURL(url);
        });
      }
      return;
    }

    // For other file types, provide a download link
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      alert('Please allow popups to view files.');
      if (needsCleanup) URL.revokeObjectURL(url);
      return;
    }

    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${file.name}</title>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: #f5f5f5;
          }
          .container {
            max-width: 600px;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          h1 {
            margin-top: 0;
            color: #333;
          }
          p {
            color: #666;
            margin-bottom: 30px;
          }
          .download-btn { 
            display: inline-block; 
            padding: 12px 24px; 
            background-color: #4CAF50; 
            color: white; 
            text-decoration: none; 
            border-radius: 4px;
            font-weight: bold;
            transition: background-color 0.3s;
          }
          .download-btn:hover {
            background-color: #45a049;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">📄</div>
          <h1>Preview not available</h1>
          <p>This file type cannot be previewed in the browser.</p>
          <a href="${url}" download="${file.name}" class="download-btn">Download ${file.name}</a>
        </div>
      </body>
      </html>
    `);
    newWindow.document.close();

    if (needsCleanup) {
      newWindow.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(url);
      });
    }
  };

  const { folder: currentFolder, contents: currentContents } = getCurrentFolder();

  return (
    <div
      className={`min-h-screen bg-gray-50 p-6 ${dragOver ? 'bg-blue-50' : ''}`}
      onClick={closeDropdowns}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {dragOver && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-dashed border-blue-500">
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-blue-700">Drop files here to upload</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        {/* Files Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {currentFolder && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {currentFolder ? currentFolder.name : 'Files'}
              </h1>
              {currentFolder && (
                <p className="text-sm text-gray-500">
                  {currentContents.length} items • {currentFolder.size}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Upload Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowUploadModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">Upload</span>
            </button>

            {/* Add File Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddFile();
              }}
              className="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Source Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSourceDropdownOpen(!sourceDropdownOpen);
                  setTypeDropdownOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 border border-blue-200 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:border-blue-300"
              >
                <span>{selectedSource}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {sourceDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-blue-200 rounded-lg shadow-lg z-50">
                  {sourceOptions.map((option) => (
                    <button
                      key={option}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSource(option);
                        setSourceDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Type Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTypeDropdownOpen(!typeDropdownOpen);
                  setSourceDropdownOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 border border-blue-200 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:border-blue-300"
              >
                <span>{selectedType}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {typeDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-blue-200 rounded-lg shadow-lg z-50">
                  {typeOptions.map((option) => (
                    <button
                      key={option}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedType(option);
                        setTypeDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Files Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-blue-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-700">Size</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-700">Last Modified</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filterAndSortFiles(currentContents).length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <Folder className="w-12 h-12 text-gray-300" />
                      <p>This folder is empty</p>
                      <p className="text-sm">Upload files or create new folders to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filterAndSortFiles(currentContents).map((file) => {
                  const isRemoving = removingFiles.includes(file.id);
                  return (
                    <tr
                      key={file.id}
                      className={`hover:bg-blue-50 transform transition-all duration-300 cursor-pointer ${isRemoving ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
                        }`}
                      onClick={() => {
                        if (file.isFolder) {
                          handleFolderClick(file);
                        } else {
                          handleViewFile(file);
                        }
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            {getFileIcon(file)}
                          </div>
                          {editingFileId === file.id ? (
                            <input
                              ref={inputRef}
                              type="text"
                              value={newFileName}
                              onChange={(e) => setNewFileName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveFileName();
                                if (e.key === "Escape") setEditingFileId(null);
                              }}
                              onBlur={saveFileName}
                              className="px-2 py-1 text-sm font-medium text-gray-900 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-900">{file.name}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{file.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{file.size}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{file.lastModified}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {!file.isFolder && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewFile(file);
                              }}
                              className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="View File"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadFile(file);
                            }}
                            className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShareFile(file);
                            }}
                            className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(menuOpen === file.id ? null : file.id);
                              }}
                              className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {menuOpen === file.id && (
                              <div className="absolute bottom-full mb-1 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[100]">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditFile(file);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Name
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFile(file.id);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center rounded-b-lg"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Move to Bin
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">
              Upload Files {currentFolder && `to ${currentFolder.name}`}
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag and drop files here, or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Choose Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showFolderSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Choose destination folder</h2>
            <select
              className="w-full border rounded p-2 mb-4"
              value={selectedDestinationFolder || ""}
              onChange={(e) =>
                setSelectedDestinationFolder(
                  e.target.value ? parseInt(e.target.value, 10) : null
                )
              }
            >
              <option value="">Root (no folder)</option>
              {getAllFolders().map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {"— ".repeat(folder.depth) + folder.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowFolderSelector(false)}
                className="px-3 py-1 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={handleSharedFilesUpload}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Save Here
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}