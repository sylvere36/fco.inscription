import type { Metadata } from 'next'
import { SuccessMessage } from '@/components/SuccessMessage'

export const metadata: Metadata = {
  title: 'Inscription reçue — FCO',
}

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-lg">
        <SuccessMessage />
      </div>
    </main>
  )
}
