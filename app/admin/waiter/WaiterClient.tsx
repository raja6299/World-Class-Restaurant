'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { openSessionAction } from '@/src/modules/floor/actions';
import { useRouter } from 'next/navigation';

type WaiterTable = {
  id: string;
  tableNumber: string;
  capacity: number;
  status: string;
  sessions?: { guestCount: number; orders?: { status: string }[] }[];
};

export function WaiterClient({ initialTables, branchId, supabaseUrl, supabaseKey }: { initialTables: WaiterTable[], branchId: string, supabaseUrl: string, supabaseKey: string }) {
  const [tables] = useState(initialTables);
  const router = useRouter();
  
  useEffect(() => {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Subscribe to Table updates
    const channel = supabase
      .channel('floor-tables')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Table', filter: `branchId=eq.${branchId}` }, () => {
        router.refresh();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Order', filter: `branchId=eq.${branchId}` }, () => {
        router.refresh();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [branchId, supabaseUrl, supabaseKey, router]);

  const handleOpenSession = async (tableId: string) => {
    // Hardcoded waiter ID for demo
    await openSessionAction(tableId, branchId, 2);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {tables.map(table => {
        const activeSession = table.sessions?.[0];
        const activeOrder = activeSession?.orders?.[0];
        
        let bgColor = 'bg-zinc-900 border-zinc-800';
        if (table.status === 'OCCUPIED') bgColor = 'bg-blue-900/20 border-blue-900/50 text-blue-100';
        if (table.status === 'CUSTOMER_WAITING') bgColor = 'bg-amber-900/20 border-amber-900/50 text-amber-100';
        if (table.status === 'BILL_PENDING') bgColor = 'bg-green-900/20 border-green-900/50 text-green-100';

        return (
          <div key={table.id} className={`p-6 border rounded-2xl transition-colors ${bgColor}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-3xl font-serif">{table.tableNumber}</h3>
              <span className="text-xs px-2 py-1 bg-zinc-800 rounded-md">
                {table.capacity} Seats
              </span>
            </div>
            
            <p className="text-sm font-medium mb-4 uppercase tracking-wider opacity-80">{table.status}</p>

            {activeSession ? (
              <div className="space-y-2 text-sm opacity-80">
                <p>Guests: {activeSession.guestCount}</p>
                {activeOrder ? (
                  <p>Order: <span className="font-semibold">{activeOrder.status}</span></p>
                ) : (
                  <p>No active order</p>
                )}
              </div>
            ) : (
              <div className="mt-6">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenSession(table.id); }}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-lg transition-colors"
                >
                  Open Session
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Slide-over Action Panel could go here when selectedTable is set */}
    </div>
  );
}
