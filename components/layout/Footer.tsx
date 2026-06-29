'use client';

import Link from 'next/link';
import { RESTAURANT } from '@/lib/utils/constants';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menus' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/#reservation', label: 'Reservations' },
];

const legalLinks = [
  { href: '#', label: 'Privacy Policy' },
  { href: '#', label: 'Terms & Conditions' },
  { href: '#', label: 'Cancellation Policy' },
];

export default function Footer() {
  return (
    <footer className="bg-aurum-charcoal text-aurum-ivory relative overflow-hidden">
      <div className="max-w-7xl mx-auto pt-32 pb-12 px-6 lg:px-12 relative z-10">
        
        {/* Top Reservation CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-aurum-ivory/10 pb-16 mb-16 gap-10">
          <div className="max-w-2xl">
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6">
              Join us for an <br />
              <span className="text-aurum-gold italic font-light">unforgettable</span> evening.
            </h2>
            <Link 
              href="/#reservation" 
              className="inline-flex items-center gap-4 group"
            >
              <span className="text-sm uppercase tracking-[3px] font-semibold text-aurum-gold group-hover:text-aurum-ivory transition-colors duration-300">
                Reserve a Table
              </span>
              <div className="w-12 h-[1px] bg-aurum-gold group-hover:bg-aurum-ivory group-hover:w-20 transition-all duration-300" />
            </Link>
          </div>
          
          {/* Newsletter Minimal */}
          <div className="w-full md:w-auto md:min-w-[320px]">
            <p className="text-xs uppercase tracking-[2px] text-aurum-ivory/50 mb-4">Newsletter</p>
            <form className="flex border-b border-aurum-ivory/30 pb-2 relative group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent w-full text-sm text-aurum-ivory placeholder:text-aurum-ivory/30 focus:outline-none pr-8"
              />
              <button 
                type="submit"
                className="absolute right-0 bottom-2 text-aurum-gold hover:text-aurum-ivory transition-colors duration-300"
                aria-label="Subscribe"
              >
                &rarr;
              </button>
              <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-aurum-gold group-focus-within:w-full transition-all duration-500" />
            </form>
          </div>
        </div>

        {/* Links & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24">
          {/* Column 1: Address */}
          <div>
            <p className="text-xs uppercase tracking-[2px] text-aurum-gold mb-6">Location</p>
            <div className="text-sm text-aurum-ivory/70 space-y-1 font-light">
              <p>{RESTAURANT.address.street}</p>
              <p>{RESTAURANT.address.city}, {RESTAURANT.address.postalCode}</p>
              <a href={`mailto:${RESTAURANT.email}`} className="block mt-4 hover:text-aurum-gold transition-colors duration-300">
                {RESTAURANT.email}
              </a>
              <a href={`tel:${RESTAURANT.phone}`} className="block mt-1 hover:text-aurum-gold transition-colors duration-300">
                {RESTAURANT.phone}
              </a>
            </div>
          </div>

          {/* Column 2: Hours */}
          <div>
            <p className="text-xs uppercase tracking-[2px] text-aurum-gold mb-6">Hours</p>
            <div className="text-sm text-aurum-ivory/70 space-y-3 font-light">
              <div className="flex justify-between max-w-[200px]">
                <span>Mon–Thu</span>
                <span>{RESTAURANT.hours.monThu.open}–{RESTAURANT.hours.monThu.close}</span>
              </div>
              <div className="flex justify-between max-w-[200px]">
                <span>Fri–Sat</span>
                <span>{RESTAURANT.hours.friSat.open}–{RESTAURANT.hours.friSat.close}</span>
              </div>
              <div className="flex justify-between max-w-[200px]">
                <span>Sun</span>
                <span>{RESTAURANT.hours.sun.open}–{RESTAURANT.hours.sun.close}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Navigation */}
          <div>
            <p className="text-xs uppercase tracking-[2px] text-aurum-gold mb-6">Explore</p>
            <ul className="space-y-3 font-light">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-aurum-ivory/70 hover:text-aurum-ivory transition-colors duration-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div>
            <p className="text-xs uppercase tracking-[2px] text-aurum-gold mb-6">Connect</p>
            <ul className="space-y-3 font-light">
              <li>
                <a href={RESTAURANT.social.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-aurum-ivory/70 hover:text-aurum-ivory transition-colors duration-300">
                  Instagram
                </a>
              </li>
              <li>
                <a href={RESTAURANT.social.facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-aurum-ivory/70 hover:text-aurum-ivory transition-colors duration-300">
                  Facebook
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${RESTAURANT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-sm text-aurum-ivory/70 hover:text-aurum-ivory transition-colors duration-300">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-aurum-ivory/10 gap-4">
          <p className="text-xs text-aurum-ivory/40 font-light tracking-wide">
            © {new Date().getFullYear()} {RESTAURANT.name}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            {legalLinks.map(({ href, label }) => (
              <li key={label}>
                <Link href={href} className="text-xs text-aurum-ivory/40 hover:text-aurum-ivory/80 transition-colors duration-300 font-light">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Large Decorative Text Background */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0 opacity-[0.03] pointer-events-none flex justify-center translate-y-1/4">
        <span className="font-playfair font-bold text-[15vw] whitespace-nowrap tracking-tighter">
          AURUM
        </span>
      </div>
    </footer>
  );
}
