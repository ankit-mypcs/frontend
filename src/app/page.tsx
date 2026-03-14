/**
 * PURPOSE: mypcs.in homepage — hero, stats, problem, features, subjects, pricing, CTA
 * USED BY: App Router (/)
 * DEPENDS ON: api.ts, Nav.tsx, Footer.tsx
 */

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

/* ── Static content arrays ── */

const PROBLEMS = [
  { emoji: "💸", old: "₹50,000 – ₹1,00,000/year coaching", now: "₹999/year on mypcs.in", label: "Cost" },
  { emoji: "🚌", old: "Move to Allahabad, ₹5K/month hostel", now: "Study from your village", label: "Access" },
  { emoji: "📚", old: "10 books, no structure, no tracking", now: "Everything structured, one place", label: "Material" },
  { emoji: "🎯", old: "Read and forget, repeat", now: "Practice daily with real PYQs", label: "Method" },
];

const FEATURES = [
  { num: "01", title: "10,000+ PYQs Tagged by Chapter", desc: "30 years of UPPCS, IAS, BPSC, MPPCS questions. Every question tagged by subject, chapter, exam, year.", badge: "Free", accent: "#E07020" },
  { num: "02", title: "Chapter Notes with PYQ Links", desc: "Study notes from multiple sources. Every fact linked to the PYQs that tested it.", badge: "Premium", accent: "#000080" },
  { num: "03", title: "Smart Practice Engine", desc: "UPPCS marking (+2, -0.66). Tracks weak areas. Focuses revision where it matters.", badge: "Free", accent: "#046A38" },
  { num: "04", title: "Repeat Question Detector", desc: "37% of questions follow patterns. We flag concepts asked 2, 3, even 5 times.", badge: "Premium", accent: "#046A38" },
  { num: "05", title: "Performance Analytics", desc: "Accuracy by subject, chapter, topic. Weekly improvement. Weak area detection.", badge: "Free", accent: "#000080" },
  { num: "06", title: "Works on ₹6,000 Phones", desc: "Text-first. No heavy videos. Works on 2G/3G. Built for rural UP.", badge: "Free", accent: "#E07020" },
];

const SUBJECTS = [
  { id: 1, emoji: "⚖️", name: "Indian Polity", meta: "2,484 PYQs · 42 ch", live: true },
  { id: 2, emoji: "🏛️", name: "History", meta: "4,697 PYQs · 94 ch", live: true },
  { id: 3, emoji: "🌍", name: "Geography", meta: "3,492 PYQs · 72 ch", live: true },
  { id: 0, emoji: "💰", name: "Economy", meta: "Coming Soon", live: false },
  { id: 0, emoji: "🔬", name: "Science", meta: "Coming Soon", live: false },
  { id: 0, emoji: "🌱", name: "Environment", meta: "Coming Soon", live: false },
  { id: 0, emoji: "🏠", name: "UP Special", meta: "Coming Soon", live: false },
  { id: 0, emoji: "📰", name: "Current Affairs", meta: "Coming Soon", live: false },
];

const STEPS = [
  { n: "1", title: "Sign up with phone OTP", desc: "No email. No forms. Just your phone number.", hi: "सिर्फ़ phone number से शुरू करें", bg: "#E07020" },
  { n: "2", title: "Pick a subject, start practicing", desc: "Real PYQs from 30 years. Instant feedback with explanation.", hi: "रोज़ practice करें", bg: "#000080" },
  { n: "3", title: "Learn from every mistake", desc: "Wrong answer? Notes open. What coaching teaches for ₹50K — here for ₹999.", hi: "हर गलत जवाब से सीखो", bg: "#046A38" },
  { n: "4", title: "Track, improve, crack the exam", desc: "System knows your weak chapters. Streaks keep you consistent.", hi: "System बताएगा कहाँ focus करो", bg: "#000080" },
];

const FREE_LIST = ["3 questions / day", "2 subjects", "Streak tracking", "Basic stats"];
const PREMIUM_LIST = ["Unlimited questions", "All subjects", "Full PYQ Explorer", "Chapter Notes + PYQ links", "Repeat question detector", "Weakness targeting", "Full analytics"];

/* ── Page component ── */

