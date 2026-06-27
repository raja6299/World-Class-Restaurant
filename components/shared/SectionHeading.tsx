'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeInUp, scaleXGrow } from '@/lib/utils/animations';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeading({ title, subtitle, className = '' }: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className={`text-center ${className}`}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <motion.h2
        variants={fadeInUp}
        className="font-playfair text-3xl md:text-4xl lg:text-5xl text-aurum-text-heading text-center"
      >
        {title}
      </motion.h2>

      <motion.div
        variants={scaleXGrow}
        className="h-[3px] w-[60px] bg-aurum-gold-primary mx-auto mt-4 mb-3 origin-left"
      />

      {subtitle && (
        <motion.p
          variants={fadeInUp}
          className="text-base text-aurum-text-body/70 text-center max-w-[600px] mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
