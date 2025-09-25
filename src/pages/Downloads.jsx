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

    // Load files from localStorage on component mount
    useEffect(() => {
        const loadFiles = () => {
            try {
                const storedFiles = JSON.parse(localStorage.getItem("downloads")) || [];
                setFiles(storedFiles);
            } catch (error) {
                console.error("Error loading files from localStorage:", error);
                setFiles([]);
            }
        };

        loadFiles();

        // Listen for storage changes from other tabs/windows
        const handleStorageChange = (e) => {
            if (e.key === "downloads") {
                try {
                    const newFiles = JSON.parse(e.newValue) || [];
                    setFiles(newFiles);
                } catch (error) {
                    console.error("Error parsing storage change:", error);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleView = (file) => {
        if (file.url) {
            // Create a temporary URL if it's a data URL
            if (file.url.startsWith('data:')) {
                const blob = dataURLtoBlob(file.url);
                if (blob) {
                    const tempUrl = URL.createObjectURL(blob);
                    window.open(tempUrl, "_blank");
                    // Clean up the temporary URL after a short delay
                    setTimeout(() => URL.revokeObjectURL(tempUrl), 1000);
                } else {
                    alert("Could not open file");
                }
            } else {
                window.open(file.url, "_blank");
            }
        } else {
            alert("No file URL available");
        }
    };

    // In the Downloads component, update the handleDelete function:

    const handleDelete = (file) => {
        try {
            // Add to trash
            const storedTrash = JSON.parse(localStorage.getItem("trashItems")) || [];
            const deletedWithTimestamp = {
                ...file,
                deletedAt: new Date().toISOString().split("T")[0],
            };
            const updatedTrash = [...storedTrash, deletedWithTimestamp];
            localStorage.setItem("trashItems", JSON.stringify(updatedTrash));

            // Remove from downloads
            const updatedDownloads = files.filter((f) => f.id !== file.id);
            setFiles(updatedDownloads);
            localStorage.setItem("downloads", JSON.stringify(updatedDownloads));

            // Dispatch custom events to notify other components
            window.dispatchEvent(new CustomEvent("downloadsUpdated"));
            window.dispatchEvent(new CustomEvent("trashUpdated"));
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

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

    return (
        <Box sx={{ flex: 1, p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
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
                files.map((file) => (
                    <Card
                        key={file.id}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            px: 2,
                            py: 1,
                            mb: 2,
                            borderRadius: 2,
                            boxShadow: 1,
                            backgroundColor: "#eff6ff",
                            width: "100%",
                            maxWidth: 800,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <DescriptionIcon sx={{ fontSize: 40, color: "error.main" }} />
                            <Box>
                                <Typography variant="subtitle1" fontWeight="600">
                                    {file.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Size: {file.size} — Downloaded: {file.date}
                                </Typography>
                            </Box>
                        </Box>

                        <Box>
                            <IconButton color="primary" onClick={() => handleView(file)}>
                                <VisibilityIcon />
                            </IconButton>
                            <IconButton
                                color="success"
                                onClick={() => navigate("/dashboard/share")}
                                sx={{ mx: 1 }}
                            >
                                <ShareIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(file)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Card>
                ))
            )}
        </Box>
    );
}