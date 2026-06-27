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
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden"
    >
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        className={className}
      />
    </motion.div>
  );
}
