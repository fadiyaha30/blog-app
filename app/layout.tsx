import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '🐇 uhuy',
  description: 'A modern blog application',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}