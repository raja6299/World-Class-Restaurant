'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { EXPERIENCES } from '@/lib/utils/constants';
import { staggerContainer, staggerItem } from '@/lib/utils/animations';
import SectionHeading from '@/components/shared/SectionHeading';
import Button from '@/components/shared/Button';

export default function ExperiencesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="experiences" className="py-24 px-6 lg:px-12">
      <SectionHeading
        title="Dining Experiences"
        subtitle="Curated moments designed to be remembered."
      />

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
      >
        {EXPERIENCES.map((exp) => (
          <motion.div
            key={exp.id}
            variants={staggerItem}
            whileHover={{ scale: 1.02, boxShadow: '0 8px 16px rgba(45,45,45,0.12)' }}
            className="group bg-aurum-cream-secondary rounded-xl overflow-hidden border border-[rgba(212,175,55,0.2)] hover:border-aurum-gold-primary transition-colors duration-200"
          >
            <div className="relative h-[300px] overflow-hidden">
              <Image
                src={exp.image}
                alt={exp.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-6">
              <h3 className="font-playfair text-2xl text-aurum-text-heading mb-2">{exp.title}</h3>
              <p className="text-base text-aurum-text-body/80 leading-relaxed mb-4">
                {exp.description}
              </p>
              <div className="flex gap-4 text-sm text-aurum-gold-earthy mb-4">
                <span>👥 {exp.capacity} guests</span>
                <span>⏱ {exp.duration}</span>
              </div>
              <p className="text-lg font-bold text-aurum-gold-primary mb-4">{exp.priceRange}</p>
              <Button variant="primary" size="sm" href="#reservation">
                {exp.cta}
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
