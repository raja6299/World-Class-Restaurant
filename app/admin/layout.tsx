import React from 'react';
import Link from 'next/link';
import { createClient } from '@/src/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Very basic authorization check on layout level
  const role = user.user_metadata?.role;
  if (!['ADMIN', 'OWNER', 'MANAGER'].includes(role)) {
    redirect('/unauthorized');
  }

  return (
    <div className="min-h-screen bg-aurum-charcoal-primary flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-aurum-charcoal-secondary border-r border-aurum-gold-primary/20 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-playfair text-aurum-gold-primary font-semibold">Aurum OS</h1>
          <p className="text-sm text-aurum-cream-secondary">Admin Console</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-2 rounded-lg text-aurum-cream-primary hover:bg-aurum-gold-primary/10 hover:text-aurum-gold-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/menu" className="block px-4 py-2 rounded-lg text-aurum-cream-primary hover:bg-aurum-gold-primary/10 hover:text-aurum-gold-primary transition-colors">
            Menu & Modifiers
          </Link>
          <Link href="/admin/inventory" className="block px-4 py-2 rounded-lg text-aurum-cream-primary hover:bg-aurum-gold-primary/10 hover:text-aurum-gold-primary transition-colors">
            Inventory
          </Link>
          <Link href="/admin/suppliers" className="block px-4 py-2 rounded-lg text-aurum-cream-primary hover:bg-aurum-gold-primary/10 hover:text-aurum-gold-primary transition-colors">
            Suppliers & POs
          </Link>
          <Link href="/admin/kitchen" className="block px-4 py-2 rounded-lg text-aurum-cream-primary hover:bg-aurum-gold-primary/10 hover:text-aurum-gold-primary transition-colors">
            Kitchen KDS
          </Link>
          <Link href="/admin/waiter" className="block px-4 py-2 rounded-lg text-aurum-cream-primary hover:bg-aurum-gold-primary/10 hover:text-aurum-gold-primary transition-colors">
            Waiter POS
          </Link>
          <Link href="/admin/settings" className="block px-4 py-2 rounded-lg text-aurum-cream-primary hover:bg-aurum-gold-primary/10 hover:text-aurum-gold-primary transition-colors mt-8">
            Settings
          </Link>
          <Link href="/admin/branches" className="block px-4 py-2 rounded-lg text-aurum-cream-primary hover:bg-aurum-gold-primary/10 hover:text-aurum-gold-primary transition-colors">
            Branches
          </Link>
        </nav>
        <div className="p-4 border-t border-aurum-gold-primary/20">
          <p className="text-sm text-aurum-cream-secondary truncate">{user.email}</p>
          <p className="text-xs text-aurum-gold-secondary mt-1 uppercase tracking-wider">{role}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-aurum-charcoal-secondary border-b border-aurum-gold-primary/20 flex items-center px-8">
          <h2 className="text-lg font-inter text-aurum-cream-primary">Restaurant Operations</h2>
        </header>
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
