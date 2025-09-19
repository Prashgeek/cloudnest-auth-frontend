import React, { useState } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import Footer from "../components/Dashboard/Footer";
import Banner from "../components/Dashboard/Banner";
import FileList from "../components/Dashboard/FileList";
import ActionCardsContainer from "../components/Dashboard/ActionCardsContainer";
import ShareFileComponent from "../components/Dashboard/ShareFileComponent";
import Settings from "./Settings";

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [recentFiles, setRecentFiles] = useState([]);
  const [showShareFile, setShowShareFile] = useState(false);

  const addFile = (file) => setRecentFiles((prev) => [file, ...prev].slice(0, 10));

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

  const handleShareClick = () => setShowShareFile(true);
  const handleFileUploaded = (file) => addFile(file);

  // Handle menu changes
  const handleMenuChange = (menu) => {
    setActiveMenu(menu);
    if (menu !== "Home") {
      setShowShareFile(false); // Close Share page for non-Home menus
    } else if (menu === "Home") {
      setShowShareFile(false); // Ensure dashboard content shows on Home
    }
  };

  const BlankPanel = () => <div className="bg-white w-full h-full min-h-[400px]" />;

  const renderContent = () => {
    if (activeMenu === "Settings") return <Settings />;
    if (["Downloads", "Files", "Trash"].includes(activeMenu)) return <BlankPanel />;

    return (
      <>
        {showShareFile ? (
          <ShareFileComponent
            onBackToDashboard={() => setShowShareFile(false)}
            onFileUploaded={handleFileUploaded}
          />
        ) : (
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
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        <Sidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />
        <div className="flex-1 flex flex-col">
          <Header />
          <section className="p-6 flex-1"> {renderContent()} </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}