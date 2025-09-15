import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Button from "./Button";
import InputField from "./InputField";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

export default function SignupForm({ onSwitch, showToast }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    // Full Name: at least 2 letters, only alphabets and spaces
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    else if (!nameRegex.test(formData.fullName))
      newErrors.fullName =
        "Name must be at least 2 characters and contain only letters";
    // Email: stricter validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|io|co)$/i;
    if (!formData.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Please enter a valid email with proper domain";
    // Password: at least 8 chars, uppercase, lowercase, number, special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!formData.password) newErrors.password = "Password is required";
    else if (!passwordRegex.test(formData.password))
      newErrors.password =
        "Password must be 8+ chars, include uppercase, lowercase, number & symbol";
    // Confirm Password
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    // Terms
    if (!acceptTerms)
      newErrors.terms = "Please accept the terms and conditions";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Store user data in localStorage
    localStorage.setItem("authToken", "signup_token"); // Added auth token storage
    localStorage.setItem("userName", formData.fullName); // Added username storage
    localStorage.setItem("userEmail", formData.email); // Added email storage
    
    setLoading(false);
    showToast("Registration successful!");
    setTimeout(() => onSwitch(), 1500);
  };
  
  const handleGoogleSignup = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    localStorage.setItem("authToken", "google_token");
    localStorage.setItem("userName", "Google User"); // Added username storage
    localStorage.setItem("userEmail", "user@gmail.com"); // Added email storage
    showToast("Login successful!");
    setTimeout(() => (window.location.href = "/dashboard"), 1500);
  };
  
  const handleAppleSignup = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    localStorage.setItem("authToken", "apple_token");
    localStorage.setItem("userName", "Apple User"); // Added username storage
    localStorage.setItem("userEmail", "user@icloud.com"); // Added email storage
    showToast("Login successful!");
    setTimeout(() => (window.location.href = "/dashboard"), 1500);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 w-full items-center p-8"
      style={{
        backgroundColor: "#EAF7FC",
        boxShadow: "none",
        border: "none",
        borderRadius: "1rem",
      }}
    >
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-4">
        <img src="/logo.png" alt="Logo" className="w-12 h-12 mb-2" />
        <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">
          Sign Up
        </h2>
        <p className="text-gray-500 text-xs text-center">
          Create your account to get started.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-11/12 sm:w-4/5 mx-auto"
      >
        <InputField
          icon={<User className="w-5 h-5" />}
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleInputChange}
          error={errors.fullName}
        />
        <InputField
          icon={<Mail className="w-5 h-5" />}
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
        />
        <InputField
          icon={<Lock className="w-5 h-5" />}
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />
        <PasswordStrengthIndicator password={formData.password} />
        <InputField
          icon={<Lock className="w-5 h-5" />}
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-600 hover:text-gray-800"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            I agree to the{" "}
            <a href="#terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.terms && <p className="text-red-600 text-sm">{errors.terms}</p>}
        <Button
          type="submit"
          loading={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex justify-center items-center gap-2"
        >
          Sign Up
        </Button>
      </form>
      <div className="flex items-center my-4 text-gray-300 gap-2 w-11/12 sm:w-4/5 mx-auto">
        <hr className="flex-grow border-gray-300" />
        <span className="text-xs text-gray-400 text-center">Or Register with</span>
        <hr className="flex-grow border-gray-300" />
      </div>
      <div className="flex justify-center gap-4 w-full max-w-md mx-auto px-4">
        <motion.button
          onClick={handleGoogleSignup}
          whileHover={{ scale: 1.05 }}
          className="flex items-center justify-center w-20 h-10 bg-white border rounded-lg shadow hover:bg-gray-50"
        >
          <FcGoogle className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={handleAppleSignup}
          whileHover={{ scale: 1.05 }}
          className="flex items-center justify-center w-20 h-10 bg-white border rounded-lg shadow hover:bg-gray-50"
        >
          <FaApple className="w-6 h-6 text-black" />
        </motion.button>
      </div>
      <p className="mt-4 text-center text-gray-600 text-xs w-11/12 sm:w-4/5 mx-auto">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-blue-600 hover:underline font-semibold"
          type="button"
        >
          Log in here
        </button>
      </p>
    </motion.div>
  );
}
