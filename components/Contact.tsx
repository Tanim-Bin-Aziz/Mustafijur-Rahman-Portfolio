import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { FadeUp, Tag } from "./Motion";

export default function Contact() {
  return (
    <section id="contact" className="relative py-28 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <FadeUp>
          <Tag>
            <span className="mx-auto">Get In Touch</span>
          </Tag>
        </FadeUp>

        <FadeUp delay={0.05}>
          <h2 className="font-serif font-black italic text-4xl md:text-7xl tracking-tight mb-8">
            Let&apos;s build something <span className="text-gold">timeless.</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="text-cream/45 max-w-xl mx-auto mb-12 leading-relaxed">
            Currently accepting select engagements for Q1 2026. If you&apos;re
            building something ambitious, I&apos;d love to hear about it.
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <a
            href="mailto:hello@sophialaurent.design"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-bg font-semibold hover:bg-gold-light transition-colors duration-300 mb-14"
          >
            hello@sophialaurent.design <ArrowUpRight size={16} />
          </a>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="grid sm:grid-cols-3 gap-6 text-sm text-cream/50">
            <div className="flex flex-col items-center gap-2">
              <Mail size={16} className="text-gold" />
              hello@sophialaurent.design
            </div>
            <div className="flex flex-col items-center gap-2">
              <Phone size={16} className="text-gold" />
              +33 1 42 00 00 00
            </div>
            <div className="flex flex-col items-center gap-2">
              <MapPin size={16} className="text-gold" />
              Paris, France
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
