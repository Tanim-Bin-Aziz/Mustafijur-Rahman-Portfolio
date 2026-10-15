"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import type { IconType } from "react-icons";
import Nav from "@/components/Nav";
import { loadFullIconMap, type IconMap } from "@/lib/icons";
import {
  PROFILE_SECTIONS,
  resolveIconName,
  type ProfileData,
} from "@/data/profile";

/* ---------------------------------------------------------
   Theme
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
   Small presentational components
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
  iconImage,
}: {
  label: string;
  color: string;
  icon?: IconType;
  iconImage?: string;
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
      {iconImage ? (
        <span className="relative h-3.5 w-3.5 flex-shrink-0">
          <Image
            src={iconImage}
            alt={label}
            fill
            sizes="14px"
            className="object-contain"
          />
        </span>
      ) : (
        Icon && <Icon className="flex-shrink-0 text-[11px]" />
      )}
      {label}
    </span>
  );
}

function SkillGroup({
  label,
  icon: Icon,
  iconImage,
  items,
  color,
  resolveIcon,
}: {
  label: string;
  icon: IconType;
  iconImage?: string;
  items: { name: string; icon: string; iconImage?: string }[];
  color: string;
  resolveIcon: (name: string) => IconType;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="relative flex-shrink-0 w-6 h-6 overflow-hidden rounded-md flex items-center justify-center"
          style={{ backgroundColor: color + "1a", color }}
        >
          {iconImage ? (
            <Image
              src={iconImage}
              alt={label}
              fill
              sizes="24px"
              className="object-contain"
            />
          ) : (
            <Icon className="text-[11px]" />
          )}
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
            icon={resolveIcon(item.icon)}
            iconImage={item.iconImage}
          />
        ))}
      </div>
    </div>
  );
}

function SocialIconButton({
  link,
  icon: Icon,
  theme,
}: {
  link: { label: string; href: string; icon: string; external: boolean };
  icon: IconType;
  theme: Theme;
}) {
  const [active, setActive] = useState(false);

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
export default function ProfileView({ profile }: { profile: ProfileData }) {
  const [dark, setDark] = useState(true);
  const [extraIcons, setExtraIcons] = useState<IconMap | null>(null);
  const theme = dark ? darkTheme : lightTheme;

  useEffect(() => {
    let cancelled = false;
    loadFullIconMap().then((map) => {
      if (!cancelled) setExtraIcons(map);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const iconFor = (name: string) =>
    resolveIconName(name, extraIcons ?? undefined);

  const isVisible = (key: string) => profile.sectionVisibility[key] !== false;

  const columnKeys = (column: "left" | "right") =>
    profile.sectionOrder.filter((key) => {
      const meta = PROFILE_SECTIONS.find((s) => s.key === key);
      return meta?.column === column && isVisible(key);
    });

  const renderSection = (key: string): ReactNode => {
    switch (key) {
      case "about":
        return (
          <SectionCard theme={theme}>
            <SectionLabel theme={theme}>About Me</SectionLabel>
            {profile.about
              .filter((paragraph) => paragraph.trim())
              .map((paragraph, i) => (
              <p
                key={i}
                className={`text-sm leading-relaxed${i > 0 ? " mt-3" : ""}`}
                style={{ color: theme.cardForeground }}
              >
                {paragraph}
              </p>
            ))}
          </SectionCard>
        );

      case "experience":
        return (
          <SectionCard theme={theme}>
            <SectionLabel theme={theme}>Professional Experience</SectionLabel>
            {profile.experiences.map((exp, i) => (
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
                    {exp.bullets
                      .filter((b) => b.trim())
                      .map((b, j) => (
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
        );

      case "awards":
        return (
          <SectionCard theme={theme}>
            <SectionLabel theme={theme}>Awards & Achievements</SectionLabel>
            {profile.awards.map((a, i) => (
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
        );

      case "education":
        return (
          <SectionCard theme={theme}>
            <SectionLabel theme={theme}>Education</SectionLabel>
            <div className="space-y-4">
              {profile.education.map((edu, i) => (
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
        );

      case "hobbies":
        return (
          <SectionCard theme={theme}>
            <SectionLabel theme={theme}>Hobbies & Interests</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {profile.hobbies.map((h) => (
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
        );

      case "references":
        return (
          <SectionCard theme={theme}>
            <SectionLabel theme={theme}>References</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.references.map((r) => (
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
                  {r.phones
                    .filter((p) => p.trim())
                    .map((p) => (
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
        );

      case "skills":
        return (
          <SectionCard theme={theme}>
            <SectionLabel theme={theme}>Skills</SectionLabel>
            {profile.skillCategories.map((cat) => (
              <SkillGroup
                key={cat.label}
                label={cat.label}
                icon={iconFor(cat.icon)}
                iconImage={cat.iconImage}
                items={cat.items}
                color={cat.color}
                resolveIcon={iconFor}
              />
            ))}
          </SectionCard>
        );

      case "softSkills":
        return (
          <SectionCard theme={theme}>
            <SectionLabel theme={theme}>Strengths</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {profile.softSkills.strengths.map((s) => (
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
                {profile.softSkills.passions.map((s) => (
                  <TagBadge key={s} label={s} color="#ec4899" />
                ))}
              </div>
            </div>
          </SectionCard>
        );

      case "stats":
        return (
          <SectionCard theme={theme}>
            <SectionLabel theme={theme}>Stats & Highlights</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              {profile.stats.map((s) => (
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
        );

      case "languages":
        return (
          <SectionCard theme={theme}>
            <SectionLabel theme={theme}>Languages</SectionLabel>
            <div className="space-y-3">
              {profile.languages.map((l) => (
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
                      style={{
                        width: `${l.pct}%`,
                        backgroundColor: l.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Nav />
      <div
        className="min-h-screen py-4 sm:py-6 pt-24 px-3 sm:px-4 transition-colors duration-300"
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
            <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-center md:items-start text-center md:text-left">
              <div className="relative flex-shrink-0 w-28 h-28 md:w-36 md:h-auto md:min-h-[9rem] md:self-stretch">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  sizes="(min-width: 768px) 144px, 112px"
                  className="rounded-xl object-contain"
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
                  {profile.name}
                </h1>
                <p
                  className="text-sm mt-0.5"
                  style={{ color: theme.mutedForeground }}
                >
                  {profile.title}
                </p>
                <p
                  className="mt-1.5 text-sm font-medium"
                  style={{ color: "#22c55e" }}
                >
                  ● {profile.status}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                  {profile.socialLinks.map((link) => (
                    <SocialIconButton
                      key={link.label}
                      link={link}
                      icon={iconFor(link.icon)}
                      theme={theme}
                    />
                  ))}
                </div>
              </div>

              <ul
                className="w-full md:w-[270px] lg:w-[280px] md:flex-shrink-0 md:self-stretch md:flex md:flex-col md:justify-center md:pl-6 lg:pl-5 md:border-l border-t md:border-t-0 pt-4 md:pt-0 mt-1 md:mt-0 space-y-3 text-xs sm:text-sm"
                style={{ borderColor: theme.border }}
              >
                {profile.contactEntries.map((c) => {
                  const Icon = iconFor(c.icon);
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
            <div className="space-y-4">
              {columnKeys("left").map((key) => (
                <div key={key}>{renderSection(key)}</div>
              ))}
            </div>

            <div className="space-y-4">
              {columnKeys("right").map((key) => (
                <div key={key}>{renderSection(key)}</div>
              ))}
            </div>
          </div>

          <p
            className="text-center text-xs py-4"
            style={{ color: theme.mutedForeground }}
          >
            {profile.name} · {profile.title} · 2025
          </p>
        </div>
      </div>
    </>
  );
}
