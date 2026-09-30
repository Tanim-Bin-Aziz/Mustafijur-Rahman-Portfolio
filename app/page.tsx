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

export default function Home() {
  const [loading, setLoading] = useState(true);
  const items = [
    {
      src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&q=80",
      title: "The Palm Court Residences",
      category: "VILLAS",
      location: "DUBAI",
    },
    {
      src: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=400&q=80",
      title: "Lumen Boulevard",
      category: "LUXURY APARTMENTS",
      location: "MUMBAI",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
      title: "Azure Heights",
      category: "PENTHOUSES",
      location: "DUBAI",
    },
    {
      src: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80",
      title: "The Grand Veranda",
      category: "VILLAS",
      location: "MIAMI",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
      title: "Opal Residences",
      category: "LUXURY APARTMENTS",
      location: "SINGAPORE",
    },
    {
      src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
      title: "The Ivory Estate",
      category: "ESTATES",
      location: "LONDON",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&q=80",
      title: "Crescent Bay",
      category: "WATERFRONT HOMES",
      location: "DOHA",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
      title: "Elysian Gardens",
      category: "VILLAS",
      location: "ABU DHABI",
    },

    {
      src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
      title: "The Grand Arc",
      category: "LUXURY APARTMENTS",
      location: "PARIS",
    },
    {
      src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
      title: "Verde Estate",
      category: "ESTATES",
      location: "LONDON",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&q=80",
      title: "Pearl Marina",
      category: "SKY RESIDENCES",
      location: "ABU DHABI",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
      title: "Aurora Heights",
      category: "PENTHOUSES",
      location: "TOKYO",
    },
    {
      src: "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=400&q=80",
      title: "Monaco Gardens",
      category: "VILLAS",
      location: "MONACO",
    },
    {
      src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&q=80",
      title: "The Regent Towers",
      category: "APARTMENTS",
      location: "NEW YORK",
    },
    {
      src: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=400&q=80",
      title: "Crystal Bay",
      category: "WATERFRONT HOMES",
      location: "SINGAPORE",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
      title: "Maison Royale",
      category: "ESTATES",
      location: "PARIS",
    },

    {
      src: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80",
      title: "Palm Vista",
      category: "VILLAS",
      location: "DUBAI",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
      title: "Luna Residences",
      category: "LUXURY APARTMENTS",
      location: "MUMBAI",
    },
    {
      src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
      title: "The Emerald Court",
      category: "PENTHOUSES",
      location: "LONDON",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&q=80",
      title: "Blue Horizon",
      category: "WATERFRONT HOMES",
      location: "MIAMI",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
      title: "Golden Sands",
      category: "VILLAS",
      location: "DOHA",
    },
    {
      src: "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=400&q=80",
      title: "The Imperial House",
      category: "ESTATES",
      location: "ABU DHABI",
    },
    {
      src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&q=80",
      title: "Nova Skyline",
      category: "SKY RESIDENCES",
      location: "DUBAI",
    },
    {
      src: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=400&q=80",
      title: "Azure Palace",
      category: "PENTHOUSES",
      location: "SINGAPORE",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
      title: "The Willow Estate",
      category: "ESTATES",
      location: "LONDON",
    },
    {
      src: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80",
      title: "Marina Crown",
      category: "WATERFRONT HOMES",
      location: "MONACO",
    },

    {
      src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
      title: "Celestial Towers",
      category: "LUXURY APARTMENTS",
      location: "TOKYO",
    },
    {
      src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
      title: "Royal Orchid",
      category: "VILLAS",
      location: "BANGKOK",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&q=80",
      title: "The Sapphire Bay",
      category: "WATERFRONT HOMES",
      location: "DOHA",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
      title: "Eclipse Residences",
      category: "SKY RESIDENCES",
      location: "NEW YORK",
    },
    {
      src: "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=400&q=80",
      title: "Casa Aurelia",
      category: "VILLAS",
      location: "MIAMI",
    },
    {
      src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&q=80",
      title: "The Grand Meridian",
      category: "PENTHOUSES",
      location: "DUBAI",
    },
    {
      src: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=400&q=80",
      title: "Pearl Heights",
      category: "APARTMENTS",
      location: "MUMBAI",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
      title: "Maison Lumiere",
      category: "ESTATES",
      location: "PARIS",
    },
    {
      src: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80",
      title: "Ocean Crest",
      category: "WATERFRONT HOMES",
      location: "SINGAPORE",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
      title: "The Elite Court",
      category: "LUXURY APARTMENTS",
      location: "LONDON",
    },

    {
      src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
      title: "Serenity Villa",
      category: "VILLAS",
      location: "ABU DHABI",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&q=80",
      title: "Azure Marina",
      category: "WATERFRONT HOMES",
      location: "DUBAI",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
      title: "The Crown Tower",
      category: "SKY RESIDENCES",
      location: "NEW YORK",
    },
    {
      src: "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=400&q=80",
      title: "Eden Palace",
      category: "ESTATES",
      location: "MONACO",
    },
    {
      src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&q=80",
      title: "Velvet Heights",
      category: "PENTHOUSES",
      location: "PARIS",
    },
    {
      src: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=400&q=80",
      title: "The Horizon Residences",
      category: "LUXURY APARTMENTS",
      location: "TOKYO",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
      title: "Palm Royale",
      category: "VILLAS",
      location: "DUBAI",
    },
    {
      src: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80",
      title: "Coral Bay Estate",
      category: "WATERFRONT HOMES",
      location: "MIAMI",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
      title: "The Grand Opal",
      category: "APARTMENTS",
      location: "SINGAPORE",
    },
    {
      src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
      title: "Royal Garden Residence",
      category: "ESTATES",
      location: "LONDON",
    },

    {
      src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&q=80",
      title: "Silver Palm",
      category: "VILLAS",
      location: "DOHA",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
      title: "Luna Skyline",
      category: "SKY RESIDENCES",
      location: "DUBAI",
    },
    {
      src: "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=400&q=80",
      title: "The Grand Pearl",
      category: "PENTHOUSES",
      location: "MUMBAI",
    },
    {
      src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&q=80",
      title: "Elysian Court",
      category: "LUXURY APARTMENTS",
      location: "PARIS",
    },
    {
      src: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=400&q=80",
      title: "Oceanic Residence",
      category: "WATERFRONT HOMES",
      location: "ABU DHABI",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
      title: "The Ivory Palace",
      category: "ESTATES",
      location: "MONACO",
    },
    {
      src: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80",
      title: "Crescent Villas",
      category: "VILLAS",
      location: "DUBAI",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
      title: "Nova Court",
      category: "APARTMENTS",
      location: "LONDON",
    },
    {
      src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
      title: "The Azure Estate",
      category: "ESTATES",
      location: "MIAMI",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&q=80",
      title: "Marina Royale",
      category: "WATERFRONT HOMES",
      location: "SINGAPORE",
    },

    {
      src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
      title: "The Lumina Tower",
      category: "SKY RESIDENCES",
      location: "NEW YORK",
    },
    {
      src: "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=400&q=80",
      title: "Golden Horizon",
      category: "PENTHOUSES",
      location: "DUBAI",
    },
    {
      src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&q=80",
      title: "Serene Boulevard",
      category: "LUXURY APARTMENTS",
      location: "TOKYO",
    },
    {
      src: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=400&q=80",
      title: "The Royal Veranda",
      category: "VILLAS",
      location: "ABU DHABI",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
      title: "Emerald Heights",
      category: "PENTHOUSES",
      location: "LONDON",
    },
    {
      src: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80",
      title: "Crystal Marina",
      category: "WATERFRONT HOMES",
      location: "MONACO",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
      title: "The Grand Lumina",
      category: "APARTMENTS",
      location: "MUMBAI",
    },
    {
      src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
      title: "Aurelia Estate",
      category: "ESTATES",
      location: "PARIS",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&q=80",
      title: "Palm Azure",
      category: "VILLAS",
      location: "DUBAI",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
      title: "The Meridian Court",
      category: "SKY RESIDENCES",
      location: "SINGAPORE",
    },
  ];
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
        <AuroraRingGallery items={items} />
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
