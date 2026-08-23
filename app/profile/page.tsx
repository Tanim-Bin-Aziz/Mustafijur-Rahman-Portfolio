"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa6";

/* ---------------------------------------------------------
   Theme — CSS variable-er upor nirbhor na kore explicit color
   tokens use kora hocche, jate card/border shobshomoy dekha jay
--------------------------------------------------------- */
interface Theme {
  background: string;
  card: string;
  border: string;
  foreground: string;
  cardForeground: string;
  mutedForeground: string;
  secondary: string;
  secondaryForeground: string;
  primary: string;
  primaryForeground: string;
}

const darkTheme: Theme = {
  background: "#000000",
  card: "#111114",
  border: "rgba(255,255,255,0.10)",
  foreground: "#f5f5f7",
  cardForeground: "#e4e4e7",
  mutedForeground: "#9a9aa2",
  secondary: "#1a1a1f",
  secondaryForeground: "#d4d4d8",
  primary: "#6d5ef5",
  primaryForeground: "#ffffff",
};

const lightTheme: Theme = {
  background: "#f4f4f6",
  card: "#ffffff",
  border: "rgba(0,0,0,0.08)",
  foreground: "#111114",
  cardForeground: "#27272a",
  mutedForeground: "#6b7280",
  secondary: "#f1f1f4",
  secondaryForeground: "#374151",
  primary: "#6d5ef5",
  primaryForeground: "#ffffff",
};

/* ---------------------------------------------------------
   Types
--------------------------------------------------------- */
interface SkillCategory {
  label: string;
  color: string;
  items: string[];
}

interface SoftSkills {
  strengths: string[];
  passions: string[];
}

interface Experience {
  title: string;
  company: string;
  dept: string;
  type: string;
  period: string;
  bullets: string[];
}

interface Award {
  title: string;
  desc: string;
}

interface Education {
  degree: string;
  institution: string;
  detail: string;
  grade: string;
  current: boolean;
}

interface Reference {
  name: string;
  role: string;
  company: string;
  email: string;
  phones: string[];
}

interface Stat {
  value: string;
  label: string;
  sub: string;
}

interface Language {
  name: string;
  pct: number;
  level: string;
  color: string;
}

interface ContactEntry {
  icon: string;
  label: string;
  value: string;
  href?: string;
}

/* ---------------------------------------------------------
   Data — Mustafijur Rahaman profile
--------------------------------------------------------- */
const skillCategories: SkillCategory[] = [
  {
    label: "Design Tools",
    color: "#4f46e5",
    items: ["Adobe Illustrator", "Photoshop", "CLO3D (3D Fashion)"],
  },
  {
    label: "Fashion",
    color: "#ec4899",
    items: [
      "Fashion Illustration",
      "Garments Construction",
      "Fabric Knowledge",
      "Garments Wash",
      "Trend Forecasting",
      "Dress Making",
    ],
  },
  {
    label: "Technology",
    color: "#f59e0b",
    items: ["Microsoft Office", "Artificial Intelligence"],
  },
];

const softSkills: SoftSkills = {
  strengths: [
    "Creative",
    "Attention to Details",
    "Communication",
    "Problem Solving",
    "Trend Awareness",
  ],
  passions: [
    "Fabric and Textile",
    "Play with Color",
    "Gather Information",
    "Research",
    "Artificial Intelligence",
  ],
};

const experiences: Experience[] = [
  {
    title: "Design Intern",
    company: "Ha-Meem Group",
    dept: "Design Department",
    type: "Internship",
    period: "20 Apr 2025 – 15 Jul 2025",
    bullets: [
      "Worked in the Design Department contributing to garment development and sampling",
      "Gained hands-on experience in the production workflow of a leading garment manufacturer",
    ],
  },
];

const awards: Award[] = [
  {
    title: "DTG Fashion Show 2025",
    desc: "Designed and developed a Woven collection for DTG Fashion Show, aligning with ready-to-wear fashion trends.",
  },
];

const education: Education[] = [
  {
    degree: "3D Fashion Design (CLO3D)",
    institution: "BGMEA (SICIP)",
    detail: "Professional Training · 10 May 2025 – 09 Aug 2025",
    grade: "A+",
    current: false,
  },
  {
    degree: "B.A Hons — Fashion Design & Technology",
    institution: "Shanto Mariam University of Creative Technology",
    detail: "2021 – Present",
    grade: "CGPA 3.97",
    current: true,
  },
  {
    degree: "Higher Secondary Certificate (HSC)",
    institution: "Dhaka Imperial College",
    detail: "Johurul Haque City, Dhaka · Science",
    grade: "GPA 4.30",
    current: false,
  },
  {
    degree: "Secondary School Certificate (SSC)",
    institution: "Suraj Mohini Institute",
    detail: "Khankhanapur, Rajbari, Dhaka · Science",
    grade: "GPA 4.94",
    current: false,
  },
];

