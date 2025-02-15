"use client";
import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { Delete } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { Close } from "@mui/icons-material";

export default function CartDrawer({ open, onClose }) {
  const { cartItems, removeFromCart } = useCart();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({});

  // ✅ Initialize quantities when cart items change
  useEffect(() => {
    const initialQuantities = {};
    cartItems.forEach((item) => {
      initialQuantities[item.id] = item.quantity || 1;
    });
    setQuantities(initialQuantities);
  }, [cartItems]);

  // ✅ Update quantity function
  const handleQuantityChange = (id, newQuantity) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: newQuantity,
    }));
  };

  // ✅ Calculate total price dynamically
  const totalPriceUSD = cartItems.reduce(
    (total, item) => total + Number(item.price.replace("$", "")) * quantities[item.id],
    0
  );

  const totalPriceINR = cartItems.reduce(
    (total, item) => total + Number(item.currency.replace("₹", "")) * quantities[item.id],
    0
  );

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const loadRazorpay = async () => {
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);
      } else {
        setRazorpayLoaded(true);
      }
    };
    loadRazorpay();
  }, []);

  // ✅ Handle UPI Checkout
  const handleUPICheckout = async () => {
    if (!razorpayLoaded) {
      toast.error("Razorpay is not loaded. Please try again.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Ensure this is set in .env.local
      amount: totalPriceINR * 100, // Amount in paisa
      currency: "INR",
      name: "Premium Shop",
      description: "Purchase from Premium Shop",
      handler: function (response) {
        toast.success("Payment Successful! Transaction ID: " + response.razorpay_payment_id);
      },
      prefill: {
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#2563EB",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleCryptoCheckout = async () => {
    setLoading(true);
    try {
      const totalPrice = parseFloat(totalPriceUSD); // ✅ Convert to valid number
  
      if (!totalPrice || totalPrice <= 0) {
        console.error("Invalid total price:", totalPrice);
        toast.error("Invalid total amount");
        return;
      }
  
      const res = await fetch("/api/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalAmount: totalPrice }), // ✅ Send valid amount
      });
  
      const data = await res.json();
      
      if (data.invoice_url) {
        window.location.href = data.invoice_url; // ✅ Redirect to NOWPayments invoice
      } else {
        toast.error("Failed to create invoice. Try again.");
      }
    } catch (error) {
      console.error("Crypto Payment Error:", error);
      toast.error("Crypto Payment Failed");
    }
    setLoading(false);
  };  

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: "100vw", sm: 400 }, // ✅ Responsive width
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: darkMode ? "#181818" : "#fff",
          color: darkMode ? "#fff" : "#000",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderBottom: darkMode ? "1px solid #333" : "1px solid #ddd",
          }}
        >
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={onClose} sx={{ color: darkMode ? "#fff" : "#000" }}>
            <Close />
          </IconButton>
        </Box>

        <Divider />

        {/* Cart Items */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
          {cartItems.length === 0 ? (
            <Typography variant="body1">Your cart is empty</Typography>
          ) : (
            cartItems.map((item) => (
              <Box key={item.id} sx={{ marginBottom: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: darkMode ? "#222" : "#f9f9f9",
                    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* Image & Name */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "contain",
                        borderRadius: "8px",
                      }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.price} | {item.currency}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Quantity Selector & Delete Icon */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Select
                      value={quantities[item.id]}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      size="small"
                      sx={{ width: 60, height: 30 }}
                    >
                      {[1, 2, 3, 4, 5].map((qty) => (
                        <MenuItem key={qty} value={qty}>
                          {qty}
                        </MenuItem>
                      ))}
                    </Select>
                    <IconButton onClick={() => removeFromCart(item.id)}>
                      <Delete size={20} />
                    </IconButton>
                  </Box>
                </Box>
                <Divider sx={{ marginY: 2 }} />
              </Box>
            ))
          )}
        </Box>

        {/* Footer */}
        {cartItems.length > 0 && (
          <Box
            sx={{
              padding: 2,
              borderTop: "1px solid #ddd",
              backgroundColor: darkMode ? "#181818" : "#fff",
            }}
          >
            <div className="flex justify-between">
            <Typography variant="h6">Total: ${totalPriceUSD}</Typography>
            <Typography variant="body2" color="text.secondary">
              ₹{totalPriceINR}
            </Typography>
            </div>
          
            <Button fullWidth sx={{marginBottom:"10px"}} variant="contained" onClick={handleUPICheckout} className="mb-5">
              Pay via UPI (₹)
            </Button>
            <Button fullWidth variant="contained" color="secondary"  onClick={handleCryptoCheckout}>
              Pay via Crypto ($)
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
