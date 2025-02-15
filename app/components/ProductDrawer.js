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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { CheckCircle, Star, ShoppingCart, Tag, Calendar, Rocket } from "lucide-react";
import { useCart } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";

export default function ProductDrawer({ open, productId, onClose }) {
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProductDetails() {
      if (!productId) return;

      try {
        const res = await fetch(`/api/productsdetails/${productId}`);
        const data = await res.json();
        if (!data.error) {
          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    }

    fetchProductDetails();
  }, [productId]);
  const handleAddToCart =async (productCart) => {
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
  }

  if (!product) return null;

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
        <Divider sx={{ marginY: 2 }} />

        {/* Product Image */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "auto", borderRadius: "10px" }}
          />
        </Box>

        {/* Product Name & Category */}
        <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>
          {product.name}
        </Typography>
        <Typography variant="body2" sx={{ textAlign: "center", color: "gray" }}>
          {product.category}
        </Typography>

        {/* Features List (Fetched from DB) */}
        <List>
          {product.features?.map((feature, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircle size={20} color="green" />
              </ListItemIcon>
              <ListItemText primary={feature.description} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ marginY: 2 }} />

        {/* Price & Add to Cart Button */}
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
            sx={{ mt: 2 }}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>
      <Toaster position="top-center" />
    </Drawer>
  );
}
