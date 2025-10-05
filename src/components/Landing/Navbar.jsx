// src/components/Landing/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-50 shadow-sm"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src="/logo.png"
              alt="Cloudnest Logo"
              className="w-18 h-20 object-contain"
            />
            <span className="ml-2 text-xl font-bold text-gray-900">
              Cloudnest
            </span>
          </motion.div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { name: "About", to: "/#about" },
              { name: "Contact", to: "/contact" },
              { name: "Terms & Conditions", to: "/terms" },
            ].map((link) => (
              <motion.div
                key={link.name}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Link to={link.to}>{link.name}</Link>
              </motion.div>
            ))}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Log In
              </Link>
            </motion.div>
          </div>

          {/* Mobile Login */}
          <div className="md:hidden">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg"
              >
                Log In
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
