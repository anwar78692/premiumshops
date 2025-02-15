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
import toast, { Toaster } from "react-hot-toast";

export default function ProductDrawer({ open, productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
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
        background: "#1E293B",
        color: "#fff",
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
          backgroundColor: "#1E1E1E",
          color: "#fff",
          overflowY: "auto", // ✅ Enables scrolling
          scrollbarWidth: "thin",
        }}
      >
        {/* ✅ Header Section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontSize: isMobile ? "16px" : "18px" }}>Product Details</Typography>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ marginY: 1, backgroundColor: "#444" }} />

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
                }}
              />
            </Box>

            {/* ✅ Product Name & Category */}
            <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold", fontSize: isMobile ? "18px" : "20px" }}>
              {product.name}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "center", color: "gray", fontSize: isMobile ? "14px" : "16px" }}>
              {product.category}
            </Typography>

            <Divider sx={{ marginY: 1, backgroundColor: "#444" }} />

            {/* ✅ Features List */}
            <List sx={{ paddingY: 0 }}>
              {product.features?.length > 0 ? (
                product.features.map((feature, index) => (
                  <ListItem key={index} sx={{ paddingY: "4px" }}> {/* ✅ Reduced Padding */}
                    <ListItemIcon sx={{ minWidth: "30px" }}>
                      <CheckCircle size={18} color="green" />
                    </ListItemIcon>
                    <ListItemText primary={feature.description} sx={{ fontSize: "14px", color: "#fff" }} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" sx={{ textAlign: "center", color: "gray", mt: 1 }}>
                  No features available.
                </Typography>
              )}
            </List>

            <Divider sx={{ marginY: 1, backgroundColor: "#444" }} />

            {/* ✅ Price & Add to Cart Button */}
            <Box sx={{ textAlign: "center", mt: "auto" }}>
              <Typography variant="h6" sx={{ fontSize: isMobile ? "16px" : "18px" }}>
                {product.price} | {product.currency}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={() => handleAddToCart(product)}
                sx={{ mt: 1, fontSize: isMobile ? "14px" : "16px" }} // ✅ Adjust button text size
              >
                Add to Cart
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="body2" sx={{ textAlign: "center", color: "gray" }}>
            Product not found.
          </Typography>
        )}
      </Box>
      <Toaster position="top-center" />
    </Drawer>
  );
}
