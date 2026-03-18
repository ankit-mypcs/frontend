/**
 * PURPOSE: Courses landing — lists all subjects as entry points
 * ROUTE:   /courses
 * DEPENDS: api.ts, Nav.tsx, Footer.tsx
 */

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

export default async function CoursesPage() {
  let subjects: { name: string; slug: string; chapter_count: number; question_count: number }[] = [];

  try {
    const res = await api.getSubjects();
    subjects = res.results;
  } catch {
    /* API down */
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen" style={{ background: "#FAF8F5", color: "#1A1A1A" }}>
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <p className="text-xs font-semibold" style={{ color: "#B5AEA4" }}>
            Courses
          </p>
        </div>

        {/* Header */}
        <section className="py-8 px-4 text-center">
          <p
            className="text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 mb-2"
            style={{ color: "#E07020" }}
          >
            <span className="w-4 h-0.5 rounded" style={{ background: "#E07020" }} />
            Courses
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            Pick your subject.
          </h1>
          <p className="text-sm" style={{ color: "#7A7168" }}>
            Start with a subject, drill into chapters, study the notes.
          </p>
        </section>

        {/* Subject cards */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <a
                key={s.slug}
                href={`/courses/${s.slug}`}
                className="block border rounded-xl p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                style={{ borderColor: "#E8E4DC", background: "white" }}
              >
                <h2 className="font-extrabold text-lg mb-1">{s.name}</h2>
                <div className="flex gap-3 text-xs" style={{ color: "#7A7168" }}>
                  <span>{s.chapter_count} chapters</span>
                  <span>{s.question_count.toLocaleString()} PYQs</span>
                </div>
                <div className="mt-4 text-xs font-semibold" style={{ color: "#E07020" }}>
                  View parts →
                </div>
              </a>
            ))}
          </div>

          {subjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg font-bold mb-2">Could not load subjects</p>
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
