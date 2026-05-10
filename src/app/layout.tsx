import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  charset: "utf-8",
  title: {
    template: "%s | Your Robotics Company",
    default: "Your Robotics Company – Advanced Service Robots",
  },
  description:
    "We design and manufacture autonomous service robots for cleaning, logistics, and hospitality.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.yourroboticscompany.com",
    siteName: "Your Robotics Company",
    title: "Your Robotics Company – Advanced Service Robots",
    description:
      "We design and manufacture autonomous service robots for cleaning, logistics, and hospitality.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Your Robotics Company robots in action",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Robotics Company – Advanced Service Robots",
    description:
      "We design and manufacture autonomous service robots for cleaning, logistics, and hospitality.",
    images: ["/images/og-default.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}