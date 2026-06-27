'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { RESTAURANT } from '@/lib/utils/constants';
import Link from 'next/link';

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  
  // Subtle parallax for background and content
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Luxury slow-spring reveal
  const revealVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { 
        delay: custom * 0.15,
        type: 'spring' as const,
        stiffness: 40,
        damping: 20,
        mass: 1
      },
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-aurum-charcoal"
      aria-label={`Welcome to ${RESTAURANT.name}`}
    >
      {/* Background Image / Video Fallback */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 w-full h-full z-0">
        <Image
          src="https://images.unsplash.com/photo-1545247181-516773cae754?w=1920&h=1080&fit=crop&q=90"
          alt="AURUM Culinary Experience"
          fill
          priority
          className="object-cover object-center opacity-80"
          sizes="100vw"
        />
        {/* Cinematic Warm Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-aurum-charcoal/90 via-aurum-brown/40 to-aurum-charcoal/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-aurum-gold/10 mix-blend-overlay" />
      </motion.div>

      {/* Optional Cinematic Video (Commented out - See README for Gemini Video generation instructions) */}
      {/* 
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-80">
        <source src="/videos/hero-cinematic.mp4" type="video/mp4" />
      </video> 
      */}

      {/* Centered Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center mt-12"
      >
        <motion.p
          custom={0}
          variants={revealVariants}
          className="text-[10px] md:text-[11px] font-semibold tracking-[4px] uppercase text-aurum-ivory/80 mb-6 md:mb-8"
        >
          {RESTAURANT.taglineSubtitle}
        </motion.p>

        <motion.h1
          custom={1}
          variants={revealVariants}
          className="font-playfair text-6xl md:text-8xl lg:text-[120px] font-medium text-aurum-ivory tracking-[-0.03em] leading-none drop-shadow-2xl"
        >
          {RESTAURANT.name}
        </motion.h1>

        <motion.p
          custom={2}
          variants={revealVariants}
          className="font-playfair text-xl md:text-3xl text-aurum-gold italic mt-6 md:mt-10 font-light"
        >
          {RESTAURANT.tagline}
        </motion.p>

        <motion.div custom={3} variants={revealVariants} className="mt-12 md:mt-16">
          <Link 
            href="#reservation"
            className="group relative overflow-hidden inline-flex items-center justify-center px-10 py-4 bg-transparent border border-aurum-gold/50 text-aurum-ivory text-xs font-semibold tracking-[3px] uppercase rounded-full hover:border-aurum-gold transition-all duration-700"
          >
            <span className="relative z-10 group-hover:text-aurum-charcoal transition-colors duration-500">
              Experience the Journey
            </span>
            <div className="absolute inset-0 bg-aurum-gold transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-[0.19,1,0.22,1]" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-[1px] h-16 bg-aurum-ivory/20 overflow-hidden relative">
          <motion.div
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 left-0 w-full h-1/2 bg-aurum-gold"
          />
        </div>
      </motion.div>
    </section>
  );
}
