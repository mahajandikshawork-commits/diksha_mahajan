import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";
import { BsWhatsapp } from 'react-icons/bs';

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
          
          {/* Fixed WhatsApp Button */}
          <a
            href="https://wa.me/919871907315"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#20BA5A] transition-all hover:scale-110 z-50"
            aria-label="Chat on WhatsApp"
          >
            <BsWhatsapp className="text-white" size={28} />
          </a>
        </CartProvider>
      </body>
    </html>
  );
}
