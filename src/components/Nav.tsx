/**
 * PURPOSE: Navigation bar matching v12 homepage design
 * USED BY: All pages
 * DEPENDS ON: next/link
 */

"use client";
import Link from "next/link";

export default function Nav() {
  return (
    <>
      {/* Tricolor accent bar */}
      <div
        style={{
          height: 3,
          background: "linear-gradient(90deg, #C96B28 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #1A7F4B 66.66%)",
          position: "sticky",
          top: 0,
          zIndex: 1001,
        }}
      />
      <nav
        style={{
          position: "sticky",
          top: 3,
          zIndex: 1000,
          background: "rgba(248,247,244,0.95)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "0 24px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-sans), 'Inter', sans-serif",
              fontWeight: 900,
              fontSize: 20,
              color: "#0A0F3A",
              letterSpacing: "-0.02em",
            }}
          >
            my<span style={{ color: "#C96B28" }}>pcs</span>.in
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex" style={{ gap: 4 }}>
            {[
              { label: "Courses", href: "/courses" },
              { label: "Chapters", href: "/chapters" },
              { label: "Practice", href: "/practice" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  padding: "6px 16px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#6B6B6B",
                  transition: "color 0.2s",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              style={{
                padding: "8px 20px",
                borderRadius: 100,
                fontSize: 14,
                fontWeight: 600,
                color: "#333",
                border: "1px solid rgba(0,0,0,0.08)",
                background: "#fff",
              }}
            >
              Log In
            </button>
            <button
              style={{
                padding: "8px 24px",
                borderRadius: 100,
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                background: "#C96B28",
                boxShadow: "0 2px 12px rgba(201,107,40,0.2)",
              }}
            >
              Start Free →
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
