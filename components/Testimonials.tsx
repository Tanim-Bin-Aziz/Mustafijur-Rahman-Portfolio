import Image from "next/image";
import { Quote } from "lucide-react";
import { FadeUp, Tag } from "./Motion";
import { TESTIMONIALS } from "@/data/portfolio";

export default function Testimonials() {
  return (
    <section className="relative py-28 px-6 bg-card/40">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <Tag>Kind Words</Tag>
          <h2 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight mb-16 max-w-2xl">
            Trusted by <span className="text-gold">industry leaders.</span>
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <FadeUp
              key={t.name}
              delay={i * 0.08}
              className="p-7 border border-cream/[0.08] flex flex-col"
            >
              <Quote size={22} className="text-gold/50 mb-4" />
              <p className="text-cream/60 text-sm leading-relaxed mb-6 flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Image src={t.photo} alt={t.name} fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-cream">{t.name}</div>
                  <div className="text-xs text-cream/40">{t.role}</div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
