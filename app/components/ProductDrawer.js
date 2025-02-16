"use client";
import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  CircularProgress,
  useMediaQuery
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { CheckCircle, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext"; // ✅ Import Theme Context
import toast, { Toaster } from "react-hot-toast";

export default function ProductDrawer({ open, productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const { darkMode } = useTheme(); // ✅ Use Theme Context
  const isMobile = useMediaQuery("(max-width: 600px)"); // ✅ Detects mobile screens

  useEffect(() => {
    if (!productId || !open) return;

    setProduct(null); // ✅ Reset previous product data
    setLoading(true);

    async function fetchProductDetails() {
      try {
        const res = await fetch(`/api/productsdetails/${productId}`);

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched product details:", data);

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetails();
  }, [productId, open]);

  const handleAddToCart = async (productCart) => {
    addToCart(productCart);
    toast.success(`${productCart.name} added to cart! 🛒`, {
      position: "top-right",
      duration: 3000,
      style: {
        borderRadius: "10px",
        background: darkMode ? "#1E293B" : "#fff",
        color: darkMode ? "#fff" : "#000",
      },
    });
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: isMobile ? "100vw" : 350, // ✅ Full width on mobile
          padding: 2,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: darkMode ? "#1E1E1E" : "#fff",
          color: darkMode ? "#fff" : "#000",
          overflowY: "auto", // ✅ Enables scrolling
          scrollbarWidth: "thin",
        }}
      >
        {/* ✅ Header Section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontSize: isMobile ? "16px" : "18px" }}>Product Details</Typography>
          <IconButton onClick={onClose} sx={{ color: darkMode ? "#fff" : "#000" }}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ marginY: 1, backgroundColor: darkMode ? "#444" : "#ddd" }} />

        {/* ✅ Show Loader if Loading */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress />
          </Box>
        ) : product ? (
          <>
            {/* ✅ Product Image */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 , mt:2 }}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: isMobile ? "90%" : "80%", // ✅ Adjusts for mobile
                  maxWidth: "300px",
                  height: "auto",
                  borderRadius: "12px",
                  objectFit: "contain",
                  boxShadow: darkMode ? "0px 4px 8px rgba(255,255,255,0.1)" : "0px 4px 8px rgba(0,0,0,0.1)"
                }}
              />
            </Box>

            {/* ✅ Product Name & Category */}
            <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold", fontSize: isMobile ? "18px" : "20px" }}>
              {product.name}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "center", color: darkMode ? "gray" : "#555", fontSize: isMobile ? "14px" : "16px" }}>
              {product.category}
            </Typography>

            <Divider sx={{ marginY: 1, backgroundColor: darkMode ? "#444" : "#ddd" }} />

            {/* ✅ Features List */}
            <List sx={{ paddingY: 0 }}>
              {product.features?.length > 0 ? (
                product.features.map((feature, index) => (
                  <ListItem key={index} sx={{ paddingY: "4px" }}> {/* ✅ Reduced Padding */}
                    <ListItemIcon sx={{ minWidth: "30px" }}>
                      <CheckCircle size={18} color="green" />
                    </ListItemIcon>
                    <ListItemText primary={feature.description} sx={{ fontSize: "14px", color: darkMode ? "#fff" : "#000" }} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" sx={{ textAlign: "center", color: darkMode ? "gray" : "#777", mt: 1 }}>
                  No features available.
                </Typography>
              )}
            </List>

            <Divider sx={{ marginY: 1, backgroundColor: darkMode ? "#444" : "#ddd" }} />

            {/* ✅ Price & Add to Cart Button */}
            <Box sx={{ textAlign: "center", mt: "auto" }}>
              <Typography variant="h6" sx={{ fontSize: isMobile ? "16px" : "18px", color: darkMode ? "#38BDF8" : "#2563EB" }}>
                {product.price} | {product.currency}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={() => handleAddToCart(product)}
                sx={{
                  mt: 1,
                  fontSize: isMobile ? "14px" : "16px",
                  backgroundColor: darkMode ? "#3B82F6" : "#2563EB",
                  "&:hover": { backgroundColor: darkMode ? "#2563EB" : "#1D4ED8" },
                }} 
              >
                Add to Cart
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="body2" sx={{ textAlign: "center", color: darkMode ? "gray" : "#777" }}>
            Product not found.
          </Typography>
        )}
      </Box>
      <Toaster position="top-center" />
    </Drawer>
  );
}
