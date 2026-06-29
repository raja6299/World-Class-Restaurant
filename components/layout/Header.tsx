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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-24 flex items-center justify-center transition-all duration-500 ${
        scrolled
          ? 'bg-aurum-ivory/95 backdrop-blur-md shadow-aurum-sm border-b border-aurum-champagne/30'
          : 'bg-gradient-to-b from-aurum-charcoal/40 to-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="w-full max-w-7xl px-6 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`font-playfair text-2xl md:text-3xl font-medium tracking-[4px] uppercase transition-colors duration-500 ${scrolled ? 'text-aurum-charcoal' : 'text-aurum-ivory'}`}
          aria-label={`${RESTAURANT.name} — Home`}
        >
          {RESTAURANT.name}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative text-[11px] font-semibold tracking-[2px] uppercase transition-colors duration-300 group ${
                scrolled
                  ? pathname === href ? 'text-aurum-gold' : 'text-aurum-charcoal/70 hover:text-aurum-gold'
                  : 'text-aurum-ivory/80 hover:text-aurum-ivory'
              }`}
            >
              {label}
              <span
                className={`absolute -bottom-2 left-0 h-[1px] bg-aurum-gold transition-all duration-500 ease-out ${
                  pathname === href ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Reserve CTA */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="hidden lg:block"
        >
          <Link
            href="/#reservation"
            className={`px-7 py-3 text-[11px] font-semibold tracking-[2px] uppercase rounded-full transition-all duration-500 ${
              scrolled
                ? 'bg-aurum-gold text-aurum-ivory hover:bg-aurum-charcoal shadow-aurum-sm hover:shadow-aurum-md'
                : 'bg-aurum-ivory text-aurum-charcoal hover:bg-aurum-gold hover:text-aurum-ivory'
            }`}
          >
            Reserve
          </Link>
        </motion.div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden flex flex-col gap-[6px] p-2 z-50"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 8, backgroundColor: '#2A2A2A' } : { rotate: 0, y: 0, backgroundColor: scrolled ? '#2A2A2A' : '#FAF7F2' }}
            className="block w-7 h-[1px] transition-colors duration-300"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1, backgroundColor: scrolled ? '#2A2A2A' : '#FAF7F2' }}
            className="block w-7 h-[1px] transition-colors duration-300"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -8, backgroundColor: '#2A2A2A' } : { rotate: 0, y: 0, backgroundColor: scrolled ? '#2A2A2A' : '#FAF7F2' }}
            className="block w-7 h-[1px] transition-colors duration-300"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.32, 0, 0.67, 0] }}
            className="fixed inset-0 bg-aurum-ivory flex flex-col items-center justify-center gap-10 z-40"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-3xl font-playfair tracking-[3px] uppercase transition-colors duration-300 ${
                  pathname === href ? 'text-aurum-gold' : 'text-aurum-charcoal hover:text-aurum-gold'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/#reservation"
              className="mt-8 px-10 py-4 bg-aurum-gold text-aurum-ivory text-sm font-semibold tracking-[3px] uppercase rounded-full hover:bg-aurum-charcoal transition-colors duration-500 shadow-aurum-md"
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
