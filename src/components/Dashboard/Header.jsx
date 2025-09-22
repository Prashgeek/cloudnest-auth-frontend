// src/components/Dashboard/Header.jsx
import React, { useEffect, useState, useCallback } from "react";
import { LogOut } from "lucide-react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";

const LOCAL_PROFILE_KEY = "profileData_v1";

export default function Header() {
  const [userAvatar, setUserAvatar] = useState("");
  const [userName, setUserName] = useState("User");

  // ✅ load profile from localStorage
  const loadProfileFromStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw || "{}");
        if (parsed.fullName) setUserName(parsed.fullName);
        if (parsed.avatar) setUserAvatar(parsed.avatar);
        return;
      }
    } catch (err) {
      console.warn("Header: parse error", err);
    }

    // fallback (old keys)
    const storedUserName = localStorage.getItem("userName");
    const storedUserAvatar = localStorage.getItem("userAvatar");
    if (storedUserName) setUserName(storedUserName);
    if (storedUserAvatar) setUserAvatar(storedUserAvatar);
  }, []);

  useEffect(() => {
    loadProfileFromStorage();

    const onStorage = () => loadProfileFromStorage();
    const onProfileUpdated = () => loadProfileFromStorage();

    window.addEventListener("storage", onStorage);
    window.addEventListener("profileUpdated", onProfileUpdated);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("profileUpdated", onProfileUpdated);
    };
  }, [loadProfileFromStorage]);

  // ✅ logout handler
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userAvatar");
    localStorage.removeItem(LOCAL_PROFILE_KEY);
    window.location.href = "/";
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <div></div>
      <div className="flex items-center gap-4">
        {/* 🔔 Notifications */}
        <button className="text-gray-600 hover:text-gray-800">
          <NotificationsIcon />
        </button>

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
            {!userAvatar && userName?.[0]} {/* fallback letter */}
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
