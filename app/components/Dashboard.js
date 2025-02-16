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
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            height: "100%",
                                            backgroundColor: darkMode ? "#1E293B" : "#fff",
                                            color: darkMode ? "#fff" : "#333",
                                            padding: "16px",
                                            borderRadius: "16px",
                                            border: darkMode ? "1px solid #374151" : "1px solid rgba(0, 0, 0, 0.1)",
                                            boxShadow: darkMode
                                                ? "0px 4px 10px rgba(0, 0, 0, 0.3)"
                                                : "0px 10px 25px rgba(0, 0, 0, 0.1)",
                                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                            "&:hover": {
                                                transform: "scale(1.05)",
                                                boxShadow: darkMode
                                                    ? "0px 10px 30px rgba(0, 0, 0, 0.4)"
                                                    : "0px 15px 35px rgba(0, 0, 0, 0.15)",
                                            },
                                            position: "relative",
                                        }}
                                    >
                                        {/* Billing Cycle Badge */}
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: "12px",
                                                right: "12px",
                                                backgroundColor:
                                                    product.billingCycle === "Monthly" ? "#3B82F6" : "#2563EB",
                                                color: "#fff",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                padding: "4px 10px",
                                                borderRadius: "12px",
                                                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                                            }}
                                        >
                                            {product.billingCycle}
                                        </Box>

                                        {/* Product Image */}
                                        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                                            <CardMedia
                                                component="img"
                                                image={product.image}
                                                alt={product.name}
                                                sx={{
                                                    width: "90px",
                                                    height: "90px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                    border: "3px solid rgba(255, 255, 255, 0.3)",
                                                    padding: "5px",
                                                    boxShadow: darkMode
                                                        ? "none"
                                                        : "0px 5px 15px rgba(0, 0, 0, 0.15)",
                                                }}
                                            />
                                        </Box>

                                        {/* Product Details */}
                                        <Box sx={{ textAlign: "center" }}>
                                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                                {product.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: darkMode ? "gray" : "#555", mb: 1 }}
                                            >
                                                {product.category}
                                            </Typography>

                                            {/* Pricing */}
                                            <Typography variant="body2" sx={{ fontSize: "14px" }}>
                                                <s style={{ opacity: 0.6, fontSize: "14px", marginRight: "6px" }}>
                                                    {`$${Number(product.price.replace("$", "")) + 10}`} {/* Original Price */}
                                                </s>
                                                <strong style={{ fontSize: "18px", color: darkMode ? "#fff" : "#000" }}>
                                                    {product.price}
                                                </strong>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {product.currency}
                                            </Typography>
                                        </Box>

                                        {/* Buttons */}
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                            <Tooltip title="Add to Cart" placement="top" arrow>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={handleAddToCart}
                                                    sx={{
                                                        minWidth: "40px",
                                                        backgroundColor: darkMode ? "#2563EB" : "#1D4ED8",
                                                        "&:hover": { backgroundColor: darkMode ? "#1E40AF" : "#2563EB" },
                                                    }}
                                                >
                                                    <ShoppingCart size={18} />
                                                </Button>
                                            </Tooltip>

                                            <Tooltip title="View Details" placement="top" arrow>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleOpenDrawer(product)}
                                                    sx={{
                                                        minWidth: "40px",
                                                        borderColor: darkMode ? "#2563EB" : "#1D4ED8",
                                                        color: darkMode ? "#2563EB" : "#1D4ED8",
                                                        "&:hover": { borderColor: darkMode ? "#1E40AF" : "#2563EB" },
                                                    }}
                                                >
                                                    <Info size={18} />
                                                </Button>
                                            </Tooltip>
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
