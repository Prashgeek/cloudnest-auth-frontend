import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

function NotificationSettings() {
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);
  
    const handlePushToggle = () => setPushEnabled((prev) => !prev);
    const handleEmailToggle = () => setEmailEnabled((prev) => !prev);
  
    const PushSwitch = styled((props) => (
      <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
      width: 42,
      height: 26,
      padding: 0,
      "& .MuiSwitch-switchBase": {
        padding: 0,
        margin: 2,
        transitionDuration: "300ms",
        "&.Mui-checked": {
          transform: "translateX(16px)",
          color: "#fff",
          "& + .MuiSwitch-track": {
            backgroundColor: "#007aff",
            opacity: 1,
            border: 0,
          },
        },
      },
      "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: 22,
        height: 22,
        border: "2px solid #007aff", // border around thumb
        backgroundColor: "#fff", // thumb background
      },
      "& .MuiSwitch-track": {
        borderRadius: 26 / 2,
        backgroundColor: "#fff",
        border: "3px solid #007aff",
        opacity: 1,
        transition: theme.transitions.create(["background-color"], {
          duration: 500,
        }),
      },
    }));
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        m: 3,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          maxWidth: 500,
          width: "100%",
          borderRadius: 3,
          p: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{ color: "text.primary", fontWeight: 600, mb: 3 }}
          >
            Notification Settings
          </Typography>

          {/* Push Notifications */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Push Notifications
            </Typography>
            <PushSwitch checked={pushEnabled} onChange={handlePushToggle} />
          </Box>

          {/* Email Notifications */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Email Notifications
            </Typography>
            <PushSwitch checked={emailEnabled} onChange={handleEmailToggle} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default NotificationSettings;
