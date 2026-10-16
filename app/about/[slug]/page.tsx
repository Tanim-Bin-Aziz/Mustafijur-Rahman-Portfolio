import { notFound } from "next/navigation";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProfileView from "@/components/profile/ProfileView";
import { getProfile } from "@/lib/profile";
import { getAboutItem } from "@/lib/about";

export default async function AboutDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getAboutItem(slug);

  if (!item) return notFound();

  if (slug === "profile") {
    const profile = await getProfile();
    return <ProfileView profile={profile} />;
  }

  return (
    <>
      <Nav />
      <main className="bg-[#09090a] min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#8db355] mb-6">
            About
          </p>
          <h1 className="font-serif italic text-5xl md:text-6xl mb-10 text-[#F4EEE3]">
            {item.title}
          </h1>

          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 mb-10">
            <Image
              src={item.cover}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>

          <p className="text-lg leading-8 text-[#F4EEE3]/70 font-light">
            {item.description}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
