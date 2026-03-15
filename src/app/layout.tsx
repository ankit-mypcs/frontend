/**
 * PURPOSE: Root layout — loads fonts, sets metadata, wraps all pages
 * USED BY: Next.js App Router (every page)
 * DEPENDS ON: next/font/google, globals.css
 */

import type { Metadata } from "next";
import { Outfit, Lexend, Noto_Sans_Devanagari, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* Primary font for UI (kept for practice/subjects pages) */
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

/* Monospace for numbers/stats */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${outfit.variable} ${lexend.variable} ${notoHindi.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        style={{ background: "#0A0A0F", color: "rgba(255,255,255,0.87)" }}
      >
        {children}
      </body>
    </html>
  );
}
