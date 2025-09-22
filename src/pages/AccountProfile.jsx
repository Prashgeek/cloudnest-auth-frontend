// Add these new imports at the top
import React, { useEffect, useRef, useState } from "react";

export default function AccountProfile() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const avatarInputRef = useRef(null);
  const avatarCircleRef = useRef(null);
  const avatarIconRef = useRef(null);

  const [avatarDataUrl, setAvatarDataUrl] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const LOCAL_KEY = "profileData_v1";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.fullName && nameRef.current) nameRef.current.textContent = parsed.fullName;
        if (parsed.email && emailRef.current) emailRef.current.textContent = parsed.email;
        if (parsed.phone && phoneRef.current) phoneRef.current.textContent = parsed.phone;
        if (parsed.avatar) setAvatarDataUrl(parsed.avatar);
        return;
      }
    } catch {}

    try {
      const n = localStorage.getItem("userName");
      const e = localStorage.getItem("userEmail");
      const p = localStorage.getItem("userPhone");
      const a = localStorage.getItem("userAvatar");
      if (n && nameRef.current) nameRef.current.textContent = n;
      if (e && emailRef.current) emailRef.current.textContent = e;
      if (p && phoneRef.current) phoneRef.current.textContent = p;
      if (a) setAvatarDataUrl(a);
    } catch {}
  }, []);

  useEffect(() => {
    if (!avatarCircleRef.current) return;
    if (avatarDataUrl) {
      avatarCircleRef.current.style.backgroundImage = `url('${avatarDataUrl}')`;
      if (avatarIconRef.current) avatarIconRef.current.style.display = "none";
    } else {
      avatarCircleRef.current.style.backgroundImage = "";
      if (avatarIconRef.current) avatarIconRef.current.style.display = "";
    }
  }, [avatarDataUrl]);

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarDataUrl(ev.target.result);
      try {
        e.target.value = "";
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const name = nameRef.current?.textContent?.trim() ?? "";
    const email = emailRef.current?.textContent?.trim() ?? "";
    const phone = phoneRef.current?.textContent?.trim() ?? "";

    // Validation
    if (!name) {
      alert("Please enter your name.");
      nameRef.current.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      emailRef.current.focus();
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phone && phoneDigits.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      phoneRef.current.focus();
      return;
    }

    const payload = {
      fullName: name,
      email: email,
      phone: phone,
      avatar: avatarDataUrl || "",
    };

    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(payload));
      localStorage.setItem("userName", payload.fullName);
      localStorage.setItem("userEmail", payload.email);
      localStorage.setItem("userPhone", payload.phone);
      localStorage.setItem("userAvatar", payload.avatar);
    } catch {}

    window.dispatchEvent(new Event("profileUpdated"));

    // Show the animated notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2500); // auto hide after 2.5s
  };

  return (
    <div>
      <style>{`
        * { box-sizing: border-box; }

        .ap-body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #fff;
          color: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          position: relative;
        }

        .profile-container {
          max-width: 800px;
          width: 100%;
        }

        .ap-title {
          text-align: center;
          font-weight: bold;
          margin-bottom: 50px;
          font-size: 55px;
        }

        .profile-content {
          display: flex;
          gap: 32px;
          align-items: flex-start;
          margin-bottom: 60px;
        }

        .avatar-section {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          min-width: 130px;
          cursor: pointer;
        }

        .avatar-circle {
          width: 150px;
          height: 150px;
          background-color: #3b6d8a;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-size: cover;
          background-position: center;
          overflow: hidden;
          margin: 75px 10px 0px 0px;
        }

        .avatar-circle svg {
          fill: #dbe9f1;
          width: 110px;
          height: 110px;
        }

        .change-text {
          font-weight: bold;
          font-size: 18px;
          cursor: pointer;
          color: #000;
          margin: 20px 4px 0px 0px;
        }

        .form-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          background-color: #fff;
          border-radius: 14px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.07);
          display: flex;
          align-items: center;
          padding: 0 28px;
          gap: 25px;
          height: 96px;
        }

        .input-group label {
          font-weight: bold;
          min-width: 120px;
          font-size: 18px;
          color: #000;
        }

        .input-group .input-value {
          font-size: 18px;
          color: #000;
          flex-grow: 1;
          outline: none;
          display: flex;
          align-items: center;
          padding: 10px 0;
        }

        .input-group .input-value[contenteditable="true"]:focus {
          outline: 2.5px solid #007bff;
          border-radius: 5px;
          padding-left: 6px;
          padding-right: 6px;
          margin: 0;
        }

        .save-button {
          width: 167px;
          padding: 14px 16px;
          font-size: 18px;
          color: #007bff;
          background-color: transparent;
          border: 2px solid #007bff;
          border-radius: 10px;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease;
          display: block;
          margin: 0 auto;
        }

        .save-button:hover {
          background-color: #007bff;
          color: #fff;
        }

        /* Notification popup */
        .notification-popup {
          position: absolute;
          top: 30px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #007bff;
          color: #fff;
          padding: 14px 30px;
          border-radius: 10px;
          font-size: 18px;
          font-weight: bold;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          opacity: 0;
          animation: fadeInOut 2.5s forwards;
          z-index: 100;
        }

        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          10% { opacity: 1; transform: translateX(-50%) translateY(0); }
          90% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        }
      `}</style>

      <div className="ap-body">
        <div className="profile-container" role="region" aria-label="User profile editor">
          {showNotification && <div className="notification-popup">Profile Updated!</div>}

          <h1 className="ap-title">Your profile</h1>

          <div className="profile-content">
            <div
              className="avatar-section"
              onClick={handleAvatarClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleAvatarClick();
              }}
              role="button"
              tabIndex={0}
            >
              <input
                ref={avatarInputRef}
                id="avatarInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
              <div
                className="avatar-circle"
                aria-label="User Avatar"
                role="img"
                ref={avatarCircleRef}
              >
                <svg
                  id="avatarIcon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-hidden="true"
                  focusable="false"
                  ref={avatarIconRef}
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 8-4 8-4s8 0 8 4v1H4v-1z" />
                </svg>
              </div>
              <div className="change-text">Change</div>
            </div>

            <div className="form-section">
              <div className="input-group">
                <label htmlFor="name">Name</label>
                <div
                  id="name"
                  className="input-value"
                  contentEditable="true"
                  role="textbox"
                  aria-label="Full name"
                  ref={nameRef}
                >
                  User
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <div
                  id="email"
                  className="input-value"
                  contentEditable="true"
                  role="textbox"
                  aria-label="Email"
                  ref={emailRef}
                >
                  Saniya@gmail.com
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone No.</label>
                <div
                  id="phone"
                  className="input-value"
                  contentEditable="true"
                  role="textbox"
                  aria-label="Phone number"
                  ref={phoneRef}
                >
                  +91 xxxxxxxxxx
                </div>
              </div>
            </div>
          </div>

          <button className="save-button" type="button" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
