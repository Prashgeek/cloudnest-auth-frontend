// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import Footer from "../components/Dashboard/Footer";
import Banner from "../components/Dashboard/Banner";
import FileList from "../components/Dashboard/FileList";
import ActionCardsContainer from "../components/Dashboard/ActionCardsContainer";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("Home");
  const [recentFiles, setRecentFiles] = useState([]);

  // Load recentFiles from localStorage on mount
  useEffect(() => {
    try {
      const storedFiles = JSON.parse(localStorage.getItem("recentFiles") || "[]");
      setRecentFiles(storedFiles);
    } catch (err) {
      console.error("Failed to read recentFiles from localStorage", err);
    }
  }, []);

  // Sync active menu from current pathname (so direct URL loads highlight correct menu)
  useEffect(() => {
    const pathname = location.pathname.replace(/\/+$/, ""); // strip trailing slash
    const mapPathToMenu = (p) => {
      if (p === "/dashboard" || p === "/dashboard/") return "Home";
      if (p.startsWith("/dashboard/settings")) return "Settings";
      if (p.startsWith("/dashboard/downloads")) return "Downloads";
      if (p.startsWith("/dashboard/files")) return "Files";
      if (p.startsWith("/dashboard/trash")) return "Trash";
      // share-file and other special pages — keep Home as fallback (or return a specific label if needed)
      return "Home";
    };
    setActiveMenu(mapPathToMenu(pathname));
  }, [location.pathname]);

  // Add file to recent files state + store
  const addFile = (file) => {
    setRecentFiles((prev) => {
      const updated = [file, ...prev].slice(0, 10);
      localStorage.setItem("recentFiles", JSON.stringify(updated));
      return updated;
    });
  };

  const simulateReceiveFile = () => {
    addFile({
      name: `Received_File_${Date.now()}.pdf`,
      size: "1.2 MB",
      date: new Date().toISOString().split("T")[0],
      type: "received",
    });
  };

  const simulateSendFile = () => {
    addFile({
      name: `Sent_Document_${Date.now()}.docx`,
      size: "800 KB",
      date: new Date().toISOString().split("T")[0],
      type: "sent",
    });
  };

  const handleFileUploaded = (file) => addFile(file);

  // Navigate when sidebar menu changes — this keeps URL and state in sync
  const handleMenuChange = (menu) => {
    setActiveMenu(menu);
    let path = "/dashboard";
    if (menu === "Settings") path = "/dashboard/settings";
    else if (menu === "Downloads") path = "/dashboard/downloads";
    else if (menu === "Files") path = "/dashboard/files";
    else if (menu === "Trash") path = "/dashboard/trash";
    else path = "/dashboard";
    navigate(path);
  };

  const handleShareClick = () => {
    // navigate to nested share-file route (App.jsx should have /dashboard/share-file)
    navigate("/dashboard/share-file");
  };

  const BlankPanel = () => <div className="bg-white w-full h-full min-h-[400px]" />;

  // If the path is a nested dashboard route (not the exact /dashboard index),
  // render the nested child route via <Outlet /> so Settings, ViewStorage, etc. show.
  const pathname = location.pathname.replace(/\/+$/, "");
  const isDashboardRoot = pathname === "/dashboard" || pathname === "/dashboard/";
  const isNestedDashboardRoute =
    pathname.startsWith("/dashboard/") && !isDashboardRoot;

  const renderHomeContent = () => (
    <>
      <Banner />
      <div className="flex justify-center items-center mt-6 gap-6">
        <ActionCardsContainer
          onReceiveFile={simulateReceiveFile}
          onSendFile={simulateSendFile}
          onShareFile={handleShareClick}
        />
      </div>
      <FileList files={recentFiles} />
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        <Sidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />
        <div className="flex-1 flex flex-col">
          <Header />
          <section className="p-6 flex-1">
            {isNestedDashboardRoute ? (
              /* nested route content (Settings, ShareFile page, ViewStorage etc.) */
              <Outlet context={{ addFile, recentFiles, handleFileUploaded }} />
            ) : (
              /* dashboard home content */
              renderHomeContent()
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}