import React from "react";
import { LogOut } from "lucide-react";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange } from '@mui/material/colors';
import Button from '@mui/material/Button';

export default function Header() {
  // Added logout handler function
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    
    // Redirect to login page
    window.location.href = "/";
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <div></div>
      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-gray-800">
          <NotificationsIcon />
        </button>
        <Stack direction="row" spacing={2}>
          <Avatar sx={{ bgcolor: deepOrange }}>S</Avatar>
        </Stack>
       <Button
  variant="contained"
  onClick={handleLogout}
  sx={{
    textTransform: "none",
    fontWeight: "bold", // ✅ bold text
    borderRadius: "12px", // ✅ smooth rectangular corners
    backgroundColor: "#d9d9d9",
    color: "#000000",
    boxShadow: "none",
    px: 1.9, // ✅ slightly less padding to reduce width
    py: 1,
    minWidth: "unset", // ✅ prevents default wide button
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
