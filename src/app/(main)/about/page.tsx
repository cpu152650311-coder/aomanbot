import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Aoman Future',
  description: 'Learn about Aoman Future, a pioneer in intelligent robotics solutions.',
  openGraph: {
    title: 'About Us - Aoman Future',
    description: 'Learn about Aoman Future, a pioneer in intelligent robotics solutions.',
    url: 'https://www.aomanfuture.com/about',
    siteName: 'Aoman Future',
    images: [
      {
        url: 'https://www.aomanfuture.com/images/about-og.jpg',
        width: 1200,
        height: 630,
        alt: 'About Aoman Future',
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="hero">
        <h1>About Aoman Future</h1>
        <p>Shaping the future with intelligent robotics.</p>
      </section>
      <section className="content">
        <h2>Our Mission</h2>
        <p>
          At Aoman Future, we design and manufacture advanced robotic systems
          that enhance human productivity and improve quality of life. From
          autonomous cleaning to collaborative service, our robots are built for
          reliability and intelligence.
        </p>
        <h2>Our History</h2>
        <p>
          Founded in 2020, Aoman Future has rapidly grown into a global leader
          in robotics innovation, serving customers in over 30 countries.
        </p>
      </section>
    </main>
  );
}