import { useState } from "react";
import FileUpload from "../components/FileUpload";
import useTheme from "../hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const { darkMode, toggleDarkMode } = useTheme();

  const handleUpload = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDelete = (fileName) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/auth";
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 flex flex-col">
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
      <div className="absolute inset-0 -z-40 opacity-50">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <Stars radius={120} depth={60} count={3000} factor={3} fade speed={0.5} />
        </Canvas>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-6 py-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Cloudnest Logo"
            className="w-14 h-14 rounded-xl shadow-lg object-contain"
          />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand to-purple-600 bg-clip-text text-transparent">
              Cloudnest Drive
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Secure cloud storage for everyone
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </motion.button>

          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand to-purple-600 text-white shadow-lg transition"
          >
            Logout
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-6">
        {/* Upload Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6"
        >
          <FileUpload onUpload={handleUpload} />
        </motion.div>

        {/* File List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Uploaded Files</h2>
          {files.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No files uploaded yet.</p>
          ) : (
            <ul className="space-y-3">
              {files.map((file, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-md border border-white/20 dark:border-gray-700/40"
                >
                  <span className="font-medium">{file.name}</span>
                  <div className="flex space-x-3">
                    <a
                      href={URL.createObjectURL(file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-sm rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow hover:opacity-90 transition"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(file.name)}
                      className="px-3 py-1 text-sm rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white shadow hover:opacity-90 transition"
                    >
                      Delete
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 px-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2025 Cloudnest. Secure cloud storage for everyone.
        </p>
      </footer>
    </div>
  );
}
