import React, { useState } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import Footer from "../components/Dashboard/Footer";
import Banner from "../components/Dashboard/Settings/Banner";
import AccountInfo from "../components/Dashboard/Settings/AccountInfo";
import CloudStorage from "../components/Dashboard/Settings/CloudStorage";
import NotificationSettings from "../components/Dashboard/Settings/NotifcationSettings";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";

function Settings() {
  const [activeMenu, setActiveMenu] = useState("Settings");
  const navigate = useNavigate()
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <div className="flex-1 flex flex-col">
          <Header />
          <Banner />

          {/* Grid layout for AccountInfo, CloudStorage, NotificationSettings */}
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

          {/* Buttons Row */}
          <div className="flex flex-wrap gap-4 m-4 justify-center">
            {/* Change Password Button */}
            <button className="flex-1 flex items-center gap-2 bg-white text-gray-900 font-semibold px-5 py-3 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:scale-105 transition-transform duration-200 min-w-[180px] mx-2 justify-center">
              <LockOutlinedIcon className="text-gray-600 text-lg" />
              <span className="text-base">Change Password</span>
            </button>

            {/* Upgrade Button */}
            <button className="flex-1 flex items-center gap-2 bg-white text-gray-900 font-semibold px-5 py-3 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:scale-105 transition-transform duration-200 min-w-[180px] mx-2 justify-center">
              <CloudUploadIcon className="text-gray-600 text-lg" />
              <span className="text-base">Upgrade</span>
            </button>
          </div>

          {/* Logout Button Centered Below */}
          <div className="flex justify-center m-4">
            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md border border-blue-600 hover:bg-blue-700 transition-all duration-200 min-w-[300px]"
            onClick={()=> navigate('/')}>
              Logout
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Settings;
