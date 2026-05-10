import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | AOMAN FUTURE',
    default: 'AOMAN FUTURE – Advanced Service Robots',
  },
  description: 'AOMAN FUTURE designs and builds intelligent service robots for hospitality, healthcare, retail, and beyond.',
  openGraph: {
    title: 'AOMAN FUTURE – Advanced Service Robots',
    description: 'Intelligent service robots for hospitality, healthcare, retail, and beyond.',
    url: 'https://aomanbot.com',
    siteName: 'AOMAN FUTURE',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://aomanbot.com/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'AOMAN FUTURE robots',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AOMAN FUTURE – Advanced Service Robots',
    description: 'Intelligent service robots for hospitality, healthcare, retail, and beyond.',
    images: ['https://aomanbot.com/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}