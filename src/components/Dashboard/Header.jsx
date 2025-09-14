import React from "react";
import { LogOut } from "lucide-react";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange } from '@mui/material/colors';
import Button from '@mui/material/Button';

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <div></div>
      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-gray-800">
          <NotificationsIcon />
        </button>
        <Stack direction="row" spacing={2}>
          <Avatar sx={{ bgcolor: deepOrange[400] }}>S</Avatar>
        </Stack>
        <Button
          variant="outlined"
          color="error"
          sx={{ textTransform: "none" }}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
