import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Shield } from "lucide-react";
import { useState } from "react";
import InputField from "./InputField";
import Button from "./Button";

function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setIsEmailSent(true);
  };

  if (isEmailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
            <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Check Your Email
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We've sent a password reset link to{" "}
          <span className="font-semibold text-brand">{email}</span>
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Didn't receive the email? Check your spam folder or try again in a few minutes.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => {
              setIsEmailSent(false);
              setEmail("");
            }}
            variant="outline"
            className="w-full"
          >
            Send Another Email
          </Button>
          
          <button
            onClick={onBack}
            className="w-full text-sm text-brand hover:text-purple-600 font-medium transition-colors"
          >
            Back to Sign In
          </button>
        </div>
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
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-brand to-purple-600 bg-clip-text text-transparent">
          Reset Password
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          icon={<Mail className="w-5 h-5" />}
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          error={error}
          label="Email Address"
        />

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Send Reset Link
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </button>
      </form>

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">
          Security Tips:
        </h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Reset links expire after 1 hour for security</li>
          <li>• Check your spam folder if you don't see the email</li>
          <li>• Contact support if you continue having issues</li>
        </ul>
      </div>
    </motion.div>
  );
}

export default ForgotPasswordForm;