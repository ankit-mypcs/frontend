/**
 * PURPOSE: Subject detail — shows parts within a subject (v12 design)
 * ROUTE:   /courses/[subject]  (e.g., /courses/history)
 */

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import type { ChapterListItem } from "@/lib/api";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface PageProps {
  params: Promise<{ subject: string }>;
}

export default async function SubjectPage({ params }: PageProps) {
  const { subject } = await params;
  let chapters: ChapterListItem[] = [];

  try {
    const res = await api.getChapters();
    chapters = res.results.filter((ch) => slugify(ch.subject_name) === subject);
  } catch { /* API down */ }

  const subjectName = chapters[0]?.subject_name || subject;

  /* Group by part */
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
      <main style={{ minHeight: "100vh", background: "#F8F7F4", color: "#171717" }}>
        {/* Breadcrumb */}
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 24px 0" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#A3A3A3" }}>
            <a href="/courses" style={{ color: "#C96B28" }}>Courses</a>
            <span style={{ margin: "0 6px" }}>→</span>
            {subjectName}
          </p>
        </div>

        {/* Header */}
        <section style={{ padding: "48px 24px 32px", textAlign: "center" }}>
          <p style={{
            fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const,
            letterSpacing: "0.12em", color: "#C96B28", marginBottom: 12,
          }}>
            Subject
          </p>
          <h1 style={{
            fontFamily: "var(--font-serif), 'DM Serif Display', Georgia, serif",
            fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 400,
            lineHeight: 1.15, color: "#171717", marginBottom: 8,
          }}>
            {subjectName}
          </h1>
          <p style={{ fontSize: 15, color: "#6B6B6B" }}>
            {Object.keys(parts).length} part{Object.keys(parts).length !== 1 ? "s" : ""} · {chapters.length} chapters
          </p>
        </section>

        {/* Parts */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px 96px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {Object.entries(parts).map(([partName, data]) => {
              const chapterCount = Object.values(data.unitChapters).flat().length;
              const totalFacts = Object.values(data.unitChapters).flat().reduce((sum, ch) => sum + ch.fact_count, 0);

              return (
                <a
                  key={partName}
                  href={`/courses/${subject}/${slugify(partName)}`}
                  style={{
                    display: "block", padding: 28, borderRadius: 16,
                    background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    transition: "all 0.2s",
                  }}
                >
                  <h2 style={{
                    fontFamily: "var(--font-serif), 'DM Serif Display', Georgia, serif",
                    fontSize: 22, fontWeight: 400, marginBottom: 6,
                  }}>
                    {partName}
                  </h2>
                  <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#6B6B6B" }}>
                    <span>{chapterCount} chapters</span>
                    <span>{totalFacts} facts</span>
                  </div>
                  <p style={{ marginTop: 8, fontSize: 13, color: "#A3A3A3" }}>
                    {Object.keys(data.unitChapters).join(" · ")}
                  </p>
                  <div style={{ marginTop: 20, fontSize: 13, fontWeight: 600, color: "#C96B28" }}>
                    View chapters →
                  </div>
                </a>
              );
            })}
          </div>

          {chapters.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No chapters found for this subject</p>
              <a href="/courses" style={{ fontSize: 14, color: "#C96B28", textDecoration: "underline" }}>← Back to courses</a>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
