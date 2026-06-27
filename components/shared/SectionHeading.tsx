'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeInUp, scaleXGrow } from '@/lib/utils/animations';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  darkTheme?: boolean;
}

export default function SectionHeading({ title, subtitle, className = '', darkTheme = false }: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col items-center text-center ${className}`}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <motion.h2
        variants={fadeInUp}
        className={`font-playfair text-4xl md:text-5xl lg:text-6xl font-medium tracking-[-0.02em] ${
          darkTheme ? 'text-aurum-ivory' : 'text-aurum-charcoal'
        }`}
      >
        {title}
      </motion.h2>

      <motion.div
        variants={scaleXGrow}
        className="h-[1px] w-[80px] bg-aurum-gold mx-auto mt-6 mb-5 origin-center"
      />

      {subtitle && (
        <motion.p
          variants={fadeInUp}
          className={`text-sm tracking-wide max-w-[500px] mx-auto leading-relaxed ${
            darkTheme ? 'text-aurum-ivory/70' : 'text-aurum-charcoal/70'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
