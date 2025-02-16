"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProviderWrapper from "./context/ThemeContext";
import SearchProvider from "./context/SearchContext";
import { Montserrat } from "next/font/google"; 
import FilterProvider from "./context/FilterContext";
import CartProvider from "./context/CartContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Choose the required weights
  variable: "--font-montserrat", // Store it as a CSS variable
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body  className="font-montserrat ">
      <ThemeProviderWrapper>
          <SearchProvider>

          <FilterProvider>
            <CartProvider>
            {children}
            </CartProvider>
            </FilterProvider>

          </SearchProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
