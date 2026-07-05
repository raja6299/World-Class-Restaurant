import { prisma } from '@/src/lib/prisma';
import { KdsClient } from './KdsClient';
import { env } from '@/src/config/env';

export const metadata = {
  title: 'KDS | AURUM',
};

export default async function KitchenDisplayPage() {
  // Fetch initial branch ID (assume first for demo)
  const branch = await prisma.branch.findFirst();
  
  if (!branch) {
    return <div className="p-10 text-white">No branch found.</div>;
  }

  // Fetch initial queue
  const activeOrders = await prisma.order.findMany({
    where: {
      branchId: branch.id,
      status: { in: ['NEW', 'ACCEPTED', 'PREPARING'] },
    },
    include: {
      items: { include: { menuItem: true } },
      diningSession: {
        include: { table: true }
      }
    },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <header className="p-6 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-amber-500">Kitchen Display System</h1>
          <p className="text-sm text-zinc-400">Branch: {branch.name}</p>
        </div>
        <div className="flex gap-4 items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            Realtime Sync Active
          </div>
        </div>
      </header>

      <main className="p-6 h-[calc(100vh-100px)] overflow-x-auto">
        <KdsClient initialOrders={activeOrders} branchId={branch.id} supabaseUrl={env.NEXT_PUBLIC_SUPABASE_URL!} supabaseKey={env.NEXT_PUBLIC_SUPABASE_ANON_KEY!} />
      </main>
    </div>
  );
}
