/**
 * PURPOSE: Chapter listing page — shows all chapters grouped by unit
 * USED BY: App Router (/chapters)
 * DEPENDS ON: api.ts, Nav.tsx, Footer.tsx
 */

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import type { ChapterListItem } from "@/lib/api";

export default async function ChaptersPage() {
  let chapters: ChapterListItem[] = [];

  try {
    const res = await api.getChapters();
    chapters = res.results;
  } catch {
    /* API down — show empty state */
  }

  /* Group chapters by unit */
  const byUnit: Record<string, ChapterListItem[]> = {};
  for (const ch of chapters) {
    const key = ch.unit_name || "General";
    if (!byUnit[key]) byUnit[key] = [];
    byUnit[key].push(ch);
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen" style={{ background: "#FAF8F5", color: "#1A1A1A" }}>
        {/* ── Header ── */}
        <section className="py-12 px-4 text-center">
          <p
            className="text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 mb-2"
            style={{ color: "#E07020" }}
          >
            <span className="w-4 h-0.5 rounded" style={{ background: "#E07020" }} />
            Study Material
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            Ancient History — Chapter Notes
          </h1>
          <p className="text-sm" style={{ color: "#7A7168" }}>
            {chapters.length} chapters with facts, sites, timeline &amp; more
          </p>
        </section>

        {/* ── Chapter grid by unit ── */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          {Object.entries(byUnit).map(([unitName, unitChapters]) => (
            <div key={unitName} className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "#7A7168" }}>
                {unitName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {unitChapters.map((ch) => (
                  <a
                    key={ch.id}
                    href={`/chapters/${ch.slug}`}
                    className="block border rounded-xl p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    style={{ borderColor: "#E8E4DC", background: "white" }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ background: "rgba(224,112,32,0.1)", color: "#E07020" }}
                      >
                        {ch.chapter_number}
                      </span>
                      <h3 className="font-extrabold text-lg">{ch.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs" style={{ color: "#7A7168" }}>
                      <span className="px-2 py-0.5 rounded" style={{ background: "#F5F0E8" }}>
                        Facts
                      </span>
                      <span className="px-2 py-0.5 rounded" style={{ background: "#F5F0E8" }}>
                        Sites
                      </span>
                      <span className="px-2 py-0.5 rounded" style={{ background: "#F5F0E8" }}>
                        Timeline
                      </span>
                      <span className="px-2 py-0.5 rounded" style={{ background: "#F5F0E8" }}>
                        Glossary
                      </span>
                    </div>
                    <div className="mt-3 text-xs" style={{ color: "#B5AEA4" }}>
                      Click to study →
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}

          {chapters.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg font-bold mb-2">Could not load chapters</p>
              <p className="text-sm" style={{ color: "#7A7168" }}>
                Make sure the Django API is running.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
