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
}

export default function AnimatedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
}: AnimatedImageProps) {
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
        className={`transition-transform duration-700 ease-out ${fill ? 'object-cover' : ''}`}
      />
    </motion.div>
  );
}
