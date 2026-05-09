import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import InquiryModal from '@/components/InquiryModal'

export const metadata: Metadata = {
  robots: { index: true, follow: true },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <InquiryModal />
    </>
  )
}
