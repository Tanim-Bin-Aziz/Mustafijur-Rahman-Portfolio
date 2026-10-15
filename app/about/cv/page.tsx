import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Download, FileText } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getActiveCv } from "@/lib/cv";

export default async function AboutCvPage() {
  const cv = await getActiveCv();

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#09090a] px-6 pb-20 pt-32">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/about"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#F4EEE3]/50 transition-colors hover:text-[#8db355]"
          >
            <ArrowLeft size={15} />
            Back to about
          </Link>

          {cv && (
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              {cv.title && (
                <h1 className="font-serif text-5xl italic text-[#F4EEE3] md:text-6xl">
                  {cv.title}
                </h1>
              )}

              <div className="ml-auto flex items-center gap-2">
                <a
                  href={cv.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#8DB355] px-4 py-2 text-xs font-semibold text-[#0B0908] transition-colors hover:bg-[#9cc163]"
                >
                  <Download size={13} />
                  Download PDF
                </a>
                <a
                  href={cv.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 px-4 py-2 text-xs text-[#F4EEE3]/60 transition-colors hover:border-white/25 hover:text-[#F4EEE3]"
                >
                  Open full size
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          )}

          {cv ? (
            <div
              className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl"
              style={{ aspectRatio: "210 / 297" }}
            >
              <iframe
                src={`${cv.fileUrl}#pagemode=none&view=Fit`}
                title={cv.title || "CV"}
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center">
              <FileText size={44} className="mx-auto text-[#F4EEE3]/20" />
              <p className="mt-4 text-[#F4EEE3]/70">No CV uploaded yet.</p>
              <p className="mt-2 text-sm text-[#F4EEE3]/40">
                Upload a CV PDF from the dashboard and it will show up right
                here.
              </p>
              <Link
                href="/dashboard/cv"
                className="mt-6 inline-flex rounded-full border border-[#8DB355]/40 px-6 py-2.5 text-sm text-[#8DB355] transition-colors hover:bg-[#8DB355]/10"
              >
                Go to CV management
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
