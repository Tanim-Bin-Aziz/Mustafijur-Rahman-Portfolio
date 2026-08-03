import { CheckCircle } from "lucide-react";
import { FadeUp, Tag } from "./Motion";
import { EXPERIENCE } from "@/data/portfolio";

export default function Experience() {
  return (
    <section id="experience" className="relative py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <Tag>Career Path</Tag>
          <h2 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight mb-16 max-w-2xl">
            Seven years of <span className="text-gold">craft.</span>
          </h2>
        </FadeUp>

        <div className="flex flex-col">
          {EXPERIENCE.map((e, i) => (
            <FadeUp
              key={e.company}
              delay={i * 0.08}
              className="grid md:grid-cols-[160px_1fr] gap-4 md:gap-10 py-10 border-t border-cream/[0.08] last:border-b"
            >
              <div className="text-cream/40 text-sm font-mono">{e.period}</div>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
                  <h3 className="font-serif italic font-bold text-2xl">{e.role}</h3>
                  <span className="text-gold text-sm">@ {e.company}</span>
                </div>
                <p className="text-cream/50 text-sm leading-relaxed mb-4 max-w-2xl">
                  {e.description}
                </p>
                <ul className="flex flex-col gap-1.5 mb-4">
                  {e.achievements.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-cream/65">
                      <CheckCircle size={13} className="text-gold shrink-0" /> {a}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {e.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-3 py-1 border border-cream/15 text-cream/50 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
