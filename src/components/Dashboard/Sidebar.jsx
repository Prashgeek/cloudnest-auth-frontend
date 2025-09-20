import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// MUI Icons
import HomeIcon from "@mui/icons-material/Home";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;

export default function Sidebar({ activeMenu = "Home", onMenuChange }) {
  const navigate = useNavigate();
  const location = useLocation(); // For active menu highlight

  // Updated links to use nested /dashboard routes
  const menuItems = [
    { text: "Home", icon: <HomeIcon />, link: "/dashboard" },
    { text: "Downloads", icon: <DownloadIcon />, link: "/dashboard/downloads" },
    { text: "Files", icon: <InsertDriveFileIcon />, link: "/dashboard/files" },
    { text: "Settings", icon: <SettingsIcon />, link: "/dashboard/settings" },
    { text: "Trash", icon: <DeleteIcon />, link: "/dashboard/trash" },
  ];

  // Helper: normalize path (remove trailing slashes)
  const normalize = (p = "") => (p.endsWith("/") && p.length > 1 ? p.replace(/\/+$/, "") : p);

  const getIsActive = (itemLink) => {
    const pathname = normalize(location.pathname);
    const link = normalize(itemLink);

    // Exact match for dashboard root
    if (link === "/dashboard") {
      return pathname === "/dashboard";
    }
    // For other links, match if path starts with the link (so nested routes highlight)
    return pathname === link || pathname.startsWith(link + "/");
  };

  const handleMenuClick = (item) => {
    if (onMenuChange) {
      // Inform parent about the menu change (keeps local UI state in sync)
      onMenuChange(item.text);
    }
    // Navigate only if we're not already on the same path (avoids redundant pushes)
    const target = normalize(item.link);
    const current = normalize(location.pathname);
    if (current !== target) {
      navigate(item.link);
    }
  };

  const handleKeyDown = (e, item) => {
    // Support keyboard activation (Enter / Space)
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleMenuClick(item);
    }
  };

  return (
    <Box sx={{ display: "flex", borderRight: "1px solid #d1d5db", backgroundColor: "#eff6ff" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          height: "100vh",
          ["& .MuiDrawer-paper"]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#eff6ff",
            position: "relative",
            height: "100%",
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 2 }}>
          <img
            src="/logo.png"
            alt="Cloudnest Logo"
            style={{ width: "78px", height: "auto", display: "block" }}
            onError={(e) => {
              // hide broken image safely and do not rely on sibling elements
              e.currentTarget.style.display = "none";
            }}
          />
          <Box
            sx={{
              display: "none",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#2563eb",
            }}
          >
            CloudNest
          </Box>
        </Box>

        {/* Menu List */}
        <Box sx={{ overflow: "auto" }}>
          <List sx={{ display: "flex", flexDirection: "column", gap: 4.5 }}>
            {menuItems.map((item) => {
              const isActive = getIsActive(item.link);

              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => handleMenuClick(item)}
                    onKeyDown={(e) => handleKeyDown(e, item)}
                    aria-current={isActive ? "page" : undefined}
                    sx={{
                      opacity: isActive ? 1 : 0.65,
                      transition: "opacity 0.2s ease-in-out",
                      backgroundColor: "transparent",
                      "&:hover": {
                        opacity: 0.9,
                        backgroundColor: "transparent",
                      },
                      "&:active": {
                        transform: "scale(0.98)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? "#000000" : "#6b7280",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontWeight: isActive ? "700" : "400",
                          color: "#000000",
                          transition: "all 0.2s ease",
                        },
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
