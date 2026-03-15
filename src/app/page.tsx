/**
 * PURPOSE: mypcs.in v7 homepage — dark theme, saffron accent, bento grid, scroll reveals
 * USED BY: App Router (/)
 * DEPENDS ON: homepage.module.css, api.ts
 * DESIGN: Dark #0A0A0F, saffron #E07A2F, Satoshi + JetBrains Mono
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import s from "./homepage.module.css";

/* ── Static content arrays ── */

const PROBLEMS = [
  { emoji: "💸", old: "₹50,000 – ₹1,00,000/year coaching", now: "₹999/year on mypcs.in", label: "Cost" },
  { emoji: "🚌", old: "Move to Allahabad, ₹5K/month hostel", now: "Study from your village", label: "Access" },
  { emoji: "📚", old: "10 books, no structure, no tracking", now: "Everything structured, one place", label: "Material" },
  { emoji: "🎯", old: "Read and forget, repeat", now: "Practice daily with real PYQs", label: "Method" },
];

const FEATURES = [
  { num: "01", title: "10,000+ PYQs Tagged by Chapter", desc: "30 years of UPPCS, IAS, BPSC, MPPCS questions. Every question tagged by subject, chapter, exam, year.", badge: "Free" },
  { num: "02", title: "Chapter Notes with PYQ Links", desc: "Study notes from multiple sources. Every fact linked to the PYQs that tested it.", badge: "Premium" },
  { num: "03", title: "Smart Practice Engine", desc: "UPPCS marking (+2, -0.66). Tracks weak areas. Focuses revision where it matters.", badge: "Free" },
  { num: "04", title: "Repeat Question Detector", desc: "37% of questions follow patterns. We flag concepts asked 2, 3, even 5 times.", badge: "Premium" },
  { num: "05", title: "Performance Analytics", desc: "Accuracy by subject, chapter, topic. Weekly improvement. Weak area detection.", badge: "Free" },
  { num: "06", title: "Works on ₹6,000 Phones", desc: "Text-first. No heavy videos. Works on 2G/3G. Built for rural UP.", badge: "Free" },
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
  { n: "1", title: "Sign up with phone OTP", desc: "No email. No forms. Just your phone number.", hi: "सिर्फ़ phone number से शुरू करें", bg: "#E07A2F" },
  { n: "2", title: "Pick a subject, start practicing", desc: "Real PYQs from 30 years. Instant feedback with explanation.", hi: "रोज़ practice करें", bg: "#E07A2F" },
  { n: "3", title: "Learn from every mistake", desc: "Wrong answer? Notes open. What coaching teaches for ₹50K — here for ₹999.", hi: "हर गलत जवाब से सीखो", bg: "#E07A2F" },
  { n: "4", title: "Track, improve, crack the exam", desc: "System knows your weak chapters. Streaks keep you consistent.", hi: "System बताएगा कहाँ focus करो", bg: "#E07A2F" },
];

const FREE_LIST = ["3 questions / day", "2 subjects", "Streak tracking", "Basic stats"];
const PREMIUM_LIST = ["Unlimited questions", "All subjects", "Full PYQ Explorer", "Chapter Notes + PYQ links", "Repeat question detector", "Weakness targeting", "Full analytics"];

const FOOTER_COLUMNS = [
  { title: "Product", links: ["Practice", "PYQ Explorer", "Chapter Notes", "Mock Tests"] },
  { title: "Subjects", links: ["Indian Polity", "History", "Geography", "More Coming"] },
  { title: "Connect", links: ["About Us", "Telegram", "Contact", "Privacy"] },
];

/* ── Scroll reveal hook ── */

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, className: `${s.reveal} ${visible ? s.revealVisible : ""}` };
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const r = useReveal();
  return <div ref={r.ref} className={`${r.className} ${className}`}>{children}</div>;
}

/* ── Section label helper ── */

function SectionLabel({ text }: { text: string }) {
  return (
    <p className={s.sectionLabel}>
      <span className={s.sectionLabelBar} />
      {text}
    </p>
  );
}

/* ── Page component ── */

