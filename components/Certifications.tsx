import Image from "next/image";
import { FileText } from "lucide-react";
import type { Certificate } from "@/lib/certificates";

function looksPdf(url: string) {
  return url.toLowerCase().split("?")[0].endsWith(".pdf");
}

export default function Certifications({
  certificates,
}: {
  certificates: Certificate[];
}) {
  if (certificates.length === 0) return null;

  return (
    <section className="w-full bg-[#f7f6f4] px-6 py-20">
      <div className="mx-auto mb-14 max-w-5xl text-center">
        <h2 className="font-black text-4xl tracking-tight text-[#0B0908] md:text-6xl">
          Certificates
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[#0B0908]/60 md:text-lg">
          Certifications, awards and recognitions.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((certificate) => {
          const pdf = looksPdf(certificate.fileUrl);

          return (
            <a
              key={certificate.id}
              href={certificate.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-xl border border-[#0B0908]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f0eeea]">
                {pdf ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <FileText
                      size={44}
                      className="text-[#0B0908]/25 transition-colors group-hover:text-red-500"
                    />
                  </div>
                ) : (
                  <Image
                    src={certificate.fileUrl}
                    alt={certificate.title}
                    fill
                    sizes="(max-width:640px) 92vw, (max-width:1024px) 46vw, 30vw"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {pdf && (
                  <span className="absolute right-3 top-3 rounded-full bg-red-500/90 px-2.5 py-1 font-mono text-[10px] tracking-widest text-white">
                    PDF
                  </span>
                )}
              </div>

              <div className="px-4 py-4">
                <p className="font-bold text-[#0B0908]">{certificate.title}</p>
                {certificate.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-[#0B0908]/60">
                    {certificate.description}
                  </p>
                )}
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8DB355]">
                  View {pdf ? "PDF" : "certificate"} +
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