const hobbies: string[] = [
  "Fitness & Health",
  "Music & Art",
  "DIY Projects",
  "Reading",
  "Sketch",
  "Dress Making",
];

const references: Reference[] = [
  {
    name: "Prerna",
    role: "Manager Design",
    company: "HA-MEEM Group",
    email: "Prerna@hameemgroup.com",
    phones: ["+8801316-798324", "+8801332-520851"],
  },
  {
    name: "Mahmudul Hasan",
    role: "Head of Design (DPD)",
    company: "Fakir Group",
    email: "mahmud_dpd@fakirgroup.com",
    phones: ["+880 1710-423896", "+880 1610-423896"],
  },
];

const stats: Stat[] = [
  { value: "3.97", label: "CGPA", sub: "University" },
  { value: "A+", label: "CLO3D Cert", sub: "BGMEA SICIP" },
  { value: "1", label: "Internship", sub: "Ha-Meem Group" },
  { value: "2+", label: "Awards", sub: "Fashion Shows" },
];

const languages: Language[] = [
  { name: "English", pct: 90, level: "Proficient", color: "#4f46e5" },
  { name: "Chinese", pct: 75, level: "Intermediate", color: "#ec4899" },
  { name: "French", pct: 15, level: "Learning", color: "#f59e0b" },
];

const contactEntries: ContactEntry[] = [
  {
    icon: "📞",
    label: "Phone",
    value: "+8801710768932",
    href: "tel:+8801710768932",
  },
  {
    icon: "✉",
    label: "Email",
    value: "Ashikislam01710@gmail.com",
    href: "mailto:Ashikislam01710@gmail.com",
  },
  {
    icon: "📍",
    label: "Location",
    value: "Mallikpara, Khankhanapur, Rajbari, Dhaka",
  },
];

