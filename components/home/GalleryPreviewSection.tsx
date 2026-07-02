'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GALLERY_IMAGES } from '@/lib/utils/constants';
import AnimatedImage from '@/components/shared/AnimatedImage';
import Link from 'next/link';

export default function GalleryPreviewSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);
  
  const previewImages = GALLERY_IMAGES.slice(0, 5);

  return (
    <section ref={targetRef} id="gallery-preview" className="relative h-[400vh] bg-aurum-charcoal">
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        
        {/* Header - Fixed during scroll */}
        <div className="pt-24 px-6 lg:px-12 flex justify-between items-end shrink-0 z-20">
          <div>
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-7xl text-aurum-ivory font-medium tracking-[-0.02em]">
              Visual Stories
            </h2>
            <p className="mt-4 text-aurum-ivory/60 max-w-md font-light text-sm md:text-base">
              A cinematic glimpse into the moments, details, and atmosphere that define the Aurum experience.
            </p>
          </div>
          <Link href="/gallery" className="hidden md:flex items-center gap-4 group">
            <span className="text-xs uppercase tracking-[3px] text-aurum-gold font-semibold group-hover:text-aurum-ivory transition-colors duration-300">
              Explore Gallery
            </span>
            <div className="w-12 h-[1px] bg-aurum-gold group-hover:bg-aurum-ivory transition-colors duration-300 group-hover:w-16" />
          </Link>
        </div>

        {/* Horizontal Scroll Track */}
        <motion.div style={{ x }} className="flex items-center h-full gap-8 px-6 lg:px-12 pb-24 mt-12 w-max">
          {previewImages.map((img, i) => (
            <div 
              key={i} 
              className={`relative overflow-hidden group shrink-0 ${
                i % 2 === 0 ? 'w-[60vw] md:w-[45vw] lg:w-[35vw] h-[60vh]' : 'w-[50vw] md:w-[35vw] lg:w-[25vw] h-[50vh] mt-24'
              }`}
            >
              <AnimatedImage
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 60vw, (max-width: 1024px) 45vw, 35vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-aurum-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <p className="text-aurum-ivory font-playfair text-2xl mb-1">{img.alt}</p>
                <p className="text-aurum-gold text-xs uppercase tracking-[2px]">{img.category}</p>
              </div>
            </div>
          ))}
          
          {/* Final 'View More' Card */}
          <div className="relative shrink-0 w-[40vw] md:w-[25vw] lg:w-[20vw] h-[40vh] flex items-center justify-center border border-aurum-gold/20 rounded-sm group cursor-pointer ml-12 hover:bg-aurum-ivory/5 transition-colors duration-500">
             <Link href="/gallery" className="absolute inset-0 flex flex-col items-center justify-center text-aurum-ivory">
               <span className="font-playfair text-2xl md:text-3xl mb-4 group-hover:-translate-y-2 transition-transform duration-500">View All</span>
               <span className="w-12 h-[1px] bg-aurum-gold group-hover:w-24 transition-all duration-500" />
             </Link>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
