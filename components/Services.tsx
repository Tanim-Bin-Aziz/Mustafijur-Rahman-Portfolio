import { FadeUp, Tag } from "./Motion";
import { SERVICES, SKILLS } from "@/data/portfolio";

export default function Services() {
  return (
    <section id="services" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <Tag>What I Do</Tag>
          <h2 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight mb-16 max-w-2xl">
            Services built for <span className="text-gold">luxury craft.</span>
          </h2>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-cream/[0.06] mb-24">
          {SERVICES.map((s, i) => (
            <FadeUp key={s.n} delay={i * 0.06} className="bg-bg p-8 hover:bg-card transition-colors duration-300 group">
              <span className="font-mono text-gold/60 text-xs">{s.n}</span>
              <h3 className="font-serif italic font-bold text-2xl mt-4 mb-3 group-hover:text-gold transition-colors">
                {s.title}
              </h3>
              <p className="text-cream/45 text-sm leading-relaxed">{s.desc}</p>
            </FadeUp>
          ))}
        </div>

        <FadeUp>
          <Tag>Toolkit</Tag>
        </FadeUp>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {SKILLS.map((group, i) => (
            <FadeUp key={group.cat} delay={i * 0.08}>
              <h4 className="text-xs tracking-[0.2em] uppercase text-cream/40 font-mono mb-4">
                {group.cat}
              </h4>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-cream/70 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
