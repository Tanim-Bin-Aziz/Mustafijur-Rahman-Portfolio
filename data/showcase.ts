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
      { src: "/images/Swatch/1.png", alt: "Cotton swatch collection" },
      { src: "/images/Swatch/2.png", alt: "Linen and wool swatch board" },
      { src: "/images/Swatch/3.png", alt: "Seasonal colour swatch layout" },
      { src: "/images/Swatch/4.png", alt: "Seasonal colour swatch layout" },
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

export interface ShowcaseRingItem {
  src: string;
  thumbnail?: string; // image used for the fixed-size ring card (chosen crop)
  cardOffsetX?: number;
  cardOffsetY?: number;
  cardScale?: number;
  title: string;
  category: string;
  location: string;
  videoUrl?: string; // optional looping background video
}

export const SHOWCASE_RING: ShowcaseRingItem[] = [
  {
    src: "/images/denim-pocket/1.png",
    title: "Denim Pocket Front",
    category: "DENIM",
    location: "DHAKA",
  },
  {
    src: "/images/denim-pocket/2.png",
    title: "Denim Pocket Topstitch",
    category: "DENIM",
    location: "DHAKA",
  },
  {
    src: "/images/Swatch/1.png",
    title: "Cotton Swatch Set",
    category: "TEXTILE",
    location: "MILAN",
  },
  {
    src: "/images/Swatch/2.png",
    title: "Linen & Wool Board",
    category: "TEXTILE",
    location: "PARIS",
  },
  {
    src: "/images/Swatch/3.png",
    title: "Seasonal Colourway",
    category: "TEXTILE",
    location: "LONDON",
  },
  {
    src: "/images/Swatch/4.png",
    title: "Swatch Card Layout",
    category: "TEXTILE",
    location: "TOKYO",
  },
  {
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    title: "Look 01 - Summer Edit",
    category: "RUNWAY",
    location: "PARIS",
  },
  {
    src: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
    title: "Look 02 - Studio Lookbook",
    category: "LOOKBOOK",
    location: "MILAN",
  },
  {
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    title: "Look 03 - Street Edit",
    category: "STREETWEAR",
    location: "NEW YORK",
  },
  {
    src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
    title: "Look 04 - Retail Capsule",
    category: "RETAIL",
    location: "LONDON",
  },
  {
    src: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
    title: "Look 05 - Tailored Suiting",
    category: "TAILORING",
    location: "LONDON",
  },
  {
    src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
    title: "Look 06 - Day Dress",
    category: "DRESSES",
    location: "PARIS",
  },
  {
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
    title: "Look 07 - Duo Styling",
    category: "EDITORIAL",
    location: "TOKYO",
  },
  {
    src: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&q=80",
    title: "Look 08 - Evening Statement",
    category: "EVENINGWEAR",
    location: "MILAN",
  },
  {
    src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80",
    title: "Look 09 - Colour Pop Campaign",
    category: "CAMPAIGN",
    location: "NEW YORK",
  },
  {
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80",
    title: "Look 10 - Portrait Knits",
    category: "KNITWEAR",
    location: "LONDON",
  },
  {
    src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
    title: "Look 11 - Denim Layering",
    category: "DENIM",
    location: "DHAKA",
  },
  {
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    title: "Look 12 - Movement Study",
    category: "SILK",
    location: "PARIS",
  },
  {
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    title: "Look 13 - Street Diaries",
    category: "STREETWEAR",
    location: "TOKYO",
  },
  {
    src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
    title: "Look 14 - Drape Silhouette",
    category: "EVENINGWEAR",
    location: "MILAN",
  },
  {
    src: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&q=80",
    title: "Look 15 - Knit Texture",
    category: "KNITWEAR",
    location: "MILAN",
  },
  {
    src: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80",
    title: "Look 16 - Fabric Bolts",
    category: "TEXTILE",
    location: "DHAKA",
  },
  {
    src: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&q=80",
    title: "Look 17 - Atelier Process",
    category: "ATELIER",
    location: "DHAKA",
  },
  {
    src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80",
    title: "Look 18 - Materials Palette",
    category: "TEXTILE",
    location: "DHAKA",
  },
];
