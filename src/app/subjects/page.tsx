/**
 * PURPOSE: Subjects listing page — shows all subjects with PYQ counts
 * USED BY: App Router (/subjects)
 * DEPENDS ON: api.ts, Nav.tsx, Footer.tsx
 */

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import type { Subject } from "@/lib/api";

export default async function SubjectsPage() {
  let subjects: Subject[] = [];

  try {
    const res = await api.getSubjects();
    subjects = res.results;
  } catch {
    /* API down — show empty state */
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
            <span
              className="w-4 h-0.5 rounded"
              style={{ background: "#E07020" }}
            />
            Subjects
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            Pick a subject. Start practicing.
          </h1>
          <p className="text-sm" style={{ color: "#7A7168" }}>
            {subjects.length} subjects live with{" "}
            {subjects
              .reduce((sum, s) => sum + s.question_count, 0)
              .toLocaleString()}
            + PYQs
          </p>
        </section>

        {/* ── Subject grid ── */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {subjects.filter((s) => s.question_count > 0).map((s) => (
              <a
                key={s.id}
                href={"/practice?subject_id=" + s.id + "&subject_name=" + encodeURIComponent(s.name)}
                className="block border rounded-xl p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                style={{ borderColor: "#E8E4DC", background: "white" }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-extrabold text-lg">{s.name}</h2>
                  </div>
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-lg"
                    style={{ background: "rgba(224,112,32,0.1)", color: "#E07020" }}
                  >
                    {s.question_count.toLocaleString()} PYQs
                  </span>
                </div>
                <div className="mt-3 text-xs" style={{ color: "#B5AEA4" }}>
                  {s.chapter_count} chapters · Click to practice →
                </div>
              </a>
            ))}
          </div>

          {/* Empty state */}
          {subjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg font-bold mb-2">
                Could not load subjects
              </p>
              <p className="text-sm" style={{ color: "#7A7168" }}>
                Make sure the Django API is running on port 8000.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
