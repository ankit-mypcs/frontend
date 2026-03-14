/**
 * PURPOSE: Site footer with tricolor accent and link columns
 * USED BY: src/app/page.tsx (homepage)
 * DEPENDS ON: nothing
 */

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: ["Practice", "PYQ Explorer", "Chapter Notes", "Mock Tests"],
  },
  {
    title: "Subjects",
    links: ["Indian Polity", "History", "Geography", "More Coming"],
  },
  {
    title: "Connect",
    links: ["About Us", "Telegram", "Contact", "Privacy"],
  },
];

export default function Footer() {
  return (
    <footer
      style={{ background: "#0A0A2A" }}
      className="text-white/40 pt-12 pb-6 px-4"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div>
          <div className="font-black text-lg text-white mb-2">
            my<span style={{ color: "#E07020" }}>pcs</span>.in
          </div>
          <p className="text-sm leading-relaxed">
            My Pathway to Civil Services. Built in Nagpur for rural India.
          </p>
          {/* Tricolor accent bar */}
          <div
            className="h-0.5 w-12 mt-3 rounded-sm"
            style={{
              background:
                "linear-gradient(90deg,#E07020 33%,rgba(255,255,255,0.2) 33%,rgba(255,255,255,0.2) 66%,#0A8A4C 66%)",
            }}
          />
        </div>

        {/* Link columns */}
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-white/55 text-xs font-bold uppercase tracking-widest mb-3">
              {col.title}
            </h4>
            {col.links.map((link) => (
              <a
                key={link}
                href="#"
                className="block text-sm py-0.5 hover:text-orange-400 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="max-w-5xl mx-auto mt-8 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between text-xs">
        <span>&copy; 2026 mypcs.in</span>
        <span>Made with care in Nagpur for rural India</span>
      </div>
    </footer>
  );
}
