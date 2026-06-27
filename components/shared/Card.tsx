'use client';

import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  const baseStyles =
    'group bg-aurum-cream-secondary border border-[rgba(212,175,55,0.2)] rounded-xl overflow-hidden transition-colors duration-200';

  if (!hover) {
    return (
      <div className={`${baseStyles} ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        boxShadow: '0 8px 16px rgba(45,45,45,0.12)',
      }}
      transition={{ duration: 0.2 }}
      className={`${baseStyles} hover:border-aurum-gold-primary ${className}`}
    >
      {children}
    </motion.div>
  );
}
