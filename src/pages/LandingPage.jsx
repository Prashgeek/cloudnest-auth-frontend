// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <motion.nav
        className="bg-white border-b border-gray-200"
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
            {/* Links */}
            <div className="hidden md:flex items-center space-x-8">
              <motion.a
                href="#about"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                About
              </motion.a>
              <motion.a
                href="#contact"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                Contact
              </motion.a>
              <motion.a
                href="#terms"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                Terms & Conditions
              </motion.a>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/auth"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Log In
                </Link>
              </motion.div>
            </div>
            {/* Mobile login */}
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

      {/* Hero */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1
                className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Secure Cloud for<br />Everyone.
              </motion.h1>
              <motion.p
                className="text-lg text-gray-600 mb-8 max-w-lg"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Store, manage, and collaborate on your documents securely in the
                cloud. Access your files anytime, from any device.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(37,99,235,0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/auth"
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium block shadow-lg text-center"
                  >
                    Get Started Free
                  </Link>
                </motion.div>
                <motion.button
                  className="bg-white text-gray-700 px-8 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Logo Card - Lighter Blue */}
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div
                className="rounded-3xl p-8 shadow-lg max-w-md w-full"
                style={{ backgroundColor: "#EAF7FC" }}
                whileHover={{ y: -10, boxShadow: "0 25px 50px rgba(0,0,0,0.1)" }}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  hover: { duration: 0.3 },
                }}
              >
                <div className="text-center">
                  <motion.div
                    className="flex justify-center mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src="/logo.png"
                      alt="Cloudnest Logo"
                      className="w-44 h-44 object-contain"
                    />
                  </motion.div>
                  <motion.h2
                    className="text-2xl font-bold text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

     {/* Features Section - Smaller Width Cards & Bigger Icons */}
<section
  className="py-20 px-4 sm:px-8 lg:px-16"
  style={{ backgroundColor: "#EAF7FC" }}
>
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Discover Our Powerful Features
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Cloudnest is built to provide a seamless and powerful experience
        for individuals and teams. Here's a deeper look at what we offer.
      </p>
    </div>

    {/* Grid: 2 Columns */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[
        {
          title: "Secure File Sharing",
          desc: "Share files securely with anyone you choose, even if they don't have an account. Secure your links with passwords and custom permissions for full control.",
          icon: (
            <svg
              className="w-13 h-13 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          ),
        },
        {
          title: "Receive Files from Anyone",
          desc: "Create secure upload links to receive files and send to partners or clients. They can securely upload files directly into your account without needing to sign up themselves.",
          icon: (
            <svg
              className="w-13 h-13 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
          ),
        },
        {
          title: "Access from Anywhere",
          desc: "Your files are automatically synced across all your devices: desktop, laptop, and mobile. Start a document on your computer and finish it on your phone.",
          icon: (
            <svg
              className="w-13 h-13 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          ),
        },
        {
          title: "Collaborate in Real-Time",
          desc: "Work on shared documents and projects simultaneously with your team. See live changes, leave comments, and track revisions for seamless productivity.",
          icon: (
            <svg
              className="w-13 h-13 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          ),
        },
        {
          title: "Simple & Elegant Design",
          desc: "We designed Cloudnest to be simple and easy to use. The clean and intuitive interface lets you focus on your work, not on navigating complicated menus.",
          icon: (
            <svg
              className="w-13 h-13 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
        },
        {
          title: "Top-Level Encryption",
          desc: "Every file you upload is protected with top-level encryption. We ensure your data is secure both in transit and at rest, providing you with the highest level of privacy and security.",
          icon: (
            <svg
              className="w-13 h-13 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          ),
        },
      ].map((feature, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 flex flex-row items-center gap-6 h-full max-w-md mx-auto"
        >
          {/* Icon on left, bigger */}
          <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 bg-transparent rounded-full">
            {feature.icon}
          </div>
          {/* Content */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Testimonials Section with new background */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div
              className="rounded-2xl p-8 shadow-sm border border-gray-200"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                "Cloudnest has transformed how my team works. It's incredibly
                easy to use and provides peace of mind knowing our data is
                secure."
              </p>
              <div className="text-center">
                <div className="font-semibold text-gray-900">- Sarah J.</div>
                <div className="text-sm text-gray-500">Marketing Director</div>
              </div>
            </div>
            <div
              className="rounded-2xl p-8 shadow-sm border border-gray-200"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                "I've used many cloud services, but none are as fast or
                intuitive as Cloudnest. The collaboration features are a
                game-changer."
              </p>
              <div className="text-center">
                <div className="font-semibold text-gray-900">- Alex R.</div>
                <div className="text-sm text-gray-500">Product Manager</div>
              </div>
            </div>
            <div
              className="rounded-2xl p-8 shadow-sm border border-gray-200"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                "As a student I'm constantly working on group projects.
                Cloudnest makes it simple to share and edit documents with
                classmates in real-time."
              </p>
              <div className="text-center">
                <div className="font-semibold text-gray-900">- Maya S.</div>
                <div className="text-sm text-gray-500">Graduate Student</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses and individuals who trust Cloudnest.
          </p>
          <Link
            to="/auth"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-gray-400">© 2025 Cloudnest. All rights reserved.</p>
          </div>
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#privacy" className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </a>
            <a href="#terms" className="text-gray-400 hover:text-white text-sm">
              Terms of Services
            </a>
            <a href="#contact" className="text-gray-400 hover:text-white text-sm">
              Contact
            </a>
          </div>
         {/* Social Media Icons - Updated to match your screenshot */}
          <div className="flex justify-center space-x-4">
            {/* Facebook */}
            <a href="#facebook" className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

           {/* Instagram */}
<a
  href="#instagram"
  className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700 transition-colors"
>
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-.88a1.13 1.13 0 1 1-2.25 0 1.13 1.13 0 0 1 2.25 0Z"/>
  </svg>
</a>

            {/* Twitter/X */}
            <a href="#twitter" className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="#linkedin" className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a href="#youtube" className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}