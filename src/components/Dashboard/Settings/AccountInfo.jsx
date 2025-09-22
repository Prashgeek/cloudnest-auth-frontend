// src/components/Dashboard/Settings/AccountInfo.jsx
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

/**
 * AccountInfo
 * - Reads profile info from localStorage key "profileData_v1" (preferred)
 * - Falls back to older keys: userName, userEmail, userPhone
 * - Edit button navigates to /dashboard/settings/account
 * - Keeps visual layout and MUI usage consistent with your app
 */

const LOCAL_PROFILE_KEY = "profileData_v1";

function AccountInfo() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Test User");
  const [userEmail, setUserEmail] = useState("test@example.com");
  const [userPhone, setUserPhone] = useState("1234567890");

  useEffect(() => {
    // 1) Prefer the consolidated profile object saved by AccountProfile
    try {
      const rawProfile = localStorage.getItem(LOCAL_PROFILE_KEY);
      if (rawProfile) {
        const parsed = JSON.parse(rawProfile);
        if (parsed.fullName) setUserName(parsed.fullName);
        if (parsed.email) setUserEmail(parsed.email);
        if (parsed.phone) setUserPhone(parsed.phone);
        return; // we've populated from the canonical source; stop here
      }
    } catch (err) {
      // ignore parse errors and fall back to legacy keys
      // eslint-disable-next-line no-console
      console.warn("AccountInfo: failed reading profileData_v1", err);
    }

    // 2) Fallback: older individual keys that your app previously stored
    try {
      const storedUserName = localStorage.getItem("userName");
      const storedUserEmail = localStorage.getItem("userEmail");
      const storedUserPhone = localStorage.getItem("userPhone");
      if (storedUserName) setUserName(storedUserName);
      if (storedUserEmail) setUserEmail(storedUserEmail);
      if (storedUserPhone) setUserPhone(storedUserPhone);
    } catch (err) {
      // ignore storage errors
      // eslint-disable-next-line no-console
      console.warn("AccountInfo: failed reading legacy profile keys", err);
    }

    // 3) If there's an auth token hint (google/apple) adjust display name only
    try {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        if (authToken.includes("google")) {
          setUserName("Google User");
        } else if (authToken.includes("apple")) {
          setUserName("Apple User");
        }
      }
    } catch (err) {
      // ignore
    }
  }, []); // run once on mount

  const handleEdit = () => {
    // navigate to the account editor — this route should be registered as:
    // /dashboard/settings/account
    navigate("/dashboard/settings/account");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        m: 3, // breathing room
      }}
    >
      <Card
        variant="outlined"
        sx={{
          maxWidth: 500,
          width: "100%",
          borderRadius: 3,
          p: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
        aria-label="Account information"
      >
        <CardContent>
          {/* Header row with title + edit */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 5,
            }}
          >
            <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 600 }}>
              Account Info
            </Typography>

            {/* Edit button — navigates to profile editor */}
            <Button
              onClick={handleEdit}
              variant="text"
              size="small"
              sx={{ textTransform: "none", fontWeight: 500 }}
              aria-label="Edit account information"
            >
              Edit
            </Button>
          </Box>

          {/* Info fields */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { label: "Full Name", value: userName },
              { label: "Email", value: userEmail },
              { label: "Phone", value: userPhone },
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                role="group"
                aria-label={`${item.label} row`}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    minWidth: "200px", // fixed width column for labels
                  }}
                >
                  {item.label}
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AccountInfo;
