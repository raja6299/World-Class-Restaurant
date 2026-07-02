import { prisma } from '@/src/lib/prisma';
import LoginForm from './LoginForm';
import Image from 'next/image';

export default async function LoginPage() {
  const restaurant = await prisma.restaurant.findFirst();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-aurum-charcoal-primary">
      {/* Left Side - Image/Branding */}
      <div className="hidden md:flex md:w-1/2 relative bg-aurum-charcoal-secondary overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-aurum-charcoal-primary/40 z-10"></div>
        {/* We use a beautiful placeholder or logo if exists */}
        <div className="relative z-20 flex flex-col items-center text-center">
          {restaurant?.logoUrl ? (
            <Image 
              src={restaurant.logoUrl} 
              alt={restaurant.name} 
              width={200} 
              height={200} 
              className="mb-8"
            />
          ) : (
            <div className="w-32 h-32 mb-8 bg-aurum-gold-primary/20 rounded-full flex items-center justify-center border border-aurum-gold-primary/50">
              <span className="font-playfair text-4xl text-aurum-gold-primary">
                {restaurant?.name?.charAt(0) || 'A'}
              </span>
            </div>
          )}
          <h1 className="font-playfair text-4xl lg:text-5xl text-aurum-cream-primary mb-4 tracking-wide">
            {restaurant?.name || 'Aurum OS'}
          </h1>
          <p className="text-aurum-cream-secondary/70 text-lg font-light tracking-widest uppercase">
            Enterprise Management
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-aurum-cream-primary min-h-screen">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="font-playfair text-3xl text-aurum-text-heading mb-2">Welcome Back</h2>
            <p className="text-aurum-text-body/60 text-sm">Please sign in to access your operations dashboard.</p>
          </div>
          
          <LoginForm />
          
          <div className="mt-12 text-center">
            <p className="text-xs text-aurum-text-body/40">
              Powered by <span className="font-medium text-aurum-gold-primary">XAIVON Enterprise</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
