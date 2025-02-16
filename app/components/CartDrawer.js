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
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Close } from "@mui/icons-material";

export default function CartDrawer({ open, onClose }) {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { darkMode } = useTheme();
  const router = useRouter();
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

  // ✅ Handle UPI Checkout & Remove Items on Success
  const handleUPICheckout = async () => {
    if (!razorpayLoaded) {
      toast.error("Razorpay is not loaded. Please try again.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: totalPriceINR * 100,
      currency: "INR",
      name: "Premium Shop",
      description: "Purchase from Premium Shop",
      handler: function (response) {
        toast.success("Payment Successful! Transaction ID: " + response.razorpay_payment_id);
        
        // ✅ Remove items from cart after successful payment
        clearCart();
        onClose();
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

  // ✅ Handle Crypto Checkout & Remove Items on Success
  const handleCryptoCheckout = async () => {
    setLoading(true);
    try {
      const totalPrice = parseFloat(totalPriceUSD);
  
      if (!totalPrice || totalPrice <= 0) {
        toast.error("Invalid total amount");
        return;
      }
  
      const res = await fetch("/api/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalAmount: totalPrice }),
      });
  
      const data = await res.json();
      
      if (data.invoice_url) {
        window.location.href = data.invoice_url;
        
        // ✅ Remove items from cart after successful payment
        clearCart();
        onClose();
      } else {
        toast.error("Failed to create invoice. Try again.");
      }
    } catch (error) {
      toast.error("Crypto Payment Failed");
    }
    setLoading(false);
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
  
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems, email: "algoexpert52@gmail.com" }), 
      });
  
      // ✅ Read response once and store it
      const data = await res.json();  
      console.log("Checkout Response:", data);
  
      if (!res.ok) {
        console.error("Checkout Error Response:", data);
        toast.error(data.error || "Checkout failed!");
        return;
      }
  
      if (data.url) {
        window.location.href = data.url; 
      } else {
        toast.error("Failed to start checkout!");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error("Error during checkout.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: "100vw", sm: 400 },
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
          <div className="flex justify-end items-center">
            {cartItems.length > 0 && (
              <Button onClick={clearCart} sx={{ color: "red" }}>
                Clear Cart
              </Button>
            )}
            <IconButton onClick={onClose} sx={{ color: darkMode ? "#fff" : "#000" }}>
              <Close />
            </IconButton>
          </div>
        </Box>

        <Divider />

        {/* Cart Items */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
          {cartItems.length === 0 ? (
            <Box sx={{ textAlign: "center", padding: "20px" }}>
              <Typography variant="body1">Your cart is empty</Typography>
              <Button 
                variant="contained" 
                sx={{ marginTop: "10px" }} 
                onClick={() => {
                  router.push("/");
                  onClose();
                }}
              >
                Add Items to Cart
              </Button>
            </Box>
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
                      style={{ width: 50, height: 50, objectFit: "contain", borderRadius: "8px" }}
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
          <Box sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ textAlign: "center", marginBottom: "10px" }}>
              Total: ${totalPriceUSD} | ₹{totalPriceINR}
            </Typography>
            <Button fullWidth variant="contained" onClick={handleCheckout} sx={{ marginBottom: "10px" }}>
              Pay via Stripe
            </Button>
            <Button fullWidth variant="contained" color="secondary" onClick={handleCryptoCheckout}>
              Pay via Crypto ($)
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
