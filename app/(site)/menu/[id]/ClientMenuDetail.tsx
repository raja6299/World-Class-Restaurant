'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addToCartAction } from '@/src/modules/cart/actions';

export default function ClientMenuDetail({ item, sessionId }: { 
  item: { 
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    isPureVeg?: boolean;
    isJain?: boolean;
    spiceLevel?: number | null;
    preparationTime?: number | null;
  }, 
  sessionId: string | null 
}) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!sessionId) return;
    setIsAdding(true);
    await addToCartAction(item.id, quantity, [], notes);
    setIsAdding(false);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-aurum-cream-secondary pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto bg-aurum-cream-primary rounded-xl overflow-hidden border border-[rgba(212,175,55,0.2)] shadow-aurum-lg">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image */}
          <div className="relative h-[400px] md:h-full min-h-[400px]">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full bg-aurum-cream-secondary flex items-center justify-center">
                <span className="text-aurum-gold-primary/50 text-4xl font-playfair">{item.name}</span>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <Link href="/menu" className="text-aurum-gold-primary hover:underline text-sm mb-6 inline-block uppercase tracking-wider">
              ← Back to Menu
            </Link>
            
            <h1 className="font-playfair text-3xl md:text-4xl text-aurum-text-heading mb-4">{item.name}</h1>
            <p className="text-aurum-text-body/80 mb-6 leading-relaxed">
              {item.description}
            </p>
            
            <div className="text-2xl font-bold text-aurum-gold-primary mb-8">
              ₹{item.price}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {item.isPureVeg && <span className="px-3 py-1 bg-green-700/10 text-green-700 border border-green-700/20 text-xs font-bold uppercase rounded-full">Pure Veg</span>}
              {item.isJain && <span className="px-3 py-1 bg-green-700/10 text-green-700 border border-green-700/20 text-xs font-bold uppercase rounded-full">Jain Available</span>}
              {item.spiceLevel && item.spiceLevel > 1 && <span className="px-3 py-1 bg-red-500/10 text-red-600 border border-red-500/20 text-xs font-bold uppercase rounded-full">Spicy Level {item.spiceLevel}</span>}
              {item.preparationTime && <span className="px-3 py-1 bg-aurum-dark-navy/10 text-aurum-dark-navy border border-aurum-dark-navy/20 text-xs font-bold uppercase rounded-full">{item.preparationTime} min prep</span>}
            </div>

            {sessionId ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-aurum-text-heading mb-2">Special Instructions</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-aurum-cream-secondary border border-[rgba(212,175,55,0.2)] rounded-lg p-3 text-sm focus:border-aurum-gold-primary focus:outline-none transition-colors"
                    placeholder="E.g., less spicy, allergy notes..."
                    rows={2}
                  ></textarea>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 bg-aurum-cream-secondary rounded-full px-4 py-2 border border-[rgba(212,175,55,0.2)]">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-aurum-gold-primary text-xl hover:text-aurum-gold-earthy transition-colors w-6 h-6 flex items-center justify-center">-</button>
                    <span className="font-medium min-w-[20px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-aurum-gold-primary text-xl hover:text-aurum-gold-earthy transition-colors w-6 h-6 flex items-center justify-center">+</button>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-grow bg-aurum-gold-primary text-aurum-cream-primary py-3 rounded hover:bg-aurum-gold-earthy transition-colors font-medium uppercase tracking-wider disabled:opacity-50"
                  >
                    {isAdding ? 'Adding...' : `Add to Cart - ₹${item.price * quantity}`}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-aurum-cream-secondary border border-[rgba(212,175,55,0.2)] rounded-lg p-6 text-center">
                <p className="text-aurum-text-body/70 text-sm mb-4">You are currently viewing our menu. Scan a table QR code to start ordering.</p>
                <Link href="/#reservation">
                  <button className="bg-aurum-gold-primary text-aurum-cream-primary px-6 py-3 rounded hover:bg-aurum-gold-earthy transition-colors font-medium uppercase tracking-wider w-full">
                    Reserve a Table
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
