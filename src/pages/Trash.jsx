import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

export default function Trash() {
  const [trashItems, setTrashItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, itemIndexes: [] });

  useEffect(() => {
    loadTrash();
    const onTrashUpdated = () => loadTrash();
    window.addEventListener("trashUpdated", onTrashUpdated);
    return () => window.removeEventListener("trashUpdated", onTrashUpdated);
  }, []);

  const loadTrash = () => {
    const storedTrash = JSON.parse(localStorage.getItem("trashItems") || "[]");
    setTrashItems(storedTrash);
    setCheckedItems([]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setCheckedItems(trashItems.map((_, i) => i));
    } else {
      setCheckedItems([]);
    }
  };

  const handleCheck = (index) => {
    const newChecked = checkedItems.includes(index)
      ? checkedItems.filter((i) => i !== index)
      : [...checkedItems, index];
    setCheckedItems(newChecked);
    if (newChecked.length) {
      setDeleteDialog({ open: true, itemIndexes: newChecked });
    }
  };

  const handleRefresh = () => {
    const storedTrash = JSON.parse(localStorage.getItem("trashItems") || "[]");
    setTrashItems(storedTrash);
    setCheckedItems([]);
  };

  const confirmDelete = () => {
    const updatedTrash = trashItems.filter((_, i) => !deleteDialog.itemIndexes.includes(i));
    localStorage.setItem("trashItems", JSON.stringify(updatedTrash));
    setTrashItems(updatedTrash);
    setCheckedItems([]);
    setDeleteDialog({ open: false, itemIndexes: [] });
    window.dispatchEvent(new Event("trashUpdated"));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Trash
      </Typography>

      {/* Select All & Refresh */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Checkbox
          checked={checkedItems.length === trashItems.length && trashItems.length > 0}
          onChange={handleSelectAll}
        />
        <IconButton onClick={handleRefresh} sx={{ color: "#000" }}>
          <RefreshIcon />
        </IconButton>
        <Typography variant="body2" fontWeight={600}>
          Items will remain in Trash for 30 days.
        </Typography>
      </Box>

      {!trashItems.length ? (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Your trash is empty
          </Typography>
        </Card>
      ) : (
        trashItems.map((item, index) => (
          <Card
            key={item.originalId || index}
            sx={{
              p: 2,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              bgcolor: "#f4f4f4"
            }}
          >
            <Checkbox
              checked={checkedItems.includes(index)}
              onChange={() => handleCheck(index)}
            />
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Size: {item.size ? (item.size / 1024 / 1024).toFixed(2) + " MB" : "0 Bytes"} ~ Deleted: {item.deletedAt}
              </Typography>
            </Box>
          </Card>
        ))
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, itemIndexes: [] })}>
        <DialogTitle>Delete File(s) Permanently</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete the selected file(s)? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, itemIndexes: [] })}>No</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
