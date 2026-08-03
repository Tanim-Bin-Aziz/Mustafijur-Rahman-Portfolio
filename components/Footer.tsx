import { Linkedin, Twitter, Dribbble, Instagram } from "lucide-react";

const SOCIALS = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Dribbble, href: "#", label: "Dribbble" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="border-t border-cream/[0.06] py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <span className="text-cream/30 text-xs font-mono">
          © {new Date().getFullYear()} Sophia Laurent. All rights reserved.
        </span>
        <div className="flex items-center gap-5">
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="text-cream/30 hover:text-gold transition-colors"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
