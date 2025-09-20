import React from "react";
import Banner from "../components/Dashboard/Settings/Banner";
import AccountInfo from "../components/Dashboard/Settings/AccountInfo";
import CloudStorage from "../components/Dashboard/Settings/CloudStorage";
import NotificationSettings from "../components/Dashboard/Settings/NotifcationSettings";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  const location = useLocation();

  // Render main Settings page content only on exact /dashboard/settings
  // For nested route (e.g., /dashboard/settings/view-storage), render only the nested Outlet
  if (location.pathname === "/dashboard/settings") {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <Banner />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
            p: 3,
          }}
        >
          <AccountInfo />
          <CloudStorage />
          <NotificationSettings sx={{ gridColumn: "1" }} />
        </Box>
        <div className="flex flex-wrap gap-4 m-4 justify-center">
          <button className="flex-1 flex items-center gap-2 bg-white text-gray-900 font-semibold px-5 py-3 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:scale-105 transition-transform duration-200 min-w-[180px] mx-2 justify-center">
            <LockOutlinedIcon className="text-gray-600 text-lg" />
            <span className="text-base">Change Password</span>
          </button>
          <button className="flex-1 flex items-center gap-2 bg-white text-gray-900 font-semibold px-5 py-3 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:scale-105 transition-transform duration-200 min-w-[180px] mx-2 justify-center">
            <CloudUploadIcon className="text-gray-600 text-lg" />
            <span className="text-base">Upgrade</span>
          </button>
        </div>
        <div className="flex justify-center m-4">
          <button
            className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md border border-blue-600 hover:bg-blue-700 transition-all duration-200 min-w-[300px]"
            onClick={() => navigate("/")}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // For all other nested settings routes, render the nested page only
  return <Outlet />;
}

export default Settings;
