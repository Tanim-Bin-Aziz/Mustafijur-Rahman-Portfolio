export interface ShowcaseCategory {
  id: string;
  label: string;
  title: string;
  images: { src: string; alt: string }[];
  details: string[];
  pptxHref?: string;
  pdfHref?: string;
}

export const SHOWCASE: ShowcaseCategory[] = [
  {
    id: "denim-pocket",
    label: "Denim Pocket",
    title: "Denim Pocket",
    images: [
      { src: "/images/denim-pocket/1.png", alt: "Denim pocket front view" },
      {
        src: "/images/denim-pocket/2.png",
        alt: "Denim pocket stitch detail",
      },
    ],
    details: [
      "Raw selvedge denim, 14oz",
      "Reinforced bar-tack corners",
      "Contrast top-stitch in gold thread",
      "Hand distressed edge finish",
    ],
    pptxHref: "/files/denim-pocket-deck.pptx",
    pdfHref: "/files/denim-pocket-case-study.pdf",
  },
  {
    id: "swatch",
    label: "Swatch",
    title: "Fabric Swatch Library",
    images: [
      { src: "/images/swatch/1.png", alt: "Cotton swatch collection" },
      { src: "/images/swatch/2.png", alt: "Linen and wool swatch board" },
      { src: "/images/swatch/3.png", alt: "Seasonal colour swatch layout" },
      { src: "/images/swatch/4.png", alt: "Seasonal colour swatch layout" },
    ],
    details: [
      "24 fabric variants catalogued",
      "Organic cotton, linen, and wool blends",
      "Seasonal colourway mapping",
      "Sourced from certified sustainable mills",
    ],
    pptxHref: "/files/swatch-library-deck.pptx",
    pdfHref: "/files/swatch-library.pdf",
  },
  {
    id: "t-shirt",
    label: "T-shirt",
    title: "Signature T-shirt",
    images: [
      { src: "/projects/t-shirt/1.webp", alt: "T-shirt front on model" },
      { src: "/projects/t-shirt/2.webp", alt: "T-shirt fabric close-up" },
      { src: "/projects/t-shirt/3.webp", alt: "T-shirt back print detail" },
    ],
    details: [
      "180gsm combed cotton jersey",
      "Relaxed drop-shoulder fit",
      "Water-based screen print",
      "Garment-dyed for soft hand-feel",
    ],
    pptxHref: "/files/t-shirt-deck.pptx",
    pdfHref: "/files/t-shirt-case-study.pdf",
  },
  {
    id: "combination",
    label: "Combination",
    title: "Combination Set",
    images: [
      {
        src: "/projects/combination/1.webp",
        alt: "Full combination outfit styled",
      },
      {
        src: "/projects/combination/2.webp",
        alt: "Combination layering detail",
      },
      { src: "/projects/combination/3.webp", alt: "Combination set flat lay" },
    ],
    details: [
      "Modular top and bottom pairing",
      "Cross-textile combination: denim + jersey",
      "Interchangeable layering system",
      "Designed for a capsule collection",
    ],
    pptxHref: "/files/combination-deck.pptx",
    pdfHref: "/files/combination-case-study.pdf",
  },
  {
    id: "artwork",
    label: "Artwork",
    title: "Print Artwork",
    images: [
      {
        src: "/projects/artwork/1.webp",
        alt: "Original print artwork concept",
      },
      { src: "/projects/artwork/2.webp", alt: "Artwork colour separation" },
      {
        src: "/projects/artwork/3.webp",
        alt: "Artwork applied to garment mockup",
      },
    ],
    details: [
      "Hand-illustrated original artwork",
      "4-colour separation for screen print",
      "Repeat pattern engineered for yardage",
      "Vector-finalised for production",
    ],
    pptxHref: "/files/artwork-deck.pptx",
    pdfHref: "/files/artwork-case-study.pdf",
  },
  {
    id: "flat-sketch",
    label: "Flat sketch",
    title: "Technical Flat Sketch",
    images: [
      {
        src: "/projects/flat-sketch/1.webp",
        alt: "Front technical flat sketch",
      },
      {
        src: "/projects/flat-sketch/2.webp",
        alt: "Back technical flat sketch",
      },
      {
        src: "/projects/flat-sketch/3.webp",
        alt: "Technical sketch with measurement callouts",
      },
    ],
    details: [
      "Front and back CAD flats",
      "Stitch and seam callouts labelled",
      "Measurement spec included",
      "Production-ready tech pack format",
    ],
    pptxHref: "/files/flat-sketch-deck.pptx",
    pdfHref: "/files/flat-sketch-tech-pack.pdf",
  },
];
