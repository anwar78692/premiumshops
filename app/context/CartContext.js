"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CartContext = createContext({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {}, 
  handleOpenCart: () => {}, 
  handleCloseCart: () => {}, 
});

export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [userUUID, setUserUUID] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const handleOpenCart=() => {
    setCartOpen(true);
  }
  const handleCloseCart=() => {
    setCartOpen(false);
  }

  // Generate and store UUID if not available
  useEffect(() => {
    let storedUUID = localStorage.getItem("userUUID");
    if (!storedUUID) {
      storedUUID = uuidv4();
      localStorage.setItem("userUUID", storedUUID);
    }
    setUserUUID(storedUUID);
  }, []);

  // Fetch cart from MongoDB using UUID
  useEffect(() => {
    if (!userUUID) return;

    async function fetchCart() {
      try {
        const res = await fetch(`/api/cart?uuid=${userUUID}`);
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        setCartItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCartItems([]);
      }
    }

    fetchCart();
  }, [userUUID]);

  // Add product to cart
  const addToCart = async (product) => {
    if (!userUUID) return;

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, uuid: userUUID, quantity: 1 }),
      });

      if (!res.ok) throw new Error("Failed to add item to cart");

      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.productId === product.id);
        if (existingItem) {
          return prev.map((item) =>
            item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { ...product, productId: product.id, quantity: 1 }];
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Remove product from cart
  const removeFromCart = async (id) => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid: userUUID, id,clearAll:false }),
      });
      if (!res.ok) throw new Error("Failed to remove item from cart");
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid: userUUID, clearAll: true }),
      });
      
      if (!res.ok) throw new Error("Failed to clear cart");

      setCartItems([]); 
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart,clearCart,cartOpen, handleOpenCart,handleCloseCart }}>
      {children}
    </CartContext.Provider>
  );
}
