import './globals.css';
import type { Metadata } from 'next';
import {Inter} from 'next/font/google';
import { ThemeProvider } from '@/components/_components/theme-provider';
import {Providers} from "./providers"
import { Navbar } from '@/components/_components/home_page_components/navbar';
import { Footer } from '@/components/_components/home_page_components/footer';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Learning Path AI Generator',
    template: '%s - Learning Path AI',
  },
  description: 'Generate personalized learning paths with AI-powered guidance',
  keywords: 'Learning Path AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
         <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
               <Navbar />
               <main >
                  {children}
               </main>
               <Footer />
               </ThemeProvider>
         </Providers>
      </body>
    </html>
  );
}
