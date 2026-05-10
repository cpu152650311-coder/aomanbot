import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Browse Aoman Future’s fleet of autonomous mobile robots, intelligent workstations, and integrated automation suites.',
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Note: Replace any hardcoded 'https://aomanbot.com' with 'https://aomanfuture.com'
  const productsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Products',
    url: 'https://aomanfuture.com/products',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [], // populate dynamically if possible
    },
  };

  return (
    <>
      <Script
        id="products-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productsJsonLd),
        }}
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}