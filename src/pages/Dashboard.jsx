import React from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import Banner from "../components/Dashboard/Banner";
import FileList from "../components/Dashboard/FileList";
import ActionCardsContainer from "../components/Dashboard/ActionCardsContainer";
import Footer from "../components/Dashboard/Footer";

export default function Dashboard() {
  const recentFiles = [
    { name: "Project_Proposal_2025.pdf", size: "1.2 MB", date: "2025-08-28" },
    { name: "Project_Proposal_2025.docx", size: "1.2 MB", date: "2025-08-28" },
    { name: "Project_Proposal_2025.pptx", size: "1.2 MB", date: "2025-08-28" },
    { name: "Project_Proposal_2025.pdf", size: "1.2 MB", date: "2025-08-28" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
  <div className="flex">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Header />
      <section className="p-6 flex-1">
        <Banner />
        <div className="flex justify-center items-center mt-6 gap-6">
          <ActionCardsContainer />
        </div>
        <FileList files={recentFiles} />
      </section>
    </div>
  </div>
  <Footer />
</div>

  );
}
