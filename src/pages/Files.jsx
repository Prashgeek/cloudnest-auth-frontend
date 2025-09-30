import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ChevronDown,
  Download,
  Share2,
  Folder,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  Upload,
  File,
  Image,
  Video,
  FileText,
  X,
  Check,
  Eye,
  FolderOpen,
  FileText as DocIcon,
  Film,
  Image as ImageIcon,
  Archive
} from 'lucide-react';
import FileManager from '../utils/fileManager'; // Import FileManager

export default function Files() {
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState('Source');
  const [selectedType, setSelectedType] = useState('Type');
  const [editingFileId, setEditingFileId] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [removingFiles, setRemovingFiles] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [folderPath, setFolderPath] = useState([]);
  const [sharedFilesList, setSharedFilesList] = useState(() => {
    try {
      return (typeof FileManager !== 'undefined' && FileManager.getFiles)
        ? FileManager.getFiles().filter(f => f.folder === 'Shared' || f.type === 'shared')
        : JSON.parse(localStorage.getItem('fileStorage') || '[]');
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const onStorageUpdated = () => {
      try {
        setSharedFilesList((typeof FileManager !== 'undefined' && FileManager.getFiles)
          ? FileManager.getFiles().filter(f => f.folder === 'Shared' || f.type === 'shared')
          : JSON.parse(localStorage.getItem('fileStorage') || '[]'));
      } catch (e) { /* ignore */ }
    };
    window.addEventListener('storageUpdated', onStorageUpdated);
    window.addEventListener('storage', onStorageUpdated);
    return () => {
      window.removeEventListener('storageUpdated', onStorageUpdated);
      window.removeEventListener('storage', onStorageUpdated);
    };
  }, []);

  // Unified view handler (handles folders + password-protected files)
  const handleViewFile = (file) => {
    if (!file) return;

    // If it's a folder, navigate into it
    if (file.isFolder) {
      handleFolderClick(file);
      return;
    }

    // Always consult FileManager as the source of truth for shared/passworded files
    let storedFile = null;
    try {
      const all = (typeof FileManager !== 'undefined' && FileManager.getFiles) ? FileManager.getFiles() : [];
      storedFile = all.find(f => String(f.id) === String(file.id));
    } catch (e) {
      console.error('Error reading from FileManager:', e);
      storedFile = null;
    }

    const fileToCheck = storedFile || file;

    // If password protected, prompt and verify against FileManager (preferred) or the stored object
    if (fileToCheck.hasPassword) {
      const input = window.prompt('This file is password protected. Enter password to view:');
      if (input === null) return; // cancelled
      try {
        let ok = false;
        if (typeof FileManager !== 'undefined' && FileManager.verifyPassword) {
          ok = FileManager.verifyPassword(fileToCheck.id, input);
        } else if (fileToCheck.password != null) {
          ok = String(fileToCheck.password) === String(input);
        }
        if (!ok) { window.alert('Wrong password'); return; }
      } catch (e) {
        console.error('Error verifying password', e);
        window.alert('Error verifying password');
        return;
      }
    }

    // If we have a storedFile, prefer its dataUrl/objectUrl/url when opening
    const openFile = (f) => {
      try {
        if (f.dataUrl) {
          // open dataUrl as blob
          const parts = f.dataUrl.split(';base64,');
          if (parts.length === 2) {
            const contentType = parts[0].split(':')[1];
            const raw = window.atob(parts[1]);
            const uInt8Array = new Uint8Array(raw.length);
            for (let i = 0; i < raw.length; ++i) {
              uInt8Array[i] = raw.charCodeAt(i);
            }
            const blob = new Blob([uInt8Array], { type: contentType });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => { try { URL.revokeObjectURL(url); } catch (e) {} }, 1500);
            return;
          }
        }
        if (f.objectUrl) {
          window.open(f.objectUrl, '_blank');
          return;
        }
        if (f.url) {
          window.open(f.url, '_blank');
          return;
        }

        // Fallback: show info alert (temporary viewer)
        window.alert(`Opening file: ${f.name}
Size: ${f.size || 'unknown'}
Shared with: ${(f.sharedWith || []).map(s => s.email).join(', ') || '—'}`);
      } catch (e) {
        console.error('Error opening file viewer', e);
      }
    };

    openFile(storedFile || file);
  };

  // Unified download handler (tries FileManager first, falls back to blob download)
  const handleDownloadFile = (file) => {
    if (!file) return;

    try {
      // Prefer FileManager.downloadFile if available (app-level downloads storage)
      if (typeof FileManager !== 'undefined' && FileManager.downloadFile) {
        FileManager.downloadFile(file);
        try { window.dispatchEvent(new Event('storageUpdated')); } catch (e) { /* ignore */ }
        window.alert('File added to Downloads. Visit Downloads page to see it.');
        return;
      }
    } catch (err) {
      console.warn('FileManager.downloadFile failed, falling back to blob download', err);
    }

    // Fallback: create a simple text blob (demo) for download or use `dataUrl` if available
    try {
      let url = null;
      if (file.dataUrl) {
        // create blob from dataUrl
        const parts = file.dataUrl.split(';base64,');
        if (parts.length === 2) {
          const contentType = parts[0].split(':')[1];
          const raw = window.atob(parts[1]);
          const uInt8Array = new Uint8Array(raw.length);
          for (let i = 0; i < raw.length; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
          }
          const blob = new Blob([uInt8Array], { type: contentType });
          url = URL.createObjectURL(blob);
        }
      }

      if (!url) {
        // demo content fallback if we don't have actual data
        const content = `This is a demo file: ${file.name}\n\nFile type: ${file.type}\nSize: ${file.size}\nLast modified: ${file.lastModified || ''}`;
        const blob = new Blob([content], { type: 'text/plain' });
        url = URL.createObjectURL(blob);
      }

      const a = document.createElement('a');
      a.href = url;
      a.download = file.name || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => { try { URL.revokeObjectURL(url); } catch (e) { /* ignore */ } }, 2000);
    } catch (e) {
      console.error('Fallback download failed', e);
      window.alert('Failed to download file');
    }
  };

  const [viewingFile, setViewingFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // read dashboard outlet context to get shared files from share flow
  const outlet = useOutletContext ? useOutletContext() : {};
  const recentFilesFromOutlet = outlet?.recentFiles || [];

  // Source options with icons
  const sourceOptions = [
    { label: 'All', icon: <FolderOpen className="w-4 h-4 text-blue-500" /> },
    { label: 'Folders', icon: <Folder className="w-4 h-4 text-yellow-500" /> },
    { label: 'Documents', icon: <DocIcon className="w-4 h-4 text-blue-600" /> },
    { label: 'Videos', icon: <Film className="w-4 h-4 text-red-500" /> },
    { label: 'Photos & Images', icon: <ImageIcon className="w-4 h-4 text-green-500" /> },
    { label: 'PDFs', icon: <FileText className="w-4 h-4 text-red-600" /> },
    { label: 'Archives (zip)', icon: <Archive className="w-4 h-4 text-orange-500" /> }
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

  // Predefined folders with sample data
  const predefinedFolders = [
    {
      id: 1,
      name: 'Recent Files',
      type: 'File Folder',
      size: '2.4 MB',
      lastModified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isFolder: true,
      children: [
        {
          id: 101,
          name: 'Project Proposal.docx',
          type: 'Document',
          size: '1.2 MB',
          lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          isFolder: false
        },
        {
          id: 102,
          name: 'Meeting Notes.pdf',
          type: 'PDF Document',
          size: '0.8 MB',
          lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          isFolder: false
        },
        {
          id: 103,
          name: 'Budget Spreadsheet.xlsx',
          type: 'Spreadsheet',
          size: '0.4 MB',
          lastModified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          isFolder: false
        }
      ]
    },
    // Other predefined folders...
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

  // Initialize files with predefined folders
  const [files, setFiles] = useState(() => {
    try {
      const stored = sessionStorage.getItem("files");
      if (stored) {
        const parsedFiles = JSON.parse(stored);
        const recreateObjectUrls = (fileList) => {
          return fileList.map(file => {
            if (file.isFolder && file.children) {
              return { ...file, children: recreateObjectUrls(file.children) };
            } else if (file.dataUrl && !file.isFolder) {
              return { ...file, objectUrl: createObjectUrlFromDataUrl(file.dataUrl) };
            }
            return file;
          });
        };
        return recreateObjectUrls(parsedFiles);
      }
    } catch (error) {
      console.error('Error loading files from sessionStorage:', error);
    }
    return predefinedFolders;
  });

  // Save files to sessionStorage whenever files change
  useEffect(() => {
    try {
      const cleanFiles = files.map(file => {
        const cleanFile = (f) => {
          const { objectUrl, file: fileObj, ...rest } = f;
          if (rest.children) {
            return { ...rest, children: rest.children.map(cleanFile) };
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

  // Close dropdowns when clicking outside
  const closeDropdowns = () => {
    setSourceDropdownOpen(false);
    setTypeDropdownOpen(false);
  };

  // Get current folder and its contents - UPDATED TO INCLUDE SHARED FILES
  const getCurrentFolder = () => {
    if (!currentFolderId) {
      // When at root level, combine predefined folders with shared files folder
      const combinedFiles = [...files];
      
      // Add shared files folder if any shared files exist
      if (sharedFilesList && sharedFilesList.length > 0) {
        // Create a "Shared Files" folder that contains all shared files
        const sharedFolder = {
          id: 'shared-folder',
          name: 'Shared Files',
          type: 'File Folder',
          size: `${sharedFilesList.length} items`,
          lastModified: new Date().toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric' 
          }),
          isFolder: true,
          children: sharedFilesList,
          // Remove the pin icon and use regular folder properties
        };
        
        // Add the shared folder to the root if it doesn't exist
        if (!combinedFiles.find(f => f.id === 'shared-folder')) {
          combinedFiles.unshift(sharedFolder); // Add at the beginning
        } else {
          // Update existing shared folder
          const index = combinedFiles.findIndex(f => f.id === 'shared-folder');
          combinedFiles[index] = sharedFolder;
        }
      }
      
      return { folder: null, contents: combinedFiles };
    }
    
    // Handle shared folder specifically
    if (currentFolderId === 'shared-folder') {
      return { 
        folder: { id: 'shared-folder', name: 'Shared Files' }, 
        contents: sharedFilesList || [] 
      };
    }
    
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

  // Get file icon based on type with emoji support - UPDATED FOR SHARED FILES
  const getFileIcon = (file, useEmoji = false) => {
    // Check if it's a shared file (but not the shared folder itself)
    const isSharedFile = (file.type === 'shared' || file.folder === 'Shared') && file.id !== 'shared-folder';
    
    if (file.isFolder || file.id === 'shared-folder') {
      // For shared folder, use folder icon instead of pin
      return useEmoji ? '📂' : <Folder className="w-4 h-4 text-blue-600" />;
    }
    
    // For shared files, use their actual file type icons instead of pin
    if (isSharedFile) {
      // Fall through to normal file icon logic for shared files
    }
    
    const ext = file.name?.split('.').pop()?.toLowerCase();
    if (useEmoji) {
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) return '🖼️';
      if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(ext)) return '🎬';
      if (['pdf'].includes(ext)) return '📄';
      if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return '📝';
      if (['zip', 'rar', '7z', 'tar'].includes(ext)) return '📦';
      if (['exe', 'app', 'apk'].includes(ext)) return '⚙️';
      if (['json', 'db'].includes(ext)) return '📊';
      if (['xlsx', 'xls', 'csv'].includes(ext)) return '📊';
      return '📄';
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return <Image className="w-4 h-4 text-green-600" />;
    if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(ext)) return <Video className="w-4 h-4 text-red-600" />;
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext)) return <FileText className="w-4 h-4 text-orange-600" />;
    if (['zip', 'rar', '7z', 'tar'].includes(ext)) return <Archive className="w-4 h-4 text-orange-500" />;
    return <File className="w-4 h-4 text-gray-600" />;
  };

  // Filter and sort files based on selected source and type
  const filterAndSortFiles = (fileList) => {
    let filteredFiles = [...fileList];

    if (selectedSource !== 'Source') {
      filteredFiles = filteredFiles.filter(file => {
        if (selectedSource === 'All') return true;
        else if (selectedSource === 'Folders') return file.isFolder;
        else if (selectedSource === 'Documents') {
          const ext = file.name?.split('.').pop()?.toLowerCase();
          return ['txt', 'doc', 'docx', 'rtf', 'odt', 'tex', 'pdf'].includes(ext);
        } else if (selectedSource === 'Videos') {
          const ext = file.name?.split('.').pop()?.toLowerCase();
          return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext);
        } else if (selectedSource === 'Photos & Images') {
          const ext = file.name?.split('.').pop()?.toLowerCase();
          return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext);
        } else if (selectedSource === 'PDFs') {
          const ext = file.name?.split('.').pop()?.toLowerCase();
          return ext === 'pdf';
        } else if (selectedSource === 'Archives (zip)') {
          const ext = file.name?.split('.').pop()?.toLowerCase();
          return ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext);
        }
        return true;
      });
    }

    if (selectedType !== 'Type') {
      filteredFiles.sort((a, b) => {
        if (selectedType === 'Date Modified') {
          const dateA = new Date(a.lastModified);
          const dateB = new Date(b.lastModified);
          return dateB - dateA;
        } else if (selectedType === 'Size') {
          const parseSize = (sizeStr = '') => {
            const match = (sizeStr || '').match(/(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)/i);
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
          return sizeB - sizeA;
        } else if (selectedType === 'Name' || selectedType === 'Alphabetical Order') {
          return a.name.localeCompare(b.name);
        } else if (selectedType === 'Day') {
          const dayA = new Date(a.lastModified).getDate();
          const dayB = new Date(b.lastModified).getDate();
          return dayB - dayA;
        } else if (selectedType === 'Month') {
          const monthA = new Date(a.lastModified).getMonth();
          const monthB = new Date(b.lastModified).getMonth();
          return monthB - monthA;
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
      if (file.id === targetId) return { ...file, ...updates };
      if (file.isFolder && file.children) {
        return { ...file, children: updateFileInTree(file.children, targetId, updates) };
      }
      return file;
    });
  };

  // Handle file deletion
  const handleDeleteFile = (fileId) => {
    const fileToDelete = currentContents.find(f => f.id === fileId);
    if (fileToDelete) {
      try {
        const storedTrash = JSON.parse(localStorage.getItem("trashItems")) || [];
        const deletedWithTimestamp = { ...fileToDelete, deletedAt: new Date().toISOString().split("T")[0] };
        const updatedTrash = [...storedTrash, deletedWithTimestamp];
        localStorage.setItem("trashItems", JSON.stringify(updatedTrash));
        window.dispatchEvent(new CustomEvent("trashUpdated"));
      } catch (error) {
        console.error("Error adding file to trash:", error);
      }
    }
    setRemovingFiles(prev => [...prev, fileId]);
    setTimeout(() => {
      if (currentFolderId) {
        setFiles(prev => updateFileInTree(prev, currentFolderId, {
          children: findFolderById(prev, currentFolderId).contents.filter(f => f.id !== fileId)
        }));
      } else {
        setFiles(prev => prev.filter(f => f.id !== fileId));
      }
      if (fileToDelete && fileToDelete.objectUrl) {
        URL.revokeObjectURL(fileToDelete.objectUrl);
      }
      setRemovingFiles(prev => prev.filter(id => id !== fileId));
    }, 300);
  };

  const handleFileUpload = async (uploadedFiles) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    try {
      const processFilePromises = Array.from(uploadedFiles).map(async (file, index) => {
        const objectUrl = URL.createObjectURL(file);
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const uniqueId = Date.now() + Math.random() * 1000 + index;
            resolve({
              id: uniqueId,
              name: file.name,
              type: getFileType(file),
              size: formatFileSize(file.size),
              lastModified: currentDate,
              isFolder: false,
              objectUrl,
              dataUrl: e.target.result,
              file
            });
          };
          reader.onerror = () => {
            console.error(`Error reading file: ${file.name}`);
            reject(new Error(`Failed to read ${file.name}`));
          };
          reader.readAsDataURL(file);
        });
      });
      const processedFiles = await Promise.all(processFilePromises);
      if (currentFolderId) {
        const { contents } = getCurrentFolder();
        setFiles(prev => updateFileInTree(prev, currentFolderId, { children: [...contents, ...processedFiles] }));
      } else {
        setFiles(prev => [...prev, ...processedFiles]);
      }
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Some files failed to upload. Please try again.');
    }
  };

  // Get file type from file object
  const getFileType = (file) => {
    const type = file.type || '';
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
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragOver(false); };
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const droppedFiles = e.dataTransfer.files; if (droppedFiles.length > 0) handleFileUpload(droppedFiles); };

  // Share file
  const handleShareFile = (file) => {
    if (navigator.share) {
      navigator.share({ title: file.name, text: `Check out this file: ${file.name}`, url: window.location.href })
        .then(() => console.log('File shared successfully'))
        .catch((error) => console.log('Error sharing file:', error));
    } else {
      alert(`Share functionality for: ${file.name}\n\nThis would typically open your device's share dialog.`);
    }
  };

  const { folder: currentFolder, contents: currentContents } = getCurrentFolder();

  return (
    <div
      className={`min-h-screen bg-gray-50 p-4 ${dragOver ? 'bg-blue-50' : ''}`}
      onClick={closeDropdowns}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {dragOver && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-dashed border-blue-500">
            <Upload className="w-10 h-10 text-blue-500 mx-auto mb-3" />
            <p className="text-base font-medium text-blue-700">Drop files here to upload</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm w-full max-w-full overflow-hidden">
        {/* Files Header - More compact layout */}
        <div className="px-6 py-4 border-b">
          <div className="flex flex-col space-y-3">
            {/* Main title and back button */}
            <div className="flex items-center space-x-3">
              {currentFolder && (
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center w-7 h-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentFolder ? (
                    <>
                      {currentFolder.name}
                      {currentFolderId === 'shared-folder' && (
                        <span className="ml-2 text-xs text-blue-600 font-normal">
                          ({sharedFilesList?.length || 0} files)
                        </span>
                      )}
                    </>
                  ) : 'Files'}
                </h1>
              </div>
            </div>

            {/* Source and Type dropdowns below the title */}
            <div className="flex items-center space-x-4">
              {/* Source Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setSourceDropdownOpen(!sourceDropdownOpen); setTypeDropdownOpen(false); }}
                  className="flex items-center space-x-2 px-3 py-1.5 border border-blue-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                >
                  <span>{selectedSource}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {sourceDropdownOpen && (
                  <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-blue-200 rounded-lg shadow-lg z-50">
                    {sourceOptions.map((option) => (
                      <button
                        key={option.label}
                        onClick={(e) => { e.stopPropagation(); setSelectedSource(option.label); setSourceDropdownOpen(false); }}
                        className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0 flex items-center space-x-2"
                      >
                        <div className="flex-shrink-0">
                          {option.icon}
                        </div>
                        <span className="font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Type Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setTypeDropdownOpen(!typeDropdownOpen); setSourceDropdownOpen(false); }}
                  className="flex items-center space-x-2 px-3 py-1.5 border border-blue-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                >
                  <span>{selectedType}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {typeDropdownOpen && (
                  <div className="absolute top-full mt-1 left-0 w-40 bg-white border border-blue-200 rounded-lg shadow-lg z-50">
                    {typeOptions.map((option) => (
                      <button
                        key={option}
                        onClick={(e) => { e.stopPropagation(); setSelectedType(option); setTypeDropdownOpen(false); }}
                        className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Files Table - More compact */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b bg-blue-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-black w-2/5">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black w-1/5">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black w-1/6">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black w-1/6">Last Modified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filterAndSortFiles(currentContents).map((file) => {
                const isRemoving = removingFiles.includes(file.id);
                const isShared = file.type === 'shared' || file.folder === 'Shared' || file.id === 'shared-folder';
                
                return (
                  <tr
                    key={file.id}
                    className={`hover:bg-blue-50 transform transition-all duration-300 cursor-pointer ${
                      isRemoving ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
                    } ${isShared ? 'bg-blue-25 border-l-4 border-blue-400' : ''}`}
                    onClick={() => {
                      if (file.isFolder) handleFolderClick(file);
                      else handleViewFile(file);
                    }}
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-lg">{getFileIcon(file, true)}</span>
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
                            className="px-2 py-1 text-sm font-medium text-gray-900 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <div>
                            <span className="text-sm font-medium text-gray-900">{file.name}</span>
                            {isShared && file.id !== 'shared-folder' && (
                              <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                                Shared
                              </span>
                            )}
                            {file.sharedWith && file.sharedWith.length > 0 && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                Shared with: {file.sharedWith.slice(0, 2).map(s => s.email).join(', ')}
                                {file.sharedWith.length > 2 && ` +${file.sharedWith.length - 2} more`}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{file.type}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{file.size}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{file.lastModified}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center space-x-2">
                        {!file.isFolder && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleViewFile(file); }}
                            className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View File"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDownloadFile(file); }}
                          className="p-1.5 text-[#0088ff] hover:text-[#0066cc] hover:bg-blue-50 rounded-lg"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShareFile(file); }}
                          className="p-1.5 text-[#98d715] hover:text-[#7ab10c] hover:bg-green-50 rounded-lg"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal - More compact */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-lg p-5 w-80 max-w-90vw" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-3">Upload Files {currentFolder && `to ${currentFolder.name}`}</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-3">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-sm mb-2">Drag and drop files here, or</p>
              <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">Choose Files</button>
              <input ref={fileInputRef} type="file" multiple onChange={(e) => handleFileUpload(e.target.files)} className="hidden" />
            </div>

            <div className="flex space-x-2">
              <button onClick={() => setShowUploadModal(false)} className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
