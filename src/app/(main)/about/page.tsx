import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Your Site Name',
  description: 'Learn more about our mission, values, and the team behind our work.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">About Us</h1>
      <p className="mt-4 text-lg">
        We are a forward-thinking company dedicated to delivering exceptional
        digital solutions. Our team combines creativity, technology, and
        strategic insight to help businesses grow.
      </p>
    </main>
  );
}