export default function Home() {
  const [totalQuestions, setTotalQuestions] = useState(10673);
  const [totalChapters, setTotalChapters] = useState(208);
  const [totalSubjects, setTotalSubjects] = useState(3);

  useEffect(() => {
    api.getStats().then((stats) => {
      setTotalQuestions(stats.total_questions);
      setTotalChapters(stats.total_chapters);
      setTotalSubjects(stats.total_subjects);
    }).catch(() => { /* fallback to defaults */ });
  }, []);

  return (
    <>
      {/* ── TRICOLOR STRIPE ── */}
      <div className={s.tricolorStripe} />

      {/* ── NAV ── */}
      <nav className={s.nav}>
        <div className={s.navInner}>
          <a href="/" className={s.logo}>
            mypcs<span className={s.logoDot}>.</span>in
          </a>
          <div className={s.navLinks}>
            {["Features", "Subjects", "Pricing"].map((item) => (
              <a key={item} href={"#" + item.toLowerCase()} className={s.navLink}>
                {item}
              </a>
            ))}
          </div>
          <div className={s.navActions}>
            <button className={s.btnLogin}>Log In</button>
            <a href="/subjects" className={s.btnStart}>Start Free &rarr;</a>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ── */}
        <section className={s.hero}>
          <div className={s.heroMesh} />
          <div className={s.heroGrid} />
          <div className={s.heroContent}>
            <div className={s.heroBadge}>
              <span className={s.liveDot} />
              UPPCS 2027 Preparation
            </div>

            <h1 className={s.heroTitle}>
              Your Pathway to<br />
              Civil Services for<br />
              <span className={s.heroPrice}>₹999</span>
              <span className={s.heroYear}>/year</span>
            </h1>

            <p className={s.heroTagline}>
              सिर्फ़ एक smartphone, दो घंटे, और एक सपना — SDM बनना है
            </p>

            <p className={s.heroDesc}>
              {totalQuestions.toLocaleString()}+ Previous Year Questions. Smart practice engine.
              Chapter notes linked to PYQs. Built for the student who has a phone and a dream.
            </p>

            <div className={s.heroCtas}>
              <a href="/subjects" className={s.ctaPrimary}>
                Start Free Practice &rarr;
              </a>
              <a href="#features" className={s.ctaSecondary}>
                See How It Works
              </a>
            </div>

            <div className={s.heroTrust}>
              <span><span className={s.trustCheck}>&#10003;</span> Free forever</span>
              <span><span className={s.trustCheck}>&#10003;</span> No card needed</span>
              <span><span className={s.trustCheck}>&#10003;</span> Works on 2G</span>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className={s.statsBar}>
          <div className={s.statsGrid}>
            {[
              { val: totalQuestions.toLocaleString() + "+", lbl: "PYQ Questions" },
              { val: String(totalChapters), lbl: "Chapters" },
              { val: "30 yr", lbl: "PYQ Coverage" },
              { val: String(totalSubjects), lbl: "Subjects Live" },
            ].map((stat, i) => (
              <div key={i} className={s.statItem}>
                <div className={s.statValue}>{stat.val}</div>
                <div className={s.statLabel}>{stat.lbl}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROBLEM ── */}
        <Reveal>
          <section className={`${s.section} ${s.bgDefault}`} id="problem">
            <div className={s.sectionInner}>
              <SectionLabel text="The Problem" />
              <h2 className={s.sectionTitle}>
                Coaching costs ₹50,000. That&apos;s not fair.
              </h2>
              <p className={`${s.sectionSub} ${s.sectionSubHi}`}>
                बुंदेलखंड से पूर्वांचल तक — हर aspirant को बराबर का मौका।
              </p>
              <div className={s.problemGrid}>
                {PROBLEMS.map((p) => (
                  <div key={p.label} className={s.problemCard}>
                    <div className={s.problemEmoji}>{p.emoji}</div>
                    <div className={s.problemOld}>{p.old}</div>
                    <div className={s.problemNew}>&rarr; {p.now}</div>
                    <div className={s.problemLabel}>{p.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── FEATURES (Bento Grid) ── */}
        <Reveal>
          <section className={`${s.section} ${s.bgSurface}`} id="features">
            <div className={s.sectionInner}>
              <SectionLabel text="Features" />
              <h2 className={s.sectionTitle}>
                Everything a UPPCS aspirant needs.
              </h2>
              <p className={s.sectionSub}>
                No videos you&apos;ll never watch. Just structured practice on your phone.
              </p>
              <div className={s.bentoGrid}>
                {FEATURES.map((f) => (
                  <div key={f.num} className={s.bentoCard}>
                    <div className={s.bentoAccent} />
                    <div className={s.bentoNum}>{f.num}</div>
                    <h3 className={s.bentoTitle}>{f.title}</h3>
                    <p className={s.bentoDesc}>{f.desc}</p>
                    <span className={`${s.bentoBadge} ${f.badge === "Premium" ? s.badgePremium : s.badgeFree}`}>
                      {f.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── SUBJECTS ── */}
        <Reveal>
          <section className={`${s.section} ${s.bgDefault}`} id="subjects">
            <div className={s.sectionInner}>
              <SectionLabel text="Subjects" />
              <h2 className={s.sectionTitle}>
                3 subjects live. More every month.
              </h2>
              <p className={s.sectionSub}>&nbsp;</p>
              <div className={s.subjectsGrid}>
                {SUBJECTS.map((sub) =>
                  sub.live ? (
                    <a
                      key={sub.name}
                      href={"/practice?subject_id=" + sub.id + "&subject_name=" + encodeURIComponent(sub.name)}
                      className={s.subjectCard}
                    >
                      <div className={s.subjectEmoji}>{sub.emoji}</div>
                      <div className={s.subjectName}>{sub.name}</div>
                      <div className={s.subjectMeta}>{sub.meta}</div>
                    </a>
                  ) : (
                    <div key={sub.name} className={s.subjectCardDisabled}>
                      <div className={s.subjectEmoji}>{sub.emoji}</div>
                      <div className={s.subjectName}>{sub.name}</div>
                      <div className={s.subjectMeta}>{sub.meta}</div>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── HOW IT WORKS ── */}
        <Reveal>
          <section className={`${s.section} ${s.bgSurface}`}>
            <div className={s.sectionInner}>
              <SectionLabel text="How It Works" />
              <h2 className={s.sectionTitle}>
                Start in 30 seconds. From anywhere in UP.
              </h2>
              <p className={s.sectionSub}>&nbsp;</p>
              <div className={s.stepsContainer}>
                {STEPS.map((step, i) => (
                  <div key={i} className={s.stepRow}>
                    <div className={s.stepCircle} style={{ background: step.bg }}>
                      {step.n}
                    </div>
                    <div>
                      <h3 className={s.stepTitle}>{step.title}</h3>
                      <p className={s.stepDesc}>{step.desc}</p>
                      <p className={s.stepHi}>{step.hi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── PRICING ── */}
        <Reveal>
          <section className={`${s.section} ${s.bgDefault}`} id="pricing">
            <div className={s.sectionInner}>
              <SectionLabel text="Pricing" />
              <h2 className={s.sectionTitle}>
                Less than ₹3/day. No hidden fees.
              </h2>
              <p className={`${s.sectionSub} ${s.sectionSubHi}`}>
                ₹999 में पूरे साल — कोचिंग से 50 गुना सस्ता।
              </p>
              <div className={s.pricingGrid}>
                {/* Free */}
                <div className={s.pricingFree}>
                  <div className={s.pricingTier}>Free Forever</div>
                  <div className={s.pricingAmount}>₹0</div>
                  <div className={s.pricingNote}>No card needed</div>
                  <ul className={s.pricingList}>
                    {FREE_LIST.map((item) => (
                      <li key={item} className={s.pricingListItem}>
                        <span className={s.checkGreen}>&#10003;</span> {item}
                      </li>
                    ))}
                    {["Full PYQ explorer", "Chapter notes", "Mock tests"].map((item) => (
                      <li key={item} className={s.pricingListItem} style={{ color: "var(--text-4)" }}>
                        <span className={s.crossDim}>&#10005;</span> {item}
                      </li>
                    ))}
                  </ul>
                  <button className={s.pricingBtnOutline}>Start Free</button>
                </div>

                {/* Premium */}
                <div className={s.pricingPremium}>
                  <div className={s.pricingBadge}>Most Popular</div>
                  <div className={`${s.pricingTier} ${s.pricingTierSaffron}`}>Premium</div>
                  <div className={s.pricingAmount}>
                    ₹999<span className={s.pricingPeriod}>/year</span>
                  </div>
                  <div className={s.pricingNote}>Early bird &middot; Will be ₹1,499</div>
                  <ul className={s.pricingList}>
                    {PREMIUM_LIST.map((item) => (
                      <li key={item} className={s.pricingListItem}>
                        <span className={s.checkGreen}>&#10003;</span> {item}
                      </li>
                    ))}
                  </ul>
                  <button className={s.pricingBtnSaffron}>Get Premium — ₹999 &rarr;</button>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── FINAL CTA ── */}
        <section className={s.ctaSection}>
          <div className={s.ctaDivider} />
          <h2 className={s.ctaTitle}>Ek smartphone. Do ghante. Ek sapna.</h2>
          <p className={s.ctaSub}>50 लाख students &middot; ₹999/year &middot; Rural India first</p>
          <a href="/subjects" className={s.ctaPrimary}>
            Start Your Pathway &rarr;
          </a>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className={s.footer}>
        <div className={s.footerGrid}>
          <div>
            <div className={s.footerBrand}>
              mypcs<span style={{ color: "var(--saffron)" }}>.</span>in
            </div>
            <p className={s.footerBrandDesc}>
              My Pathway to Civil Services. Built in Nagpur for rural India.
            </p>
            <div className={s.footerTricolor} />
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <div className={s.footerColTitle}>{col.title}</div>
              {col.links.map((link) => (
                <a key={link} href="#" className={s.footerLink}>{link}</a>
              ))}
            </div>
          ))}
        </div>
        <div className={s.footerBottom}>
          <span>&copy; 2026 mypcs.in</span>
          <span>Made with care in Nagpur for rural India</span>
        </div>
      </footer>
    </>
  );
}
