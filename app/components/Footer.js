"use client";
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { useMediaQuery } from "@mui/material";

export default function Footer() {
  const { darkMode } = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row", // Block on mobile, row on desktop
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        backgroundColor: darkMode ? "#0D1117" : "#f8f9fa",
        color: darkMode ? "#ffffff" : "#000000",
        boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.1)",
        position: "relative",
        bottom: 0,
        width: "100%",
        marginTop: "20px",
        textAlign: isMobile ? "center" : "left", // Center align for mobile
      }}
    >
      <Typography variant="body2" sx={{ marginBottom: isMobile ? "10px" : 0 }}>
        Copyright © Premium Shop 2025
      </Typography>
      <Button
        variant="text"
        color="primary"
        onClick={() => window.open("https://t.me/PBG_1BOT", "_blank")}
        sx={{
          textTransform: "none",
          fontWeight: "bold",
        }}
      >
        Contact Us on Telegram
      </Button>
    </Box>
  );
}
