import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Light Script',
  description:
    'Bible story customization app that preserves doctrinal integrity while allowing surface element modifications',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="bg-white dark:bg-black border-b border-black/[.08] dark:border-white/[.145]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
                Light Script
              </h1>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-white dark:bg-black border-t border-black/[.08] dark:border-white/[.145]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Light Script — Bible Story Customization App
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
