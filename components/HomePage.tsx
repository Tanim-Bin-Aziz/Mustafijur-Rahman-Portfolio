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
import ImageGallerySystem from "@/components/ImageGallerySystem";
import HomeVideoSections, {
  type HomeVideoSection,
} from "@/components/HomeVideoSections";
import Image from "next/image";
import type { ShowcaseRingItem } from "@/data/showcase";
import type { Project } from "@/lib/projects";
import type { GalleryFolder, GalleryImage } from "@/lib/gallery";
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
  galleryFolders,
  galleryImages,
  videoSections,
}: {
  items: ShowcaseRingItem[];
  certificates: Certificate[];
  showcaseVideos: ShowcaseVideoCard[];
  heroVideoUrl: string;
  reviews: SiteReview[];
  projectGroups: { label: string; slug: string; projects: Project[] }[];
  galleryFolders: GalleryFolder[];
  galleryImages: GalleryImage[];
  videoSections: HomeVideoSection[];
}) {
  const [loading, setLoading] = useState(true);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const [galleryOpen, setGalleryOpen] = useState(false);

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
          <section className="relative py-20 px-6 md:px-10 bg-[#0d0d0a]">
            <div className="max-w-7xl mx-auto">
              <div className="space-y-20">
                {projectGroups
                  .filter((g) => g.projects.length > 0)
                  .map((group) => {
                    const visible = visibleCounts[group.slug] ?? 12;
                    const shown = group.projects.slice(0, visible);
                    const hasMore = visible < group.projects.length;
                    return (
                      <div key={group.slug}>
                        <div className="mb-8 text-center">
                          <h2 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight text-[#F4EEE3]">
                            {group.label}
                          </h2>
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-12 px-2">
                          {shown.map((p) => (
                            <div
                              key={p.id}
                              className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(25%-24px)]"
                            >
                              <ProjectCard
                                title={p.title}
                                cover={p.cover}
                                previewImages={p.previewImages}
                                href={`/portfolio/${group.slug}/${p.slug}`}
                                priority={false}
                              />
                            </div>
                          ))}
                        </div>
                        {hasMore && (
                          <div className="mt-8 flex justify-center">
                            <button
                              type="button"
                              onClick={() =>
                                setVisibleCounts((prev) => ({
                                  ...prev,
                                  [group.slug]: Math.min(
                                    (prev[group.slug] ?? 12) + 12,
                                    group.projects.length,
                                  ),
                                }))
                              }
                              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm text-[#F4EEE3]/70 hover:text-[#8db355] hover:border-[#8db355]/50 transition-colors"
                            >
                              View more →
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>
        )}
        {galleryImages.length > 0 && (
          <section className="relative py-20 px-6 bg-[#0d0d0a] border-t border-white/5">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 text-center">
                <h2 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight text-[#F4EEE3]">
                  Gallery
                </h2>
              </div>
              {!galleryOpen ? (
                <div className="relative rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {galleryImages.slice(0, 12).map((img) => (
                      <div
                        key={img.id}
                        className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40"
                      >
                        <Image
                          src={img.imageUrl}
                          alt={img.title}
                          fill
                          sizes="(max-width:640px) 33vw, (max-width:1024px) 25vw, 16vw"
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 rounded-b-3xl bg-gradient-to-t from-[#0d0d0a] via-[#0d0d0a]/85 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex justify-center pb-5">
                    <button
                      type="button"
                      onClick={() => setGalleryOpen(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0d0d0a]/80 px-6 py-2.5 text-sm text-[#F4EEE3]/70 hover:text-[#8db355] hover:border-[#8db355]/50 transition-colors"
                    >
                      View more →
                    </button>
                  </div>
                </div>
              ) : (
                <ImageGallerySystem folders={galleryFolders} images={galleryImages} />
              )}
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
        <HomeVideoSections sections={videoSections} />
        <Certifications certificates={certificates} />
        <Testimonials reviews={reviews} />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
