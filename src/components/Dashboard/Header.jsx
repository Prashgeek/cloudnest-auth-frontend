// src/components/Dashboard/Header.jsx
import React, { useEffect, useState, useCallback } from "react";
import { LogOut } from "lucide-react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import { Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotifications } from "../../contexts/NotificationContext";

const LOCAL_PROFILE_KEY = "profileData_v1";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUnreadCount } = useNotifications();
  const [userAvatar, setUserAvatar] = useState("");
  const [userName, setUserName] = useState("User");

  const loadProfileFromStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.fullName) setUserName(parsed.fullName);
        if (parsed.avatar) setUserAvatar(parsed.avatar);
        return;
      }
    } catch {
      // ignore
    }
    const storedName = localStorage.getItem("userName");
    const storedAvatar = localStorage.getItem("userAvatar");
    if (storedName) setUserName(storedName);
    if (storedAvatar) setUserAvatar(storedAvatar);
  }, []);

  useEffect(() => {
    loadProfileFromStorage();
    window.addEventListener("storage", loadProfileFromStorage);
    window.addEventListener("profileUpdated", loadProfileFromStorage);
    return () => {
      window.removeEventListener("storage", loadProfileFromStorage);
      window.removeEventListener("profileUpdated", loadProfileFromStorage);
    };
  }, [loadProfileFromStorage]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userAvatar");
    localStorage.removeItem(LOCAL_PROFILE_KEY);
    window.location.href = "/";
  };

  // Toggle notifications page: open if not on it, close (go to dashboard) if currently on it
  const toggleNotifications = () => {
    if (location.pathname === "/notifications") {
      navigate("/dashboard");
    } else {
      navigate("/notifications");
    }
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <div></div>
      <div className="flex items-center gap-4">
        {/* 🔔 Notifications with badge - toggles /notifications */}
        <Badge badgeContent={getUnreadCount()} color="error">
          <button
            onClick={toggleNotifications}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Toggle notifications"
          >
            <NotificationsIcon />
          </button>
        </Badge>

        {/* 👤 Profile Avatar */}
        <Stack direction="row" spacing={2}>
          <Avatar
            src={userAvatar || undefined}
            sx={{
              width: 42,
              height: 42,
              backgroundColor: "#366c8d",
              fontWeight: "bold",
              border: "2px solid #e5e7eb",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            {!userAvatar && userName.charAt(0)}
          </Avatar>
        </Stack>

        {/* 🚪 Logout Button */}
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "12px",
            backgroundColor: "#d9d9d9",
            color: "#000000",
            boxShadow: "none",
            px: 1.9,
            py: 1,
            minWidth: "unset",
            "&:hover": {
              backgroundColor: "#bfbfbf",
              boxShadow: "none",
            },
          }}
        >
          Log Out
        </Button>
      </div>
    </header>
  );
}
