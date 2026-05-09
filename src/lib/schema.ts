/**
 * Schema.org JSON-LD helpers.
 * Generates structured data objects for injection into TSX pages.
 */

export interface BreadcrumbItem {
  name: string
  item: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface ProductSchema {
  name: string
  description: string
  image: string
  brand: string
  category: string
  url: string
  offers?: { price: string; priceCurrency: string; availability: string }
}

export function organizationSchema() {
  return {
    '@type': 'Organization' as const,
    name: 'AOMAN FUTURE',
    url: 'https://aomanbot.com',
    logo: 'https://aomanbot.com/logo.webp',
    email: 'info@aomanbot.com',
    telephone: '+8618928864959',
    address: {
      '@type': 'PostalAddress' as const,
      addressRegion: 'Guangdong',
      addressLocality: 'Shenzhen',
      addressCountry: 'CN',
    },
  }
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList' as const,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem' as const,
      position: i + 1,
      name: item.name,
      item: item.item,
    })),
  }
}

export function productSchema(product: ProductSchema) {
  const schema: Record<string, unknown> = {
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: { '@type': 'Brand', name: product.brand },
    category: product.category,
    url: product.url,
    manufacturer: {
      '@type': 'Organization',
      name: 'AOMAN FUTURE',
      url: 'https://aomanbot.com',
    },
  }
  if (product.offers) {
    schema.offers = {
      '@type': 'Offer',
      price: product.offers.price,
      priceCurrency: product.offers.priceCurrency,
      availability: `https://schema.org/${product.offers.availability}`,
    }
  }
  return schema
}

export function faqSchema(faqs: FaqItem[]) {
  return {
    '@type': 'FAQPage' as const,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: faq.answer,
      },
    })),
  }
}

export function websiteSchema() {
  return {
    '@type': 'WebSite' as const,
    name: 'AOMAN FUTURE',
    url: 'https://aomanbot.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://aomanbot.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }
}

export function blogPostingSchema(post: {
  title: string
  description: string
  image: string
  url: string
  datePublished: string
  dateModified: string
  authorName: string
}) {
  return {
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image,
    url: post.url,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: { '@type': 'Person', name: post.authorName },
    publisher: {
      '@type': 'Organization',
      name: 'AOMAN FUTURE',
      logo: { '@type': 'ImageObject', url: 'https://aomanbot.com/logo.webp' },
    },
  }
}

/**
 * Build a complete @graph array for a page.
 * Usage in page.tsx:
 *   const jsonLd = pageJsonLd([organizationSchema(), breadcrumbSchema([...])])
 */
export function pageJsonLd(schemas: Record<string, unknown>[]) {
  return { '@context': 'https://schema.org', '@graph': schemas }
}
