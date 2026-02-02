import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";
import LoadingBar from "./components/LoadingBar";
import ClientLayout from "./components/ClientLayout";
import Link from 'next/link';
import { BsWhatsapp } from 'react-icons/bs';
import GoogleAnalytics from "./components/GoogleAnalytics";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Diksha Mahajan - Luxury Bridal Wear & Designer Lehengas | Indian Bridal Fashion",
    template: "%s | Diksha Mahajan"
  },
  description: "Discover exquisite luxury bridal wear, designer lehengas, and bespoke Indian wedding outfits by Diksha Mahajan. Shop premium bridal collections, custom-made suits, and elegant festive wear for your special occasions.",
  keywords: [
    "Diksha Mahajan",
    "luxury bridal wear",
    "designer lehengas",
    "Indian bridal fashion",
    "wedding outfits",
    "bridal lehenga",
    "designer suits",
    "custom bridal wear",
    "trousseau collection",
    "festive wear",
    "cocktail dresses",
    "reception outfits",
    "embroidered suits",
    "bridal couture",
    "Indian designer wear"
  ],
  authors: [{ name: "Diksha Mahajan" }],
  creator: "Diksha Mahajan",
  publisher: "Diksha Mahajan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://dikshamahajan.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Diksha Mahajan - Luxury Bridal Wear & Designer Lehengas",
    description: "Discover exquisite luxury bridal wear, designer lehengas, and bespoke Indian wedding outfits by Diksha Mahajan.",
    url: 'https://dikshamahajan.com',
    siteName: 'Diksha Mahajan',
    images: [
      {
        url: '/logo.PNG',
        width: 1200,
        height: 630,
        alt: 'Diksha Mahajan - Luxury Bridal Couture',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Diksha Mahajan - Luxury Bridal Wear & Designer Lehengas",
    description: "Discover exquisite luxury bridal wear, designer lehengas, and bespoke Indian wedding outfits.",
    images: ['/logo.PNG'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body
        className={`${montserrat.variable} antialiased`}
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <CartProvider>
          <ClientLayout>
            <LoadingBar />
            <Header />
            {children}
            <Footer />
            <CartSidebar />
            
            {/* Fixed WhatsApp Button */}
            <Link
              href="https://wa.me/919871907315"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#20BA5A] transition-all hover:scale-110 z-50"
              aria-label="Chat on WhatsApp"
            >
              <BsWhatsapp className="text-white" size={28} />
            </Link>
          </ClientLayout>
        </CartProvider>
      </body>
    </html>
  );
}
