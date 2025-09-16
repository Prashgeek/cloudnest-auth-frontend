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
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function ClippedDrawer({ activeMenu = "Home", onMenuChange }) { // Added props for active menu
  const menuItems = [
    { text: "Home", icon: <HomeIcon />, link: '/'},
    { text: "Downloads", icon: <DownloadIcon />, link: '/' },
    { text: "Files", icon: <InsertDriveFileIcon />, link: '/' },
    { text: "Settings", icon: <SettingsIcon />, link: '/settings' },
    { text: "Trash", icon: <DeleteIcon />, link: '/' },
  ];

  const navigate = useNavigate()
  const handleMenuClick = (menuText, link) => { // Added click handler
    if (onMenuChange) {
      onMenuChange(menuText);
      navigate(link)
    }
  };

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
            {menuItems.map((item, index) => {
              const isActive = activeMenu === item.text; // Added active state check
              
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => handleMenuClick(item.text, item.link)} // Added click handler
                    sx={{
                      opacity: isActive ? 1 : 0.7, // Added opacity for inactive items
                      backgroundColor: isActive ? "#dbeafe" : "transparent", // Added blue background for active
                      borderRadius: "8px", // Added border radius
                      margin: "0 8px", // Added margin
                      transition: "all 0.2s ease-in-out", // Added smooth transition
                      borderLeft: isActive ? "4px solid #2563eb" : "4px solid transparent", // Added left border for active
                      "&:hover": {
                        backgroundColor: isActive ? "#bfdbfe" : "#f3f4f6", // Added hover effects
                        opacity: 1, // Full opacity on hover
                        transform: "translateX(4px)" // Added slight movement on hover
                      },
                      "&:active": {
                        transform: "scale(0.98)" // Added press effect
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? "#2563eb" : "#6b7280", // Added active icon color
                        transition: "color 0.2s ease" // Added color transition
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontWeight: isActive ? "600" : "500", // Added font weight for active
                          color: isActive ? "#2563eb" : "#374151", // Added text color for active
                          transition: "all 0.2s ease" // Added text transition
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
