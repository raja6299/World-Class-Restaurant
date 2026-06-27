'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { FEATURED_DISHES } from '@/lib/utils/constants';
import { staggerContainer, staggerItem } from '@/lib/utils/animations';
import SectionHeading from '@/components/shared/SectionHeading';

export default function FeaturedDishesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="featured-dishes" className="py-24 px-6 lg:px-12">
      <SectionHeading
        title="Signature Creations"
        subtitle="Each dish tells a story of heritage, craftsmanship, and the finest ingredients."
      />

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
      >
        {FEATURED_DISHES.map((dish) => (
          <motion.div
            key={dish.id}
            variants={staggerItem}
            whileHover={{ scale: 1.02, boxShadow: '0 8px 16px rgba(45,45,45,0.12)' }}
            className="group bg-aurum-cream-secondary rounded-xl overflow-hidden border border-[rgba(212,175,55,0.2)] hover:border-aurum-gold-primary transition-colors duration-200"
          >
            <div className="relative h-[300px] overflow-hidden">
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-6">
              <h3 className="font-playfair text-2xl text-aurum-text-heading mb-1">
                {dish.name}
              </h3>
              <p className="text-sm italic text-aurum-gold-brass mb-3">{dish.tagline}</p>
              <p className="text-base text-aurum-text-body/80 leading-relaxed mb-4">
                {dish.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-aurum-gold-primary">{dish.price}</span>
                <Link
                  href="/menu"
                  className="text-sm text-aurum-gold-primary hover:underline transition-all duration-200"
                >
                  Explore Full Menu →
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
