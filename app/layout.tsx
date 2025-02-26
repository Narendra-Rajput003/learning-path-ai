import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/_components/theme-provider';
import { Providers } from "./providers";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://learningpathai.com'),
  title: {
    default: 'LearningPath AI - Personalized Learning Journeys',
    template: '%s | LearningPath AI'
  },
  description: 'Create personalized learning paths with AI-powered guidance. Master new skills efficiently with interactive roadmaps and progress tracking.',
  keywords: [
    'learning path',
    'AI learning',
    'programming education',
    'tech career',
    'personalized learning',
    'coding roadmap',
    'developer education',
    'AI education platform',
    'tech skills',
    'learning management system'
  ],
  authors: [{ name: 'LearningPath AI Team' }],
  creator: 'LearningPath AI',
  publisher: 'LearningPath AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://learningpathai.com',
    siteName: 'LearningPath AI',
    title: 'LearningPath AI - Personalized Learning Journeys',
    description: 'Create personalized learning paths with AI-powered guidance',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LearningPath AI - Personalized Learning Journeys',
    description: 'Create personalized learning paths with AI-powered guidance',
    creator: '@learningpathai',
    images: ['/twitter-image.png'],
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#A855F7'
      }
    ]
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
