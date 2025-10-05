// src/pages/ContactUsContent.jsx
import React, { useState } from "react";

export default function ContactUsContent() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (formData.fullName && formData.email && formData.message) {
      console.log("Form submitted:", formData);
      alert("Thank you for your message! We will get back to you soon.");
      setFormData({ fullName: "", email: "", message: "" });
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Page content */}
      <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Have a question or need assistance? Fill out the form below, and we’ll get back to you as soon as possible.
            </p>
          </div>

          {/* Flex container with proper spacing */}
          <div className="flex flex-col lg:flex-row justify-center items-start gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md -mt-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Send us a Message
              </h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your message here..."
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none bg-white text-gray-900"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 shadow-sm"
                >
                  Submit
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md mt-6 lg:mt-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Our Information
              </h2>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Address</h3>
                <p className="text-gray-600 leading-relaxed">
                  Building No. 101, Block A,<br />
                  Nehru Place<br />
                  New Delhi, Delhi 110019
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">support@cloudnest.com</p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">+1(555)123-4567</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Find us on the Map</h3>
                <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.735934874738!2d77.2506!3d28.5489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3d8c7f0e5c5%3A0x8a4c4b3b3b3b3b3b!2sNehru%20Place%2C%20New%20Delhi%2C%20Delhi%20110019!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Map showing Nehru Place location"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
