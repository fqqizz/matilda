import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/context/StoreContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { SearchModal } from "@/components/ui/SearchModal";
import { QuickViewModal } from "@/components/ui/QuickViewModal";
import { CustomCursor } from "@/components/ui/CustomCursor";

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
    icon: "/images/matilda-logo-leopard-transparent.png",
    apple: "/images/matilda-logo-leopard-transparent.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans bg-[#FFFDF9] text-[#191414] antialiased min-h-screen flex flex-col justify-between selection:bg-[#3A080C] selection:text-[#E4C98A]">
        <StoreProvider>
          <Preloader />
          <CustomCursor />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />

          {/* Global Interactive Overlays */}
          <CartDrawer />
          <SearchModal />
          <QuickViewModal />
        </StoreProvider>
      </body>
    </html>
  );
}
