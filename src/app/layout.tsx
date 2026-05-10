import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Aoman Future',
    template: '%s | Aoman Future'
  },
  description: 'Aoman Future official website',
  // alternates removed – language subdirectories do not exist
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.aomanfuture.com',
    siteName: 'Aoman Future',
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