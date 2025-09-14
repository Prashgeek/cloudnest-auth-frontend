import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// ✅ MUI Icons
import HomeIcon from "@mui/icons-material/Home";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";

const drawerWidth = 240;

export default function ClippedDrawer() {
  const menuItems = [
    { text: "Home", icon: <HomeIcon /> },
    { text: "Downloads", icon: <DownloadIcon /> },
    { text: "Files", icon: <InsertDriveFileIcon /> },
    { text: "Settings", icon: <SettingsIcon /> },
    { text: "Trash", icon: <DeleteIcon /> },
  ];

  return (
    <Box sx={{ display: "flex", borderRight: "1px solid #d1d5db", backgroundColor: "#eff6ff" }} >
      <CssBaseline />

      {/* ✅ Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          height: "100vh",
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#eff6ff",
            position: "relative",   // ✅ stops overlapping footer
            height: "100%",
            
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 2, // optional padding
          }}
        >
          <img
            src="/logo.png"
            alt="Cloudnest Logo"
            style={{ width: "78px", height: "auto" }}
          />
        </Box>

        <Box sx={{ overflow: "auto" }}>
          <List sx={{ display: "flex", flexDirection: "column", gap: 4.5 }}>
            {menuItems.map((item, index) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
