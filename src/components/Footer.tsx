/**
 * PURPOSE: Site footer matching v12 homepage design
 * USED BY: All pages
 */

const FOOTER_COLUMNS = [
  { title: "Product", links: ["Practice", "PYQ Explorer", "Chapter Notes", "Mock Tests"] },
  { title: "Subjects", links: ["Indian Polity", "History", "Geography", "More Coming"] },
  { title: "Connect", links: ["About Us", "Telegram", "Contact", "Privacy"] },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0A0F3A", color: "rgba(255,255,255,0.4)", padding: "64px 24px 32px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40 }}>
        {/* Brand */}
        <div>
          <div style={{ fontWeight: 900, fontSize: 18, color: "#fff", marginBottom: 8 }}>
            my<span style={{ color: "#C96B28" }}>pcs</span>.in
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>
            My Pathway to Civil Services.
          </p>
          <div style={{
            height: 2, width: 48, marginTop: 16, borderRadius: 2,
            background: "linear-gradient(90deg, #C96B28 33%, rgba(255,255,255,0.2) 33%, rgba(255,255,255,0.2) 66%, #1A7F4B 66%)",
          }} />
        </div>

        {/* Link columns */}
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 style={{
              color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16,
            }}>
              {col.title}
            </h4>
            {col.links.map((link) => (
              <a
                key={link} href="#"
                style={{ display: "block", fontSize: 14, padding: "3px 0", transition: "color 0.2s" }}
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div style={{
        maxWidth: 1080, margin: "40px auto 0", paddingTop: 20,
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", justifyContent: "space-between", fontSize: 12,
        flexWrap: "wrap", gap: 8,
      }}>
        <span>&copy; 2026 mypcs.in</span>
        <span>A personalized pathway, for those who dare to serve the roots of India.</span>
      </div>
    </footer>
  );
}
