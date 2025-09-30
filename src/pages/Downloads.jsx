import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";

export default function Downloads() {
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const downloads = JSON.parse(localStorage.getItem('downloadsStorage') || '[]');
            setFiles(downloads);
        } catch (e) {
            setFiles([]);
        }
    }, []);

    useEffect(() => {
        const loadFiles = () => {
            try {
                const storedFiles = JSON.parse(localStorage.getItem("downloadsStorage")) || [];
                setFiles(storedFiles);
            } catch (error) {
                console.error("Error loading files from localStorage:", error);
                setFiles([]);
            }
        };
        loadFiles();

        const handleStorageChange = (e) => {
            if (e.key === "downloadsStorage") {
                try {
                    const newFiles = JSON.parse(e.newValue) || [];
                    setFiles(newFiles);
                } catch (error) {
                    console.error("Error parsing storage change:", error);
                }
            }
        };

        const handleStorageUpdate = () => {
            loadFiles();
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("storageUpdated", handleStorageUpdate);
        
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("storageUpdated", handleStorageUpdate);
        };
    }, []);

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

    const handleView = (file) => {
        try {
            if (file.dataUrl) {
                const blob = dataURLtoBlob(file.dataUrl);
                if (blob) {
                    const tempUrl = URL.createObjectURL(blob);
                    window.open(tempUrl, "_blank");
                    setTimeout(() => URL.revokeObjectURL(tempUrl), 1000);
                    return;
                }
            }
            if (file.objectUrl) {
                window.open(file.objectUrl, "_blank");
                return;
            }
            if (file.url) {
                if (file.url.startsWith('data:')) {
                    const blob = dataURLtoBlob(file.url);
                    if (blob) {
                        const tempUrl = URL.createObjectURL(blob);
                        window.open(tempUrl, "_blank");
                        setTimeout(() => URL.revokeObjectURL(tempUrl), 1000);
                        return;
                    }
                } else {
                    window.open(file.url, "_blank");
                    return;
                }
            }
            alert(`File: ${file.name}\nSize: ${file.size || 'Unknown'}\nType: ${file.type || 'Unknown'}\n\nNote: File data not available for viewing.`);
        } catch (error) {
            console.error('Error viewing file:', error);
            alert("Error opening file. Please try again.");
        }
    };

    const handleDelete = (file) => {
        try {
            const storedTrash = JSON.parse(localStorage.getItem("trashItems")) || [];
            const deletedWithTimestamp = {
                ...file,
                deletedAt: new Date().toISOString().split("T")[0],
            };
            const updatedTrash = [...storedTrash, deletedWithTimestamp];
            localStorage.setItem("trashItems", JSON.stringify(updatedTrash));

            const updatedDownloads = files.filter((f) => f.id !== file.id);
            setFiles(updatedDownloads);
            localStorage.setItem("downloadsStorage", JSON.stringify(updatedDownloads));

            window.dispatchEvent(new CustomEvent("downloadsUpdated"));
            window.dispatchEvent(new CustomEvent("trashUpdated"));
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    return (
        <Box sx={{ flex: 1, p: 4, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Your Downloaded Files
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                Manage and access your downloaded documents here.
            </Typography>

            {files.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <DescriptionIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                    <Typography color="text.secondary">
                        No downloaded files found.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Files you download will appear here.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ width: "calc(100% - 10px)", maxWidth: 1200 }}>
                    {files.map((file) => (
                        <Card
                            key={file.id}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: 3,
                                py: 2,
                                mb: 2,
                                borderRadius: 2,
                                boxShadow: 2,
                                backgroundColor: "#eff6ff",
                                width: "100%",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0 }}>
                                <DescriptionIcon sx={{ fontSize: 40, color: "error.main" }} />
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="subtitle1" fontWeight="600" noWrap>
                                        {file.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        Size: {file.size || 'Unknown'} {file.lastModified ? `— Downloaded: ${file.lastModified}` : ''}
                                        {file.sharedWith && file.sharedWith.length > 0 && (
                                            <span> — Shared with: {file.sharedWith.slice(0, 2).map(s => s.email || s.name).join(', ')}{file.sharedWith.length > 2 ? ` +${file.sharedWith.length - 2} more` : ''}</span>
                                        )}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <IconButton color="primary" onClick={() => handleView(file)}>
                                    <VisibilityIcon />
                                </IconButton>
                                <IconButton
                                    color="success"
                                    onClick={() => navigate("/dashboard/share", { state: { pendingFiles: [file] } })}
                                >
                                    <ShareIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDelete(file)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
}
