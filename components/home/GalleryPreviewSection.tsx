'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { GALLERY_IMAGES } from '@/lib/utils/constants';
import { staggerContainer, staggerItem } from '@/lib/utils/animations';
import SectionHeading from '@/components/shared/SectionHeading';
import Button from '@/components/shared/Button';

export default function GalleryPreviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const previewImages = GALLERY_IMAGES.slice(0, 6);

  return (
    <section id="gallery-preview" className="py-24 px-6 lg:px-12">
      <SectionHeading
        title="Visual Stories"
        subtitle="A glimpse into the AURUM experience."
      />

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="masonry-grid max-w-7xl mx-auto mt-12"
      >
        {previewImages.map((img, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            className={`relative overflow-hidden rounded-xl cursor-pointer group ${
              img.span === 'tall' ? 'tall' : img.span === 'wide' ? 'wide' : ''
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-center p-4">
              <p className="text-sm font-medium mb-1">{img.alt}</p>
              <p className="text-xs text-aurum-gold-primary">{img.category}</p>
              <p className="text-xs mt-2 opacity-70">View Gallery</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-12 text-center">
        <Button variant="primary" size="lg" href="/gallery">
          Explore Full Gallery
        </Button>
      </div>
    </section>
  );
}
