/**
 * PURPOSE: Subject detail — shows parts (e.g., Ancient India, Medieval India) within a subject
 * ROUTE:   /courses/[subject]  (e.g., /courses/history)
 * DEPENDS: api.ts, Nav.tsx, Footer.tsx
 *
 * Since the API doesn't have a dedicated parts endpoint, we fetch all chapters
 * and group them by part_name to build the hierarchy.
 */

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import type { ChapterListItem } from "@/lib/api";

/* Helper: convert a name to a URL-safe slug */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface PageProps {
  params: Promise<{ subject: string }>;
}

export default async function SubjectPage({ params }: PageProps) {
  const { subject } = await params;
  let chapters: ChapterListItem[] = [];

  try {
    const res = await api.getChapters();
    chapters = res.results.filter(
      (ch) => slugify(ch.subject_name) === subject
    );
  } catch {
    /* API down */
  }

  /* Derive subject name from first chapter */
  const subjectName = chapters[0]?.subject_name || subject;

  /* Group chapters by part_name */
  const parts: Record<string, { unitChapters: Record<string, ChapterListItem[]> }> = {};
  for (const ch of chapters) {
    const partKey = ch.part_name || "General";
    if (!parts[partKey]) parts[partKey] = { unitChapters: {} };
    const unitKey = ch.unit_name || "General";
    if (!parts[partKey].unitChapters[unitKey]) parts[partKey].unitChapters[unitKey] = [];
    parts[partKey].unitChapters[unitKey].push(ch);
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
            {subjectName}
          </p>
        </div>

        {/* Header */}
        <section className="py-8 px-4 text-center">
          <p
            className="text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 mb-2"
            style={{ color: "#E07020" }}
          >
            <span className="w-4 h-0.5 rounded" style={{ background: "#E07020" }} />
            Subject
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            {subjectName}
          </h1>
          <p className="text-sm" style={{ color: "#7A7168" }}>
            {Object.keys(parts).length} part{Object.keys(parts).length !== 1 ? "s" : ""} · {chapters.length} chapters
          </p>
        </section>

        {/* Parts listing */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(parts).map(([partName, data]) => {
              const chapterCount = Object.values(data.unitChapters).flat().length;
              const totalFacts = Object.values(data.unitChapters)
                .flat()
                .reduce((sum, ch) => sum + ch.fact_count, 0);

              return (
                <a
                  key={partName}
                  href={`/courses/${subject}/${slugify(partName)}`}
                  className="block border rounded-xl p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                  style={{ borderColor: "#E8E4DC", background: "white" }}
                >
                  <h2 className="font-extrabold text-lg mb-1">{partName}</h2>
                  <div className="flex gap-3 text-xs" style={{ color: "#7A7168" }}>
                    <span>{chapterCount} chapters</span>
                    <span>{totalFacts} facts</span>
                  </div>
                  <div className="mt-3 text-xs" style={{ color: "#B5AEA4" }}>
                    {Object.keys(data.unitChapters).map((u) => u).join(" · ")}
                  </div>
                  <div className="mt-3 text-xs font-semibold" style={{ color: "#E07020" }}>
                    View chapters →
                  </div>
                </a>
              );
            })}
          </div>

          {chapters.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg font-bold mb-2">No chapters found for this subject</p>
              <a href="/courses" className="text-sm underline" style={{ color: "#E07020" }}>
                ← Back to courses
              </a>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
