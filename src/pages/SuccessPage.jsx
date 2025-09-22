// src/pages/SuccessPage.jsx
import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaCheck } from "react-icons/fa"; // Thick checkmark icon

export default function SuccessPage() {
  const navigate = useNavigate();
  
  const outletContext = useOutletContext();
  const addFile = outletContext?.addFile;

  const handleDoneClick = () => {
    if (addFile) {
      addFile({
        name: `Shared_File_${Date.now()}.pdf`,
        size: "2.4 MB",
        date: new Date().toISOString().split("T")[0],
        type: "shared",
      });
    }
    navigate("/dashboard");
  };

  return (
    <div className="success-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lalezar&display=swap');

        .success-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          color: #4b5563;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
          padding: 32px;
        }

        .success-header {
          font-weight: bold;
          font-size: 28px;
          color: #000000;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .success-card {
          width: 1048px;
          height: 557px;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          background: #f8fafc;
          box-sizing: border-box;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .success-card h2 {
          margin: 0 0 24px;
          font-size: 32px;
          color: #22c55e;
          font-weight: 900;
        }

        .success-illustration {
          width: 300px;
          height: 300px;
          margin-bottom: 24px;
        }

        .success-illustration img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .success-message {
          font-size: 16px;
          line-height: 1.5;
          color: #6b7280;
          margin: 0;
        }

        .done-button {
          background: #2563eb;
          color: white;
          padding: 14px 56px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
          box-shadow: 0 4px 6px rgba(37, 99, 235, 0.4);
        }

        .done-button:hover {
          background: #1e40af;
        }

        .big-success-text {
          font-family: 'Lalezar', cursive;
          font-weight: 400;
          font-size: 64px;
          line-height: 100%;
          letter-spacing: 0%;
          color: #22c55e;
          margin: 16px 0;
          text-align: center;
        }

        @media (max-width: 1200px) {
          .success-card {
            width: 90%;
            height: auto;
            min-height: 450px;
          }
          .success-header {
            font-size: 24px;
          }
          .success-card h2 {
            font-size: 28px;
          }
          .success-illustration {
            width: 220px;
            height: 220px;
          }
          .big-success-text {
            font-size: 48px;
          }
        }

        @media (max-width: 768px) {
          .success-page {
            padding: 20px;
          }
          .success-card {
            padding: 32px 24px;
          }
          .success-header {
            font-size: 22px;
          }
          .success-card h2 {
            font-size: 24px;
          }
          .success-illustration {
            width: 180px;
            height: 180px;
          }
          .big-success-text {
            font-size: 36px;
          }
        }
      `}</style>

      <div className="success-header">
        <FaCheck size={45} color="#11cc6e" /> {/* Thick green checkmark */}
        Files Shared Successfully
      </div>

      <section className="success-card">
        <div className="big-success-text">Success!!</div>
        <div className="success-illustration">
          <img src="/success.png" alt="Success" />
        </div>
        <p className="success-message">
          Your files have been successfully shared with your teammates!!!
        </p>
      </section>

      <button
        className="done-button"
        type="button"
        onClick={handleDoneClick}
      >
        Done
      </button>
    </div>
  );
}
