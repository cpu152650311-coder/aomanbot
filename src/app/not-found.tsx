import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found | AOMAN FUTURE',
  description: 'The page you are looking for does not exist. Explore AOMAN FUTURE intelligent service robots.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8FAFB] text-gray-900">
      <div className="text-center px-6">
        <span className="text-8xl font-bold text-[#0066FF]/20">404</span>
        <h1 className="mt-4 text-3xl font-bold">Page Not Found</h1>
        <p className="mt-3 text-gray-500 max-w-md mx-auto">
          The page you are looking for might have been moved or doesn&apos;t exist.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0066FF] hover:bg-[#0052CC] transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-[#0066FF] border border-[#0066FF] hover:bg-[#0066FF]/5 transition-colors"
          >
            Explore Products
          </Link>
        </div>
      </div>
    </main>
  )
}