/* ---------------------------------------------------------
   Small presentational components — shobgular-i theme prop lage
--------------------------------------------------------- */
function SectionCard({
  children,
  theme,
  className = "",
}: {
  children: ReactNode;
  theme: Theme;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl p-5 ${className}`}
      style={{
        backgroundColor: theme.card,
        border: `1px solid ${theme.border}`,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({
  children,
  theme,
}: {
  children: ReactNode;
  theme: Theme;
}) {
  return (
    <p
      className="text-xs font-semibold tracking-widest uppercase mb-4"
      style={{ color: theme.mutedForeground }}
    >
      {children}
    </p>
  );
}

function TagBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-block text-xs px-2.5 py-1 rounded-full font-medium border"
      style={{
        color,
        borderColor: color + "33",
        backgroundColor: color + "12",
      }}
    >
      {label}
    </span>
  );
}

function SkillGroup({
  label,
  items,
  color,
}: {
  label: string;
  items: string[];
  color: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span
          className="text-xs font-semibold tracking-wider uppercase"
          style={{ color }}
        >
          {label}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 pl-4">
        {items.map((s) => (
          <TagBadge key={s} label={s} color={color} />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Page
--------------------------------------------------------- */
export default function ProfilePage() {
  const [dark, setDark] = useState(true);
  const theme = dark ? darkTheme : lightTheme;

  return (
    <div
      className="min-h-screen py-6 px-4 transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Dark mode toggle */}
      <div className="max-w-6xl mx-auto flex justify-end mb-4">
        <button
          onClick={() => setDark((d) => !d)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
          style={{
            backgroundColor: theme.card,
            border: `1px solid ${theme.border}`,
            color: theme.foreground,
          }}
        >
          {dark ? "☀️ Light mode" : "🌙 Dark mode"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-4">
        {/* ── HEADER CARD ── */}
        <SectionCard theme={theme}>
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-xl flex items-center justify-center text-3xl font-black select-none">
                <Image
                  src="/images/profile.jpg"
                  alt="Profile"
                  width={96}
                  height={96}
                  className="rounded-xl"
                />
              </div>
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500"
                style={{ border: `2px solid ${theme.card}` }}
              />
            </div>
            <div className="flex-1">
              <h1
                className="text-2xl font-bold"
                style={{ color: theme.foreground }}
              >
                Mustafijur Rahaman
              </h1>
              <p
                className="text-sm mt-0.5"
                style={{ color: theme.mutedForeground }}
              >
                Fashion Designer · 3D CLO Designer · Fashion Illustrator
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-sm flex-wrap">
                <span style={{ color: theme.mutedForeground }}>
                  Khankhanapur, Rajbari, Dhaka
                </span>
                <span className="font-medium" style={{ color: "#22c55e" }}>
                  ● Open to opportunities
                </span>
              </div>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: theme.cardForeground }}
              >
                Fashion designing student with a passion for creating innovative
                and stylish clothing. Proven ability to sketch, design, and sew
                garments. Expertise in Adobe Illustrator, Photoshop, and CLO3D
                3D fashion design.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <a
                  href="tel:+8801710768932"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.primaryForeground,
                  }}
                >
                  <FaFacebook className="" />
                  facebook
                </a>

                <span
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: theme.secondary,
                    border: `1px solid ${theme.border}`,
                    color: theme.foreground,
                  }}
                >
                  <FaLinkedin className="" />
                  LinkedIn
                </span>
                <span
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: theme.secondary,
                    border: `1px solid ${theme.border}`,
                    color: theme.foreground,
                  }}
                >
                  <FaWhatsapp className="" />
                  WhatsApp
                </span>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── TWO COLUMN ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            {/* About */}
            <SectionCard theme={theme}>
              <SectionLabel theme={theme}>About Me</SectionLabel>
              <p
                className="text-sm leading-relaxed"
                style={{ color: theme.cardForeground }}
              >
                Fashion designing student with a passion for creating innovative
                and stylish clothing. Proven ability to sketch, design, and sew
                garments. Expertise in Adobe Illustrator and Photoshop. Seeking
                an entry-level fashion design trainee where I can use my skills
                and creativity to learn from experienced professionals and gain
                real-world experience
              </p>
              <p
                className="text-sm leading-relaxed mt-3"
                style={{ color: theme.cardForeground }}
              >
                I completed an internship at Ha-Meem Group, one of
                Bangladesh&apos;s leading garment exporters, where I gained
                real-world experience in a professional design department. I am
                creative, detail-oriented, and eager to grow in the fashion
                industry — from concept sketching to final production.
              </p>
            </SectionCard>

            {/* Professional Experience */}
            <SectionCard theme={theme}>
              <SectionLabel theme={theme}>Professional Experience</SectionLabel>
              {experiences.map((exp, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: theme.secondary }}
                  >
                    👔
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3
                          className="font-semibold text-sm"
                          style={{ color: theme.foreground }}
                        >
                          {exp.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className="text-xs font-medium"
                            style={{ color: theme.primary }}
                          >
                            {exp.company}
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: theme.mutedForeground }}
                          >
                            · {exp.dept}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: "#ec489912",
                              color: "#ec4899",
                              border: "1px solid #ec489933",
                            }}
                          >
                            {exp.type}
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-xs flex-shrink-0"
                        style={{ color: theme.mutedForeground }}
                      >
                        📅 {exp.period}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.map((b, j) => (
                        <li
                          key={j}
                          className="text-xs flex gap-2"
                          style={{ color: theme.secondaryForeground }}
                        >
                          <span
                            className="flex-shrink-0 mt-0.5"
                            style={{ color: theme.primary }}
                          >
                            ›
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </SectionCard>

            {/* Awards */}
            <SectionCard theme={theme}>
              <SectionLabel theme={theme}>Awards & Achievements</SectionLabel>
              {awards.map((a, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: theme.secondary }}
                  >
                    🏆
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-sm"
                      style={{ color: theme.foreground }}
                    >
                      {a.title}
                    </h3>
                    <p
                      className="text-xs mt-1 leading-relaxed"
                      style={{ color: theme.secondaryForeground }}
                    >
                      {a.desc}
                    </p>
                  </div>
                </div>
              ))}
            </SectionCard>

            {/* Education */}
            <SectionCard theme={theme}>
              <SectionLabel theme={theme}>Education</SectionLabel>
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: theme.secondary }}
                    >
                      🎓
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h3
                            className="font-semibold text-sm"
                            style={{ color: theme.foreground }}
                          >
                            {edu.degree}
                          </h3>
                          <p
                            className="text-xs font-medium mt-0.5"
                            style={{ color: theme.primary }}
                          >
                            {edu.institution}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: theme.mutedForeground }}
                          >
                            {edu.detail}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className="text-sm font-bold"
                            style={{ color: "#f59e0b" }}
                          >
                            {" "}
                            {edu.current && (
                              <span
                                className="text-xs px-2 mr-2 py-0.5 rounded font-medium"
                                style={{
                                  backgroundColor: "#22c55e22",
                                  color: "#22c55e",
                                }}
                              >
                                Current
                              </span>
                            )}
                            {edu.grade}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Hobbies */}
            <SectionCard theme={theme}>
              <SectionLabel theme={theme}>Hobbies & Interests</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((h) => (
                  <span
                    key={h}
                    className="text-sm px-3 py-1.5 rounded-full font-medium"
                    style={{
                      backgroundColor: theme.secondary,
                      color: theme.secondaryForeground,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
            </SectionCard>

            {/* References */}
            <SectionCard theme={theme}>
              <SectionLabel theme={theme}>References</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {references.map((r) => (
                  <div
                    key={r.name}
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: theme.secondary,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <p
                      className="font-semibold text-sm"
                      style={{ color: theme.foreground }}
                    >
                      {r.name}
                    </p>
                    <p
                      className="text-xs font-medium mt-0.5"
                      style={{ color: theme.primary }}
                    >
                      {r.role}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme.mutedForeground }}
                    >
                      {r.company}
                    </p>
                    <a
                      href={`mailto:${r.email}`}
                      className="text-xs mt-1 block hover:underline"
                      style={{ color: theme.secondaryForeground }}
                    >
                      {r.email}
                    </a>
                    {r.phones.map((p) => (
                      <p
                        key={p}
                        className="text-xs"
                        style={{ color: theme.mutedForeground }}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">
            {/* Skills */}
            <SectionCard theme={theme}>
              <SectionLabel theme={theme}>Skills</SectionLabel>
              {skillCategories.map((cat) => (
                <SkillGroup
                  key={cat.label}
                  label={cat.label}
                  items={cat.items}
                  color={cat.color}
                />
              ))}
            </SectionCard>

            {/* Soft Skills */}
            <SectionCard theme={theme}>
              <SectionLabel theme={theme}>Strengths</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {softSkills.strengths.map((s) => (
                  <TagBadge key={s} label={s} color="#4f46e5" />
                ))}
              </div>
              <div className="mt-4">
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-2"
                  style={{ color: theme.mutedForeground }}
                >
                  Passions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {softSkills.passions.map((s) => (
                    <TagBadge key={s} label={s} color="#ec4899" />
                  ))}
                </div>
              </div>
            </SectionCard>

            {/* Stats */}
            <SectionCard theme={theme}>
              <SectionLabel theme={theme}>Stats & Highlights</SectionLabel>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="text-center py-2">
                    <div
                      className="text-2xl font-bold"
                      style={{ color: theme.primary }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="text-xs font-medium mt-0.5"
                      style={{ color: theme.foreground }}
                    >
                      {s.label}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: theme.mutedForeground }}
                    >
                      {s.sub}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Languages */}
            <SectionCard theme={theme}>
              <SectionLabel theme={theme}>Languages</SectionLabel>
              <div className="space-y-3">
                {languages.map((l) => (
                  <div key={l.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span
                        className="font-medium"
                        style={{ color: theme.foreground }}
                      >
                        {l.name}
                      </span>
                      <span style={{ color: l.color }}>{l.level}</span>
                    </div>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ backgroundColor: theme.secondary }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${l.pct}%`, backgroundColor: l.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Contact */}
            <SectionCard theme={theme}>
              <SectionLabel theme={theme}>Contact</SectionLabel>
              <div className="space-y-3">
                {contactEntries.map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: theme.secondary }}
                    >
                      {c.icon}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-xs"
                        style={{ color: theme.mutedForeground }}
                      >
                        {c.label}
                      </p>
                      {c.href ? (
                        <a
                          href={c.href}
                          className="text-xs font-medium break-all hover:underline"
                          style={{ color: theme.foreground }}
                        >
                          {c.value}
                        </a>
                      ) : (
                        <p
                          className="text-xs font-medium"
                          style={{ color: theme.foreground }}
                        >
                          {c.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>

        <p
          className="text-center text-xs py-4"
          style={{ color: theme.mutedForeground }}
        >
          Mustafijur Rahaman · Fashion Designer · 2025
        </p>
      </div>
    </div>
  );
}
