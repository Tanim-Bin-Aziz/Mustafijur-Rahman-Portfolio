"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Experience from "@/components/Experience";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PixelWarpGallery from "@/components/PixelWarpGallery";
import ImageDisplay from "@/components/ImageDisplay";
import AuroraRingGallery from "@/components/AuroraRingGallery";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import type { ShowcaseRingItem } from "@/data/showcase";
import type { Project } from "@/lib/projects";
import type { ShowcaseVideoCard } from "@/lib/showcase";
import type { Certificate } from "@/lib/certificates";
import type { SiteReview } from "@/lib/reviews";

export default function HomePage({
  items,
  certificates,
  showcaseVideos,
  heroVideoUrl,
  reviews,
  projectGroups,
}: {
  items: ShowcaseRingItem[];
  certificates: Certificate[];
  showcaseVideos: ShowcaseVideoCard[];
  heroVideoUrl: string;
  reviews: SiteReview[];
  projectGroups: { label: string; slug: string; projects: Project[] }[];
}) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <Nav ready={!loading} />
      <main>
        <Hero ready={!loading} videoUrl={heroVideoUrl} />
        {/* <ScrollReveal /> */}
        {/* <Stats /> */}
        {/* <Services /> */}
        {/* <Projects /> */}
        <AuroraRingGallery items={items} />

        {projectGroups.some((g) => g.projects.length > 0) && (
          <section className="relative py-20 px-6 bg-[#0d0d0a]">
            <div className="max-w-6xl mx-auto">
              <div className="mb-10 text-center">
                <h2 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight text-[#F4EEE3]">
                  Projects
                </h2>
              </div>
              <div className="space-y-10">
                {projectGroups
                  .filter((g) => g.projects.length > 0)
                  .map((group) => (
                    <div key={group.slug} className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6 items-start">
                      <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-[#8db355] pt-3">
                        {group.label}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {group.projects.map((p) => (
                          <ProjectCard
                            key={p.id}
                            title={p.title}
                            cover={p.cover}
                            previewImages={p.previewImages}
                            href={`/portfolio/${group.slug}/${p.slug}`}
                            priority={false}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="mt-10 flex justify-center">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm text-[#F4EEE3]/70 hover:text-[#8db355] hover:border-[#8db355]/50 transition-colors"
                >
                  View more →
                </Link>
              </div>
            </div>
          </section>
        )}
        {/* <ImageDisplay
          slides={[
            { src: "/images/img1.jpg", title: "Look 01" },
            { src: "/images/img2.jpg", title: "Look 02" },
            { src: "/images/img3.jpg", title: "Look 03" },
            { src: "/images/img4.jpg", title: "Look 04" },
            { src: "/images/img5.jpg", title: "Look 05" },
          ]}
          autoplay
        /> */}
        {showcaseVideos.length > 0 && (
          <PixelWarpGallery
            items={showcaseVideos.map((card) => ({
              label: card.label || undefined,
              video: card.videoUrl,
            }))}
          />
        )}
        <Certifications certificates={certificates} />
        <Testimonials reviews={reviews} />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
