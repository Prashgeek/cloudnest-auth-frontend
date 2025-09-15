import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import pandaImg from '../../assets/cloudnest_banner.png'

export default function Banner() {
  const [userName, setUserName] = useState("Test"); // Changed default from "" to "Test"

  useEffect(() => {
    // Get username from localStorage when component mounts
    const storedUserName = localStorage.getItem("userName");
    const authToken = localStorage.getItem("authToken");
    
    if (storedUserName) {
      // ✅ ADDED: Remove "User" suffix if it exists and clean the name
      const cleanName = storedUserName
        .replace(/\s+user$/i, '') // Remove "User" at the end (case insensitive)
        .replace(/user$/i, '') // Remove "user" at the end without space
        .trim(); // Remove extra spaces
      
      setUserName(cleanName || "Test");
    } else if (authToken) {
      // ✅ ADDED: Set name based on auth token type
      if (authToken.includes("google")) {
        setUserName("Google");
      } else if (authToken.includes("apple")) {
        setUserName("Apple");
      } else {
        setUserName("Test");
      }
    }
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#dbeafe", // baby blue
        p: 2, // Padding
        borderRadius: 2, // rounded-lg
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "2000px", // Max width
        width: "80%", // Width control
        mx: "auto", // Center horizontally
        my: 2, // Margin top/bottom
        height: "190px", // ✅ FIXED HEIGHT - Container won't grow with panda
        overflow: "hidden", // ✅ Hide any overflow to maintain container size
      }}
    >
      {/* Text moved to the right with margin */}
      <Box sx={{ marginLeft: "80px", flex: 1 }}> {/* Added flex: 1 for better spacing */}
        <Typography variant="h4" fontWeight="600">
          Hi, {userName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your secure cloud awaits you.
        </Typography>
      </Box>
      {/* ✅ Panda with independent sizing - won't affect container height */}
      <Box
        component="img"
        src={pandaImg}
        alt="Panda"
        sx={{ 
          width: 280, // You can adjust this independently
          height: 190, // You can adjust this independently  
          objectFit: "contain",
          marginRight: "50px",
          marginLeft: "-20px",
          maxHeight: "1800px", // ✅ Ensures image doesn't exceed container height
          maxWidth: "none", // ✅ Allows width to be set independently
        }}
      />
    </Box>
  );
}
