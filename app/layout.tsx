import type { Metadata } from "next";
import Script from "next/script";
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
    default: "Diksha Mahajan - Your heirloom begins here",
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
    title: "Diksha Mahajan - Your heirloom begins here",
    description: "Discover exquisite luxury bridal wear, designer lehengas, and bespoke Indian wedding outfits by Diksha Mahajan.",
    url: 'https://dikshamahajan.com',
    siteName: 'Diksha Mahajan',
    images: [
      {
        url: '/logo.webp',
        width: 1200,
        height: 630,
        alt: 'Diksha Mahajan - Your heirloom begins here',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Diksha Mahajan - Your heirloom begins here",
    description: "Discover exquisite luxury bridal wear, designer lehengas, and bespoke Indian wedding outfits.",
    images: ['/logo.webp'],
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
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KPHGZK3Q');`}
        </Script>
        {/* End Google Tag Manager */}
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1077955564560473');
fbq('track', 'PageView');`}
        </Script>
        {/* End Meta Pixel Code */}
        <link rel="preconnect" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body
        className={`${montserrat.variable} antialiased`}
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KPHGZK3Q"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Meta Pixel (noscript) */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1077955564560473&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel (noscript) */}
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
