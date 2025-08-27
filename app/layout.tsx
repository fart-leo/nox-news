import './globals.css'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'NOX — крипто-новости',
  description: 'Автопополняемый сайт новостей о крипте',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-black text-white">
        <header className="p-4 border-b border-white/10">NOX</header>
        <main className="p-4">{children}</main>
        <footer className="p-4 text-gray-400">© {new Date().getFullYear()} NOX</footer>
      </body>
    </html>
  )
}
