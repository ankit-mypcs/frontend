/**
 * PURPOSE: Courses landing — lists all subjects (v12 design exact match)
 * ROUTE:   /courses
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
      <main style={{ minHeight: "100vh", background: "#F8F7F4", color: "#333" }}>
        {/* Breadcrumb */}
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 24px 0" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#A3A3A3" }}>Courses</p>
        </div>

        {/* Header — v12 editorial style */}
        <section style={{ padding: "96px 24px 48px", textAlign: "center" }}>
          <p style={{
            fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const,
            letterSpacing: "0.16em", color: "#C96B28", marginBottom: 48,
          }}>
            Courses
          </p>
          <h1 style={{
            fontFamily: "var(--font-serif, 'DM Serif Display', Georgia, serif)",
            fontSize: "clamp(34px, 7vw, 68px)", fontWeight: 400,
            lineHeight: 1.1, color: "#171717", letterSpacing: "-0.02em",
            marginBottom: 24, maxWidth: 780, marginLeft: "auto", marginRight: "auto",
          }}>
            Pick your subject.
          </h1>
          <p style={{
            fontSize: "clamp(17px, 2.5vw, 21px)", color: "#333",
            maxWidth: 600, margin: "0 auto", lineHeight: 1.65,
          }}>
            Start with a subject, drill into chapters, study the notes.
          </p>
        </section>

        {/* Subject cards */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px 96px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {subjects.map((s) => (
              <a
                key={s.slug}
                href={`/courses/${s.slug}`}
                style={{
                  display: "block", padding: 28, borderRadius: 20,
                  background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  transition: "all 0.2s", textDecoration: "none", color: "inherit",
                }}
              >
                <h2 style={{
                  fontFamily: "var(--font-serif, 'DM Serif Display', Georgia, serif)",
                  fontSize: 24, fontWeight: 400, marginBottom: 8, color: "#171717",
                }}>
                  {s.name}
                </h2>
                <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#6B6B6B", fontWeight: 500 }}>
                  <span>{s.chapter_count} chapters</span>
                  <span>{s.question_count.toLocaleString()} PYQs</span>
                </div>
                <div style={{ marginTop: 24, fontSize: 13, fontWeight: 600, color: "#C96B28" }}>
                  View parts →
                </div>
              </a>
            ))}
          </div>

          {subjects.length === 0 && (
            <div style={{ textAlign: "center", padding: "96px 0" }}>
              <p style={{
                fontFamily: "var(--font-serif, 'DM Serif Display', Georgia, serif)",
                fontSize: 22, fontWeight: 400, marginBottom: 12, color: "#171717",
              }}>
                Could not load subjects
              </p>
              <p style={{ fontSize: 15, color: "#6B6B6B", lineHeight: 1.65 }}>Make sure the Django API is running.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
