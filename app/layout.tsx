import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Diksha Mahajan - Luxury Bridal Wear",
  description: "Discover exquisite bridal collections by Diksha Mahajan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}
