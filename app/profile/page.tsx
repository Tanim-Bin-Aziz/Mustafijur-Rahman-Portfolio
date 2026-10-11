"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import type { IconType } from "react-icons";
import {
  FaBrain,
  FaChartLine,
  FaCube,
  FaDroplet,
  FaEnvelope,
  FaFacebook,
  FaLinkedin,
  FaLaptopCode,
  FaLocationDot,
  FaMicrosoft,
  FaPencil,
  FaPenNib,
  FaPenRuler,
  FaPersonDress,
  FaPhone,
  FaPinterest,
  FaScissors,
  FaShirt,
  FaSwatchbook,
  FaWhatsapp,
  FaImage,
} from "react-icons/fa6";

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
interface SkillItem {
  name: string;
  icon: IconType;
}

interface SkillCategory {
  label: string;
  icon: IconType;
  color: string;
  items: SkillItem[];
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
  icon: IconType;
  label: string;
  value: string;
  href?: string;
}

interface SocialLink {
  label: string;
  href: string;
  icon: IconType;
  external: boolean;
}

/* ---------------------------------------------------------
   Data — Mustafijur Rahaman profile
--------------------------------------------------------- */
const skillCategories: SkillCategory[] = [
  {
    label: "Design Tools",
    icon: FaPenRuler,
    color: "#4f46e5",
    items: [
      { name: "Adobe Illustrator", icon: FaPenNib },
      { name: "Photoshop", icon: FaImage },
      { name: "CLO3D (3D Fashion)", icon: FaCube },
    ],
  },
  {
    label: "Fashion",
    icon: FaShirt,
    color: "#ec4899",
    items: [
      { name: "Fashion Illustration", icon: FaPencil },
      { name: "Garments Construction", icon: FaScissors },
      { name: "Fabric Knowledge", icon: FaSwatchbook },
      { name: "Garments Wash", icon: FaDroplet },
      { name: "Trend Forecasting", icon: FaChartLine },
      { name: "Dress Making", icon: FaPersonDress },
    ],
  },
  {
    label: "Technology",
    icon: FaLaptopCode,
    color: "#f59e0b",
    items: [
      { name: "Microsoft Office", icon: FaMicrosoft },
      { name: "Artificial Intelligence", icon: FaBrain },
    ],
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
    icon: FaPhone,
    label: "Phone",
    value: "+8801710768932",
    href: "tel:+8801710768932",
  },
  {
    icon: FaEnvelope,
    label: "Email",
    value: "Ashikislam01710@gmail.com",
    href: "mailto:Ashikislam01710@gmail.com",
  },
  {
    icon: FaLocationDot,
    label: "Location",
    value: "Mallikpara, Khankhanapur, Rajbari, Dhaka",
  },
];

/* ---------------------------------------------------------
   Social / contact links
   TODO: Facebook, LinkedIn, Pinterest, Instagram-er href
   gulo nijer real profile URL diye replace koro
--------------------------------------------------------- */
const socialLinks: SocialLink[] = [
  {
    label: "WhatsApp",
    href: "https://wa.me/8801710768932",
    icon: FaWhatsapp,
    external: true,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/your-username",
    icon: FaFacebook,
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/your-username",
    icon: FaLinkedin,
    external: true,
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com/your-username",
    icon: FaPinterest,
    external: true,
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
      className={`rounded-xl p-4 sm:p-5 ${className}`}
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

function TagBadge({
  label,
  color,
  icon: Icon,
}: {
  label: string;
  color: string;
  icon?: IconType;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium border"
      style={{
        color,
        borderColor: color + "33",
        backgroundColor: color + "12",
      }}
    >
      {Icon && <Icon className="flex-shrink-0 text-[11px]" />}
      {label}
    </span>
  );
}

function SkillGroup({
  label,
  icon: Icon,
  items,
  color,
}: {
  label: string;
  icon: IconType;
  items: SkillItem[];
  color: string;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center"
          style={{ backgroundColor: color + "1a", color }}
        >
          <Icon className="text-[11px]" />
        </span>
        <span
          className="text-xs font-semibold tracking-wider uppercase"
          style={{ color }}
        >
          {label}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 pl-8">
        {items.map((item) => (
          <TagBadge
            key={item.name}
            label={item.name}
            color={color}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
}

/* Compact round icon button — contact icons-er moto neutral look.
   Hover e shudhu primary tint, brand color nei. */
function SocialIconButton({ link, theme }: { link: SocialLink; theme: Theme }) {
  const [active, setActive] = useState(false);
  const Icon = link.icon;

  return (
    <a
      href={link.href}
      aria-label={link.label}
      title={link.label}
      {...(link.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-full transition-colors duration-200 active:scale-95 outline-none"
      style={{
        backgroundColor: active ? theme.primary : theme.secondary,
        color: active ? theme.primaryForeground : theme.secondaryForeground,
      }}
    >
      <Icon className="text-base" />
    </a>
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
      className="min-h-screen py-4 sm:py-6 px-3 sm:px-4 transition-colors duration-300"
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
          {/* Mobile: center stacked · Desktop: row */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-center md:items-start text-center md:text-left">
            {/* Photo — desktop e header content er height-er sathe fit hoy */}
            <div className="relative flex-shrink-0 w-28 h-28 md:w-36 md:h-auto md:min-h-[9rem] md:self-stretch">
              <Image
                src="/images/profile.jpg"
                alt="Mustafijur Rahaman"
                fill
                sizes="(min-width: 768px) 144px, 112px"
                className="rounded-xl object-cover"
                priority
              />
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500"
                style={{ border: `2px solid ${theme.card}` }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h1
                className="text-xl sm:text-2xl font-bold"
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
              <p
                className="mt-1.5 text-sm font-medium"
                style={{ color: "#22c55e" }}
              >
                ● Open to opportunities
              </p>

              {/* Contact / social icons — compact, wraps on small screens */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                {socialLinks.map((link) => (
                  <SocialIconButton
                    key={link.label}
                    link={link}
                    theme={theme}
                  />
                ))}
              </div>
            </div>

            {/* Contact info — right side on desktop, below on mobile */}
            <ul
              className="w-full md:w-[270px] lg:w-[280px] md:flex-shrink-0 md:self-stretch md:flex md:flex-col md:justify-center md:pl-6 lg:pl-5 md:border-l border-t md:border-t-0 pt-4 md:pt-0 mt-1 md:mt-0 space-y-3 text-xs sm:text-sm"
              style={{ borderColor: theme.border }}
            >
              {contactEntries.map((c) => {
                const Icon = c.icon;
                const Row = c.href ? "a" : "div";
                return (
                  <li
                    key={c.label}
                    className="flex justify-center md:justify-start"
                  >
                    <Row
                      {...(c.href ? { href: c.href } : {})}
                      className={`flex items-start gap-3 text-left min-w-0 ${
                        c.href ? "hover:underline" : ""
                      }`}
                      style={{ color: theme.cardForeground }}
                    >
                      <span
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: theme.secondary }}
                      >
                        <Icon
                          className="text-[11px]"
                          style={{ color: theme.secondaryForeground }}
                        />
                      </span>
                      <span className="min-w-0 break-words leading-snug py-1">
                        {c.value}
                      </span>
                    </Row>
                  </li>
                );
              })}
            </ul>
          </div>
        </SectionCard>

        {/* ── TWO COLUMN ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-4">
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
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
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
                      className="text-xs mt-1 block hover:underline break-all"
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
                  icon={cat.icon}
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
