'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { MENU_ITEMS, MENU_CATEGORIES, RESTAURANT } from '@/lib/utils/constants';
import { staggerContainer, staggerItem } from '@/lib/utils/animations';

const badgeStyles: Record<string, string> = {
  'chef-special': 'bg-aurum-gold-primary/90 text-aurum-cream-primary',
  vegetarian: 'bg-green-700/90 text-white',
  spicy: 'bg-red-500/90 text-white',
  new: 'bg-aurum-dark-navy/90 text-white',
};

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('starters');
  const [searchQuery, setSearchQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = item.category === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="pt-28 pb-12 px-6 text-center bg-aurum-cream-secondary">
        <h1 className="font-playfair text-4xl md:text-5xl text-aurum-text-heading">
          {RESTAURANT.name} Menu
        </h1>
        <p className="text-base text-aurum-text-body/70 mt-3 max-w-[500px] mx-auto">
          Each dish tells a story of heritage, sourced directly from 23 organic farms across India.
        </p>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-20 z-40 bg-aurum-cream-primary/95 backdrop-blur-md border-b border-[rgba(212,175,55,0.2)] py-4 px-6">
        <div className="flex justify-center gap-3 overflow-x-auto max-w-5xl mx-auto scrollbar-hide">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-sm uppercase tracking-wider font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'text-aurum-gold-primary border-b-[3px] border-aurum-gold-primary'
                  : 'text-aurum-text-body/50 hover:text-aurum-text-body'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="max-w-[600px] mx-auto mt-8 mb-12 px-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes..."
            className="w-full h-14 bg-aurum-cream-secondary border border-[rgba(212,175,55,0.2)] rounded-lg px-5 pr-12 text-base text-aurum-text-body focus:border-aurum-gold-primary focus:outline-none transition-colors duration-200"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-aurum-gold-earthy/50 text-lg">
            🔍
          </span>
        </div>
      </div>

      {/* Menu Grid */}
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-6 pb-20"
      >
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="font-playfair text-2xl text-aurum-text-heading/50">No dishes found</p>
            <p className="text-sm text-aurum-text-body/50 mt-2">Try adjusting your search</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              className="group bg-aurum-cream-secondary rounded-xl overflow-hidden border border-[rgba(212,175,55,0.2)] transition-all duration-200 hover:shadow-aurum-lg hover:border-aurum-gold-primary"
            >
              <div className="relative h-[200px] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Badges */}
                {item.badges.length > 0 && (
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {item.badges.map((badge) => (
                      <span
                        key={badge}
                        className={`px-2 py-1 text-[11px] font-bold uppercase rounded backdrop-blur-sm ${
                          badgeStyles[badge] || ''
                        }`}
                      >
                        {badge.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-playfair text-lg text-aurum-text-heading font-semibold">
                  {item.name}
                </h3>
                <p className="text-sm text-aurum-text-body/70 mt-1 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-aurum-gold-primary">{item.price}</span>
                  <Link
                    href="/#reservation"
                    className="text-sm text-aurum-gold-primary hover:underline transition-all duration-200"
                  >
                    Reserve Table
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
