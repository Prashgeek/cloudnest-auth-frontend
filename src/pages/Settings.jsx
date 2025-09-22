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

  const isMainSettingsPage = location.pathname === "/dashboard/settings";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {isMainSettingsPage && (
        <>
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
            <button
              className="flex-1 flex items-center gap-2 bg-white text-gray-900 font-semibold px-5 py-3 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:scale-105 transition-transform duration-200 min-w-[180px] mx-2 justify-center"
              onClick={() => navigate("account")} // RELATIVE path!
            >
              View Details
            </button>
            <button className="flex-1 flex items-center gap-2 bg-white text-gray-900 font-semibold px-5 py-3 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:scale-105 transition-transform duration-200 min-w-[180px] mx-2 justify-center">
              Upgrade
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
        </>
      )}

      {/* Nested route content */}
      <Outlet />
    </div>
  );
}

export default Settings;
