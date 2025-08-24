import { motion } from "framer-motion";
import { CheckCircle2, Cloud, Shield, Users, Zap } from "lucide-react";

function MarketingSection() {
  const features = [
    {
      icon: <Cloud className="w-5 h-5" />,
      title: "15GB Free Cloud Storage",
      description: "Store your files securely in the cloud with generous free storage",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time collaboration tools",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Advanced Security",
      description: "Enterprise-grade security with end-to-end encryption",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Real-time Sync",
      description: "Access your files instantly across all your devices",
      color: "from-orange-500 to-yellow-500"
    }
  ];

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full lg:w-[45%] p-8 lg:p-10"
    >
      <div className="space-y-8">
        {/* Brand Section */}
        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-brand to-purple-600 bg-clip-text text-transparent mb-4">
            Cloudnest
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            Your next-generation platform for{" "}
            <span className="font-semibold text-brand">secure file storage</span>,{" "}
            <span className="font-semibold text-purple-600">team collaboration</span>, and{" "}
            <span className="font-semibold text-indigo-600">real-time communication</span>.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="group p-4 rounded-2xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl bg-gradient-to-r ${feature.color} text-white`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          
          
        </div>
      </div>
    </motion.div>
  );
}

export default MarketingSection;