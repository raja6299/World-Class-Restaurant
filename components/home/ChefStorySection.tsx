'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { CHEF } from '@/lib/utils/constants';
import { fadeInUp, scaleXGrow } from '@/lib/utils/animations';

export default function ChefStorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const bioParagraphs = CHEF.bio.split('\n\n');

  return (
    <section id="chef-story" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
      >
        {/* Image Column */}
        <div ref={imgRef}>
          <motion.div variants={fadeInUp} className="relative">
            <motion.div style={{ y: imgY }}>
              <div className="rounded-xl overflow-hidden border-[8px] border-aurum-gold-primary">
                <Image
                  src={CHEF.image}
                  alt={`Chef ${CHEF.name}`}
                  width={600}
                  height={750}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="mt-6 w-3/4 ml-auto rounded-lg overflow-hidden border-2 border-[rgba(212,175,55,0.2)]"
          >
            <Image
              src={CHEF.kitchenImage}
              alt={`${CHEF.name} in the kitchen`}
              width={450}
              height={300}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>

        {/* Text Column */}
        <div>
          <motion.h2
            variants={fadeInUp}
            className="font-playfair text-3xl md:text-4xl lg:text-5xl text-aurum-text-heading"
          >
            Chef {CHEF.name}&apos;s Journey
          </motion.h2>

          <motion.div
            variants={scaleXGrow}
            className="w-[60px] h-[3px] bg-aurum-gold-primary my-6 origin-left"
          />

          {bioParagraphs.map((para, i) => (
            <motion.p
              key={i}
              variants={fadeInUp}
              className="text-lg text-aurum-text-body leading-relaxed mb-5"
            >
              {para}
            </motion.p>
          ))}

          <motion.blockquote
            variants={fadeInUp}
            className="border-l-4 border-aurum-gold-primary pl-6 my-8"
          >
            <p className="font-playfair text-xl md:text-2xl text-aurum-gold-brass italic leading-relaxed">
              &ldquo;{CHEF.quote}&rdquo;
            </p>
          </motion.blockquote>
        </div>
      </motion.div>
    </section>
  );
}
