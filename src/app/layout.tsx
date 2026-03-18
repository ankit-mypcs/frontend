/**
 * PURPOSE: Root layout — loads v12 fonts, sets metadata, wraps all pages
 * USED BY: Next.js App Router (every page)
 * DEPENDS ON: next/font/google, globals.css
 *
 * Font stack matches v12 homepage:
 *   --serif: DM Serif Display (headlines)
 *   --sans:  Inter (body)
 *   --mono:  JetBrains Mono (numbers/stats)
 */

import type { Metadata } from "next";
import { DM_Serif_Display, Inter, JetBrains_Mono, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

/* Serif — headlines */
const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

/* Sans — body text */
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

/* Mono — numbers, stats, codes */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/* Hindi text support */
const notoHindi = Noto_Sans_Devanagari({
  variable: "--font-hindi",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "mypcs.in — My Pathway to Civil Services",
  description:
    "UPPCS preparation backed by learning science. Spaced repetition, mastery learning, interleaved practice. 1,178+ PYQs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSerif.variable} ${inter.variable} ${jetbrainsMono.variable} ${notoHindi.variable} antialiased`}
        style={{
          fontFamily: "var(--font-sans), 'Inter', system-ui, sans-serif",
          background: "#F8F7F4",
          color: "#333333",
          lineHeight: 1.65,
          letterSpacing: "-0.01em",
        }}
      >
        {children}
      </body>
    </html>
  );
}
