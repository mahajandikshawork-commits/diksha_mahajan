import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
