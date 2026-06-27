'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { QUICK_NAV_CARDS } from '@/lib/utils/constants';
import { staggerContainer, staggerItem } from '@/lib/utils/animations';

const icons: Record<string, React.ReactNode> = {
  leaf: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-aurum-gold-primary mx-auto mb-4">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.5 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
  calendar: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-aurum-gold-primary mx-auto mb-4">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  ),
  utensils: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-aurum-gold-primary mx-auto mb-4">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  ),
  door: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-aurum-gold-primary mx-auto mb-4">
      <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
      <path d="M2 20h20" />
      <path d="M14 12v.01" />
    </svg>
  ),
};

export default function QuickNavCards() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const handleClick = (scrollTo: string) => {
    const el = document.getElementById(scrollTo);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {QUICK_NAV_CARDS.map((card) => (
          <motion.div
            key={card.title}
            variants={staggerItem}
            whileHover={{ scale: 1.05, boxShadow: '0 8px 16px rgba(45,45,45,0.12)' }}
            onClick={() => handleClick(card.scrollTo)}
            className="bg-aurum-cream-secondary border border-[rgba(212,175,55,0.2)] rounded-xl p-8 text-center cursor-pointer hover:border-aurum-gold-primary transition-colors duration-200"
          >
            {icons[card.icon]}
            <h3 className="font-playfair text-xl text-aurum-text-heading mb-2">{card.title}</h3>
            <p className="text-sm text-aurum-text-body/70">{card.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
