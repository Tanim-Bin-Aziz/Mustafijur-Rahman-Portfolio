import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import Sidebar from "./sidebar";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-bg text-cream">
      <Nav />
      <Sidebar />
      <main className="pt-20 md:pl-64">
        <div className="p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
