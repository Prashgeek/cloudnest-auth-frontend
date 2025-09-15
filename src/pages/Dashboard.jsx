import React, { useState } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import Banner from "../components/Dashboard/Banner";
import FileList from "../components/Dashboard/FileList";
import ActionCardsContainer from "../components/Dashboard/ActionCardsContainer";
import Footer from "../components/Dashboard/Footer";

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("Home"); // Added state for active menu
  const [recentFiles, setRecentFiles] = useState([]); // Changed from hardcoded array to empty state
  
  // Mock function to simulate file upload/receive
  const addFile = (file) => {
    setRecentFiles(prev => [file, ...prev].slice(0, 10)); // Keep only 10 recent files
  };

  // Mock function to simulate receiving a file (for testing)
  const simulateReceiveFile = () => {
    const mockFile = {
      name: `Received_File_${Date.now()}.pdf`,
      size: "1.2 MB",
      date: new Date().toISOString().split('T'),
      type: "received"
    };
    addFile(mockFile);
  };

  // Mock function to simulate sending a file (for testing)
  const simulateSendFile = () => {
    const mockFile = {
      name: `Sent_Document_${Date.now()}.docx`,
      size: "800 KB", 
      date: new Date().toISOString().split('T'),
      type: "sent"
    };
    addFile(mockFile);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <div className="flex-1 flex flex-col">
          <Header />
          <section className="p-6 flex-1">
            <Banner />
            <div className="flex justify-center items-center mt-6 gap-6">
              <ActionCardsContainer 
                onReceiveFile={simulateReceiveFile}
                onSendFile={simulateSendFile}
              />
            </div>
            <FileList files={recentFiles} />
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
