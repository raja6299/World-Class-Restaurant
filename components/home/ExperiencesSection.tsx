'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { EXPERIENCES } from '@/lib/utils/constants';
import SectionHeading from '@/components/shared/SectionHeading';
import AnimatedImage from '@/components/shared/AnimatedImage';

export default function ExperiencesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 40, damping: 20 },
    },
  };

  return (
    <section id="experiences" className="py-32 px-6 lg:px-12 bg-aurum-cream">
      <SectionHeading
        title="Curated Experiences"
        subtitle="Immersive dining journeys designed to engage all your senses and create lasting memories."
      />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mt-20"
      >
        {EXPERIENCES.map((exp) => (
          <motion.div
            key={exp.id}
            variants={itemVariants}
            className="group relative bg-aurum-ivory flex flex-col h-full shadow-aurum-sm hover:shadow-aurum-lg transition-shadow duration-700 overflow-hidden cursor-pointer"
          >
            {/* Image Section */}
            <div className="relative h-[400px] w-full overflow-hidden">
              <div className="absolute inset-0 bg-aurum-charcoal/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <AnimatedImage
                src={exp.image}
                alt={exp.title}
                fill
              />
            </div>
            
            {/* Content Section */}
            <div className="p-10 flex flex-col flex-grow relative z-20 bg-aurum-ivory transform transition-transform duration-700 group-hover:-translate-y-4">
              <h3 className="font-playfair text-3xl text-aurum-charcoal font-medium tracking-wide mb-4">
                {exp.title}
              </h3>
              <p className="text-sm text-aurum-charcoal/70 leading-relaxed font-light flex-grow">
                {exp.description}
              </p>
              
              <div className="mt-8 pt-6 border-t border-aurum-gold/30 flex justify-between items-end">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold tracking-[2px] uppercase text-aurum-gold">
                    {exp.capacity} Guests &mdash; {exp.duration}
                  </span>
                  <span className="text-lg font-playfair text-aurum-charcoal tracking-wider">
                    {exp.priceRange}
                  </span>
                </div>
                
                <Link
                  href="/#reservation"
                  className="group-hover:text-aurum-gold text-aurum-charcoal transition-colors duration-500 pb-1"
                >
                  <span className="text-xs font-semibold tracking-[3px] uppercase relative">
                    {exp.cta}
                    <span className="absolute -bottom-2 left-0 h-[1px] bg-aurum-gold w-0 group-hover:w-full transition-all duration-500 ease-out" />
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
