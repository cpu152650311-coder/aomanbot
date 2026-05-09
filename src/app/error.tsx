'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8FAFB] text-gray-900">
      <div className="text-center px-6">
        <span className="text-7xl font-bold text-[#0066FF]/20">500</span>
        <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-gray-500 max-w-md mx-auto">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0066FF] hover:bg-[#0052CC] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-[#0066FF] border border-[#0066FF] hover:bg-[#0066FF]/5 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
