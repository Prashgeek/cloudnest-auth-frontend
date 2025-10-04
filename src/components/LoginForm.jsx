// src/components/LoginForm.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useNotifications } from "../contexts/NotificationContext";
import { Link } from "react-router-dom"; // ✅ Added

export default function LoginForm({ onSwitch, onForgotPassword, showToast }) {
  const { helpers } = useNotifications();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false); // ✅ Added

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const err = {};
    if (!form.email) err.email = "Email is required";
    if (!form.password) err.password = "Password is required";
    if (!acceptedTerms) err.terms = "You must accept the terms and conditions"; // ✅ Added
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let browser = "Unknown", os = "Unknown";
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iOS")) os = "iOS";
    return `${browser} on ${os}`;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    if (form.email === "test@example.com" && form.password === "123456") {
      localStorage.setItem("authToken", "token");
      localStorage.setItem("userName", "Test User");
      localStorage.setItem("userEmail", form.email);
      helpers.loginAlert("Mumbai, India", getDeviceInfo());
      showToast("Login successful!");
      setLoading(false);
      setTimeout(() => (window.location.href = "/dashboard"), 1500);
    } else {
      setLoginError("Invalid email or password");
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!acceptedTerms) { // ✅ Added validation
      setErrors({ terms: "You must accept the terms and conditions" });
      return;
    }
    
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    localStorage.setItem("authToken", "google_token");
    localStorage.setItem("userName", "Google User");
    localStorage.setItem("userEmail", "user@gmail.com");
    helpers.loginAlert("Mumbai, India", getDeviceInfo() + " (Google SSO)");
    showToast("Login successful!");
    setLoading(false);
    setTimeout(() => (window.location.href = "/dashboard"), 1500);
  };

  const handleApple = async () => {
    if (!acceptedTerms) { // ✅ Added validation
      setErrors({ terms: "You must accept the terms and conditions" });
      return;
    }
    
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    localStorage.setItem("authToken", "apple_token");
    localStorage.setItem("userName", "Apple User");
    localStorage.setItem("userEmail", "user@icloud.com");
    helpers.loginAlert("Mumbai, India", getDeviceInfo() + " (Apple ID)");
    showToast("Login successful!");
    setLoading(false);
    setTimeout(() => (window.location.href = "/dashboard"), 1500);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {loginError && (
        <p className="text-sm text-red-600 text-center mb-2">{loginError}</p>
      )}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 w-full items-center p-8"
        style={{ backgroundColor: "transparent", boxShadow: "none", border: "none" }}
      >
        <div className="flex flex-col items-center mb-4">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 mb-2" />
          <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">Log In</h2>
          <p className="text-gray-500 text-xs text-center">
            Welcome back! Please log in to your account.
          </p>
        </div>
        <div className="w-11/12 sm:w-4/5 mx-auto">
          <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div className="w-11/12 sm:w-4/5 mx-auto">
          <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>
        
        {/* Terms and Conditions Checkbox */}
        <div className="w-11/12 sm:w-4/5 mx-auto mt-2">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  if (e.target.checked) {
                    setErrors({ ...errors, terms: "" });
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </Link>
              </label>
              {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms}</p>}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-11/12 sm:w-4/5 py-2.5 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-1 text-sm font-medium mt-4"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
        <div className="flex items-center my-4 text-gray-300 gap-2 w-11/12 sm:w-4/5 mx-auto">
          <hr className="flex-grow border-gray-300" />
          <span className="text-xs text-gray-400 text-center">Or Login with</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <div className="flex justify-center gap-4 w-full max-w-md mx-auto px-4">
          <motion.button
            onClick={handleGoogle}
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center w-20 h-10 bg-white border rounded-lg shadow hover:bg-gray-50"
          >
            <FcGoogle className="w-6 h-6" />
          </motion.button>
          <motion.button
            onClick={handleApple}
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center w-20 h-10 bg-white border rounded-lg shadow hover:bg-gray-50"
          >
            <FaApple className="w-6 h-6 text-black" />
          </motion.button>
        </div>
        <p className="text-center text-gray-600 text-xs mt-4 w-11/12 sm:w-4/5 mx-auto">
          Don't have an account?{" "}
          <button onClick={onSwitch} className="text-blue-600 hover:underline">
            Sign Up
          </button>
        </p>
      </motion.div>
    </div>
  );
}