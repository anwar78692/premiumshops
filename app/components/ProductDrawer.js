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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { CheckCircle, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";

export default function ProductDrawer({ open, productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

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
      <Box sx={{ width: 350, padding: 2, display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Product Details</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ marginY: 1 }} />

        {/* ✅ Show Loader if Loading */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress />
          </Box>
        ) : product ? (
          <>
            {/* ✅ Small Product Image */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "120px", height: "120px", borderRadius: "10px", objectFit: "contain" }}
              />
            </Box>

            {/* ✅ Product Name & Category */}
            <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>
              {product.name}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "center", color: "gray" }}>
              {product.category}
            </Typography>

            <Divider sx={{ marginY: 1 }} />

            {/* ✅ Features List (Reduced Spacing) */}
            <List sx={{ paddingY: 0 }}>
              {product.features?.length > 0 ? (
                product.features.map((feature, index) => (
                  <ListItem key={index} sx={{ paddingY: "2px" }}> {/* Reduced Padding */}
                    <ListItemIcon sx={{ minWidth: "30px" }}>
                      <CheckCircle size={18} color="green" />
                    </ListItemIcon>
                    <ListItemText primary={feature.description} sx={{ fontSize: "14px" }} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" sx={{ textAlign: "center", color: "gray", mt: 1 }}>
                  No features available.
                </Typography>
              )}
            </List>

            <Divider sx={{ marginY: 1 }} />

            {/* ✅ Price & Add to Cart Button */}
            <Box sx={{ textAlign: "center", mt: "auto" }}>
              <Typography variant="h6">
                {product.price} | {product.currency}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={() => handleAddToCart(product)}
                sx={{ mt: 1 }}
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
