/**
 * PURPOSE: Part detail — chapters grouped by unit (v12 design)
 * ROUTE:   /courses/[subject]/[part]  (e.g., /courses/history/ancient-india)
 */

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import type { ChapterListItem } from "@/lib/api";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
      (ch) => slugify(ch.subject_name) === subject && slugify(ch.part_name) === part
    );
  } catch { /* API down */ }

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
      <main style={{ minHeight: "100vh", background: "#F8F7F4", color: "#171717" }}>
        {/* Breadcrumb */}
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 24px 0" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#A3A3A3" }}>
            <a href="/courses" style={{ color: "#C96B28" }}>Courses</a>
            <span style={{ margin: "0 6px" }}>→</span>
            <a href={`/courses/${subject}`} style={{ color: "#C96B28" }}>{subjectName}</a>
            <span style={{ margin: "0 6px" }}>→</span>
            {partName}
          </p>
        </div>

        {/* Header */}
        <section style={{ padding: "48px 24px 32px", textAlign: "center" }}>
          <p style={{
            fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const,
            letterSpacing: "0.12em", color: "#C96B28", marginBottom: 12,
          }}>
            {subjectName}
          </p>
          <h1 style={{
            fontFamily: "var(--font-serif), 'DM Serif Display', Georgia, serif",
            fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 400,
            lineHeight: 1.15, color: "#171717", marginBottom: 8,
          }}>
            {partName}
          </h1>
          <p style={{ fontSize: 15, color: "#6B6B6B" }}>
            {chapters.length} chapters across {Object.keys(byUnit).length} unit{Object.keys(byUnit).length !== 1 ? "s" : ""}
          </p>
        </section>

        {/* Chapters by unit */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px 96px" }}>
          {Object.entries(byUnit).map(([unitName, unitChapters]) => (
            <div key={unitName} style={{ marginBottom: 48 }}>
              <h2 style={{
                fontSize: 13, fontWeight: 700, textTransform: "uppercase" as const,
                letterSpacing: "0.08em", color: "#6B6B6B", marginBottom: 20,
              }}>
                {unitName}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
                {unitChapters
                  .sort((a, b) => a.chapter_number - b.chapter_number)
                  .map((ch) => (
                    <a
                      key={ch.id}
                      href={`/courses/${subject}/${part}/${ch.slug}`}
                      style={{
                        display: "block", padding: 28, borderRadius: 16,
                        background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <span style={{
                          width: 36, height: 36, borderRadius: 10,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, fontWeight: 700,
                          fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                          background: "#FDF5EE", color: "#C96B28",
                        }}>
                          {ch.chapter_number}
                        </span>
                        <h3 style={{
                          fontFamily: "var(--font-serif), 'DM Serif Display', Georgia, serif",
                          fontSize: 20, fontWeight: 400,
                        }}>
                          {ch.name}
                        </h3>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                        <span style={{
                          fontSize: 12, padding: "3px 10px", borderRadius: 6,
                          background: "#F8F7F4", color: "#6B6B6B", fontWeight: 500,
                        }}>
                          {ch.fact_count} Facts
                        </span>
                        <span style={{
                          fontSize: 12, padding: "3px 10px", borderRadius: 6,
                          background: "#F8F7F4", color: "#6B6B6B", fontWeight: 500,
                        }}>
                          {ch.site_count} Sites
                        </span>
                        <span style={{
                          fontSize: 12, padding: "3px 10px", borderRadius: 6,
                          background: "#F8F7F4", color: "#6B6B6B", fontWeight: 500,
                        }}>
                          {ch.pyq_count} PYQs
                        </span>
                      </div>
                      <div style={{ marginTop: 16, fontSize: 13, fontWeight: 600, color: "#C96B28" }}>
                        Study notes →
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          ))}

          {chapters.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No chapters found</p>
              <a href={`/courses/${subject}`} style={{ fontSize: 14, color: "#C96B28", textDecoration: "underline" }}>
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
