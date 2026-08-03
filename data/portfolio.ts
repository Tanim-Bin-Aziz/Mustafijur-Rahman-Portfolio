export const NAV_LINKS = [
  { label: "Work", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];
export type SlideType = "image" | "pdf" | "ppt" | "video";

export interface ProjectSlide {
  type: SlideType;
  src: string; // image/poster src (pdf & ppt pages export kore image banao)
  fileHref?: string; // actual .pdf/.pptx download link (optional)
  caption?: string;
}
// export const PROJECTS = [
//   {
//     id: 1,
//     year: "2024",
//     category: "Brand Identity & Digital",
//     title: "Maison Élite",
//     subtitle: "Luxury Fashion E-Commerce Redesign",
//     description:
//       "Complete digital transformation for one of Paris's most iconic fashion houses. An immersive e-commerce experience that mirrors the physical luxury store — resulting in an 89% increase in session duration and a 41% conversion lift.",
//     client: "Maison Élite Paris",
//     timeline: "10 weeks",
//     tags: ["E-Commerce", "Luxury", "Mobile"],
//     tools: ["Figma", "Framer", "After Effects"],
//     image:
//       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=640&fit=crop&auto=format",
//     has: { pdf: true, ppt: true, video: true, live: true },
//   },
//   {
//     id: 2,
//     year: "2024",
//     category: "Product Design",
//     title: "Couture AI",
//     subtitle: "AI-Powered Fashion Styling App",
//     description:
//       "End-to-end product design for a personalized AI fashion assistant. Uses computer vision to analyze wardrobes and suggest outfits based on occasion, weather, and personal style — 500k+ downloads in the first month.",
//     client: "Couture Labs",
//     timeline: "14 weeks",
//     tags: ["Mobile", "AI", "Fashion Tech"],
//     tools: ["Figma", "Principle", "Lottie"],
//     image:
//       "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&h=640&fit=crop&auto=format",
//     has: { pdf: true, ppt: true, video: true },
//   },
//   {
//     id: 3,
//     year: "2023",
//     category: "Editorial & Web",
//     title: "Vogue Digital",
//     subtitle: "Magazine Platform Redesign",
//     description:
//       "Reimagined the digital reading experience for a new generation of fashion readers. Cinematic layouts, smart typography, and seamless editorial navigation — increasing time-on-page by 73% and earning a 2023 Webby Award.",
//     client: "Condé Nast Digital",
//     timeline: "12 weeks",
//     tags: ["Editorial", "Web", "Typography"],
//     tools: ["Figma", "Webflow", "GSAP"],
//     image:
//       "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&h=640&fit=crop&auto=format",
//     has: { pdf: true, video: true, live: true },
//   },
//   {
//     id: 4,
//     year: "2023",
//     category: "Packaging & Identity",
//     title: "Lumière Beauty",
//     subtitle: "Luxury Cosmetics Brand System",
//     description:
//       "Complete visual identity and packaging design for a clean luxury beauty brand. From primary mark to packaging language, campaign templates, and a full Figma design system used by a 12-person team.",
//     client: "Lumière Paris",
//     timeline: "8 weeks",
//     tags: ["Branding", "Packaging", "Identity"],
//     tools: ["Illustrator", "Figma", "Photoshop"],
//     image:
//       "https://images.unsplash.com/photo-1621784563330-caee0b138a00?w=900&h=640&fit=crop&auto=format",
//     has: { pdf: true, ppt: true },
//   },
// ];

export const CERTIFICATIONS = [
  {
    org: "Google",
    title: "UX Design Professional Certificate",
    issued: "March 2024",
    credId: "GXD-2024-88471",
    color: "#4285F4",
    abbr: "G",
  },
  {
    org: "Meta",
    title: "Advanced Figma: Component Architecture",
    issued: "January 2024",
    credId: "META-FIG-20241",
    color: "#0082FB",
    abbr: "M",
  },
  {
    org: "IDF",
    title: "Become a UX Designer from Scratch",
    issued: "October 2023",
    credId: "IDF-UX-39821",
    color: "#00A86B",
    abbr: "IDF",
  },
  {
    org: "Awwwards",
    title: "Front-End Developer Certification",
    issued: "July 2023",
    credId: "AWW-FE-2023-441",
    color: "#FF4A1C",
    abbr: "A",
  },
  {
    org: "Adobe",
    title: "Creative Cloud Mastery Programme",
    issued: "April 2023",
    credId: "ADO-CC-2023-21",
    color: "#FF0000",
    abbr: "Ae",
  },
  {
    org: "Coursera",
    title: "Human-Computer Interaction",
    issued: "January 2023",
    credId: "CRS-HCI-2023-7",
    color: "#2A73CC",
    abbr: "Co",
  },
];

export const EXPERIENCE = [
  {
    company: "Atelier Numérique",
    role: "Creative Director",
    period: "2023 — Present",
    description:
      "Leading design direction for a Paris-based digital studio specialising in luxury fashion and lifestyle brands. Overseeing a team of 8 designers across UI, motion, and brand identity disciplines.",
    achievements: [
      "Grew studio revenue 120%",
      "Led 15 luxury brand projects",
      "Established design system practice",
    ],
    tech: ["Figma", "Framer", "After Effects", "Principle"],
  },
  {
    company: "Condé Nast Digital",
    role: "Senior UX Designer",
    period: "2021 — 2023",
    description:
      "Led UX design for Vogue, GQ, and Architectural Digest's digital platforms. Drove a full editorial redesign that became one of the most-awarded media UX projects of 2023.",
    achievements: [
      "2023 Webby Award Winner",
      "73% engagement increase",
      "Managed team of 3 designers",
    ],
    tech: ["Figma", "Webflow", "Hotjar", "Maze"],
  },
  {
    company: "Burberry Digital",
    role: "UI/UX Designer",
    period: "2019 — 2021",
    description:
      "Designed digital touchpoints for Burberry's global e-commerce and in-store experiences. Collaborated with the product team across London, New York, and Shanghai offices.",
    achievements: [
      "£2M+ attributed revenue",
      "Redesigned full checkout flow",
      "Built global component library",
    ],
    tech: ["Sketch", "InVision", "Principle", "Zeplin"],
  },
];

export const SERVICES = [
  {
    n: "01",
    title: "UI Design",
    desc: "Pixel-precise interfaces with obsessive attention to visual hierarchy, motion, and aesthetic craft for fashion and luxury brands.",
  },
  {
    n: "02",
    title: "UX Research",
    desc: "Rigorous user research, usability testing, and insight synthesis — turning assumptions into evidence-backed design decisions.",
  },
  {
    n: "03",
    title: "Brand Identity",
    desc: "Complete visual identity systems from mark inception to full guidelines — built for luxury, made to endure.",
  },
  {
    n: "04",
    title: "Design Systems",
    desc: "Scalable, token-based component libraries that bridge design and engineering for teams of any size.",
  },
  {
    n: "05",
    title: "Web Design",
    desc: "Editorial websites and landing pages with immersive scroll experiences, cinematic layout, and premium interaction design.",
  },
  {
    n: "06",
    title: "Mobile Design",
    desc: "Native iOS and Android experiences that respect platform conventions while pushing aesthetic boundaries.",
  },
];

export const SKILLS = [
  {
    cat: "Design & Prototyping",
    items: ["Figma", "Framer", "Adobe XD", "Principle", "ProtoPie", "Sketch"],
  },
  {
    cat: "Adobe Creative Suite",
    items: [
      "Photoshop",
      "Illustrator",
      "After Effects",
      "InDesign",
      "Premiere Pro",
    ],
  },
  {
    cat: "Front-End",
    items: ["HTML5", "CSS3", "Tailwind CSS", "React", "Framer Motion", "GSAP"],
  },
  {
    cat: "Research & Strategy",
    items: [
      "User Research",
      "Usability Testing",
      "A/B Testing",
      "Journey Mapping",
      "IA",
    ],
  },
];

export const TESTIMONIALS = [
  {
    name: "Claire Dubois",
    role: "CEO, Maison Élite Paris",
    photo:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&h=120&fit=crop&auto=format",
    text: "Sophia understands luxury in a way most digital designers simply don't. She translated the soul of our brand into a digital space that feels genuinely high-end. Our clients noticed immediately.",
  },
  {
    name: "Marcus Webb",
    role: "CPO, Couture Labs",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&auto=format",
    text: "Working with Sophia was like working with someone who had already shipped our product before. Every design decision was intentional and well-argued. The result: half a million downloads in month one.",
  },
  {
    name: "Yuki Tanaka",
    role: "Digital Director, Condé Nast",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&auto=format",
    text: "The Vogue redesign was the most ambitious digital project we'd attempted. Sophia led the UX vision with total clarity and taste. We won a Webby that year.",
  },
];

export const STATS = [
  { value: 62, suffix: "+", label: "Projects" },
  { value: 38, suffix: "", label: "Global Clients" },
  { value: 7, suffix: "+", label: "Years" },
  { value: 14, suffix: "", label: "Awards" },
];

export const BRANDS = [
  "Vogue",
  "Burberry",
  "Condé Nast",
  "Maison Élite",
  "Lumière",
  "LVMH",
  "Net-a-Porter",
  "Farfetch",
  "Adobe",
  "Google",
  "Framer",
  "Couture Labs",
];

export const HERO_WORDS = [
  { text: "Crafting", cls: "text-cream" },
  { text: "digital", cls: "text-gold" },
  { text: "experiences", cls: "text-cream" },
  { text: "for", cls: "text-cream/30" },
  { text: "luxury", cls: "text-gold-light" },
  { text: "fashion.", cls: "text-cream/12" },
];
