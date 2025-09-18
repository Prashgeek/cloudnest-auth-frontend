import React, { useState, useEffect, useRef } from "react";
import { Box, Menu, MenuItem } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GetAppIcon from "@mui/icons-material/GetApp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";

export default function Folders() {
  const initialFolders = [
    { id: 1, icon: <ImageIcon />, label: "Images", key: "totalImages" },
    { id: 2, icon: <VideocamIcon />, label: "Videos", key: "totalVideos" },
    { id: 3, icon: <MusicNoteIcon />, label: "Music", key: "totalMusic" },
    { id: 4, icon: <DescriptionIcon />, label: "Documents", key: "totalDocuments" },
  ];

  const [folders, setFolders] = useState(() => {
    const stored = localStorage.getItem("folders");
    if (stored) return JSON.parse(stored).map(f => ({ ...f, icon: getIcon(f.key) }));
    return initialFolders;
  });

  const [counts, setCounts] = useState({
    totalImages: 0,
    totalVideos: 0,
    totalMusic: 0,
    totalDocuments: 0,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [removingFolders, setRemovingFolders] = useState([]); // ⬅ track removing
  const inputRef = useRef(null);

  useEffect(() => {
    setCounts({
      totalImages: localStorage.getItem("totalImages") || 0,
      totalVideos: localStorage.getItem("totalVideos") || 0,
      totalMusic: localStorage.getItem("totalMusic") || 0,
      totalDocuments: localStorage.getItem("totalDocuments") || 0,
    });
  }, []);

  useEffect(() => {
    const toStore = folders.map(({ id, label, key }) => ({ id, label, key }));
    localStorage.setItem("folders", JSON.stringify(toStore));
  }, [folders]);

  useEffect(() => {
    if (editingFolderId != null) {
      const t = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [editingFolderId]);

  const handleMenuOpen = (event, folder) => {
    setAnchorEl(event.currentTarget);
    setSelectedFolder(folder);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFolder(null);
  };

  const handleEditClick = (folder) => {
    if (!folder) return;
    setEditingFolderId(folder.id);
    setNewFolderName(folder.label);
    handleMenuClose();
  };

  const saveFolderName = () => {
    const trimmed = (newFolderName || "").trim();
    if (!trimmed) {
      setEditingFolderId(null);
      return;
    }
    setFolders(prev =>
      prev.map(f => (f.id === editingFolderId ? { ...f, label: trimmed } : f))
    );
    setEditingFolderId(null);
  };

  function getIcon(key) {
    switch (key) {
      case "totalImages": return <ImageIcon />;
      case "totalVideos": return <VideocamIcon />;
      case "totalMusic": return <MusicNoteIcon />;
      case "totalDocuments": return <DescriptionIcon />;
      default: return <FolderIcon />;
    }
  }

  const handleAddFolder = () => {
    const newId = folders.length ? Math.max(...folders.map(f => f.id)) + 1 : 1;
    const newFolder = {
      id: newId,
      icon: <FolderIcon />,
      label: "New Folder",
      key: `custom_${newId}`,
    };
    setFolders(prev => [...prev, newFolder]);
    setEditingFolderId(newId);
    setNewFolderName("New Folder");
  };

  const handleDeleteFolder = (folderId) => {
    // Trigger fade out
    setRemovingFolders(prev => [...prev, folderId]);
    handleMenuClose();

    // After animation, remove folder from state
    setTimeout(() => {
      setFolders(prev => prev.filter(f => f.id !== folderId));
      setRemovingFolders(prev => prev.filter(id => id !== folderId));
    }, 300); // matches CSS transition duration
  };

  return (
    <div>
      <header className="mb-8 flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold text-gray-900">My Folders</h1>
        <button
          onClick={handleAddFolder}
          className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow"
        >
          <AddIcon fontSize="medium" />
        </button>
      </header>

      <div className="space-y-4 px-6">
        {folders.map(folder => {
          const isRemoving = removingFolders.includes(folder.id);
          return (
            <Box
              key={folder.id}
              className={`transform transition-all duration-300 ${
                isRemoving ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
              }`}
              sx={{
                backgroundColor: "#eaf2fb",
                p: 3,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="text-blue-500">{folder.icon}</div>
                <div>
                  {editingFolderId === folder.id ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveFolderName();
                        if (e.key === "Escape") setEditingFolderId(null);
                      }}
                      onBlur={saveFolderName}
                      className="
                        w-40
                        px-3 py-1.5
                        text-gray-900 text-lg font-medium
                        border border-gray-300
                        rounded-lg
                        focus:outline-none
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-200
                        shadow-sm
                      "
                    />
                  ) : (
                    <span className="text-lg font-medium text-gray-900">{folder.label}</span>
                  )}
                  <p className="text-sm text-gray-600">{counts[folder.key] || 0} files</p>
                </div>
              </div>
              <MoreVertIcon
                className="text-gray-600 cursor-pointer"
                onClick={(e) => handleMenuOpen(e, folder)}
              />
            </Box>
          );
        })}
      </div>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>
          <GetAppIcon fontSize="small" className="mr-2 text-gray-600" />
          Download
        </MenuItem>
        <MenuItem onClick={() => handleEditClick(selectedFolder)}>
          <EditIcon fontSize="small" className="mr-2 text-gray-600" />
          Edit Folder Name
        </MenuItem>
        <MenuItem onClick={() => handleDeleteFolder(selectedFolder?.id)}>
          <DeleteIcon fontSize="small" className="mr-2 text-gray-600" />
          Move to Bin
        </MenuItem>
      </Menu>
    </div>
  );
}
