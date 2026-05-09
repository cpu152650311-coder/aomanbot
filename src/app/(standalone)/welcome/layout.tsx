import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Welcome | AOMAN FUTURE',
  description: 'Welcome to AOMAN FUTURE. Explore our intelligent service robot lineup, product highlights, and automation capabilities.',
  alternates: {
    canonical: '/welcome',
  },
  openGraph: {
    title: 'Welcome | AOMAN FUTURE',
    description: 'Welcome to AOMAN FUTURE. Explore our intelligent service robot lineup, product highlights, and automation capabilities.',
    url: '/welcome',
    siteName: 'AOMAN FUTURE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Welcome | AOMAN FUTURE',
    description: 'Welcome to AOMAN FUTURE. Explore our intelligent service robot lineup, product highlights, and automation capabilities.',
  },
}

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
