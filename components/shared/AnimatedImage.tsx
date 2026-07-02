'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface AnimatedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  loading?: 'lazy' | 'eager';
}

export default function AnimatedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading,
}: AnimatedImageProps) {
  // If priority is true, Next.js handles loading eager automatically
  // Otherwise, fallback to lazy loading unless explicitly specified
  const effectiveLoading = priority ? undefined : (loading || 'lazy');

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`overflow-hidden relative group ${className}`}
    >
      {/* Global Image Grading Overlay to unify placeholder art direction */}
      <div className="absolute inset-0 bg-[#C4A77D] mix-blend-overlay opacity-[0.15] z-10 pointer-events-none transition-opacity duration-700 group-hover:opacity-0" />
      
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={fill ? sizes : undefined}
        loading={effectiveLoading}
        className={`transition-transform duration-700 ease-out ${fill ? 'object-cover' : ''}`}
      />
    </motion.div>
  );
}
