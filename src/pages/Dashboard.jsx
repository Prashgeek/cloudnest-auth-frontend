import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // important for nested routes
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import Footer from "../components/Dashboard/Footer";

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("Home");

  const handleMenuChange = (menuText) => {
    setActiveMenu(menuText);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        <Sidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />
        <div className="flex-1 flex flex-col">
          <Header />
          {/* This is where nested routes render */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
