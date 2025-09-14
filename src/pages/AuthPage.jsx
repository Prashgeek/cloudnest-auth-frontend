import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import ResetPasswordForm from "../components/ResetPasswordForm";
import Toast from "../components/Toast";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 4000);
  };

  const formProps = {
    onSwitch: () => setMode(mode === "login" ? "signup" : "login"),
    onForgotPassword: () => setMode("forgot"),
    onBack: () => setMode("login"),
    onSuccess: () => setMode("login"),
    showToast: showToast,
  };

  let FormComponent;
  if (mode === "signup") {
    FormComponent = <SignupForm {...formProps} />;
  } else if (mode === "forgot") {
    FormComponent = <ForgotPasswordForm {...formProps} />;
  } else if (mode === "reset") {
    const token = new URLSearchParams(window.location.search).get("token");
    FormComponent = <ResetPasswordForm token={token} {...formProps} />;
  } else {
    FormComponent = <LoginForm {...formProps} />;
  }

  return (
    <>
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
     <div className="min-h-screen bg-[#EAF7FC] flex items-center justify-center px-4">
  <AnimatePresence mode="wait" initial={false}>
    <motion.div
      key={mode}
      className="bg-[#EAF7FC] rounded-2xl shadow-lg w-full max-w-lg p-8 min-h-[650px] flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {FormComponent}
    </motion.div>
  </AnimatePresence>
</div>
    </>
  );
}
