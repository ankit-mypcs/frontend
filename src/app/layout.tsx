/**
 * PURPOSE: Root layout — loads fonts, sets metadata, wraps all pages
 * USED BY: Next.js App Router (every page)
 * DEPENDS ON: next/font/google, globals.css
 */

import type { Metadata } from "next";
import { Outfit, Lexend, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

/* Primary font for UI */
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

/* Reading font for question stems and explanations */
const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

/* Hindi text support */
const notoHindi = Noto_Sans_Devanagari({
  variable: "--font-noto-sans-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MYPCS.IN — UPPCS Exam Prep",
  description:
    "Practice 10,000+ previous year questions for UPPCS Prelims & Mains",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${lexend.variable} ${notoHindi.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
