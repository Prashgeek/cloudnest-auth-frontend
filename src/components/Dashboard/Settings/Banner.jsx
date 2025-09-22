// src/components/Dashboard/Banner.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Avatar } from "@mui/material";

const LOCAL_PROFILE_KEY = "profileData_v1";

function Banner() {
  const [userName, setUserName] = useState("Test User");
  const [userEmail, setUserEmail] = useState("test@example.com");
  const [userAvatar, setUserAvatar] = useState("");

  const loadProfileFromStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw || "{}");
        if (parsed.fullName) setUserName(parsed.fullName);
        if (parsed.email) setUserEmail(parsed.email);
        if (parsed.avatar) setUserAvatar(parsed.avatar);
        return;
      }
    } catch (err) {
      console.warn("Banner: parse error", err);
    }

    // Fallback legacy keys
    const storedUserName = localStorage.getItem("userName");
    const storedUserEmail = localStorage.getItem("userEmail");
    const storedUserAvatar = localStorage.getItem("userAvatar");

    if (storedUserName) setUserName(storedUserName);
    if (storedUserEmail) setUserEmail(storedUserEmail);
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

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
        p: 3,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        maxWidth: "1200px",
        width: "80%",
        mx: "auto",
        my: 3,
        height: "190px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* Avatar */}
      <Avatar
        src={userAvatar || undefined}
        sx={(theme) => ({
          width: 120,
          height: 120,
          backgroundColor: "#366c8d",
          border: "4px solid white",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          transition: theme.transitions.create(
            ["background-color", "transform"],
            { duration: theme.transitions.duration.standard }
          ),
          "&:hover": {
            backgroundColor: "#274d66",
            transform: "scale(1.1)",
          },
        })}
      >
        {!userAvatar && userName?.[0]} {/* fallback letter */}
      </Avatar>

      {/* User Info */}
      <Box sx={{ ml: 3, flex: 1 }}>
        <Typography variant="h5" fontWeight="700">
          {userName}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          {userEmail}
        </Typography>
      </Box>
    </Box>
  );
}

export default Banner;
