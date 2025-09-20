import React from "react";
import { Facebook, Instagram, Twitter, LinkedIn, YouTube } from "@mui/icons-material";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1f2937] text-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-6 text-center text-sm space-y-4 px-4 sm:px-6 lg:px-8">
        {/* © text + links */}
        <div>
          <p className="mb-2">© 2025 Cloudnest. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <a href="/privacy" className="hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-gray-300">
              Terms of Services
            </a>
            <a href="/contact" className="hover:text-gray-300">
              Contact
            </a>
          </div>
        </div>
        {/* Social icons */}
        <div className="flex justify-center gap-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Facebook className="text-white hover:text-blue-600" fontSize="medium" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram className="text-white hover:text-pink-500" fontSize="medium" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter className="text-white hover:text-blue-400" fontSize="medium" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <LinkedIn className="text-white hover:text-blue-700" fontSize="medium" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <YouTube className="text-white hover:text-red-600" fontSize="medium" />
          </a>
        </div>
      </div>
    </footer>
  );
}
