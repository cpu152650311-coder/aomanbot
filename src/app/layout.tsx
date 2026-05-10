import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aomanbot.com"),
  title: {
    default: "AOMAN FUTURE – Advanced Service Robots",
    template: "%s | AOMAN FUTURE",
  },
  description:
    "AOMAN FUTURE designs and manufactures advanced service robots for delivery, hospitality, healthcare, and industrial applications. Discover our L, S, and CADE series.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.aomanbot.com",
    siteName: "AOMAN FUTURE",
    title: "AOMAN FUTURE – Advanced Service Robots",
    description:
      "AOMAN FUTURE designs and manufactures advanced service robots for delivery, hospitality, healthcare, and industrial applications. Discover our L, S, and CADE series.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AOMAN FUTURE Robots",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aomanfuture",
    creator: "@aomanfuture",
    title: "AOMAN FUTURE – Advanced Service Robots",
    description:
      "AOMAN FUTURE designs and manufactures advanced service robots for delivery, hospitality, healthcare, and industrial applications. Discover our L, S, and CADE series.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}