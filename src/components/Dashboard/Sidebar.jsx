
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

//  MUI Icons
import HomeIcon from "@mui/icons-material/Home";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";

const drawerWidth = 240;

export default function ClippedDrawer({ activeMenu = "Home", onMenuChange }) {
  const menuItems = [
    { text: "Home", icon: <HomeIcon /> },
    { text: "Downloads", icon: <DownloadIcon /> },
    { text: "Files", icon: <InsertDriveFileIcon /> },
    { text: "Settings", icon: <SettingsIcon /> },
    { text: "Trash", icon: <DeleteIcon /> },
  ];

  const handleMenuClick = (menuText) => {
    if (onMenuChange) {
      onMenuChange(menuText);
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
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#eff6ff",
            position: "relative",
            height: "100%",
          },
        }}
      >
        {/*  Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 2 }}>
          <img src="/logo.png" alt="Cloudnest Logo" style={{ width: "78px", height: "auto" }} />
        </Box>

        {/*  Menu List */}
        <Box sx={{ overflow: "auto" }}>
          <List sx={{ display: "flex", flexDirection: "column", gap: 4.5 }}>
            {menuItems.map((item) => {
              const isActive = activeMenu === item.text;
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => handleMenuClick(item.text)}
                    sx={{
                      opacity: isActive ? 1 : 0.5,
                      transition: "opacity 0.2s ease-in-out",
                      backgroundColor: "transparent",
                      "&:hover": {
                        opacity: 0.8,
                        backgroundColor: "transparent",
                      },
                      "&:active": {
                        transform: "scale(0.98)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? "#000000" : "#6b7280", //  black icon if active
                        transition: "color 0.2s ease",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontWeight: isActive ? "700" : "400", //  bold text if active
                          color: "#000000", //  always black text (even if active)
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
