import type { Metadata } from "next";
import { Cormorant_Garamond, Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/context/StoreContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { SearchModal } from "@/components/ui/SearchModal";
import { QuickViewModal } from "@/components/ui/QuickViewModal";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { MusicToggle } from "@/components/ui/MusicToggle";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://matildajewellery.com"),
  title: "MATILDA | Timeless Jewellery by Duha Ajaz Pandith",
  description:
    "Timeless silhouettes offering the look of fine jewellery at a fraction of the cost. Delivery across India. Curated pendants, waist chains, enamel bangles, and Marathi nose rings.",
  keywords: [
    "MATILDA jewellery",
    "Duha Ajaz Pandith",
    "waist chain",
    "enamel bangles",
    "gothic star pendant",
    "marathi nath",
    "affordable fine jewellery India",
  ],
  authors: [{ name: "Duha Ajaz Pandith" }],
  openGraph: {
    title: "MATILDA | Timeless Jewellery",
    description:
      "Timeless silhouettes offering the look of fine jewellery at a fraction of the cost. Delivery across India.",
    url: "https://matildajewellery.com",
    siteName: "MATILDA",
    images: [
      {
        url: "/images/hero-campaign-shot.png",
        width: 1200,
        height: 630,
        alt: "MATILDA Jewellery Campaign",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/favicon.png"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${instrument.variable} ${manrope.variable}`}
    >
      <body className="font-sans bg-[#FFFDF9] text-[#191414] antialiased min-h-screen flex flex-col justify-between selection:bg-[#1A0205] selection:text-[#E4C98A]">
        <StoreProvider>
          <Preloader />
          <CustomCursor />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />

          {/* Global Interactive Overlays */}
          <MusicToggle />
          <CartDrawer />
          <SearchModal />
          <QuickViewModal />
        </StoreProvider>
      </body>
    </html>
  );
}
