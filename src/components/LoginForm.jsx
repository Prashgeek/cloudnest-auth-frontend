import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc"; // ✅ Google icon
import InputField from "./InputField";
import Button from "./Button";

function LoginForm({ onSwitch, onForgotPassword }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setLoginError("");

    try {
      // ✅ Simulated API login
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (
        formData.email === "test@example.com" &&
        formData.password === "123456"
      ) {
        localStorage.setItem("authToken", "sample_token");
        window.location.href = "/dashboard";
      } else {
        setLoginError("Invalid email or password");
      }
    } catch (err) {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fake Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setLoginError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // ✅ Pretend success
      localStorage.setItem("authToken", "google_sample_token");
      window.location.href = "/dashboard";
    } catch (err) {
      setLoginError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo at top */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-16 h-16 p-0 rounded-2xl shadow-lg object-contain"
          />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-brand to-purple-600 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          icon={<Mail className="w-5 h-5" />}
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          label="Email Address"
        />

        <InputField
          icon={<Lock className="w-5 h-5" />}
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          label="Password"
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />

        {loginError && (
          <p className="text-sm text-red-600 dark:text-red-400">{loginError}</p>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Remember me
            </span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-brand hover:text-purple-600 font-medium transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Sign In
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
              or
            </span>
          </div>
        </div>

        {/* Google Login Button */}
        <motion.button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </motion.button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="font-semibold text-brand hover:text-purple-600 transition-colors"
          >
            Create one now
          </button>
        </p>
      </form>
    </motion.div>
  );
}

export default LoginForm;
