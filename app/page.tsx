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
        <ProjectsGrid />
        <Certifications />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
