'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/utils/animations';
import HeroSection from '@/components/home/HeroSection';

// Lazy load below-the-fold components for performance
const QuickNavCards = dynamic(() => import('@/components/home/QuickNavCards'), { ssr: true });
const ChefStorySection = dynamic(() => import('@/components/home/ChefStorySection'), { ssr: true });
const FeaturedDishesSection = dynamic(() => import('@/components/home/FeaturedDishesSection'), { ssr: true });
const TastingMenusSection = dynamic(() => import('@/components/home/TastingMenusSection'), { ssr: true });
const ExperiencesSection = dynamic(() => import('@/components/home/ExperiencesSection'), { ssr: true });
const WineBeverageSection = dynamic(() => import('@/components/home/WineBeverageSection'), { ssr: true });
const TestimonialSection = dynamic(() => import('@/components/home/TestimonialSection'), { ssr: true });
const GalleryPreviewSection = dynamic(() => import('@/components/home/GalleryPreviewSection'), { ssr: true });
const ReservationFormSection = dynamic(() => import('@/components/home/ReservationFormSection'), { ssr: true });

export default function HomePage() {
  return (
    <motion.div initial="hidden" animate="visible" variants={pageTransition}>
      <HeroSection />
      <QuickNavCards />
      <ChefStorySection />
      <FeaturedDishesSection />
      <TastingMenusSection />
      <ExperiencesSection />
      <WineBeverageSection />
      <TestimonialSection />
      <GalleryPreviewSection />
      <ReservationFormSection />
    </motion.div>
  );
}
