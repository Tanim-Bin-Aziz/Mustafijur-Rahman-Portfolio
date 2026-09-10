"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, Image as ImageIcon, Video } from "lucide-react";

const navItems = [
  { name: "Project Management", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Picture Management", href: "/dashboard/pictures", icon: ImageIcon },
  { name: "Video Management", href: "/dashboard/videos", icon: Video },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-20 z-40 hidden h-[calc(100vh-5rem)] w-64 shrink-0 flex-col border-r border-cream/10 bg-[#0d0d0cf2] backdrop-blur-2xl md:flex">
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#8DB355]/15 text-[#8DB355]"
                  : "text-cream/60 hover:bg-cream/5 hover:text-[#8DB355]"
              }`}
            >
              <Icon size={17} />
              {name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
