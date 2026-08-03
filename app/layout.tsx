import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const serif = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mustafijur Rahman — Creative Director & Product Designer",
  description:
    "Portfolio of Sophia Laurent, a Paris-based Creative Director & Product Designer crafting premium digital experiences for luxury fashion and lifestyle brands.",
  keywords: [
    "portfolio",
    "creative director",
    "product designer",
    "UI/UX design",
    "luxury brand design",
  ],
  metadataBase: new URL("https://mustafijurrahman.design"),
  openGraph: {
    title: "Mustafijur Rahman — Creative Director & Product Designer",
    description:
      "Dhaka-based Creative Director crafting premium digital experiences for luxury fashion & lifestyle brands.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#09090A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body className="antialiased overflow-x-hidden">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
