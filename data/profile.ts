import type { IconType } from "react-icons";
import {
  FaBrain,
  FaChartLine,
  FaCube,
  FaDroplet,
  FaEnvelope,
  FaFacebook,
  FaImage,
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
  FaStar,
  FaSwatchbook,
  FaWhatsapp,
} from "react-icons/fa6";

/* ---------------------------------------------------------
   Icon registry — DB stores icon names as strings,
   the view/editor maps them back to components.
--------------------------------------------------------- */
export const PROFILE_ICONS: Record<string, IconType> = {
  FaBrain,
  FaChartLine,
  FaCube,
  FaDroplet,
  FaEnvelope,
  FaFacebook,
  FaImage,
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
  FaStar,
  FaSwatchbook,
  FaWhatsapp,
};

export const ICON_OPTIONS = Object.keys(PROFILE_ICONS);

export function resolveIcon(name: string): IconType {
  return PROFILE_ICONS[name] ?? FaStar;
}

export function findIconName(
  name: string,
  extra?: Record<string, IconType>,
): string | null {
  if (!name) return null;
  if (PROFILE_ICONS[name]) return name;
  if (!extra) return null;
  if (extra[name]) return name;

  const lower = name.toLowerCase();
  let lucideMatch: string | null = null;
  let faMatch: string | null = null;
  for (const key of Object.keys(extra)) {
    const keyLower = key.toLowerCase();
    if (keyLower === lower) return key;
    if (keyLower.endsWith(lower)) {
      if (key.startsWith("Lu")) {
        if (!lucideMatch || key.length < lucideMatch.length) {
          lucideMatch = key;
        }
      } else if (key.startsWith("Fa")) {
        if (!faMatch || key.length < faMatch.length) {
          faMatch = key;
        }
      }
    }
  }
  return lucideMatch ?? faMatch;
}

export function resolveIconName(
  name: string,
  extra?: Record<string, IconType>,
): IconType {
  const found = findIconName(name, extra);
  if (!found) return FaStar;
  return (extra && extra[found]) ?? PROFILE_ICONS[found] ?? FaStar;
}

/* ---------------------------------------------------------
   Types
--------------------------------------------------------- */
export interface ProfileSkillItem {
  name: string;
  icon: string;
  iconImage?: string;
}

export interface ProfileToolItem {
  name: string;
  icon: string;
  iconImage?: string;
}

export interface ProfileSkillCategory {
  label: string;
  icon: string;
  color: string;
  iconImage?: string;
  items: ProfileSkillItem[];
}

export interface ProfileExperience {
  title: string;
  company: string;
  dept: string;
  type: string;
  period: string;
  bullets: string[];
}

export interface ProfileAward {
  title: string;
  desc: string;
}

export interface ProfileEducation {
  degree: string;
  institution: string;
  detail: string;
  grade: string;
  current: boolean;
}

export interface ProfileReference {
  name: string;
  role: string;
  company: string;
  email: string;
  phones: string[];
}

export interface ProfileStat {
  value: string;
  label: string;
  sub: string;
}

export interface ProfileLanguage {
  name: string;
  pct: number;
  level: string;
  color: string;
}

export interface ProfileContact {
  icon: string;
  label: string;
  value: string;
  href?: string;
}

export interface ProfileSocial {
  label: string;
  href: string;
  icon: string;
  external: boolean;
}

export interface ProfileData {
  avatar: string;
  name: string;
  title: string;
  status: string;
  about: string[];
  skillCategories: ProfileSkillCategory[];
  softwareTools: ProfileToolItem[];
  softSkills: { strengths: string[]; passions: string[] };
  experiences: ProfileExperience[];
  awards: ProfileAward[];
  education: ProfileEducation[];
  hobbies: string[];
  references: ProfileReference[];
  stats: ProfileStat[];
  languages: ProfileLanguage[];
  contactEntries: ProfileContact[];
  socialLinks: ProfileSocial[];
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
}

export interface ProfileSectionMeta {
  key: string;
  label: string;
  column: "left" | "right";
}

export const PROFILE_SECTIONS: ProfileSectionMeta[] = [
  { key: "about", label: "About Me", column: "left" },
  { key: "experience", label: "Professional Experience", column: "left" },
  { key: "awards", label: "Awards & Achievements", column: "left" },
  { key: "education", label: "Education", column: "left" },
  { key: "hobbies", label: "Hobbies & Interests", column: "left" },
  { key: "references", label: "References", column: "left" },
  { key: "skills", label: "Skills", column: "right" },
  { key: "softSkills", label: "Strengths & Passions", column: "right" },
  { key: "stats", label: "Stats & Highlights", column: "right" },
  { key: "languages", label: "Languages", column: "right" },
];

export const SECTION_LABELS: Record<string, string> = Object.fromEntries(
  PROFILE_SECTIONS.map((s) => [s.key, s.label]),
);

