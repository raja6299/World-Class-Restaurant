'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { RESTAURANT } from '@/lib/utils/constants';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/#wine-beverage', label: 'Wine' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-center transition-all duration-300 ${
        scrolled
          ? 'bg-aurum-cream-primary/95 backdrop-blur-md shadow-aurum-md'
          : 'bg-aurum-cream-primary/80 backdrop-blur-sm'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="w-full max-w-7xl px-6 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-playfair text-2xl font-medium text-aurum-gold-primary tracking-[3px] uppercase"
          aria-label={`${RESTAURANT.name} — Home`}
        >
          {RESTAURANT.name}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative text-sm font-medium tracking-wide uppercase transition-colors duration-200 group ${
                pathname === href
                  ? 'text-aurum-gold-primary'
                  : 'text-aurum-text-body hover:text-aurum-gold-primary'
              }`}
            >
              {label}
              <span
                className={`absolute -bottom-1 left-0 h-[2px] bg-aurum-gold-primary transition-all duration-300 ${
                  pathname === href ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Reserve CTA */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="hidden lg:block"
        >
          <Link
            href="/#reservation"
            className="px-6 py-2.5 bg-aurum-gold-primary text-aurum-cream-primary text-sm font-semibold tracking-wider uppercase rounded-lg hover:bg-aurum-energy-orange transition-colors duration-200"
          >
            Reserve a Table
          </Link>
        </motion.div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            className="block w-6 h-[2px] bg-aurum-text-heading transition-colors"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-[2px] bg-aurum-text-heading"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            className="block w-6 h-[2px] bg-aurum-text-heading transition-colors"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 bottom-0 bg-aurum-cream-primary/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 z-40"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-2xl font-playfair tracking-wide transition-colors duration-200 ${
                  pathname === href ? 'text-aurum-gold-primary' : 'text-aurum-text-heading hover:text-aurum-gold-primary'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/#reservation"
              className="mt-4 px-8 py-3 bg-aurum-gold-primary text-aurum-cream-primary text-lg font-semibold tracking-wider uppercase rounded-lg hover:bg-aurum-energy-orange transition-colors duration-200"
              onClick={() => setMobileOpen(false)}
            >
              Reserve a Table
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
