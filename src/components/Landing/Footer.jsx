import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Security", href: "#security" },
        { label: "Pricing", href: "#pricing" },
        { label: "API", href: "#api" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Blog", href: "#blog" },
        { label: "Careers", href: "#careers" },
        { label: "Press", href: "#press" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#help" },
        { label: "Contact", href: "#contact" },
        { label: "Status", href: "#status" },
        { label: "Community", href: "#community" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#privacy" },
        { label: "Terms of Service", href: "#terms" },
        { label: "Cookie Policy", href: "#cookies" },
        { label: "GDPR", href: "#gdpr" }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#facebook", label: "Facebook" },
    { icon: <Twitter className="w-5 h-5" />, href: "#twitter", label: "Twitter" },
    { icon: <Instagram className="w-5 h-5" />, href: "#instagram", label: "Instagram" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#linkedin", label: "LinkedIn" },
    { icon: <Github className="w-5 h-5" />, href: "#github", label: "GitHub" }
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-white">Cloudnest</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Secure cloud storage for everyone. Store, manage, and collaborate on your 
              documents securely in the cloud.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Cloudnest. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link
              to="/contact"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}