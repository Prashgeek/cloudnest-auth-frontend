import React from "react";
import { Facebook, Instagram, Twitter, LinkedIn, YouTube } from "@mui/icons-material";

export default function Footer() {
  return (
    <footer className="bg-blue-950 border-t text-white">
      {/* Top section */}
      <div className="py-6 text-center text-sm">
        <p className="mb-2">© 2025 Cloudnest. All rights reserved.</p>
        <div className="flex justify-center gap-6">
          <a href="/privacy" className="hover:text-gray-300">Privacy Policy</a>
          <a href="/terms" className="hover:text-gray-300">Terms of Services</a>
          <a href="/contact" className="hover:text-gray-300">Contact</a>
        </div>
      </div>

      {/* Bottom section - social icons */}
      <div className="py-4 border-t flex justify-center gap-6">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <Facebook className="text-white hover:text-blue-600" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <Instagram className="text-white hover:text-pink-500" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <Twitter className="text-white hover:text-blue-400" />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <LinkedIn className="text-white hover:text-blue-700" />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
          <YouTube className="text-white hover:text-red-600" />
        </a>
      </div>
    </footer>
  );
}
