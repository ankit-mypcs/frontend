/**
 * PURPOSE: Chapter notes page — v12 design, facts/sites/timeline/glossary from Django API
 * ROUTE:   /courses/[subject]/[part]/[chapter]
 */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import type {
  ChapterDetail, Fact, SiteItem, TimelineEvent,
  GlossaryTerm, ExamIntelEntry, Exercise,
} from "@/lib/api";

const TABS = [
  { key: "facts", label: "Facts", icon: "📝" },
  { key: "sites", label: "Sites", icon: "📍" },
  { key: "timeline", label: "Timeline", icon: "⏳" },
  { key: "glossary", label: "Glossary", icon: "📖" },
  { key: "exam-intel", label: "Exam Intel", icon: "🎯" },
  { key: "exercises", label: "Exercises", icon: "✏️" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/* ── Shared styles ── */
const S = {
  card: {
    padding: 20, borderRadius: 12, background: "#FFFFFF",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
  } as React.CSSProperties,
  label: { fontSize: 13, color: "#A3A3A3" } as React.CSSProperties,
  serif: {
    fontFamily: "var(--font-serif), 'DM Serif Display', Georgia, serif",
    fontWeight: 400,
  } as React.CSSProperties,
  mono: {
    fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
  } as React.CSSProperties,
  saffron: "#C96B28",
  ink: "#171717",
  ink2: "#333333",
  ink3: "#6B6B6B",
  ink4: "#A3A3A3",
  cream: "#F8F7F4",
  creamDark: "#EDEAE4",
  surface: "#FFFFFF",
  saffronSoft: "#FDF5EE",
};

export default function ChapterNotesPage() {
  const params = useParams();
  const chapterSlug = params.chapter as string;
  const subject = params.subject as string;
  const part = params.part as string;

  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("facts");
  const [facts, setFacts] = useState<Fact[]>([]);
  const [sites, setSites] = useState<SiteItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [glossary, setGlossary] = useState<GlossaryTerm[]>([]);
  const [examIntel, setExamIntel] = useState<ExamIntelEntry[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!chapterSlug) return;
    setLoading(true);
    api.getChapterDetail(chapterSlug)
      .then((data) => { setChapter(data); setLoading(false); })
      .catch(() => { setError("Could not load chapter."); setLoading(false); });
  }, [chapterSlug]);

  useEffect(() => {
    if (!chapterSlug) return;
    setTabLoading(true);
    const loaders: Record<TabKey, () => Promise<void>> = {
      facts: async () => { if (!facts.length) setFacts(await api.getChapterFacts(chapterSlug)); },
      sites: async () => { if (!sites.length) setSites(await api.getChapterSites(chapterSlug)); },
      timeline: async () => { if (!timeline.length) setTimeline(await api.getChapterTimeline(chapterSlug)); },
      glossary: async () => { if (!glossary.length) setGlossary(await api.getChapterTerms(chapterSlug)); },
      "exam-intel": async () => { if (!examIntel.length) setExamIntel(await api.getChapterExamIntel(chapterSlug)); },
      exercises: async () => { if (!exercises.length) setExercises(await api.getChapterExercises(chapterSlug)); },
    };
    loaders[activeTab]().catch(() => {}).finally(() => setTabLoading(false));
  }, [activeTab, chapterSlug, facts.length, sites.length, timeline.length, glossary.length, examIntel.length, exercises.length]);

  if (loading) {
    return (
      <>
        <Nav />
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: S.cream }}>
          <p style={{ fontSize: 16, color: S.ink3 }}>Loading chapter...</p>
        </main>
      </>
    );
  }

  if (error || !chapter) {
    return (
      <>
        <Nav />
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: S.cream }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{error || "Chapter not found"}</p>
            <a href={`/courses/${subject}/${part}`} style={{ fontSize: 14, color: S.saffron, textDecoration: "underline" }}>
              ← Back to chapters
            </a>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main style={{ minHeight: "100vh", background: S.cream, color: S.ink }}>
        {/* Breadcrumb */}
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 24px 0" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: S.ink4 }}>
            <a href="/courses" style={{ color: S.saffron }}>Courses</a>
            <span style={{ margin: "0 6px" }}>→</span>
            <a href={`/courses/${subject}`} style={{ color: S.saffron }}>{chapter.subject_name}</a>
            <span style={{ margin: "0 6px" }}>→</span>
            <a href={`/courses/${subject}/${part}`} style={{ color: S.saffron }}>{chapter.part_name}</a>
            <span style={{ margin: "0 6px" }}>→</span>
            <span style={{ color: S.ink3 }}>{chapter.name}</span>
          </p>
        </div>

        {/* Chapter header */}
        <section style={{ padding: "24px 24px 24px", borderBottom: `1px solid ${S.creamDark}` }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <span style={{
                fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 6,
                background: S.saffronSoft, color: S.saffron, ...S.mono,
              }}>
                Ch. {chapter.chapter_number}
              </span>
              <span style={{ fontSize: 13, color: S.ink3 }}>{chapter.unit_name}</span>
            </div>
            <h1 style={{ ...S.serif, fontSize: "clamp(24px, 4vw, 36px)", color: S.ink }}>
              {chapter.name}
            </h1>
            {chapter.topics?.length > 0 && (
              <p style={{ fontSize: 14, color: S.ink3, marginTop: 6 }}>
                {chapter.topics.length} topics · {facts.length || "…"} facts
              </p>
            )}
          </div>
        </section>

        {/* Tab bar */}
        <section style={{
          borderBottom: `1px solid ${S.creamDark}`,
          position: "sticky", top: 59, zIndex: 10, background: S.cream,
        }}>
          <div style={{
            maxWidth: 1080, margin: "0 auto", padding: "0 24px",
            display: "flex", gap: 4, overflowX: "auto", paddingTop: 8, paddingBottom: 8,
          }}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 18px", borderRadius: 100,
                  fontSize: 14, fontWeight: 600, whiteSpace: "nowrap",
                  background: activeTab === tab.key ? S.saffron : "transparent",
                  color: activeTab === tab.key ? "#fff" : S.ink3,
                  border: "none", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Tab content */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 24px 96px" }}>
          {tabLoading ? (
            <p style={{ textAlign: "center", padding: "64px 0", color: S.ink3 }}>Loading...</p>
          ) : (
            <>
              {activeTab === "facts" && <FactsTab facts={facts} />}
              {activeTab === "sites" && <SitesTab sites={sites} />}
              {activeTab === "timeline" && <TimelineTab events={timeline} />}
              {activeTab === "glossary" && <GlossaryTab terms={glossary} />}
              {activeTab === "exam-intel" && <ExamIntelTab entries={examIntel} />}
              {activeTab === "exercises" && <ExercisesTab exercises={exercises} />}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ══════════════════════════════════════════ */
/*  TAB COMPONENTS                           */
/* ══════════════════════════════════════════ */

function FactsTab({ facts }: { facts: Fact[] }) {
  const byTopic: Record<string, Fact[]> = {};
  for (const f of facts) {
    const key = f.topic_name || "General";
    if (!byTopic[key]) byTopic[key] = [];
    byTopic[key].push(f);
  }
  if (!facts.length) return <Empty label="No facts available yet." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <p style={S.label}>{facts.length} facts across {Object.keys(byTopic).length} topics</p>
      {Object.entries(byTopic).map(([topic, topicFacts]) => (
        <div key={topic}>
          <h3 style={{
            ...S.serif, fontSize: 18, marginBottom: 16,
            paddingBottom: 8, borderBottom: `1px solid ${S.creamDark}`,
          }}>
            {topic}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topicFacts.map((f) => (
              <div key={f.id} style={S.card}>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: S.ink2 }}>{f.text}</p>
                <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: S.ink4 }}>
                  {f.sub_topic_name && <span>{f.sub_topic_name}</span>}
                  <span>{f.citation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SitesTab({ sites }: { sites: SiteItem[] }) {
  if (!sites.length) return <Empty label="No sites available yet." />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={S.label}>{sites.length} archaeological sites</p>
      {sites.map((s) => (
        <div key={s.id} style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 4 }}>
            <h4 style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</h4>
            {s.period && (
              <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 6, background: S.saffronSoft, color: S.ink3 }}>
                {s.period}
              </span>
            )}
          </div>
          {s.state_region && <p style={{ fontSize: 12, color: S.saffron, marginBottom: 4 }}>{s.state_region}</p>}
          <p style={{ fontSize: 14, lineHeight: 1.7, color: S.ink2 }}>{s.key_findings}</p>
          <p style={{ fontSize: 12, marginTop: 8, color: S.ink4 }}>{s.citation}</p>
        </div>
      ))}
    </div>
  );
}

function TimelineTab({ events }: { events: TimelineEvent[] }) {
  if (!events.length) return <Empty label="No timeline events available yet." />;
  return (
    <div>
      <p style={{ ...S.label, marginBottom: 24 }}>{events.length} key dates and events</p>
      <div style={{ position: "relative", paddingLeft: 24, borderLeft: `2px solid ${S.saffron}` }}>
        {events.map((e) => (
          <div key={e.id} style={{ marginBottom: 28, position: "relative" }}>
            <span style={{
              position: "absolute", left: -33, width: 16, height: 16, borderRadius: "50%",
              border: `2px solid ${S.saffron}`, background: S.cream,
            }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: S.saffron, ...S.mono }}>{e.date_text}</span>
            <p style={{ fontSize: 14, marginTop: 4, color: S.ink2, lineHeight: 1.6 }}>{e.event}</p>
            <p style={{ fontSize: 12, marginTop: 4, color: S.ink4 }}>{e.citation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GlossaryTab({ terms }: { terms: GlossaryTerm[] }) {
  if (!terms.length) return <Empty label="No glossary terms available yet." />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={S.label}>{terms.length} key terms</p>
      {terms.map((t) => (
        <div key={t.id} style={S.card}>
          <h4 style={{ ...S.serif, fontSize: 17, marginBottom: 4 }}>{t.term}</h4>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: S.ink2 }}>{t.definition}</p>
          <p style={{ fontSize: 12, marginTop: 8, color: S.ink4 }}>{t.citation}</p>
        </div>
      ))}
    </div>
  );
}

function ExamIntelTab({ entries }: { entries: ExamIntelEntry[] }) {
  if (!entries.length) return <Empty label="No exam intel available yet." />;
  const byCategory: Record<string, ExamIntelEntry[]> = {};
  for (const e of entries) {
    const key = e.category || "General";
    if (!byCategory[key]) byCategory[key] = [];
    byCategory[key].push(e);
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <p style={S.label}>{entries.length} exam insights</p>
      {Object.entries(byCategory).map(([cat, items]) => (
        <div key={cat}>
          <h3 style={{
            fontSize: 13, fontWeight: 700, textTransform: "uppercase" as const,
            letterSpacing: "0.06em", color: S.ink3, marginBottom: 16,
            paddingBottom: 8, borderBottom: `1px solid ${S.creamDark}`,
          }}>
            {cat}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((e) => (
              <div key={e.id} style={S.card}>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: S.ink2 }}>{e.detail}</p>
                <p style={{ fontSize: 12, marginTop: 8, color: S.ink4 }}>{e.topic_name} · {e.citation}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExercisesTab({ exercises }: { exercises: Exercise[] }) {
  if (!exercises.length) return <Empty label="No exercises available yet." />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={S.label}>{exercises.length} practice exercises</p>
      {exercises.map((e, i) => (
        <div key={e.id} style={S.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{
              fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 6,
              background: S.saffronSoft, color: S.saffron,
            }}>
              {e.exercise_type || `Q${i + 1}`}
            </span>
            {e.topic_name && <span style={{ fontSize: 12, color: S.ink3 }}>{e.topic_name}</span>}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: S.ink2 }}>{e.question}</p>
          <p style={{ fontSize: 12, marginTop: 8, color: S.ink4 }}>{e.source}</p>
        </div>
      ))}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <p style={{ fontSize: 14, color: S.ink3 }}>{label}</p>
    </div>
  );
}
