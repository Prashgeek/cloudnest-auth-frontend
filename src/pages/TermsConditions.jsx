import React from 'react'
import Navbar from '../components/Landing/Navbar'
import Footer from '../components/Dashboard/Footer'

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-10 mb-10">
      <Navbar/>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-gray-500 text-lg">
            Last updated: August 20, 2025
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using the Cloudnest service ("Service"), you agree to be bounded by these Terms and Conditions ("Terms"). If you disagree with any part of the terms, then you may not access the Service.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Your Account
            </h2>
            <p className="text-gray-700 leading-relaxed">
              When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Content and Conduct
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You are solely responsible for all files, data, and information that you upload, store, or share on the Service ("Content"). You agree not to upload any content that is illegal, harmful, threatening, or infringing upon any third party's rights.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The Service and its original content, features, and functionality are and will remain the exclusive property of Cloudnest and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Cloudnest.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Termination
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If no event shall Cloudnest, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
      </div>
      <Footer/>
    </div>
  )
}