"use client";
import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    TextField,
    CircularProgress,
    Chip,
    Tooltip,
    Avatar,
    IconButton,
} from "@mui/material";
import Header from "./Header";
import { useTheme } from "../context/ThemeContext";
import { useSearch } from "../context/SearchContext";
import SearchBar from "./SearchBar";
import FilterComponent from "./FilterComponent";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useFilter } from "../context/FilterContext";
import Footer from "./Footer";
import { Info, ShoppingCart } from "lucide-react";
import ProductDrawer from "./ProductDrawer";

export default function Dashboard() {
    const { searchQuery } = useSearch();
    const { darkMode } = useTheme();
    const { selectedFilter, selectedBillingCycle } = useFilter(); // ✅ Added selectedBillingCycle
    const { addToCart, handleOpenCart } = useCart();
    const [products, setProducts] = useState([]);
    const [customPrices, setCustomPrices] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleOpenDrawer = (product) => {
        setSelectedProduct(product);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                const res = await fetch("/api/products");
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        const price = customPrices[product.id] || product.price;
        addToCart({ ...product, price });

        toast.custom((t) => (
            <div
                className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 
                    ${t.visible ? "animate-slide-in" : "animate-slide-out"}`}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    maxWidth: "350px",
                    padding: "10px",
                }}
            >
                {/* Product Image */}
                <img
                    src={product.image}
                    alt={product.name}
                    style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "2px solid #ddd",
                        padding: "3px",
                    }}
                />

                {/* Product Info */}
                <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: "bold", color: "#fff" }}>{product.name}</p>
                    <p style={{ fontSize: "12px", color: "#555" }}>Added to Cart</p>
                </div>

                {/* Open Cart Button */}
                <button
                    onClick={() => {
                        toast.dismiss(t.id);
                        handleOpenCart();
                    }}
                    style={{
                        backgroundColor: "#2563EB",
                        color: "#fff",
                        padding: "6px 12px",
                        fontSize: "12px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Open Cart
                </button>
            </div>
        ));
    };

    // ✅ Updated Filtering Logic to Include Billing Cycle
    const filteredProducts = products
        .filter((item) =>
            selectedFilter === "All" ? true : item.category === selectedFilter
        )
        .filter((item) =>
            searchQuery ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
        )
        .filter((item) =>
            selectedBillingCycle === "All" ? true : item.billingCycle === selectedBillingCycle
        ); // ✅ Filter products by selected billing cycle

    useEffect(() => {
        async function trackVisit() {
            try {
                await fetch("/api/track");
            } catch (error) {
                console.error("Failed to track visit:", error);
            }
        }
        trackVisit();
    }, []);


    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    backgroundColor: darkMode ? "#0D1117" : "#fff",
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                    paddingBottom: 2,
                }}
            >
                <Header />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        backgroundColor: darkMode ? "#0D1117" : "#fff",
                    }}
                >
                    <SearchBar />
                </Box>
            </Box>

            <Box sx={{ paddingY: 2, backgroundColor: darkMode ? "#161B22" : "#fff" }}>
                <FilterComponent />
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    paddingX: 4,
                    paddingBottom: "40px",
                    scrollbarWidth: "thin",
                    scrollbarColor: "lightgray transparent",
                    "&::-webkit-scrollbar": { width: "2px" },
                    "&::-webkit-scrollbar-thumb": { backgroundColor: "lightgray", borderRadius: "10px" },
                    "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
                }}
            >
                <Grid container spacing={3} sx={{ marginTop: "10px", display: "flex", justifyContent: "center", paddingLeft: "16px" }}>
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredProducts.length === 0 ? (
                        <Typography variant="h6" sx={{ color: darkMode ? "#fff" : "#000", textAlign: "center", width: "100%", marginTop: "20px" }}>
                            No products found.
                        </Typography>
                    ) : (
                        <Grid container spacing={3} sx={{ marginTop: "10px" }}>
                            {filteredProducts.map((product) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                    <Card
                                        sx={{
                                            position: "relative",
                                            height: "250px", // ✅ Reduced Height
                                            width: "100%",
                                            maxWidth: "350px", // ✅ Slightly Compact Width
                                            borderRadius: "16px",
                                            overflow: "hidden",
                                            background: darkMode
                                                ? "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)"
                                                : "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
                                            transition: "all 0.3s ease",
                                            boxShadow: darkMode
                                                ? "0 5px 20px rgba(0, 0, 0, 0.4)"
                                                : "0 5px 20px rgba(0, 0, 0, 0.1)",
                                            "&:hover": {
                                                transform: "scale(1.03)",
                                                boxShadow: darkMode
                                                    ? "0 10px 30px rgba(0, 0, 0, 0.5)"
                                                    : "0 10px 30px rgba(0, 0, 0, 0.15)",
                                            },
                                        }}
                                    >
                                        {/* Circular Background Accent */}
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: "-40px",
                                                left: "-40px",
                                                width: "160px",
                                                height: "160px",
                                                borderRadius: "50%",
                                                background: darkMode
                                                    ? "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0) 70%)"
                                                    : "radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0) 70%)",
                                                zIndex: 0,
                                            }}
                                        />

                                        {/* Content Wrapper */}
                                        <Box
                                            sx={{
                                                position: "relative",
                                                display: "flex",
                                                flexDirection: "column",
                                                height: "100%",
                                                padding: "12px",
                                                zIndex: 1,
                                            }}
                                        >
                                            {/* Top Section */}
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 700,
                                                        fontSize: "1rem", // ✅ Slightly Smaller Font
                                                        color: darkMode ? "#fff" : "#333",
                                                    }}
                                                >
                                                    {product.name}
                                                </Typography>
                                                <Chip
                                                    label={product.billingCycle}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: product.billingCycle === "Monthly" ? "#3B82F6" : "#2563EB",
                                                        color: "#fff",
                                                        fontWeight: 600,
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                            </Box>

                                            {/* Main Content */}
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                                                {/* ✅ Product Image Inside a Circle */}
                                                <Box
                                                    sx={{
                                                        width: "100px",  // Set a fixed size for the image container
                                                        height: "100px", // Set a fixed size for the image container
                                                        borderRadius: "50%",  // This ensures the image is in a circle
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        backgroundColor: "#F5F5F5",  // Optional background color for the circle
                                                        border: "3px solid #ddd", // Optional border around the circle
                                                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Optional shadow for better visibility
                                                    }}
                                                >
                                                    <img
                                                        src={product.image} // Image source from product or static file
                                                        alt={product.name}  // Image alt text
                                                        style={{
                                                            width: "90px",  // Width of the image inside the circle
                                                            height: "90px", // Height of the image inside the circle
                                                            borderRadius: "50%", // This ensures the image itself is in a circle
                                                            objectFit: "cover",  // Ensures the image fills the circle without distortion
                                                        }}
                                                    />
                                                </Box>


                                                {/* Product Details */}
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                                                            mb: 0.5, // ✅ Reduced Spacing
                                                        }}
                                                    >
                                                        {product.category}
                                                    </Typography>

                                                    {/* Price Section with Strike-through Effect */}
                                                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                                                        <Typography
                                                            sx={{
                                                                fontSize: "1.3rem", // ✅ Adjusted Font Size
                                                                fontWeight: 700,
                                                                color: darkMode ? "#38BDF8" : "#0EA5E9",
                                                            }}
                                                        >
                                                            {product.price}
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                textDecoration: "line-through",
                                                                opacity: 0.6,
                                                                fontSize: "0.9rem",
                                                            }}
                                                        >
                                                            {`$${Number(product.price.replace("$", "")) + 10}`}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>

                                            {/* Bottom Action Buttons */}
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}> {/* ✅ Reduced Space */}
                                                {/* Add to Cart Button */}
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    onClick={() => handleAddToCart(product)}
                                                    startIcon={<ShoppingCart size={16} />}
                                                    sx={{
                                                        backgroundColor: darkMode ? "#3B82F6" : "#2563EB",
                                                        borderRadius: "10px",
                                                        padding: "8px 12px", // ✅ Smaller Padding
                                                        fontSize: "0.9rem",
                                                        fontWeight: "bold",
                                                        "&:hover": {
                                                            backgroundColor: darkMode ? "#2563EB" : "#1D4ED8",
                                                        },
                                                    }}
                                                >
                                                    Add to Cart
                                                </Button>

                                                {/* View Details Button (Tooltip Fixed) */}
                                                <Tooltip title="View Details" arrow placement="top">
                                                    <IconButton
                                                        onClick={() => handleOpenDrawer(product)}
                                                        sx={{
                                                            border: `1px solid ${darkMode ? "#3B82F6" : "#2563EB"}`,
                                                            color: darkMode ? "#3B82F6" : "#2563EB",
                                                            borderRadius: "10px",
                                                            transition: "all 0.2s ease-in-out",
                                                            "&:hover": {
                                                                backgroundColor: "rgba(37, 99, 235, 0.1)",
                                                            },
                                                        }}
                                                    >
                                                        <Info size={18} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>


                    )}
                </Grid>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    position: "sticky",
                    bottom: 0,
                    width: "100%",
                    //   backgroundColor: "#fff",
                    //   padding: 2,
                    //   borderTop: "1px solid #ddd",
                    //   boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Footer />
            </Box>
            <Toaster position="top-center" />
            <ProductDrawer open={isDrawerOpen} productId={selectedProduct?.id} product={selectedProduct} onClose={handleCloseDrawer} />
        </Box>
    );
}
