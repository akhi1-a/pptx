import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PPTX',
  description: '一款基于web端的PPT编辑器，开箱即用',
  generator: '徐小夕',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
