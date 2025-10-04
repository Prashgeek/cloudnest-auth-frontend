import { Link } from "react-router-dom";

export default function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features", isRoute: false },
        { label: "Pricing", href: "#pricing", isRoute: false },
        { label: "Integrations", href: "#integrations", isRoute: false },
        { label: "Documentation", href: "#docs", isRoute: false }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#about", isRoute: false },
        { label: "Careers", href: "#careers", isRoute: false },
        { label: "Blog", href: "#blog", isRoute: false },
        { label: "Contact", href: "#contact", isRoute: false }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", to: "/privacy", isRoute: true },
        { label: "Terms of Service", to: "/terms", isRoute: true },
        { label: "Cookie Policy", href: "#cookies", isRoute: false },
        { label: "GDPR", href: "#gdpr", isRoute: false }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 py-16 md:py-20">
      <div className="max-w-full mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-base md:text-lg font-semibold text-white tracking-wider uppercase mb-6">
                {section.title}
              </h3>
              <ul className="space-y-3 md:space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.isRoute ? (
                      <Link
                        to={link.to}
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-base"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-base"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 md:mt-20 border-t border-gray-800 pt-10 md:pt-12 text-center">
          <p className="text-lg text-gray-400">
            &copy; {new Date().getFullYear()} CloudNest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}