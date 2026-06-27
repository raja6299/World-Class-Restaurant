'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TESTIMONIALS } from '@/lib/utils/constants';
import { staggerContainer } from '@/lib/utils/animations';
import SectionHeading from '@/components/shared/SectionHeading';

export default function TestimonialSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-24 px-6 lg:px-12 bg-aurum-cream-secondary">
      <SectionHeading
        title="Guest Stories"
        subtitle="What our guests say about their AURUM experience."
      />

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12"
      >
        {TESTIMONIALS.map((testimonial, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, x: -40 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.6, ease: 'easeOut' },
              },
            }}
            className="bg-aurum-cream-primary rounded-xl p-8 border-l-4 border-aurum-gold-primary"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonial.rating }).map((_, s) => (
                <span key={s} className="text-aurum-gold-primary text-lg">★</span>
              ))}
            </div>

            <p className="font-playfair text-lg italic text-aurum-text-body leading-relaxed mb-6">
              &ldquo;{testimonial.quote}&rdquo;
            </p>

            <p className="font-inter font-bold text-base text-aurum-text-heading">
              {testimonial.author}
            </p>
            <p className="text-sm italic text-aurum-gold-brass mt-1">{testimonial.occasion}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
