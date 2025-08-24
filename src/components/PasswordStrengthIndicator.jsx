import { motion } from "framer-motion";

function PasswordStrengthIndicator({ password }) {
  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[@$!%*?&]/.test(password),
    ];
    
    strength = checks.filter(Boolean).length;
    
    const strengthConfig = {
      0: { label: "", color: "bg-gray-200 dark:bg-gray-700", textColor: "" },
      1: { label: "Very Weak", color: "bg-red-500", textColor: "text-red-500" },
      2: { label: "Weak", color: "bg-red-400", textColor: "text-red-400" },
      3: { label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-500" },
      4: { label: "Good", color: "bg-blue-500", textColor: "text-blue-500" },
      5: { label: "Strong", color: "bg-green-500", textColor: "text-green-500" },
    };
    
    return { strength, ...strengthConfig[strength] };
  };

  const { strength, label, color, textColor } = getPasswordStrength();
  
  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className="flex-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
          >
            <motion.div
              className={`h-full ${level <= strength ? color : "bg-transparent"}`}
              initial={{ width: 0 }}
              animate={{ width: level <= strength ? "100%" : "0%" }}
              transition={{ duration: 0.3, delay: level * 0.1 }}
            />
          </div>
        ))}
      </div>
      
      {label && (
        <p className={`text-xs font-medium ${textColor}`}>
          Password strength: {label}
        </p>
      )}
    </div>
  );
}

export default PasswordStrengthIndicator;