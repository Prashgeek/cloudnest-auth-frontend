import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function AccountInfo() {
    const [userName, setUserName] = useState("Test User");
    const [userEmail, setUserEmail] = useState("test@example.com");
    const [userPhone, setUserPhone] = useState("1234567890");

    useEffect(() => {
        const storedUserName = localStorage.getItem("userName");
        const storedUserEmail = localStorage.getItem("userEmail");
        const storedUserPhone = localStorage.getItem("userPhone");
        const authToken = localStorage.getItem("authToken");

        if (storedUserName) setUserName(storedUserName);
        if (storedUserEmail) setUserEmail(storedUserEmail);
        if (storedUserPhone) setUserPhone(storedUserPhone);

        if (authToken) {
            if (authToken.includes("google")) {
                setUserName("Google User");
            } else if (authToken.includes("apple")) {
                setUserName("Apple User");
            }
        }
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-start",
                m: 3, // more breathing room
            }}
        >
            <Card
                variant="outlined"
                sx={{
                    maxWidth: 500, // bigger card
                    width: "100%",
                    borderRadius: 3,
                    p: 2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
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
                        <Typography
                            variant="h6"
                            sx={{ color: "text.primary", fontWeight: 600 }}
                        >
                            Account Info
                        </Typography>
                        <Button
                            variant="text"
                            size="small"
                            sx={{ textTransform: "none", fontWeight: 500 }}
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
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 600,
                                        color: "text.secondary",
                                        minWidth: "200px" // ✅ fixed width column for labels
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
        </Box >
    );
}

export default AccountInfo;
