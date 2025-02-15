"use client";
import { ShoppingCart, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import { useState } from "react";

export default function Header() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { cartItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className={`flex items-center justify-between px-6 py-4  ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Logo */}
      <h1 className="text-2xl font-bold tracking-wide">Premium shop</h1>

      {/* Icons Section */}
      <div className="flex items-center gap-6">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full transition hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {/* Shopping Cart */}
        <div className="relative">
          <ShoppingCart size={28} className="cursor-pointer hover:text-blue-500" onClick={() => setCartOpen(true)} />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          )}
        </div>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
