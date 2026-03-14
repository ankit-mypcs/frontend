/**
 * PURPOSE: Sticky navigation bar with tricolor branding
 * USED BY: src/app/page.tsx (homepage)
 * DEPENDS ON: next/link
 */

"use client";
import Link from "next/link";

export default function Nav() {
  return (
    <nav
      className="sticky top-[3px] z-50 backdrop-blur-lg border-b"
      style={{
        background: "rgba(250,248,245,0.95)",
        borderColor: "#E8E4DC",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-black text-xl" style={{ color: "#000080" }}>
          my<span style={{ color: "#E07020" }}>pcs</span>.in
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-1">
          {["Features", "Subjects", "Pricing"].map((item) => (
            <a
              key={item}
              href={"#" + item.toLowerCase()}
              className="px-3 py-1.5 rounded-md text-sm font-semibold"
              style={{ color: "#7A7168" }}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-1.5 rounded-md text-sm font-semibold border"
            style={{ color: "#3D3730", borderColor: "#E8E4DC" }}
          >
            Log In
          </button>
          <button
            className="px-4 py-1.5 rounded-md text-sm font-bold text-white"
            style={{ background: "#E07020" }}
          >
            Start Free →
          </button>
        </div>
      </div>
    </nav>
  );
}
