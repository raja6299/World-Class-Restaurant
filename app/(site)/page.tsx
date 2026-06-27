'use client';

import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/utils/animations';
import HeroSection from '@/components/home/HeroSection';
import QuickNavCards from '@/components/home/QuickNavCards';
import ChefStorySection from '@/components/home/ChefStorySection';
import FeaturedDishesSection from '@/components/home/FeaturedDishesSection';
import TastingMenusSection from '@/components/home/TastingMenusSection';
import ExperiencesSection from '@/components/home/ExperiencesSection';
import WineBeverageSection from '@/components/home/WineBeverageSection';
import TestimonialSection from '@/components/home/TestimonialSection';
import GalleryPreviewSection from '@/components/home/GalleryPreviewSection';
import ReservationFormSection from '@/components/home/ReservationFormSection';

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
