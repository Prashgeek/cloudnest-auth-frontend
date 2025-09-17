import React, { useState } from "react";
import Banner from "../components/Dashboard/Banner";
import FileList from "../components/Dashboard/FileList";
import ActionCardsContainer from "../components/Dashboard/ActionCardsContainer";
import ShareFileComponent from "../components/Dashboard/ShareFileComponent";

export default function DashboardHome() {
  const [recentFiles, setRecentFiles] = useState([]);
  const [showShareFile, setShowShareFile] = useState(false);

  const addFile = (file) => setRecentFiles(prev => [file, ...prev].slice(0, 10));

  const simulateReceiveFile = () => {
    addFile({
      name: `Received_File_${Date.now()}.pdf`,
      size: "1.2 MB",
      date: new Date().toISOString().split('T')[0],
      type: "received"
    });
  };

  const simulateSendFile = () => {
    addFile({
      name: `Sent_Document_${Date.now()}.docx`,
      size: "800 KB",
      date: new Date().toISOString().split('T')[0],
      type: "sent"
    });
  };

  const handleShareClick = () => setShowShareFile(true);
  const handleBackToDashboard = () => setShowShareFile(false);
  const handleFileUploaded = (file) => addFile(file);

  return (
    <section className="p-6 flex-1">
      {showShareFile ? (
        <ShareFileComponent
          onBackToDashboard={handleBackToDashboard}
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
    </section>
  );
}
