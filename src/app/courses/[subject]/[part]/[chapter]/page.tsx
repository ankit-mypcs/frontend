/**
 * PURPOSE: Chapter notes page — facts, sites, timeline, glossary fetched from Django API
 * ROUTE:   /courses/[subject]/[part]/[chapter]  (e.g., /courses/history/ancient-india/stone-age)
 * DEPENDS: api.ts, Nav.tsx, Footer.tsx
 *
 * This is the deepest level of the drill-down: Courses → Subject → Part → Chapter → Notes
 * Shows all content tabs: Facts (default), Sites, Timeline, Glossary, Exam Intel, Exercises
 */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import type {
  ChapterDetail,
  Fact,
  SiteItem,
  TimelineEvent,
  GlossaryTerm,
  ExamIntelEntry,
  Exercise,
} from "@/lib/api";

/* ── Tab definitions ── */
const TABS = [
  { key: "facts", label: "Facts", icon: "📝" },
  { key: "sites", label: "Sites", icon: "📍" },
  { key: "timeline", label: "Timeline", icon: "⏳" },
  { key: "glossary", label: "Glossary", icon: "📖" },
  { key: "exam-intel", label: "Exam Intel", icon: "🎯" },
  { key: "exercises", label: "Exercises", icon: "✏️" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

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

  /* Load chapter detail on mount */
  useEffect(() => {
    if (!chapterSlug) return;
    setLoading(true);
    api
      .getChapterDetail(chapterSlug)
      .then((data) => {
        setChapter(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load chapter details.");
        setLoading(false);
      });
  }, [chapterSlug]);

  /* Load tab content when active tab changes */
  useEffect(() => {
    if (!chapterSlug) return;
    setTabLoading(true);

    const loaders: Record<TabKey, () => Promise<void>> = {
      facts: async () => {
        if (facts.length > 0) return;
        const data = await api.getChapterFacts(chapterSlug);
        setFacts(data);
      },
      sites: async () => {
        if (sites.length > 0) return;
        const data = await api.getChapterSites(chapterSlug);
        setSites(data);
      },
      timeline: async () => {
        if (timeline.length > 0) return;
        const data = await api.getChapterTimeline(chapterSlug);
        setTimeline(data);
      },
      glossary: async () => {
        if (glossary.length > 0) return;
        const data = await api.getChapterTerms(chapterSlug);
        setGlossary(data);
      },
      "exam-intel": async () => {
        if (examIntel.length > 0) return;
        const data = await api.getChapterExamIntel(chapterSlug);
        setExamIntel(data);
      },
      exercises: async () => {
        if (exercises.length > 0) return;
        const data = await api.getChapterExercises(chapterSlug);
        setExercises(data);
      },
    };

    loaders[activeTab]()
      .catch(() => {})
      .finally(() => setTabLoading(false));
  }, [activeTab, chapterSlug, facts.length, sites.length, timeline.length, glossary.length, examIntel.length, exercises.length]);

  if (loading) {
    return (
      <>
        <Nav />
        <main className="min-h-screen flex items-center justify-center" style={{ background: "#FAF8F5", color: "#1A1A1A" }}>
          <p className="text-lg" style={{ color: "#7A7168" }}>Loading chapter...</p>
        </main>
      </>
    );
  }

  if (error || !chapter) {
    return (
      <>
        <Nav />
        <main className="min-h-screen flex items-center justify-center" style={{ background: "#FAF8F5", color: "#1A1A1A" }}>
          <div className="text-center">
            <p className="text-lg font-bold mb-2">{error || "Chapter not found"}</p>
            <a href={`/courses/${subject}/${part}`} className="text-sm underline" style={{ color: "#E07020" }}>
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
      <main className="min-h-screen" style={{ background: "#FAF8F5", color: "#1A1A1A" }}>
        {/* ── Breadcrumb ── */}
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <p className="text-xs font-semibold" style={{ color: "#B5AEA4" }}>
            <a href="/courses" className="hover:underline" style={{ color: "#E07020" }}>Courses</a>
            <span className="mx-1">→</span>
            <a href={`/courses/${subject}`} className="hover:underline" style={{ color: "#E07020" }}>{chapter.subject_name}</a>
            <span className="mx-1">→</span>
            <a href={`/courses/${subject}/${part}`} className="hover:underline" style={{ color: "#E07020" }}>{chapter.part_name}</a>
            <span className="mx-1">→</span>
            {chapter.name}
          </p>
        </div>

        {/* ── Chapter header ── */}
        <section className="py-6 px-4 border-b" style={{ borderColor: "#E8E4DC" }}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded"
                style={{ background: "rgba(224,112,32,0.1)", color: "#E07020" }}
              >
                Ch. {chapter.chapter_number}
              </span>
              <span className="text-xs" style={{ color: "#7A7168" }}>
                {chapter.unit_name}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              {chapter.name}
            </h1>
            {chapter.topics && chapter.topics.length > 0 && (
              <p className="text-sm mt-2" style={{ color: "#7A7168" }}>
                {chapter.topics.length} topics · {facts.length || "..."} facts
              </p>
            )}
          </div>
        </section>

        {/* ── Tab bar ── */}
        <section className="border-b sticky top-0 z-10" style={{ borderColor: "#E8E4DC", background: "#FAF8F5" }}>
          <div className="max-w-4xl mx-auto px-4 flex gap-1 overflow-x-auto py-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  background: activeTab === tab.key ? "#E07020" : "transparent",
                  color: activeTab === tab.key ? "white" : "#7A7168",
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Tab content ── */}
        <section className="max-w-4xl mx-auto px-4 py-8">
          {tabLoading ? (
            <p className="text-center py-12" style={{ color: "#7A7168" }}>Loading...</p>
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

/* ══════════════════════════════════════════
   TAB COMPONENTS
   ══════════════════════════════════════════ */

function FactsTab({ facts }: { facts: Fact[] }) {
  const byTopic: Record<string, Fact[]> = {};
  for (const f of facts) {
    const key = f.topic_name || "General";
    if (!byTopic[key]) byTopic[key] = [];
    byTopic[key].push(f);
  }

  if (facts.length === 0) return <EmptyState label="No facts available yet." />;

  return (
    <div className="space-y-8">
      <p className="text-sm" style={{ color: "#7A7168" }}>
        {facts.length} facts across {Object.keys(byTopic).length} topics
      </p>
      {Object.entries(byTopic).map(([topic, topicFacts]) => (
        <div key={topic}>
          <h3 className="font-bold text-base mb-3 pb-1 border-b" style={{ borderColor: "#E8E4DC" }}>
            {topic}
          </h3>
          <div className="space-y-2">
            {topicFacts.map((f) => (
              <div
                key={f.id}
                className="rounded-lg p-4 text-sm leading-relaxed"
                style={{ background: "white", border: "1px solid #E8E4DC" }}
              >
                <p>{f.text}</p>
                <div className="flex gap-3 mt-2 text-xs" style={{ color: "#B5AEA4" }}>
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
  if (sites.length === 0) return <EmptyState label="No sites available yet." />;
  return (
    <div className="space-y-3">
      <p className="text-sm mb-4" style={{ color: "#7A7168" }}>{sites.length} archaeological sites</p>
      {sites.map((s) => (
        <div key={s.id} className="rounded-lg p-4" style={{ background: "white", border: "1px solid #E8E4DC" }}>
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-bold">{s.name}</h4>
            {s.period && (
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#F5F0E8", color: "#7A7168" }}>
                {s.period}
              </span>
            )}
          </div>
          {s.state_region && <p className="text-xs mb-1" style={{ color: "#E07020" }}>{s.state_region}</p>}
          <p className="text-sm leading-relaxed" style={{ color: "#4A4A4A" }}>{s.key_findings}</p>
          <p className="text-xs mt-2" style={{ color: "#B5AEA4" }}>{s.citation}</p>
        </div>
      ))}
    </div>
  );
}

function TimelineTab({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) return <EmptyState label="No timeline events available yet." />;
  return (
    <div>
      <p className="text-sm mb-6" style={{ color: "#7A7168" }}>{events.length} key dates and events</p>
      <div className="relative pl-6 border-l-2" style={{ borderColor: "#E07020" }}>
        {events.map((e) => (
          <div key={e.id} className="mb-6 relative">
            <span className="absolute -left-[33px] w-4 h-4 rounded-full border-2" style={{ background: "#FAF8F5", borderColor: "#E07020" }} />
            <span className="text-xs font-bold" style={{ color: "#E07020" }}>{e.date_text}</span>
            <p className="text-sm mt-1">{e.event}</p>
            <p className="text-xs mt-1" style={{ color: "#B5AEA4" }}>{e.citation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GlossaryTab({ terms }: { terms: GlossaryTerm[] }) {
  if (terms.length === 0) return <EmptyState label="No glossary terms available yet." />;
  return (
    <div className="space-y-3">
      <p className="text-sm mb-4" style={{ color: "#7A7168" }}>{terms.length} key terms</p>
      {terms.map((t) => (
        <div key={t.id} className="rounded-lg p-4" style={{ background: "white", border: "1px solid #E8E4DC" }}>
          <h4 className="font-bold text-base mb-1">{t.term}</h4>
          <p className="text-sm leading-relaxed" style={{ color: "#4A4A4A" }}>{t.definition}</p>
          <p className="text-xs mt-2" style={{ color: "#B5AEA4" }}>{t.citation}</p>
        </div>
      ))}
    </div>
  );
}

function ExamIntelTab({ entries }: { entries: ExamIntelEntry[] }) {
  if (entries.length === 0) return <EmptyState label="No exam intel available yet." />;
  const byCategory: Record<string, ExamIntelEntry[]> = {};
  for (const e of entries) {
    const key = e.category || "General";
    if (!byCategory[key]) byCategory[key] = [];
    byCategory[key].push(e);
  }
  return (
    <div className="space-y-6">
      <p className="text-sm" style={{ color: "#7A7168" }}>{entries.length} exam insights</p>
      {Object.entries(byCategory).map(([cat, items]) => (
        <div key={cat}>
          <h3 className="font-bold text-sm uppercase tracking-wide mb-3 pb-1 border-b" style={{ borderColor: "#E8E4DC", color: "#7A7168" }}>{cat}</h3>
          <div className="space-y-2">
            {items.map((e) => (
              <div key={e.id} className="rounded-lg p-4 text-sm" style={{ background: "white", border: "1px solid #E8E4DC" }}>
                <p>{e.detail}</p>
                <p className="text-xs mt-2" style={{ color: "#B5AEA4" }}>{e.topic_name} · {e.citation}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExercisesTab({ exercises }: { exercises: Exercise[] }) {
  if (exercises.length === 0) return <EmptyState label="No exercises available yet." />;
  return (
    <div className="space-y-3">
      <p className="text-sm mb-4" style={{ color: "#7A7168" }}>{exercises.length} practice exercises</p>
      {exercises.map((e, i) => (
        <div key={e.id} className="rounded-lg p-4" style={{ background: "white", border: "1px solid #E8E4DC" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "rgba(224,112,32,0.1)", color: "#E07020" }}>
              {e.exercise_type || `Q${i + 1}`}
            </span>
            {e.topic_name && <span className="text-xs" style={{ color: "#7A7168" }}>{e.topic_name}</span>}
          </div>
          <p className="text-sm leading-relaxed">{e.question}</p>
          <p className="text-xs mt-2" style={{ color: "#B5AEA4" }}>{e.source}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-sm" style={{ color: "#7A7168" }}>{label}</p>
    </div>
  );
}
