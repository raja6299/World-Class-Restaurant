import type { Metadata } from 'next';
import { Playfair_Display, Inter, Great_Vibes } from 'next/font/google';
import './globals.css';
import { RESTAURANT } from '@/lib/utils/constants';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const signature = Great_Vibes({
  subsets: ['latin'],
  variable: '--font-signature',
  display: 'swap',
  weight: ['400'],
});

export const metadata: Metadata = {
  title: `${RESTAURANT.name} | Premium Indian Fine Dining`,
  description: RESTAURANT.description,
  keywords: 'Indian fine dining, premium restaurant, tasting menu, Delhi, Gurgaon, farm to table, sustainable dining',
  openGraph: {
    title: `${RESTAURANT.name} | ${RESTAURANT.tagline}`,
    description: RESTAURANT.description,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${signature.variable}`}>
      <body className="font-inter bg-aurum-ivory text-aurum-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
