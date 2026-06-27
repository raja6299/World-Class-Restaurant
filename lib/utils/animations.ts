/* ═══════════════════════════════════════════════════════
   AURUM RESTAURANT — Animation Variants (Framer Motion)
   Reusable animation configurations
   ═══════════════════════════════════════════════════════ */

import type { Variants } from 'framer-motion';

/* ─── Scroll-triggered Animations ─── */

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const scaleXGrow: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 },
  },
};

/* ─── Page Transition ─── */

export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

/* ─── Hover Animations ─── */

export const hoverButton = {
  scale: 1.03,
  transition: { duration: 0.2, ease: 'easeInOut' },
};

export const hoverCard = {
  scale: 1.02,
  transition: { duration: 0.2, ease: 'easeInOut' },
};

export const hoverIcon = {
  scale: 1.1,
  transition: { duration: 0.2, ease: 'easeInOut' },
};

/* ─── Stagger with slower offset ─── */

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerItemFade: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};
