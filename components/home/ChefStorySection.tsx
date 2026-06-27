'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { CHEF } from '@/lib/utils/constants';
import AnimatedImage from '@/components/shared/AnimatedImage';

export default function ChefStorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  
  const imgY1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const imgY2 = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  const bioParagraphs = CHEF.bio.split('\n\n');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 40, damping: 20 },
    },
  };

  return (
    <section id="chef-story" ref={sectionRef} className="py-32 px-6 lg:px-12 bg-aurum-ivory relative overflow-hidden">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center relative z-10"
      >
        {/* Images Column - Editorial Overlap Layout */}
        <div className="lg:col-span-6 relative h-[600px] md:h-[800px] flex items-center justify-center">
          {/* Main Portrait */}
          <motion.div style={{ y: imgY1 }} className="absolute left-0 w-3/4 h-[80%] z-10">
            <div className="relative w-full h-full rounded-sm overflow-hidden shadow-aurum-md">
              <AnimatedImage
                src={CHEF.image}
                alt={`Chef ${CHEF.name}`}
                fill
                priority
              />
            </div>
          </motion.div>
          
          {/* Secondary Action Shot */}
          <motion.div style={{ y: imgY2 }} className="absolute right-0 bottom-[10%] w-2/5 h-2/5 z-20">
            <div className="relative w-full h-full rounded-sm overflow-hidden shadow-aurum-lg border-4 border-aurum-ivory">
              <AnimatedImage
                src={CHEF.kitchenImage}
                alt={`${CHEF.name} in action`}
                fill
              />
            </div>
          </motion.div>
        </div>

        {/* Text Column - Editorial Typography */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <motion.h2
            variants={itemVariants}
            className="font-playfair text-4xl md:text-5xl lg:text-7xl text-aurum-charcoal font-medium tracking-[-0.02em] leading-tight mb-4"
          >
            The Visionary<br />
            <span className="text-aurum-gold italic font-light">Behind Aurum</span>
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="w-[80px] h-[1px] bg-aurum-gold my-8"
          />

          <motion.blockquote
            variants={itemVariants}
            className="mb-10 relative"
          >
            <span className="absolute -top-6 -left-4 text-6xl text-aurum-gold/20 font-playfair">&ldquo;</span>
            <p className="font-playfair text-xl md:text-2xl text-aurum-charcoal/90 italic leading-relaxed relative z-10">
              {CHEF.quote}
            </p>
          </motion.blockquote>

          <div className="space-y-6">
            {bioParagraphs.map((para, i) => (
              <motion.p
                key={i}
                variants={itemVariants}
                className={`text-base md:text-lg text-aurum-charcoal/70 leading-relaxed font-light ${i === 0 ? "first-letter:text-5xl first-letter:font-playfair first-letter:text-aurum-gold first-letter:float-left first-letter:mr-2 first-letter:mt-[-4px]" : ""}`}
              >
                {para}
              </motion.p>
            ))}
          </div>
          
          <motion.div variants={itemVariants} className="mt-12">
            <p className="font-playfair text-3xl text-aurum-charcoal signature-font tracking-widest">
              {CHEF.name}
            </p>
            <p className="text-xs uppercase tracking-[3px] text-aurum-gold mt-2 font-semibold">
              Executive Chef
            </p>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Decorative background typography */}
      <div className="absolute -right-20 top-20 text-[250px] font-playfair text-aurum-charcoal/[0.02] font-bold tracking-tighter -rotate-90 origin-right pointer-events-none select-none z-0">
        AURUM
      </div>
    </section>
  );
}
