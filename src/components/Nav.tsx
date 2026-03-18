/**
 * PURPOSE: Navigation bar — exact match to v12.html
 * USED BY: All pages
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
          background:
            "linear-gradient(90deg, #C96B28 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #1A7F4B 66.66%)",
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
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontWeight: 800,
              fontSize: 22,
              color: "#171717",
              letterSpacing: "-0.03em",
              textDecoration: "none",
            }}
          >
            my<span style={{ color: "#C96B28" }}>pcs</span>.in
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { label: "Courses", href: "/courses" },
              { label: "Practice", href: "/practice" },
              { label: "Method", href: "/#method" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#6B6B6B",
                  transition: "color 0.15s",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA — dark ink like v12.html */}
          <Link
            href="/start"
            style={{
              background: "#171717",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              padding: "10px 22px",
              borderRadius: 100,
              transition: "all 0.2s",
              textDecoration: "none",
            }}
          >
            Start Free →
          </Link>
        </div>
      </nav>
    </>
  );
}
