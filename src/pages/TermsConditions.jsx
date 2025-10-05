// src/pages/TermsConditions.jsx
import React from "react";
import Navbar from "../components/Landing/Navbar.jsx";
import Footer from "../components/Landing/Footer.jsx";

export default function TermsConditions() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Page content */}
      <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8">
        {/* Header stays centered */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-gray-500 text-lg">Last updated: August 20, 2025</p>
        </div>

        {/* Sections full width */}
        <div className="space-y-10 w-full">
          <section className="px-4 lg:px-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using the Cloudnest service ("Service"), you agree to be
              bound by these Terms and Conditions ("Terms"). If you disagree with any part
              of the terms, then you may not access the Service.
            </p>
          </section>

          <section className="px-4 lg:px-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Your Account</h2>
            <p className="text-gray-700 leading-relaxed">
              When you create an account with us, you must provide accurate and complete
              information. You are responsible for safeguarding the password that you use
              to access the Service and for any activities or actions under your password.
            </p>
          </section>

          <section className="px-4 lg:px-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Content and Conduct</h2>
            <p className="text-gray-700 leading-relaxed">
              You are solely responsible for all files, data, and information that you
              upload, store, or share on the Service ("Content"). You agree not to upload
              any content that is illegal, harmful, threatening, or infringing upon any
              third party's rights.
            </p>
          </section>

          <section className="px-4 lg:px-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The Service and its original content, features, and functionality are and
              will remain the exclusive property of Cloudnest and its licensors.
            </p>
          </section>

          <section className="px-4 lg:px-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice
              or liability, for any reason whatsoever, including without limitation if you
              breach the Terms.
            </p>
          </section>

          <section className="px-4 lg:px-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              Cloudnest and its affiliates won't be liable for indirect, incidental,
              consequential or punitive damages, including loss of profits, data or goodwill.
            </p>
          </section>

          <section className="px-4 lg:px-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of India.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
