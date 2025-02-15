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
  const { selectedFilter } = useFilter();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [customPrices, setCustomPrices] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOpenDrawer = (product) => {
    console.log("Open drawer: " , product);
    
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true); // ✅
        const res = await fetch("/api/products");
        const data = await res.json();
        console.log("Product: " , data);
        
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // ✅ Stop loading after fetch
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const price = customPrices[product.id] || product.price;
    addToCart({ ...product, price });
    toast.success(`${product.name} added to cart`);
  };

  const handleCustomPriceChange = (id, value) => {
    setCustomPrices((prev) => ({ ...prev, [id]: value }));
  };

  const filteredProducts = products
    .filter((item) =>
      selectedFilter === "All" ? true : item.category === selectedFilter
    )
    .filter((item) =>
      searchQuery
        ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );
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
      {/* Sticky Header */}
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

      {/* Filter Section */}
      <Box sx={{ paddingY: 2, backgroundColor: darkMode ? "#161B22" : "#fff" }}>
        <FilterComponent />
      </Box>

      {/* Product Grid */}
      <Box
    sx={{
      flexGrow: 1,
      overflowY: "auto",
      paddingX: 4,
      paddingBottom: "40px", // ✅ Adds space at bottom to prevent overlap
      scrollbarWidth: "thin",
      scrollbarColor: "lightgray transparent",
      "&::-webkit-scrollbar": { width: "2px" },
      "&::-webkit-scrollbar-thumb": { backgroundColor: "lightgray", borderRadius: "10px" },
      "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
    }}
  >
        <Grid container spacing={3} sx={{ marginTop: "10px", display: "flex", justifyContent: "center", paddingLeft:"16px" }}>
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
                   height: "100%",
                   backgroundColor: darkMode ? "#1E293B" : "#fff",
                   color: darkMode ? "#fff" : "#000",
                   padding: "12px",
                   borderRadius: "16px",
                   transition: "transform 0.3s ease, box-shadow 0.3s ease",
                   "&:hover": {
                     transform: "scale(1.03)",
                     boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                   },
                 }}
               >
                 {/* ✅ Image & Label Row */}
                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                   {/* Circular Image */}
                   <CardMedia
                     component="img"
                     image={product.image}
                     alt={product.name}
                     sx={{
                       width: "80px",
                       height: "80px",
                       borderRadius: "50%",
                       objectFit: "cover",
                       border: "2px solid #ccc",
                       padding: "5px",
                     }}
                   />
             
                   {/* ✅ Billing Cycle Label (Aligned Right) */}
                   <Typography
                     sx={{
                       backgroundColor: product.billingCycle === "Monthly" ? "#3B82F6" : "#2563EB",
                       color: "#fff",
                       fontSize: "12px",
                       fontWeight: "bold",
                       padding: "4px 10px",
                       borderRadius: "12px",
                    //    textTransform: "uppercase",
                       display: "inline-block",
                     }}
                   >
                     {product.billingCycle}
                   </Typography>
                 </Box>
             
                 {/* ✅ Product Details */}
                 <Box>
                   <Typography variant="h6">{product.name}</Typography>
                   <Typography variant="body2" sx={{ color: darkMode ? "gray" : "text.secondary" }}>
                     {product.category}
                   </Typography>
                   <Typography variant="body2" sx={{ marginTop: "4px" }}>
                     <s>{`$${Number(product.price.replace("$", "")) + 5}`}</s>{" "}
                     <strong>{product.price}</strong>
                   </Typography>
                   <Typography variant="body2" color="text.secondary">
                     {product.currency}
                   </Typography>
                 </Box>
             
                 {/* ✅ Input for Custom Price & Buttons */}
                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
                   <TextField
                     type="number"
                     value={customPrices[product.id] || product.price.replace("$", "")}
                     onChange={(e) => handleCustomPriceChange(product.id, e.target.value)}
                     size="small"
                     sx={{
                       width: "100px",
                       height: "40px",
                       "& input": { padding: "8px", textAlign: "center", fontWeight: "bold" },
                       "& fieldset": { borderRadius: "8px" },
                     }}
                   />
             
                   {/* ✅ Cart & View Details Buttons */}
                   <Box sx={{ display: "flex", gap: "8px" }}>
                     <Button
                       variant="contained"
                       size="small"
                       onClick={() => handleAddToCart(product)}
                       sx={{ minWidth: "40px" }}
                     >
                       <ShoppingCart size={16} />
                     </Button>
                     <Button
                       variant="outlined"
                       size="small"
                       onClick={() => handleOpenDrawer(product)}
                       sx={{ minWidth: "40px" }}
                     >
                       <Info size={16} />
                     </Button>
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