export default async function Home() {
  /** Fetch live stats from Django API at build/request time. */
  let totalQuestions = 10673;
  let totalChapters = 208;
  let totalSubjects = 3;

  try {
    const stats = await api.getStats();
    totalQuestions = stats.total_questions;
    totalChapters = stats.total_chapters;
    totalSubjects = stats.total_subjects;
  } catch {
    /* Fallback to defaults if API is down */
  }

  return (
    <>
      <Nav />
      <main>
        {/* ── HERO ── */}
        <section
          className="relative py-16 md:py-24 px-4 text-center overflow-hidden"
          style={{ background: "#FAF8F5" }}
        >
          {/* Dot pattern background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(#E8E4DC 0.5px, transparent 0.5px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
              style={{
                background: "rgba(224,112,32,0.1)",
                border: "1px solid rgba(224,112,32,0.15)",
                color: "#E07020",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#0A8A4C" }}
              />
              UPPCS 2027 Preparation
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.08] mb-4">
              Your Pathway to<br />
              Civil Services for<br />
              <span style={{ color: "#E07020" }}>₹999</span>
              <span style={{ color: "#046A38" }}>/year</span>
            </h1>

            <p
              className="text-lg mb-6"
              style={{ color: "#7A7168", fontFamily: "'Noto Sans Devanagari',sans-serif" }}
            >
              सिर्फ़ एक smartphone, दो घंटे, और एक सपना — SDM बनना है
            </p>

            <p className="max-w-lg mx-auto mb-8 leading-relaxed" style={{ color: "#7A7168" }}>
              {totalQuestions.toLocaleString()}+ Previous Year Questions. Smart practice engine.
              Chapter notes linked to PYQs. Built for the student who has a phone and a dream.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/subjects"
                className="px-8 py-3.5 rounded-lg text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
                style={{ background: "#E07020" }}
              >
                Start Free Practice →
              </a>
              <a
                href="#features"
                className="px-8 py-3.5 rounded-lg text-base font-semibold border transition-colors"
                style={{ color: "#3D3730", borderColor: "#E8E4DC" }}
              >
                See How It Works
              </a>
            </div>

            <p className="mt-5 text-xs" style={{ color: "#B5AEA4" }}>
              <span className="font-bold" style={{ color: "#046A38" }}>✓</span> Free forever
              &nbsp;·&nbsp;
              <span className="font-bold" style={{ color: "#046A38" }}>✓</span> No card needed
              &nbsp;·&nbsp;
              <span className="font-bold" style={{ color: "#046A38" }}>✓</span> Works on 2G
            </p>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="border-y bg-white" style={{ borderColor: "#E8E4DC" }}>
          <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4">
            {[
              { val: totalQuestions.toLocaleString() + "+", lbl: "PYQ Questions" },
              { val: String(totalChapters), lbl: "Chapters" },
              { val: "30 yr", lbl: "PYQ Coverage" },
              { val: String(totalSubjects), lbl: "Subjects Live" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center py-6 border-r last:border-none"
                style={{ borderColor: "#E8E4DC" }}
              >
                <div
                  className="text-xl md:text-2xl font-black tracking-tight"
                  style={{ color: "#000080" }}
                >
                  {stat.val}
                </div>
                <div
                  className="text-[0.65rem] font-semibold uppercase tracking-wider mt-1"
                  style={{ color: "#B5AEA4" }}
                >
                  {stat.lbl}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROBLEM ── */}
        <section className="py-16 px-4 bg-white" id="problem">
          <div className="max-w-4xl mx-auto">
            <SectionLabel color="#E07020" text="The Problem" />
            <h2 className="text-2xl font-extrabold tracking-tight mb-1">
              Coaching costs ₹50,000. That&apos;s not fair.
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: "#7A7168", fontFamily: "'Noto Sans Devanagari',sans-serif" }}
            >
              बुंदेलखंड से पूर्वांचल तक — हर aspirant को बराबर का मौका।
            </p>
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-xl overflow-hidden border"
              style={{ background: "#E8E4DC", borderColor: "#E8E4DC" }}
            >
              {PROBLEMS.map((problem) => (
                <div
                  key={problem.label}
                  className="bg-white p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl mb-2">{problem.emoji}</div>
                  <div className="text-sm line-through" style={{ color: "#D4D0C8" }}>
                    {problem.old}
                  </div>
                  <div className="text-sm font-bold mt-1" style={{ color: "#046A38" }}>
                    → {problem.now}
                  </div>
                  <div
                    className="text-[0.65rem] font-bold uppercase tracking-wider mt-2"
                    style={{ color: "#B5AEA4" }}
                  >
                    {problem.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="py-16 px-4" id="features" style={{ background: "#FAF8F5" }}>
          <div className="max-w-4xl mx-auto">
            <SectionLabel color="#046A38" text="Features" />
            <h2 className="text-2xl font-extrabold tracking-tight mb-1">
              Everything a UPPCS aspirant needs.
            </h2>
            <p className="text-sm mb-8" style={{ color: "#7A7168" }}>
              No videos you&apos;ll never watch. Just structured practice on your phone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FEATURES.map((feature) => (
                <div
                  key={feature.num}
                  className="bg-white border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all relative overflow-hidden"
                  style={{ borderColor: "#E8E4DC" }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: feature.accent }}
                  />
                  <div
                    className="text-[0.6rem] font-black tracking-wider mb-3"
                    style={{ color: "#D4D0C8" }}
                  >
                    {feature.num}
                  </div>
                  <h3 className="font-extrabold text-sm mb-2">{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#7A7168" }}>
                    {feature.desc}
                  </p>
                  <span
                    className="inline-block mt-3 px-2.5 py-0.5 rounded text-[0.62rem] font-bold uppercase tracking-wider"
                    style={{
                      background:
                        feature.badge === "Premium"
                          ? "rgba(224,112,32,0.1)"
                          : "rgba(4,106,56,0.1)",
                      color: feature.badge === "Premium" ? "#E07020" : "#046A38",
                    }}
                  >
                    {feature.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SUBJECTS ── */}
        <section className="py-16 px-4 bg-white" id="subjects">
          <div className="max-w-4xl mx-auto">
            <SectionLabel color="#000080" text="Subjects" />
            <h2 className="text-2xl font-extrabold tracking-tight mb-8">
              3 subjects live. More every month.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SUBJECTS.map((subject) =>
                subject.live ? (
                  <a
                    key={subject.name}
                    href={"/practice?subject_id=" + subject.id + "&subject_name=" + encodeURIComponent(subject.name)}
                    className="border rounded-lg p-4 text-center transition-all hover:-translate-y-0.5"
                    style={{
                      borderColor: "#E8E4DC",
                      background: "#FAF8F5",
                    }}
                  >
                    <div className="text-2xl mb-2">{subject.emoji}</div>
                    <div className="font-bold text-sm">{subject.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#B5AEA4" }}>
                      {subject.meta}
                    </div>
                  </a>
                ) : (
                  <div
                    key={subject.name}
                    className="border rounded-lg p-4 text-center opacity-30 pointer-events-none"
                    style={{ borderColor: "#E8E4DC" }}
                  >
                    <div className="text-2xl mb-2">{subject.emoji}</div>
                    <div className="font-bold text-sm">{subject.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#B5AEA4" }}>
                      {subject.meta}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-16 px-4" style={{ background: "#FAF8F5" }}>
          <div className="max-w-4xl mx-auto">
            <SectionLabel color="#E07020" text="How It Works" />
            <h2 className="text-2xl font-extrabold tracking-tight mb-8">
              Start in 30 seconds. From anywhere in UP.
            </h2>
            <div className="max-w-lg">
              {STEPS.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-5 py-5 border-b last:border-none"
                  style={{ borderColor: "#E8E4DC" }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                    style={{ background: step.bg }}
                  >
                    {step.n}
                  </div>
                  <div>
                    <h3 className="font-bold text-[0.92rem]">{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#7A7168" }}>
                      {step.desc}
                    </p>
                    <p
                      className="text-sm mt-0.5"
                      style={{ color: "#B5AEA4", fontFamily: "'Noto Sans Devanagari',sans-serif" }}
                    >
                      {step.hi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="py-16 px-4 bg-white" id="pricing">
          <div className="max-w-4xl mx-auto">
            <SectionLabel color="#000080" text="Pricing" />
            <h2 className="text-2xl font-extrabold tracking-tight mb-1">
              Less than ₹3/day. No hidden fees.
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: "#7A7168", fontFamily: "'Noto Sans Devanagari',sans-serif" }}
            >
              ₹999 में पूरे साल — कोचिंग से 50 गुना सस्ता।
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
              {/* Free tier */}
              <div
                className="border rounded-xl p-8"
                style={{ borderColor: "#E8E4DC", background: "#FAF8F5" }}
              >
                <div
                  className="text-[0.62rem] font-extrabold uppercase tracking-widest mb-3"
                  style={{ color: "#B5AEA4" }}
                >
                  Free Forever
                </div>
                <div className="text-4xl font-black mb-1">₹0</div>
                <div className="text-xs mb-5" style={{ color: "#B5AEA4" }}>
                  No card needed
                </div>
                <ul className="space-y-2 text-sm mb-6" style={{ color: "#7A7168" }}>
                  {FREE_LIST.map((item) => (
                    <li key={item}>
                      <span className="font-bold mr-1" style={{ color: "#046A38" }}>✓</span>
                      {item}
                    </li>
                  ))}
                  {["Full PYQ explorer", "Chapter notes", "Mock tests"].map((item) => (
                    <li key={item} style={{ color: "#D4D0C8" }}>
                      <span className="font-bold mr-1">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 rounded-lg text-sm font-bold border"
                  style={{ borderColor: "#E8E4DC", color: "#3D3730" }}
                >
                  Start Free
                </button>
              </div>

              {/* Premium tier */}
              <div
                className="border-2 rounded-xl p-8 bg-white relative"
                style={{ borderColor: "#E07020" }}
              >
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[0.6rem] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider"
                  style={{ background: "#E07020" }}
                >
                  Most Popular
                </div>
                <div
                  className="text-[0.62rem] font-extrabold uppercase tracking-widest mb-3"
                  style={{ color: "#E07020" }}
                >
                  Premium
                </div>
                <div className="text-4xl font-black mb-1">
                  ₹999
                  <span className="text-lg font-medium" style={{ color: "#7A7168" }}>/year</span>
                </div>
                <div className="text-xs mb-5" style={{ color: "#B5AEA4" }}>
                  Early bird · Will be ₹1,499
                </div>
                <ul className="space-y-2 text-sm mb-6" style={{ color: "#7A7168" }}>
                  {PREMIUM_LIST.map((item) => (
                    <li key={item}>
                      <span className="font-bold mr-1" style={{ color: "#046A38" }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 rounded-lg text-sm font-bold text-white shadow-lg"
                  style={{ background: "#E07020" }}
                >
                  Get Premium — ₹999 →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section
          className="py-16 px-4 text-center text-white relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,#00003C 0%,#000080 50%,#0A0A60 100%)",
          }}
        >
          <div className="relative z-10 max-w-lg mx-auto">
            <h2 className="text-2xl font-extrabold mb-3">
              Ek smartphone. Do ghante. Ek sapna.
            </h2>
            {/* Tricolor divider */}
            <div className="flex justify-center gap-1 mb-4">
              <span className="w-6 h-0.5 rounded" style={{ background: "#E07020" }} />
              <span className="w-6 h-0.5 rounded bg-white/30" />
              <span className="w-6 h-0.5 rounded" style={{ background: "#0A8A4C" }} />
            </div>
            <p
              className="text-white/45 mb-6"
              style={{ fontFamily: "'Noto Sans Devanagari',sans-serif" }}
            >
              50 लाख students · ₹999/year · Rural India first
            </p>
            <button
              className="px-10 py-3.5 rounded-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
              style={{ background: "#E07020" }}
            >
              Start Your Pathway →
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ── Helper: Section label with colored accent bar ── */

function SectionLabel({ color, text }: { color: string; text: string }) {
  /** Consistent section header with colored bar + uppercase label. */
  return (
    <p
      className="text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 mb-2"
      style={{ color }}
    >
      <span className="w-4 h-0.5 rounded" style={{ background: color }} />
      {text}
    </p>
  );
}
