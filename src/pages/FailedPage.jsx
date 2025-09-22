// src/pages/FailedPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa"; // Thick red cross

export default function FailedPage() {
  const navigate = useNavigate();

  const handleRetryClick = () => {
    navigate("/dashboard/share-file");
  };

  return (
    <div className="failed-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lalezar&display=swap');

        .failed-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          background: #ffffff;
          color: #4b5563;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
          padding: 32px;
          position: relative;
        }

        .failed-header {
          display: flex;
          align-items: center;
          font-weight: bold;
          font-size: 28px;
          color: #000;
          margin-bottom: 40px;
          gap: 16px;
        }

        .failed-header .cross {
          color: #e63946;
          font-size: 45px;
        }

        .failed-card {
          width: 1048px;
          height: 557px;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          padding: 48px 40px;
          margin-bottom: 40px;
          box-sizing: border-box;
        }

        .failed-card-title {
          font-family: 'Lalezar', cursive;
          font-weight: 400;
          font-size: 64px;
          line-height: 100%;
          color: #e63946;
          margin-bottom: 24px;
        }

        .failed-illustration {
          width: 500px;
          height: 355px;
          margin-bottom: 24px;
        }

        .failed-illustration img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .failed-message {
          font-size: 16px;
          line-height: 1.5;
          color: #6b7280;
          margin-bottom: 48px;
        }

        /* Retry button moved out of the card */
        .retry-btn {
          width: 355px;
          height: 56px;
          border-radius: 10px;
          background-color: #1a73e8;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          padding-top: 17px;
          padding-bottom: 17px;
          padding-left: 152px;
          padding-right: 152px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 6px rgba(26, 115, 232, 0.4);
          transition: background-color 0.3s ease;
          margin-top: 40px;
        }

        .retry-btn:hover {
          background-color: #155ab6;
        }

        @media (max-width: 1200px) {
          .failed-card {
            width: 90%;
            height: auto;
            min-height: 450px;
          }
          .failed-card-title {
            font-size: 48px;
          }
          .failed-illustration {
            width: 220px;
            height: 220px;
          }
          .retry-btn {
            width: 80%;
            padding-left: 0;
            padding-right: 0;
          }
        }

        @media (max-width: 768px) {
          .failed-page {
            padding: 20px;
          }
          .failed-card {
            padding: 32px 24px;
          }
          .failed-card-title {
            font-size: 36px;
          }
          .failed-illustration {
            width: 180px;
            height: 180px;
          }
          .failed-message {
            font-size: 14px;
          }
          .retry-btn {
            width: 90%;
          }
        }
      `}</style>

      <div className="failed-header">
        <FaTimes color="#e63946" size={45} />
        Files Sharing Failed
      </div>

      <section className="failed-card">
        <div className="failed-card-title">Failed!!</div>
        <div className="failed-illustration">
          <img src="/failed.png" alt="Failed" />
        </div>
        <div className="failed-message">
          Oops! Your file sharing failed due to low internet connection.<br/>
          Kindly retry or check your connection.
        </div>
      </section>

      {/* Retry button outside the card */}
      <button
        className="retry-btn"
        type="button"
        onClick={handleRetryClick}
      >
        Retry
      </button>
    </div>
  );
}
