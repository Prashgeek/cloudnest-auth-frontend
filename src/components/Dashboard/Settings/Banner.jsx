import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar } from "@mui/material";

function Banner() {
  const [userName, setUserName] = useState("Test User");
  const [userEmail, setUserEmail] = useState("test@example.com");

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserEmail = localStorage.getItem("userEmail");
    const authToken = localStorage.getItem("authToken");

    // ✅ Only set if value exists
    if (storedUserName) setUserName(storedUserName);
    if (storedUserEmail) setUserEmail(storedUserEmail);

    // ✅ Override if token found
    if (authToken) {
      if (authToken.includes("google")) {
        setUserName("Google User");
      } else if (authToken.includes("apple")) {
        setUserName("Apple User");
      }
    }
  }, []);

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
        src="/broken-image.jpg"
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
      />

      {/* User Info */}
      <Box
        sx={{
          ml: 3,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="700"
          sx={{
            color: "text.primary",
            lineHeight: 1.3,
            transition: "all 0.3s ease",
          }}
        >
          {userName}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mt: 0.5,
            transition: "all 0.3s ease",
          }}
        >
          {userEmail}
        </Typography>
      </Box>
    </Box>
  );
}

export default Banner;
