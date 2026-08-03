import { Award } from "lucide-react";
import { FadeUp, Tag } from "./Motion";
import { CERTIFICATIONS } from "@/data/portfolio";

export default function Certifications() {
  return (
    <section id="certifications" className="relative py-28 px-6 bg-card/40">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <Tag>Credentials</Tag>
          <h2 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight mb-16 max-w-2xl">
            Certifications & <span className="text-gold">training.</span>
          </h2>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CERTIFICATIONS.map((c, i) => (
            <FadeUp
              key={c.credId}
              delay={i * 0.05}
              className="p-6 border border-cream/[0.08] hover:border-gold/40 transition-colors duration-300 group"
            >
              <div className="flex items-center justify-between mb-5">
                <span
                  className="w-10 h-10 flex items-center justify-center rounded-full text-xs font-bold font-mono"
                  style={{ backgroundColor: `${c.color}22`, color: c.color }}
                >
                  {c.abbr}
                </span>
                <Award size={16} className="text-cream/20 group-hover:text-gold transition-colors" />
              </div>
              <h3 className="font-semibold text-cream mb-1.5 leading-snug">{c.title}</h3>
              <p className="text-cream/40 text-xs mb-4 font-mono">{c.org}</p>
              <div className="flex items-center justify-between text-[10px] text-cream/30 font-mono border-t border-cream/[0.06] pt-3">
                <span>{c.issued}</span>
                <span>{c.credId}</span>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
