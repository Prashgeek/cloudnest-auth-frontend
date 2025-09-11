import { motion } from "framer-motion";
import { 
  Shield, 
  Download, 
  Smartphone, 
  Users, 
  FileText, 
  Lock 
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure File Sharing",
      description: "Share files securely with anyone you choose, even if they don't have an account. Secure your links with passwords and custom permissions for full control.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Receive Files from Anyone",
      description: "Create secure upload links to receive files and send to partners or clients. They can securely upload files directly into your account without needing to sign up themselves.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Access from Anywhere",
      description: "Your files are automatically synced across all your devices: desktop, laptop, and mobile. Start a document on your computer and finish it on your phone.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaborate in Real-Time",
      description: "Work on shared documents and projects simultaneously with your team. See live changes, leave comments, and track revisions for seamless productivity.",
      color: "from-orange-500 to-yellow-500"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Simple & Elegant Design",
      description: "We designed Cloudnest to be simple and easy to use. The clean and intuitive interface lets you focus on your work, not on navigating complicated menus.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Top-Level Encryption",
      description: "Every file you upload is protected with top-level encryption. We ensure your data is secure both in transit and at rest, providing you with the highest level of privacy and security.",
      color: "from-red-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Our Powerful Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Cloudnest is built to provide a seamless and powerful experience for 
            individuals and teams. Here's a deeper look at what we offer.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 h-full">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}