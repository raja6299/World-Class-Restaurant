'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { FEATURED_DISHES } from '@/lib/utils/constants';
import SectionHeading from '@/components/shared/SectionHeading';
import AnimatedImage from '@/components/shared/AnimatedImage';

export default function FeaturedDishesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 40,
        damping: 20,
      },
    },
  };

  return (
    <section id="featured-dishes" className="py-32 px-6 lg:px-12 bg-aurum-charcoal relative overflow-hidden">
      {/* Subtle background element */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-aurum-brown/10 via-aurum-charcoal to-aurum-charcoal opacity-50 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <SectionHeading
          title="Signature Creations"
          subtitle="Each dish tells a story of heritage, craftsmanship, and the finest ingredients, meticulously plated to perfection."
          darkTheme
        />

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-20 space-y-24 md:space-y-28"
        >
          {FEATURED_DISHES.map((dish, index) => {
            // Alternating grid layout to create an elegant masonry feel
            const isEven = index % 2 === 0;
            const imageColSpan = isEven ? 'md:col-span-7' : 'md:col-span-7 md:order-last';
            const textColSpan = isEven ? 'md:col-span-5' : 'md:col-span-5';

            return (
              <motion.div key={dish.id} variants={itemVariants} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
                <div className={`${imageColSpan} group cursor-pointer`}>
                  <div className={`relative w-full overflow-hidden rounded-sm max-h-[420px] ${index === 1 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                    <AnimatedImage
                      src={dish.image}
                      alt={dish.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className={`${textColSpan} flex flex-col justify-center space-y-6 ${isEven ? 'md:pl-8' : 'md:pr-8'}`}>
                  <div>
                    <h3 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-aurum-ivory font-medium tracking-wide mb-2">
                      {dish.name}
                    </h3>
                    <p className="text-sm italic text-aurum-gold mb-6 font-playfair tracking-wider">
                      {dish.tagline}
                    </p>
                    <div className="w-12 h-[1px] bg-aurum-gold/40 mb-6" />
                    <p className="text-sm md:text-base text-aurum-ivory/70 leading-relaxed font-light">
                      {dish.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 flex justify-between items-center border-t border-aurum-ivory/10">
                    <span className="text-lg font-playfair text-aurum-gold tracking-widest">{dish.price}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-24 text-center"
        >
          <Link
            href="/menu"
            className="inline-flex items-center justify-center px-10 py-4 border border-aurum-gold text-aurum-ivory text-xs font-semibold tracking-[3px] uppercase hover:bg-aurum-gold hover:text-aurum-charcoal transition-all duration-500"
          >
            Explore Full Menu
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
