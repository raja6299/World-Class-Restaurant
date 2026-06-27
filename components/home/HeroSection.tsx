'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { RESTAURANT } from '@/lib/utils/constants';
import Button from '@/components/shared/Button';

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.6, ease: 'easeOut' as const, delay },
  });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label={`Welcome to ${RESTAURANT.name}`}
    >
      {/* Background with gradient + subtle gold radials */}
      <div className="absolute inset-0 bg-gradient-to-b from-aurum-cream-primary to-aurum-cream-secondary z-0" />
      <div
        className="absolute inset-0 z-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(201,165,116,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(212,175,55,0.04) 0%, transparent 50%)',
        }}
      />

      {/* Video background (optional — shows if file exists) */}
      <div className="absolute inset-0 z-[1]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="video-background opacity-30"
          poster="/images/hero-poster.jpg"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-aurum-cream-primary/80 to-aurum-cream-primary/60" />
      </div>

      {/* Centered Content */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        <motion.p
          {...fadeUp(0)}
          className="text-sm font-inter font-medium tracking-[4px] uppercase text-aurum-gold-primary mb-6"
        >
          Fine Dining Experience
        </motion.p>

        <motion.h1
          {...fadeUp(0.2)}
          className="font-playfair text-6xl md:text-7xl lg:text-8xl font-light text-aurum-text-heading tracking-tight"
        >
          {RESTAURANT.name}
        </motion.h1>

        <motion.p
          {...fadeUp(0.4)}
          className="font-playfair text-2xl md:text-3xl text-aurum-gold-brass italic mt-4"
        >
          {RESTAURANT.tagline}
        </motion.p>

        <motion.p
          {...fadeUp(0.6)}
          className="text-lg text-aurum-text-body/80 max-w-[600px] mx-auto mt-6 leading-relaxed"
        >
          {RESTAURANT.taglineSubtitle}
        </motion.p>

        <motion.div {...fadeUp(0.8)} className="mt-10">
          <Button variant="primary" size="lg" href="#reservation">
            Experience the Journey
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 rounded-full border-2 border-aurum-gold-primary/30 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 bg-aurum-gold-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
