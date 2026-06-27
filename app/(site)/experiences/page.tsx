'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { EXPERIENCES, RESTAURANT } from '@/lib/utils/constants';
import { fadeInUp } from '@/lib/utils/animations';
import Button from '@/components/shared/Button';

export default function ExperiencesPage() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="pt-28 pb-12 px-6 text-center bg-aurum-cream-secondary">
        <h1 className="font-playfair text-4xl md:text-5xl text-aurum-text-heading">
          Dining Experiences
        </h1>
        <p className="text-base text-aurum-text-body/70 mt-3 max-w-[500px] mx-auto">
          Curated moments at {RESTAURANT.name}
        </p>
      </div>

      {/* Experiences */}
      <div ref={ref} className="max-w-6xl mx-auto px-6 py-12">
        {EXPERIENCES.map((exp, i) => {
          const isReversed = i % 2 === 1;
          return (
            <motion.div
              key={exp.id}
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center ${
                isReversed ? 'lg:direction-rtl' : ''
              }`}
            >
              <div className={`${isReversed ? 'lg:order-2' : ''}`}>
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              <div className={`${isReversed ? 'lg:order-1' : ''}`}>
                <h2 className="font-playfair text-3xl text-aurum-text-heading mb-4">
                  {exp.title}
                </h2>
                <p className="text-lg text-aurum-text-body/80 leading-relaxed mb-6">
                  {exp.description}
                </p>
                <div className="flex gap-6 mb-4 text-sm text-aurum-gold-earthy">
                  <span>👥 Up to {exp.capacity} guests</span>
                  <span>⏱ {exp.duration}</span>
                </div>
                <p className="text-xl font-bold text-aurum-gold-primary mb-6">{exp.priceRange}</p>
                <Button variant="primary" href="/#reservation">
                  {exp.cta}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center py-12 bg-aurum-cream-secondary">
        <h3 className="font-playfair text-2xl text-aurum-text-heading mb-4">
          Ready to create your experience?
        </h3>
        <Button variant="primary" size="lg" href="/#reservation">
          Reserve Your Experience
        </Button>
      </div>
    </div>
  );
}
