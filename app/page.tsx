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
import ProjectsGrid from "@/components/ProjectsGrid";
import PixelWarpGallery from "@/components/PixelWarpGallery";
import ImageDisplay from "@/components/ImageDisplay";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <Nav ready={!loading} />
      <main>
        <Hero ready={!loading} />
        {/* <ScrollReveal /> */}
        {/* <Stats /> */}
        {/* <Services /> */}
        {/* <Projects /> */}
        <ImageDisplay
          slides={[
            { src: "/images/img1.jpg", title: "Look 01" },
            { src: "/images/img2.jpg", title: "Look 02" },
            { src: "/images/img3.jpg", title: "Look 03" },
            { src: "/images/img4.jpg", title: "Look 04" },
            { src: "/images/img5.jpg", title: "Look 05" },
          ]}
          autoplay
        />
        <PixelWarpGallery />
        <Certifications />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
