import { Metadata } from 'next'
import Script from 'next/script'

const SITE_URL = 'https://www.aomanbot.com'
const SITE_NAME = 'AOMAN FUTURE'
const DEFAULT_DESCRIPTION = 'Leader in advanced robotics and automation for industrial transformation. Discover cutting-edge solutions for logistics, manufacturing, and beyond.'

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} – Robotics & Automation`,
    template: `%s | ${SITE_NAME}`
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} – Robotics & Automation`,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Robotics`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} – Robotics & Automation`,
    description: DEFAULT_DESCRIPTION,
    images: [`${SITE_URL}/og-image.jpg`],
    creator: '@aomanfuture'
  },
  alternates: {
    canonical: SITE_URL
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  }
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": SITE_NAME,
  "url": SITE_URL,
  "logo": `${SITE_URL}/logo.png`,
  "sameAs": [
    "https://www.linkedin.com/company/aoman-future",
    "https://twitter.com/aomanfuture",
    "https://www.youtube.com/@aomanfuture"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-800-ROBOTICS",
    "contactType": "sales",
    "areaServed": "Worldwide",
    "availableLanguage": ["English"]
  },
  "description": DEFAULT_DESCRIPTION
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": SITE_URL
    }
  ]
}

export default function HomePage() {
  return (
    <>
      <Script
        id="home-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema, breadcrumbSchema])
        }}
      />
      <main>
        {/* Your homepage content */}
        <h1>Welcome to {SITE_NAME}</h1>
      </main>
    </>
  )
}