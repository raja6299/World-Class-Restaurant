'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { RESTAURANT } from '@/lib/utils/constants';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/#wine-beverage', label: 'Wine Program' },
  { href: '/#reservation', label: 'Reservations' },
];

export default function Footer() {
  return (
    <footer className="bg-aurum-cream-secondary border-t border-[rgba(212,175,55,0.2)]">
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-aurum-gold-primary uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-aurum-text-body hover:text-aurum-gold-primary transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Hours & Location */}
          <div>
            <h3 className="text-sm font-bold text-aurum-gold-primary uppercase tracking-wider mb-5">
              Hours & Location
            </h3>
            <div className="space-y-2 text-sm text-aurum-text-body">
              <div className="flex justify-between">
                <span>Mon – Thu</span>
                <span className="font-semibold">{RESTAURANT.hours.monThu.open} – {RESTAURANT.hours.monThu.close}</span>
              </div>
              <div className="flex justify-between">
                <span>Fri – Sat</span>
                <span className="font-semibold">{RESTAURANT.hours.friSat.open} – {RESTAURANT.hours.friSat.close}</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="font-semibold">{RESTAURANT.hours.sun.open} – {RESTAURANT.hours.sun.close}</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-aurum-text-body">
              <p className="font-medium">{RESTAURANT.address.street}</p>
              <p>{RESTAURANT.address.city}, {RESTAURANT.address.postalCode}</p>
            </div>
            <a
              href={`tel:${RESTAURANT.phone}`}
              className="inline-block mt-3 text-sm text-aurum-gold-primary hover:text-aurum-energy-orange transition-colors duration-200"
            >
              {RESTAURANT.phone}
            </a>
            <span className="mx-2 text-aurum-text-body/30">|</span>
            <a
              href={`https://wa.me/${RESTAURANT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-aurum-gold-primary hover:text-aurum-energy-orange transition-colors duration-200"
            >
              WhatsApp
            </a>
          </div>

          {/* Column 3: Social & Newsletter */}
          <div>
            <h3 className="text-sm font-bold text-aurum-gold-primary uppercase tracking-wider mb-5">
              Follow Us
            </h3>
            <div className="flex gap-3 mb-6">
              {/* Instagram */}
              <motion.a
                href={RESTAURANT.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-lg border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-aurum-gold-primary hover:bg-aurum-gold-primary hover:text-aurum-cream-primary transition-all duration-200"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </motion.a>
              {/* Facebook */}
              <motion.a
                href={RESTAURANT.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-lg border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-aurum-gold-primary hover:bg-aurum-gold-primary hover:text-aurum-cream-primary transition-all duration-200"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </motion.a>
              {/* TikTok */}
              <motion.a
                href={RESTAURANT.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-lg border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-aurum-gold-primary hover:bg-aurum-gold-primary hover:text-aurum-cream-primary transition-all duration-200"
                aria-label="TikTok"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.18 8.18 0 005.58 2.17V11.7a4.83 4.83 0 01-3.77-1.24V6.69h3.77z" /></svg>
              </motion.a>
            </div>
            <p className="text-xs text-aurum-text-body/60 mb-3">
              Get seasonal menus and exclusive updates
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 h-10 bg-aurum-cream-primary border border-[rgba(212,175,55,0.2)] rounded-lg px-3 text-sm text-aurum-text-body placeholder:text-aurum-gold-earthy/50 focus:border-aurum-gold-primary focus:outline-none transition-colors duration-200"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-4 h-10 bg-aurum-gold-primary text-aurum-cream-primary text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-aurum-energy-orange transition-colors duration-200"
              >
                Subscribe
              </motion.button>
            </form>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-sm font-bold text-aurum-gold-primary uppercase tracking-wider mb-5">
              Information
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-aurum-text-body hover:text-aurum-gold-primary transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-aurum-text-body hover:text-aurum-gold-primary transition-colors duration-200">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-aurum-text-body hover:text-aurum-gold-primary transition-colors duration-200">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <a href={`mailto:${RESTAURANT.email}`} className="text-sm text-aurum-text-body hover:text-aurum-gold-primary transition-colors duration-200">
                  {RESTAURANT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[rgba(212,175,55,0.15)] text-center">
          <p className="text-xs text-aurum-text-body/50">
            © {new Date().getFullYear()} {RESTAURANT.name}. All rights reserved.
          </p>
          <p className="text-[10px] text-aurum-text-body/30 mt-1">
            Made with care by XAIVON
          </p>
        </div>
      </div>
    </footer>
  );
}
