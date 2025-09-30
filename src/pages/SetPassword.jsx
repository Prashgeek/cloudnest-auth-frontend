import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // removed Lock
import { PasswordIcon } from "../components/CustomIcons"; // ✅ import your PasswordIcon

const styles = `
  .password-input {
    width: 100%;
    min-width: 600px;
    height: 60px;
    padding: 18px 48px 18px 18px;
    border: 1px solid #E5E5E7;
    border-radius: 15px;
    font-size: 18px;
    color: #000;
    background-color: #fff;
    transition: border-color 0.3s ease;
  }
  .password-input:focus {
    outline: none;
    border-color: #007AFF;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.25);
  }
  .toggle-visibility-btn {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #8E8E93;
    transition: color 0.2s ease;
    background: transparent;
    border: none;
  }
  .toggle-visibility-btn:hover {
    color: #007AFF;
  }
  .tips-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0 2rem 5px;
    max-width: 600px;
    text-align: left;
  }
  .tips-list li {
    font-size: 15px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    color: #666;
  }
  .tips-list li.passed {
    color: #34C759;
  }
  .tips-list li span {
    margin-left: 10px;
  }
  .set-password-btn {
    width: 220px;
    height: 48px;
    background-color: #007AFF;
    color: white;
    font-weight: 600;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .set-password-btn:hover:not(:disabled) {
    background-color: #0056cc;
  }
  .set-password-btn:disabled {
    background-color: #A0A0A0;
    cursor: not-allowed;
  }
  .error-message {
    color: #ff3b30;
    font-size: 14px;
    margin-top: 8px;
    text-align: center;
    animation: fadeIn 0.3s ease-in;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2.5rem;
    gap: 12px;
  }
  .header h1 {
    font-size: 32px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #000;
  }
  .header p {
    font-size: 18px;
    color: #333;
    max-width: 400px;
    text-align: center;
    font-weight: 400;
  }
  .input-wrapper {
    position: relative;
    min-width: 400px;
    margin: 0 auto 20px;
  }
  .container {
    min-width: 1200px;
    min-height: 800px;
    padding: 40px 32px;
    width: 100%;
    box-sizing: border-box;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 0.5rem;
  }
`;

export default function SetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const outletContext = useOutletContext?.() || {};
  const uploadedFilesFromNav = Array.isArray(location.state?.uploadedFiles)
    ? location.state.uploadedFiles
    : [];
  const contextFiles = Array.isArray(outletContext.recentFiles) ? outletContext.recentFiles : [];
  const uploadedFiles = uploadedFilesFromNav.length ? uploadedFilesFromNav : contextFiles;
  const fileName =
    location.state?.fileName ||
    (uploadedFiles && uploadedFiles.length > 0 ? uploadedFiles[0].name : "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const returnTo = location.state?.returnTo || "/dashboard/share-file";

  const checkPasswordStrength = useCallback((pwd) => ({
    minLength: pwd.length >= 6,
    hasNumber: /\d/.test(pwd),
    hasSymbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
    hasLowerAndUpper: /[a-z]/.test(pwd) && /[A-Z]/.test(pwd),
  }), []);

  const strength = checkPasswordStrength(newPassword);

  const isValid = newPassword.length > 0 &&
    newPassword === confirmPassword &&
    Object.values(strength).every(Boolean);

  useEffect(() => {
    setError("");
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError("");
    if (!isValid) {
      setError("Passwords must match and meet all requirements.");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 700));
      try {
        const existing = JSON.parse(localStorage.getItem("recentFiles") || "[]");
        const namesToMark = new Set(
          (uploadedFiles || []).map((f) => (typeof f === "string" ? f : f.name))
        );
        if (fileName) namesToMark.add(fileName);
        const updated = existing.map((f) =>
          namesToMark.has(f.name) ? { ...f, hasPassword: true } : f
        );
        localStorage.setItem("recentFiles", JSON.stringify(updated));
      } catch (err) {
        console.warn("Could not update recentFiles in localStorage:", err);
      }
      try {
        const prev = JSON.parse(localStorage.getItem("filePasswordMap") || "{}");
        (uploadedFiles || []).forEach((f) => {
          const key = `${f.name}-${f.size || 0}`;
          prev[key] = { passwordSet: true, ts: Date.now() };
        });
        localStorage.setItem("filePasswordMap", JSON.stringify(prev));
        try { localStorage.setItem("pendingSharePassword", newPassword); } catch(e) { console.warn("could not store pendingSharePassword", e); }
      } catch {}
      navigate(returnTo, {
        replace: true,
        state: { passwordSet: true, uploadedFiles },
      });
    } catch (err) {
      console.error(err);
      setError("Failed to set password. Please try again.");
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === "NumpadEnter") && isValid && !isLoading) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const tips = [
    { text: "At least 6 characters", passed: strength.minLength },
    { text: "Contains a number", passed: strength.hasNumber },
    { text: "Contains a symbol", passed: strength.hasSymbol },
    { text: "Lower & upper case", passed: strength.hasLowerAndUpper },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <style>{styles}</style>
      <div className="container">
        <header className="header" tabIndex={-1}>
          <h1>
            <PasswordIcon className="w-11 h-11 text-[#007AFF]" /> {/* ✅ replaced Lock */}
            Set Password
          </h1>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{
            minWidth: "600px",
            marginBottom: "6px",
            fontSize: "16px",
            fontWeight: "500",
            color: "#333",
            marginLeft: "4px",
            marginRight: "auto",
            maxWidth: "600px",
            textAlign: "left"
          }}>
            Create a new Password to secure your file
          </div>

          <div className="input-wrapper">
            <input
              type={showNewPassword ? "text" : "password"}
              className="password-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="New Password"
              disabled={isLoading}
              aria-invalid={!!error}
              aria-describedby="error-message"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((s) => !s)}
              className="toggle-visibility-btn"
              tabIndex={-1}
              aria-label={showNewPassword ? "Hide new password" : "Show new password"}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="password-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Confirm Password"
              disabled={isLoading}
              aria-invalid={!!error}
              aria-describedby="error-message"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="toggle-visibility-btn"
              tabIndex={-1}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div id="error-message" className="error-message" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <ul className="tips-list" aria-live="polite" aria-relevant="additions">
            {tips.map(({ text, passed }, i) => (
              <li key={i} className={passed ? "passed" : ""}>
                {passed ? "✓" : "•"} <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-center">
            <button
              type="submit"
              className="set-password-btn"
              disabled={!isValid || isLoading}
              aria-disabled={!isValid || isLoading}
            >
              {isLoading ? "Saving…" : "Set Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}