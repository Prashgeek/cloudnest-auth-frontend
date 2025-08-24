import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { Stars } from "@react-three/drei";
import { Moon, Sun } from "lucide-react";

// Import our new components
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import ResetPasswordForm from "../components/ResetPasswordForm";
import MarketingSection from "../components/MarketingSection";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login", "signup", "forgot", "reset"
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const renderAuthForm = () => {
    const formProps = {
      onSwitch: () => setMode(mode === "login" ? "signup" : "login"),
      onForgotPassword: () => setMode("forgot"),
      onBack: () => setMode("login"),
      onSuccess: () => setMode("login"),
    };

    switch (mode) {
      case "signup":
        return <SignupForm {...formProps} />;
      case "forgot":
        return <ForgotPasswordForm {...formProps} />;
      case "reset":
        return <ResetPasswordForm token="sample-token" {...formProps} />;
      default:
        return <LoginForm {...formProps} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-50">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-brand/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-600/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Ccircle cx='5' cy='5' r='1'/%3E%3Ccircle cx='15' cy='15' r='1'/%3E%3Ccircle cx='25' cy='25' r='1'/%3E%3Ccircle cx='35' cy='35' r='1'/%3E%3Ccircle cx='45' cy='45' r='1'/%3E%3Ccircle cx='55' cy='55' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* 3D Stars Background */}
      <div className="absolute inset-0 -z-40 opacity-60">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <Stars radius={120} depth={60} count={3000} factor={3} saturation={0.2} fade speed={0.5} />
        </Canvas>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Your custom logo */}
          <img src="/logo.png" alt="Cloudnest Logo" className="w-16 h-16 rounded-xl shadow-lg object-contain" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand to-purple-600 bg-clip-text text-transparent">
              Cloudnest
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400"></p>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <motion.button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </motion.button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 px-6 py-8 lg:py-12 min-h-[calc(100vh-100px)]">
        {/* Marketing Section */}
        <MarketingSection />

        {/* Auth Form Section */}
        <motion.div layout className="w-full max-w-md lg:max-w-lg">
          <motion.div
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 lg:p-10"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderAuthForm()}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Additional Options */}
                  </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 px-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 Cloudnest. Secure cloud storage for everyone.</p>
        <div className="flex justify-center gap-6 mt-2">
          <a href="#" className="text-xs text-gray-400 hover:text-brand transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-xs text-gray-400 hover:text-brand transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-xs text-gray-400 hover:text-brand transition-colors">
            Support
          </a>
        </div>
      </footer>
    </div>
  );
}
