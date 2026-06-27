'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TESTIMONIALS } from '@/lib/utils/constants';
import SectionHeading from '@/components/shared/SectionHeading';

export default function TestimonialSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' as const },
    },
  };

  return (
    <section className="py-32 px-6 lg:px-12 bg-aurum-olive relative overflow-hidden">
      <SectionHeading
        title="Guest Stories"
        subtitle="What our guests say about their AURUM experience."
        darkTheme={true}
      />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto mt-24 relative z-10"
      >
        {TESTIMONIALS.map((testimonial, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="flex flex-col items-center text-center px-4"
          >
            {/* Minimalist Stars */}
            <div className="flex gap-2 mb-8">
              {Array.from({ length: testimonial.rating }).map((_, s) => (
                <span key={s} className="text-aurum-gold text-[10px]">&#10022;</span>
              ))}
            </div>

            <p className="font-playfair text-xl md:text-2xl italic text-aurum-ivory/90 leading-relaxed mb-8 flex-grow">
              &ldquo;{testimonial.quote}&rdquo;
            </p>

            <div className="flex flex-col items-center">
              <div className="w-[1px] h-8 bg-aurum-gold/30 mb-6" />
              <p className="font-playfair text-lg text-aurum-ivory tracking-wider uppercase text-sm">
                {testimonial.author}
              </p>
              <p className="text-xs tracking-[2px] uppercase text-aurum-gold mt-2">
                {testimonial.occasion}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Decorative large quotes in background */}
      <div className="absolute top-10 left-10 text-[300px] text-aurum-ivory/[0.02] font-playfair leading-none pointer-events-none z-0">
        &ldquo;
      </div>
      <div className="absolute bottom-10 right-10 text-[300px] text-aurum-ivory/[0.02] font-playfair leading-none pointer-events-none z-0 rotate-180">
        &ldquo;
      </div>
    </section>
  );
}
