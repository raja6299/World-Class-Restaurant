'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { WINE_PROGRAM } from '@/lib/utils/constants';
import { staggerContainer, staggerItem, staggerContainerSlow, staggerItemFade, fadeInUp } from '@/lib/utils/animations';
import SectionHeading from '@/components/shared/SectionHeading';

export default function WineBeverageSection() {
  const ref1 = useRef<HTMLDivElement>(null);
  const isInView1 = useInView(ref1, { once: true, amount: 0.2 });
  const ref2 = useRef<HTMLDivElement>(null);
  const isInView2 = useInView(ref2, { once: true, amount: 0.2 });
  const ref3 = useRef<HTMLDivElement>(null);
  const isInView3 = useInView(ref3, { once: true, amount: 0.2 });

  return (
    <section id="wine-beverage" className="py-24 px-6 lg:px-12">
      {/* Subsection A: Signature Cocktails */}
      <SectionHeading title="Signature Cocktails" />

      <motion.div
        ref={ref1}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView1 ? 'visible' : 'hidden'}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12"
      >
        {WINE_PROGRAM.cocktails.map((cocktail) => (
          <motion.div
            key={cocktail.name}
            variants={staggerItem}
            className="bg-aurum-cream-secondary rounded-xl p-6 border border-[rgba(212,175,55,0.2)]"
          >
            <h4 className="font-playfair text-xl text-aurum-gold-primary font-semibold mb-2">
              {cocktail.name}
            </h4>
            <p className="text-sm text-aurum-text-body/80 mb-4 leading-relaxed">
              {cocktail.description}
            </p>
            <p className="text-lg font-bold text-aurum-energy-deep">{cocktail.price}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Subsection B: Curated Wine Program */}
      <div className="mt-20" ref={ref2}>
        <motion.h3
          variants={fadeInUp}
          initial="hidden"
          animate={isInView2 ? 'visible' : 'hidden'}
          className="font-playfair text-3xl text-aurum-text-heading text-center mb-4"
        >
          Curated Wine Program
        </motion.h3>
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate={isInView2 ? 'visible' : 'hidden'}
          className="text-lg italic text-aurum-text-body/70 text-center max-w-[600px] mx-auto mb-12"
        >
          {WINE_PROGRAM.philosophy}
        </motion.p>

        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          animate={isInView2 ? 'visible' : 'hidden'}
          className="max-w-4xl mx-auto"
        >
          {WINE_PROGRAM.wines.map((wine) => (
            <motion.div
              key={wine.name}
              variants={staggerItemFade}
              className="flex items-start justify-between py-4 border-b border-[rgba(212,175,55,0.1)]"
            >
              <div>
                <p className="font-semibold text-aurum-text-heading">{wine.name}</p>
                <p className="text-sm text-aurum-gold-earthy">
                  {wine.producer} · {wine.region}
                </p>
                <p className="text-sm text-aurum-text-body/70 italic mt-1">{wine.notes}</p>
              </div>
              <p className="text-aurum-energy-deep font-bold whitespace-nowrap ml-4">{wine.price}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Subsection C: Tea & Coffee Pairings */}
      <div className="mt-16" ref={ref3}>
        <motion.h3
          variants={fadeInUp}
          initial="hidden"
          animate={isInView3 ? 'visible' : 'hidden'}
          className="font-playfair text-2xl text-aurum-text-heading text-center mb-8"
        >
          Beverage Craftsmanship
        </motion.h3>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView3 ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {WINE_PROGRAM.teaPairings.map((pairing) => (
            <motion.div
              key={pairing.tea}
              variants={staggerItem}
              className="bg-aurum-cream-secondary rounded-lg p-5 text-center border border-[rgba(212,175,55,0.1)]"
            >
              <p className="font-semibold text-aurum-gold-primary text-lg mb-1">{pairing.tea}</p>
              <p className="text-xs text-aurum-text-body/50 uppercase tracking-wider my-2">
                paired with
              </p>
              <p className="text-sm text-aurum-text-body">{pairing.pairedWith}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
