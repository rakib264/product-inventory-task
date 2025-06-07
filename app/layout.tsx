import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { ThemeToggle } from '../components/theme-toggle';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Product Inventory - Premium Product Catalog',
    template: '%s | Product Inventory',
  },
  description: 'Discover and explore our comprehensive product catalog with advanced filtering, sorting, and search capabilities.',
  keywords: 'ecommerce, products, inventory, online shopping, catalog',
  authors: [{ name: 'Product Inventory Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    siteName: 'Product Inventory',
    title: 'Product Inventory - Premium Product Catalog',
    description: 'Discover and explore our comprehensive product catalog with advanced filtering, sorting, and search capabilities.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Product Inventory',
    description: 'Premium product catalog with advanced features',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex items-center justify-between">
                <Link href="/">
                  <h1 className="text-2xl font-bold text-primary dark:text-white">Product Inventory</h1>
                </Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
          <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 py-8">
            <div className="container mx-auto px-4 text-center text-muted-foreground dark:text-gray-400">
              <p>&copy; 2025 Product Inventory. Built with Next.js and TypeScript. Built by <a target="_blank" href="https://github.com/rakib264" className="text-primary hover:underline">Redwan Rakib</a></p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}