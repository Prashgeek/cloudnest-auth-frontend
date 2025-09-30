import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNotifications } from '../contexts/NotificationContext'; // ✅ Added

const ChangePassword = () => {
  const navigate = useNavigate();
  const { helpers } = useNotifications(); // ✅ Notification helpers

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [visibility, setVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [validation, setValidation] = useState({
    length: false,
    upperLower: false,
    number: false,
    specialChar: false,
    match: false,
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));

    if (field === "new") {
      validateNewPassword(value);
    }

    if (field === "confirm") {
      setValidation((prev) => ({
        ...prev,
        match: value === passwords.new,
      }));
    }
  };

  const validateNewPassword = (password) => {
    setValidation({
      length: password.length >= 8,
      upperLower: /(?=.*[a-z])(?=.*[A-Z])/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: passwords.confirm === password,
    });
  };

  const handleSave = () => {
    let errors = [];

    if (!passwords.current) errors.push("Current password cannot be empty.");
    if (!validation.length) errors.push("Password must be at least 8 characters.");
    if (!validation.upperLower) errors.push("Password must contain uppercase & lowercase letters.");
    if (!validation.number) errors.push("Password must contain at least one number.");
    if (!validation.specialChar) errors.push("Password must contain at least one special character.");
    if (!validation.match) errors.push("Confirmation password does not match.");

    if (errors.length > 0) {
      setMessage({ text: errors.join(" "), type: "error" });

      // Auto-hide message after 1 second
      setTimeout(() => setMessage({ text: "", type: "" }), 1000);
    } else {
      setMessage({ text: "Password changed successfully. Redirecting to settings...", type: "success" });

      // ✅ Add security update notification
      helpers.securityUpdate("password change");
      
      // ✅ Simulate login alert on new device
      setTimeout(() => helpers.loginAlert("Mumbai, India", "Chrome on Windows"), 500);

      setTimeout(() => navigate("/dashboard/settings"), 1000);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-xl p-8 w-full max-w-md flex flex-col h-[100vh] relative">
        {/* Centered Message above New Password input */}
        {message.text && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg font-semibold text-center shadow-md text-sm transition-all duration-300 ${
              message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"
            }`}
            style={{ top: "390px" }}
          >
            {message.text}
          </div>
        )}

        <div className="flex-1 flex flex-col justify-start mt-8">
          {/* Title */}
          <h1
            style={{
              fontFamily: "Open Sans",
              fontWeight: 700,
              fontSize: "45px",
              lineHeight: "100%",
              marginBottom: "80px",
            }}
          >
            Change Password
          </h1>

          {/* Current Password */}
          <label
            style={{ fontFamily: "Open Sans", fontWeight: 600, fontSize: "16px", marginBottom: "8px" }}
          >
            Current Password
          </label>
          <div className="flex items-center px-3 py-3 mb-10 rounded-xl bg-white shadow-md">
            <input
              type={visibility.current ? "text" : "password"}
              value={passwords.current}
              onChange={(e) => handlePasswordChange("current", e.target.value)}
              placeholder="Enter your current password"
              className="w-full outline-none border-none text-gray-800 bg-transparent"
            />
            <span className="cursor-pointer text-gray-800" onClick={() => toggleVisibility("current")}>
              {visibility.current ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* New Password */}
          <label
            style={{ fontFamily: "Open Sans", fontWeight: 600, fontSize: "16px", marginBottom: "8px" }}
          >
            New Password
          </label>
          <div className="flex items-center px-3 py-3 mb-4 rounded-xl bg-white shadow-md">
            <input
              type={visibility.new ? "text" : "password"}
              value={passwords.new}
              onChange={(e) => handlePasswordChange("new", e.target.value)}
              placeholder="Enter your new password"
              className="w-full outline-none border-none text-gray-800 bg-transparent"
            />
            <span className="cursor-pointer text-gray-800" onClick={() => toggleVisibility("new")}>
              {visibility.new ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* Password Rules */}
          <div className="w-full mb-6">
            <ul className="text-sm list-disc list-inside space-y-1">
              <li className={`${validation.length ? "text-green-700 font-semibold" : "text-gray-500"}`}>
                Minimum 8 characters
              </li>
              <li className={`${validation.upperLower ? "text-green-700 font-semibold" : "text-gray-500"}`}>
                Include uppercase & lowercase letters
              </li>
              <li className={`${validation.number ? "text-green-700 font-semibold" : "text-gray-500"}`}>
                Include at least one number
              </li>
              <li className={`${validation.specialChar ? "text-green-700 font-semibold" : "text-gray-500"}`}>
                Include at least one special character (e.g., !@#$%)
              </li>
            </ul>
          </div>

          {/* Confirm Password */}
          <label
            style={{ fontFamily: "Open Sans", fontWeight: 600, fontSize: "16px", marginBottom: "8px" }}
          >
            Confirm New Password
          </label>
          <div className="flex items-center px-3 py-3 mb-4 rounded-xl bg-white shadow-md">
            <input
              type={visibility.confirm ? "text" : "password"}
              value={passwords.confirm}
              onChange={(e) => handlePasswordChange("confirm", e.target.value)}
              placeholder="Confirm your new password"
              className="w-full outline-none border-none text-gray-800 bg-transparent"
            />
            <span className="cursor-pointer text-gray-800" onClick={() => toggleVisibility("confirm")}>
              {visibility.confirm ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-auto">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md font-semibold"
          >
            Save Password
          </button>
          <button
            onClick={() => navigate("/dashboard/settings")}
            className="flex-1 border border-gray-400 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-300 shadow-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
};

export default ChangePassword;