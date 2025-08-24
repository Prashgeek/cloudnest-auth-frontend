import { motion } from "framer-motion";
import { Lock, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useState } from "react";
import InputField from "./InputField";
import Button from "./Button";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

function ResetPasswordForm({ token, onSuccess }) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, number and special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Password Reset Successfully
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Your password has been updated successfully. You can now sign in with your new password.
        </p>

        <Button
          onClick={onSuccess}
          className="w-full"
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Continue to Sign In
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-brand to-purple-600 p-3 rounded-2xl">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-brand to-purple-600 bg-clip-text text-transparent">
          Set New Password
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create a strong password to secure your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <InputField
            icon={<Lock className="w-5 h-5" />}
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter new password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            label="New Password"
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
          <PasswordStrengthIndicator password={formData.password} />
        </div>

        <InputField
          icon={<Lock className="w-5 h-5" />}
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          label="Confirm New Password"
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">
            Password Requirements:
          </h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li className={formData.password.length >= 8 ? "text-green-600 dark:text-green-400" : ""}>
              • At least 8 characters long
            </li>
            <li className={/[A-Z]/.test(formData.password) ? "text-green-600 dark:text-green-400" : ""}>
              • One uppercase letter
            </li>
            <li className={/[a-z]/.test(formData.password) ? "text-green-600 dark:text-green-400" : ""}>
              • One lowercase letter
            </li>
            <li className={/\d/.test(formData.password) ? "text-green-600 dark:text-green-400" : ""}>
              • One number
            </li>
            <li className={/[@$!%*?&]/.test(formData.password) ? "text-green-600 dark:text-green-400" : ""}>
              • One special character (@$!%*?&)
            </li>
          </ul>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Reset Password
        </Button>
      </form>
    </motion.div>
  );
}

export default ResetPasswordForm;