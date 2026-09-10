import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

  // Middleware eta already handle kore, kintu direct server-render-e o
  // extra safety hishebe check kora thakche
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-bg text-cream">
      <Sidebar email={user.email} />
      <main className="flex-1 overflow-y-auto p-6 sm:p-8">{children}</main>
    </div>
  );
}
