```tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "AOMAN FUTURE | Advanced Robotics & Automation Solutions",
    template: "%s | AOMAN FUTURE",
  },
  description:
    "AOMAN FUTURE – Leading provider of industrial robotics and automation solutions. We design intelligent robotic systems for manufacturing, logistics, and smart operations across the globe.",
  keywords: [
    "robotics",
    "automation",
    "industrial robots",
    "AOMAN FUTURE",
    "smart manufacturing",
    "logistics automation",
  ],
  authors: [{ name: "AOMAN FUTURE" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.aomanfuture.com",
    siteName: "AOMAN FUTURE",
    title: "AOMAN FUTURE | Advanced Robotics & Automation Solutions",
    description:
      "AOMAN FUTURE – Leading provider of industrial robotics and automation solutions. We design intelligent robotic systems for manufacturing, logistics, and smart operations across the globe.",
    images: [
      {
        url: "https://www.aomanfuture.com/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "AOMAN FUTURE robotics solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AOMANFUTURE",
    creator: "@AOMANFUTURE",
    title: "AOMAN FUTURE | Advanced Robotics & Automation Solutions",
    description:
      "AOMAN FUTURE – Leading provider of industrial robotics and automation solutions. We design intelligent robotic systems for manufacturing, logistics, and smart operations across the globe.",
    images: ["https://www.aomanfuture.com/og-default.jpg"],
  },
  alternates: {
    canonical: "https://www.aomanfuture.com",
    languages: {
      "en-US": "https://www.aomanfuture.com/en",
      "zh-CN": "https://www.aomanfuture.com/zh",
    },
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```