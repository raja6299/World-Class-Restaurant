'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { GALLERY_IMAGES, RESTAURANT } from '@/lib/utils/constants';
import { staggerContainer, staggerItem } from '@/lib/utils/animations';
import { useRef } from 'react';

type GalleryCategory = 'All' | 'Ambiance' | 'Food' | 'Behind-the-Scenes' | 'Ingredients' | 'Events';

const CATEGORIES: GalleryCategory[] = ['All', 'Ambiance', 'Food', 'Behind-the-Scenes', 'Ingredients', 'Events'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  const filteredImages = useMemo(() => {
    if (activeCategory === 'All') return GALLERY_IMAGES;
    return GALLERY_IMAGES.filter((img) => img.category === activeCategory);
  }, [activeCategory]);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev! + 1) % filteredImages.length);
    }
  }, [selectedIndex, filteredImages.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev! - 1 + filteredImages.length) % filteredImages.length);
    }
  }, [selectedIndex, filteredImages.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [selectedIndex, goNext, goPrev]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="pt-28 pb-8 px-6 text-center">
        <h1 className="font-playfair text-4xl md:text-5xl text-aurum-text-heading">Gallery</h1>
        <p className="text-base text-aurum-text-body/70 mt-3 max-w-[500px] mx-auto">
          Visual stories from {RESTAURANT.name} — ambiance, artistry, and inspiration.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center gap-3 px-6 mb-8 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-sm uppercase tracking-wider font-medium transition-all duration-200 ${
              activeCategory === cat
                ? 'text-aurum-gold-primary border-b-[3px] border-aurum-gold-primary'
                : 'text-aurum-text-body/50 hover:text-aurum-text-body'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="masonry-grid max-w-7xl mx-auto px-6 pb-12"
      >
        <AnimatePresence mode="popLayout">
          {filteredImages.map((img, i) => (
            <motion.div
              key={`${img.src}-${img.category}`}
              layout
              variants={staggerItem}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={() => openLightbox(i)}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-sm font-medium">{img.alt}</p>
                  <span className="text-xs text-aurum-gold-primary">{img.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={closeLightbox}
          >
            <div onClick={(e) => e.stopPropagation()} className="relative max-w-[90vw] max-h-[85vh]">
              {/* Close */}
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white text-xl hover:bg-white/10 transition-colors z-10"
              >
                ×
              </button>

              {/* Image */}
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="relative w-[80vw] h-[70vh] max-w-[1200px]"
              >
                <Image
                  src={filteredImages[selectedIndex].src}
                  alt={filteredImages[selectedIndex].alt}
                  fill
                  className="object-contain rounded-lg"
                  sizes="80vw"
                  priority
                />
              </motion.div>

              {/* Caption */}
              <p className="text-white text-center mt-4 text-sm">
                {filteredImages[selectedIndex].alt}
              </p>

              {/* Nav Arrows */}
              <button
                onClick={goPrev}
                className="absolute left-[-50px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white text-xl hover:bg-white/10 transition-colors"
              >
                ‹
              </button>
              <button
                onClick={goNext}
                className="absolute right-[-50px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white text-xl hover:bg-white/10 transition-colors"
              >
                ›
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
