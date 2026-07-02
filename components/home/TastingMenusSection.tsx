'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TASTING_MENUS, SEASONAL_DISHES } from '@/lib/utils/constants';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/utils/animations';
import SectionHeading from '@/components/shared/SectionHeading';
import Button from '@/components/shared/Button';
import AnimatedImage from '@/components/shared/AnimatedImage';

export default function TastingMenusSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const ref2 = useRef<HTMLDivElement>(null);
  const isInView2 = useInView(ref2, { once: true, amount: 0.1 });

  return (
    <section id="tasting-menus" className="py-24 px-6 lg:px-12 bg-aurum-cream-secondary">
      {/* Subsection A: Chef's Tasting Menu */}
      <SectionHeading
        title="Chef's Tasting Menu"
        subtitle="A curated journey through AURUM's philosophy"
      />

      {/* Hero Image for Tasting Menu */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="max-w-5xl mx-auto mt-12 mb-16 h-[50vh] md:h-[60vh] relative rounded-xl overflow-hidden shadow-aurum-lg"
      >
        <AnimatedImage
          src="/images/tasting_menu_plating.webp"
          alt="Overhead view of an elegant 7-course tasting menu"
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-aurum-charcoal/60 to-transparent" />
      </motion.div>

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
      >
        {TASTING_MENUS.map((menu) => (
          <motion.div
            key={menu.courses}
            variants={staggerItem}
            whileHover={{ scale: 1.03, boxShadow: '0 8px 16px rgba(45,45,45,0.12)' }}
            className="bg-aurum-cream-primary rounded-xl p-8 border border-[rgba(212,175,55,0.2)] text-center hover:border-aurum-gold-primary transition-colors duration-200"
          >
            <p className="text-4xl font-playfair text-aurum-gold-primary font-bold mb-2">
              {menu.courses}-Course
            </p>
            <p className="text-xl font-bold text-aurum-text-heading mb-4">{menu.price}</p>
            <p className="text-sm text-aurum-text-body/70 mb-6 italic">{menu.description}</p>
            <ul className="mb-8">
              {menu.items.map((item, i) => (
                <li
                  key={i}
                  className={`text-sm text-aurum-text-body py-2 ${
                    i < menu.items.length - 1 ? 'border-b border-[rgba(212,175,55,0.1)]' : ''
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="primary" size="sm" href="#reservation">
              Book Experience
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Subsection B: Seasonal Menu */}
      <div className="mt-32">
        <motion.div
          ref={ref2}
          initial="hidden"
          animate={isInView2 ? 'visible' : 'hidden'}
        >
          <motion.h3
            variants={fadeInUp}
            className="font-playfair text-3xl text-aurum-text-heading text-center mb-3"
          >
            This Season&apos;s Specialties
          </motion.h3>
          <motion.p
            variants={fadeInUp}
            className="text-base text-aurum-text-body/70 text-center max-w-[500px] mx-auto mb-12"
          >
            Limited-time hero dishes celebrating seasonal ingredients
          </motion.p>
        </motion.div>

        {/* Seasonal Ingredients Image */}
        <motion.div
          initial="hidden"
          animate={isInView2 ? 'visible' : 'hidden'}
          variants={fadeInUp}
          className="max-w-5xl mx-auto mb-16 h-[40vh] md:h-[50vh] relative rounded-xl overflow-hidden shadow-aurum-md"
        >
          <AnimatedImage
            src="/images/seasonal_ingredients.webp"
            alt="Fresh organic Indian seasonal ingredients on a rustic dark wood table"
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-aurum-charcoal/40 to-transparent" />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView2 ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {SEASONAL_DISHES.map((dish) => (
            <motion.div
              key={dish.name}
              variants={staggerItem}
              className="bg-aurum-cream-primary rounded-xl p-6 border border-[rgba(212,175,55,0.2)]"
            >
              <span className="inline-block bg-aurum-gold-primary/10 text-aurum-gold-primary text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                {dish.seasonalIngredient}
              </span>
              <h4 className="font-playfair text-xl text-aurum-text-heading mb-2">{dish.name}</h4>
              <p className="text-sm text-aurum-text-body/80 mb-4">{dish.description}</p>
              <p className="text-xs text-aurum-gold-earthy italic">
                Available through {dish.availableUntil}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Button variant="primary" href="#reservation">
            Reserve Your Seasonal Experience
          </Button>
        </div>
      </div>
    </section>
  );
}
