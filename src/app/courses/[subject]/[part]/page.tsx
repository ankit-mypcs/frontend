/**
 * PURPOSE: Part detail — chapters grouped by unit (v12 design exact match)
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
      <main style={{ minHeight: "100vh", background: "#F8F7F4", color: "#333" }}>
        {/* Breadcrumb */}
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 24px 0" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#A3A3A3" }}>
            <a href="/courses" style={{ color: "#C96B28", textDecoration: "none" }}>Courses</a>
            <span style={{ margin: "0 8px", color: "#A3A3A3" }}>→</span>
            <a href={`/courses/${subject}`} style={{ color: "#C96B28", textDecoration: "none" }}>{subjectName}</a>
            <span style={{ margin: "0 8px", color: "#A3A3A3" }}>→</span>
            {partName}
          </p>
        </div>

        {/* Header — v12 editorial */}
        <section style={{ padding: "96px 24px 48px", textAlign: "center" }}>
          <p style={{
            fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const,
            letterSpacing: "0.16em", color: "#C96B28", marginBottom: 48,
          }}>
            {subjectName}
          </p>
          <h1 style={{
            fontFamily: "var(--font-serif, 'DM Serif Display', Georgia, serif)",
            fontSize: "clamp(34px, 7vw, 68px)", fontWeight: 400,
            lineHeight: 1.1, color: "#171717", letterSpacing: "-0.02em",
            marginBottom: 24, maxWidth: 780, marginLeft: "auto", marginRight: "auto",
          }}>
            {partName}
          </h1>
          <p style={{
            fontSize: "clamp(17px, 2.5vw, 21px)", color: "#333",
            maxWidth: 600, margin: "0 auto", lineHeight: 1.65,
          }}>
            {chapters.length} chapters across {Object.keys(byUnit).length} unit{Object.keys(byUnit).length !== 1 ? "s" : ""}
          </p>
        </section>

        {/* Chapters by unit */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px 96px" }}>
          {Object.entries(byUnit).map(([unitName, unitChapters]) => (
            <div key={unitName} style={{ marginBottom: 48 }}>
              <h2 style={{
                fontSize: 13, fontWeight: 700, textTransform: "uppercase" as const,
                letterSpacing: "0.1em", color: "#6B6B6B", marginBottom: 24,
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
                        display: "block", padding: 28, borderRadius: 20,
                        background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                        transition: "all 0.2s", textDecoration: "none", color: "inherit",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                        <span style={{
                          width: 40, height: 40, borderRadius: 12,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, fontWeight: 700,
                          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                          background: "#FDF5EE", color: "#C96B28",
                        }}>
                          {ch.chapter_number}
                        </span>
                        <h3 style={{
                          fontFamily: "var(--font-serif, 'DM Serif Display', Georgia, serif)",
                          fontSize: 22, fontWeight: 400, color: "#171717",
                        }}>
                          {ch.name}
                        </h3>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                        <span style={{
                          fontSize: 12, padding: "4px 12px", borderRadius: 8,
                          background: "#F8F7F4", color: "#6B6B6B", fontWeight: 500,
                        }}>
                          {ch.fact_count} Facts
                        </span>
                        <span style={{
                          fontSize: 12, padding: "4px 12px", borderRadius: 8,
                          background: "#F8F7F4", color: "#6B6B6B", fontWeight: 500,
                        }}>
                          {ch.site_count} Sites
                        </span>
                        <span style={{
                          fontSize: 12, padding: "4px 12px", borderRadius: 8,
                          background: "#F8F7F4", color: "#6B6B6B", fontWeight: 500,
                        }}>
                          {ch.pyq_count} PYQs
                        </span>
                      </div>
                      <div style={{ marginTop: 20, fontSize: 13, fontWeight: 600, color: "#C96B28" }}>
                        Study notes →
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          ))}

          {chapters.length === 0 && (
            <div style={{ textAlign: "center", padding: "96px 0" }}>
              <p style={{
                fontFamily: "var(--font-serif, 'DM Serif Display', Georgia, serif)",
                fontSize: 22, fontWeight: 400, marginBottom: 12, color: "#171717",
              }}>
                No chapters found
              </p>
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
