import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ShortUrl',
  description: 'A handy tool for making your URL Short with user specifies alias',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div
          className={`relative h-full w-full flex justify-center items-center ${inter.className}`}
        >
          <div className="flex flex-col shadow-2xl p-4 w-[798px] mx-auto rounded-lg">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
