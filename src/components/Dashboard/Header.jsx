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
          variant="outlined"
          onClick={handleLogout} // Added onClick handler
          sx={{ 
            textTransform: "none",
            borderRadius: "20px", // Added border radius as requested
            color: "#000000", // Added black text color
            borderColor: "#9CA3AF", // Added grey border color
            backgroundColor: "#F9FAFB", // Added light grey background
            "&:hover": {
              backgroundColor: "#F3F4F6", // Added hover background
              borderColor: "#6B7280" // Added hover border color
            }
          }}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
