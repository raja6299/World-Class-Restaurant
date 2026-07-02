import { prisma } from '@/src/lib/prisma';
import { WaiterClient } from './WaiterClient';
import { env } from '@/src/config/env';

export const metadata = {
  title: 'Waiter Dashboard | AURUM',
};

export default async function WaiterDisplayPage() {
  const branch = await prisma.branch.findFirst();
  
  if (!branch) {
    return <div className="p-10 text-white">No branch found.</div>;
  }

  // Fetch tables and active sessions
  const tables = await prisma.table.findMany({
    where: { branchId: branch.id },
    include: {
      sessions: {
        where: { status: 'ACTIVE' },
        take: 1,
        include: {
          orders: {
            where: { status: { notIn: ['COMPLETED', 'ARCHIVED', 'CANCELLED'] } }
          }
        }
      }
    },
    orderBy: [
      { floor: 'asc' },
      { tableNumber: 'asc' }
    ]
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-6 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-amber-500">Live Floor Management</h1>
          <p className="text-sm text-zinc-400">Branch: {branch.name}</p>
        </div>
        <div className="flex gap-4 items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            Realtime Sync Active
          </div>
        </div>
      </header>

      <main className="p-6">
        <WaiterClient initialTables={tables} branchId={branch.id} supabaseUrl={env.NEXT_PUBLIC_SUPABASE_URL} supabaseKey={env.NEXT_PUBLIC_SUPABASE_ANON_KEY} />
      </main>
    </div>
  );
}