export const DEFAULT_SECTION_ORDER = PROFILE_SECTIONS.map((s) => s.key);

/* ---------------------------------------------------------
   Default profile data (mirrors the original hardcoded page)
--------------------------------------------------------- */
export const DEFAULT_PROFILE: ProfileData = {
  avatar: "/images/profile.jpg",
  name: "Mustafijur Rahaman",
  title: "Fashion Designer · 3D CLO Designer · Fashion Illustrator",
  status: "Open to opportunities",
  about: [
    "Fashion designing student with a passion for creating innovative and stylish clothing. Proven ability to sketch, design, and sew garments. Expertise in Adobe Illustrator and Photoshop. Seeking an entry-level fashion design trainee where I can use my skills and creativity to learn from experienced professionals and gain real-world experience",
    "I completed an internship at Ha-Meem Group, one of Bangladesh's leading garment exporters, where I gained real-world experience in a professional design department. I am creative, detail-oriented, and eager to grow in the fashion industry — from concept sketching to final production.",
  ],
  skillCategories: [
    {
      label: "Design Tools",
      icon: "FaPenRuler",
      color: "#4f46e5",
      items: [
        { name: "Adobe Illustrator", icon: "FaPenNib" },
        { name: "Photoshop", icon: "FaImage" },
        { name: "CLO3D (3D Fashion)", icon: "FaCube" },
      ],
    },
    {
      label: "Fashion",
      icon: "FaShirt",
      color: "#ec4899",
      items: [
        { name: "Fashion Illustration", icon: "FaPencil" },
        { name: "Garments Construction", icon: "FaScissors" },
        { name: "Fabric Knowledge", icon: "FaSwatchbook" },
        { name: "Garments Wash", icon: "FaDroplet" },
        { name: "Trend Forecasting", icon: "FaChartLine" },
        { name: "Dress Making", icon: "FaPersonDress" },
      ],
    },
    {
      label: "Technology",
      icon: "FaLaptopCode",
      color: "#f59e0b",
      items: [
        { name: "Microsoft Office", icon: "FaMicrosoft" },
        { name: "Artificial Intelligence", icon: "FaBrain" },
      ],
    },
  ],
  softwareTools: [
    { name: "Illustrator", icon: "FaPenNib" },
    { name: "Photoshop", icon: "FaImage" },
    { name: "CLO 3D", icon: "FaCube" },
    { name: "Microsoft Office", icon: "FaMicrosoft" },
    { name: "Canva AI", icon: "FaStar" },
    { name: "ChatGPT", icon: "FaBrain" },
    { name: "Gemini", icon: "FaStar" },
    { name: "Firefly", icon: "FaStar" },
  ],
  softSkills: {
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
  },
  experiences: [
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
  ],
  awards: [
    {
      title: "DTG Fashion Show 2025",
      desc: "Designed and developed a Woven collection for DTG Fashion Show, aligning with ready-to-wear fashion trends.",
    },
  ],
  education: [
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
  ],
  hobbies: [
    "Fitness & Health",
    "Music & Art",
    "DIY Projects",
    "Reading",
    "Sketch",
    "Dress Making",
  ],
  references: [
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
  ],
  stats: [
    { value: "3.97", label: "CGPA", sub: "University" },
    { value: "A+", label: "CLO3D Cert", sub: "BGMEA SICIP" },
    { value: "1", label: "Internship", sub: "Ha-Meem Group" },
    { value: "2+", label: "Awards", sub: "Fashion Shows" },
  ],
  languages: [
    { name: "English", pct: 90, level: "Proficient", color: "#4f46e5" },
    { name: "Chinese", pct: 75, level: "Intermediate", color: "#ec4899" },
    { name: "French", pct: 15, level: "Learning", color: "#f59e0b" },
  ],
  contactEntries: [
    {
      icon: "FaPhone",
      label: "Phone",
      value: "+8801710768932",
      href: "tel:+8801710768932",
    },
    {
      icon: "FaEnvelope",
      label: "Email",
      value: "Ashikislam01710@gmail.com",
      href: "mailto:Ashikislam01710@gmail.com",
    },
    {
      icon: "FaLocationDot",
      label: "Location",
      value: "Mallikpara, Khankhanapur, Rajbari, Dhaka",
    },
  ],
  socialLinks: [
    {
      label: "WhatsApp",
      href: "https://wa.me/8801710768932",
      icon: "FaWhatsapp",
      external: true,
    },
    {
      label: "Facebook",
      href: "https://facebook.com/your-username",
      icon: "FaFacebook",
      external: true,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/your-username",
      icon: "FaLinkedin",
      external: true,
    },
    {
      label: "Pinterest",
      href: "https://pinterest.com/your-username",
      icon: "FaPinterest",
      external: true,
    },
  ],
  sectionOrder: DEFAULT_SECTION_ORDER,
  sectionVisibility: Object.fromEntries(
    DEFAULT_SECTION_ORDER.map((key) => [key, true]),
  ),
};
