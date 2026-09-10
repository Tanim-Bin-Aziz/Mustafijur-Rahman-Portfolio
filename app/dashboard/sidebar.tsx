"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, Image as ImageIcon, Video, LogOut } from "lucide-react";
import { logout } from "../login/actions";

const navItems = [
  { name: "Project Management", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Picture Management", href: "/dashboard/pictures", icon: ImageIcon },
  { name: "Video Management", href: "/dashboard/videos", icon: Video },
];

export default function Sidebar({ email }: { email: string | undefined }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-full shrink-0 flex-col border-r border-white/10 bg-card md:w-64">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="font-serif text-lg font-semibold text-cream">Admin</p>
        {email && <p className="mt-0.5 truncate text-xs text-cream/45">{email}</p>}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gold/15 text-gold"
                  : "text-cream/60 hover:bg-white/5 hover:text-cream"
              }`}
            >
              <Icon size={17} />
              {name}
            </Link>
          );
        })}
      </nav>

      <form action={logout} className="border-t border-white/10 p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-cream/60 transition-colors hover:bg-white/5 hover:text-cream"
        >
          <LogOut size={17} />
          Log Out
        </button>
      </form>
    </aside>
  );
}
