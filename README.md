# Sophia Laurent — Portfolio

A premium, fast-loading, mobile-responsive portfolio built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (smooth scroll-linked animations)
- lucide-react icons
- next/image (automatic image optimization: AVIF/WebP)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build for production

```bash
npm run build
npm run start
```

## Structure

- `app/` — App Router entry, layout, global styles, SEO metadata
- `components/` — Nav, Hero, ScrollReveal, Stats, Services, Projects, Certifications, Experience, Testimonials, Contact, Footer
- `data/portfolio.ts` — all editable content (projects, certifications, experience, services, etc.) in one place

## Editing content

Everything you'd want to change day-to-day — project details, certifications, experience, testimonials, stats — lives in `data/portfolio.ts`. No need to touch component code.

## Notes

- The hero and "Philosophy" section use rotating hexagon rings with a scroll-linked word reveal, inspired by the reference designs.
- Fonts (Bodoni Moda + JetBrains Mono) are loaded via `next/font/google` for zero layout shift and no external requests.
- Images are served through `next/image` for automatic resizing/format optimization — swap the Unsplash URLs in `data/portfolio.ts` for your own project images (or local files in `/public`) any time.
- All unused shadcn/Radix UI scaffolding from the original Figma export was removed — this project only ships the packages it actually uses.
