/**
 * PURPOSE: Part detail — shows chapters grouped by unit within a part
 * ROUTE:   /courses/[subject]/[part]  (e.g., /courses/history/ancient-india)
 * DEPENDS: api.ts, Nav.tsx, Footer.tsx
 */

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import type { ChapterListItem } from "@/lib/api";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface PageProps {
  params: Promise<{ subject: string; part: string }>;
}

export default async function PartPage({ params }: PageProps) {
  const { subject, part } = await params;
  let chapters: ChapterListItem[] = [];

  try {
    const res = await api.getChapters();
    chapters = res.results.filter(
      (ch) =>
        slugify(ch.subject_name) === subject &&
        slugify(ch.part_name) === part
    );
  } catch {
    /* API down */
  }

  const subjectName = chapters[0]?.subject_name || subject;
  const partName = chapters[0]?.part_name || part;

  /* Group by unit */
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
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <p className="text-xs font-semibold" style={{ color: "#B5AEA4" }}>
            <a href="/courses" className="hover:underline" style={{ color: "#E07020" }}>Courses</a>
            <span className="mx-1">→</span>
            <a href={`/courses/${subject}`} className="hover:underline" style={{ color: "#E07020" }}>{subjectName}</a>
            <span className="mx-1">→</span>
            {partName}
          </p>
        </div>

        {/* Header */}
        <section className="py-8 px-4 text-center">
          <p
            className="text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 mb-2"
            style={{ color: "#E07020" }}
          >
            <span className="w-4 h-0.5 rounded" style={{ background: "#E07020" }} />
            {subjectName}
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            {partName}
          </h1>
          <p className="text-sm" style={{ color: "#7A7168" }}>
            {chapters.length} chapters across {Object.keys(byUnit).length} unit{Object.keys(byUnit).length !== 1 ? "s" : ""}
          </p>
        </section>

        {/* Chapters by unit */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          {Object.entries(byUnit).map(([unitName, unitChapters]) => (
            <div key={unitName} className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "#7A7168" }}>
                {unitName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {unitChapters
                  .sort((a, b) => a.chapter_number - b.chapter_number)
                  .map((ch) => (
                    <a
                      key={ch.id}
                      href={`/courses/${subject}/${part}/${ch.slug}`}
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
                          {ch.fact_count} Facts
                        </span>
                        <span className="px-2 py-0.5 rounded" style={{ background: "#F5F0E8" }}>
                          {ch.site_count} Sites
                        </span>
                        <span className="px-2 py-0.5 rounded" style={{ background: "#F5F0E8" }}>
                          {ch.pyq_count} PYQs
                        </span>
                      </div>
                      <div className="mt-3 text-xs font-semibold" style={{ color: "#E07020" }}>
                        Study notes →
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          ))}

          {chapters.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg font-bold mb-2">No chapters found</p>
              <a href={`/courses/${subject}`} className="text-sm underline" style={{ color: "#E07020" }}>
                ← Back to {subjectName}
              </a>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
