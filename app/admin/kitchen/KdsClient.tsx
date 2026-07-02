'use client';

import { useEffect, useState } from 'react';
import { updateOrderStatusAction } from '@/src/modules/kitchen/actions';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

type KdsOrder = {
  id: string;
  status: string;
  createdAt: string | Date;
  diningSession?: { table?: { tableNumber: string } };
  items: { id: string; quantity: number; snapshotName: string; notes?: string | null }[];
};

export function KdsClient({ initialOrders, branchId, supabaseUrl, supabaseKey }: { initialOrders: KdsOrder[], branchId: string, supabaseUrl: string, supabaseKey: string }) {
  const [orders] = useState(initialOrders);
  const router = useRouter();
  
  useEffect(() => {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Subscribe to Order updates
    const channel = supabase
      .channel('kds-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Order', filter: `branchId=eq.${branchId}` }, () => {
        router.refresh();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [branchId, supabaseUrl, supabaseKey, router]);

  const advanceOrder = async (orderId: string, currentStatus: string) => {
    let nextStatus = '';
    if (currentStatus === 'NEW') nextStatus = 'ACCEPTED';
    else if (currentStatus === 'ACCEPTED') nextStatus = 'PREPARING';
    else if (currentStatus === 'PREPARING') nextStatus = 'READY';
    else return;

    await updateOrderStatusAction(orderId, nextStatus, false);
  };

  return (
    <div className="flex gap-6 h-full items-start">
      {orders.map(order => (
        <div key={order.id} className="min-w-[350px] w-[350px] bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col max-h-full">
          {/* Header */}
          <div className={`p-4 border-b border-zinc-800 flex justify-between items-start rounded-t-xl ${
            order.status === 'NEW' ? 'bg-blue-900/20 border-t-2 border-t-blue-500' :
            order.status === 'ACCEPTED' ? 'bg-amber-900/20 border-t-2 border-t-amber-500' :
            'bg-green-900/20 border-t-2 border-t-green-500'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{order.diningSession?.table?.tableNumber || 'Takeaway'}</span>
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded-md text-zinc-300">
                  {order.id.slice(0,6)}
                </span>
              </div>
              <p className="text-zinc-400 text-sm mt-1">{new Date(order.createdAt).toLocaleTimeString()}</p>
            </div>
            <div className="text-right">
              <p className={`font-medium ${order.status === 'NEW' ? 'text-blue-400' : order.status === 'ACCEPTED' ? 'text-amber-400' : 'text-green-400'}`}>
                {order.status}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="pb-4 border-b border-zinc-800/50 last:border-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <span className="text-amber-500">{item.quantity}x</span>
                      {item.snapshotName}
                    </p>
                    {item.notes && (
                      <p className="text-red-400 text-sm mt-1 bg-red-950/30 p-2 rounded border border-red-900/50">
                        ⚠ {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 rounded-b-xl mt-auto">
            <button
              onClick={() => advanceOrder(order.id, order.status)}
              className="w-full py-3 rounded-lg font-medium tracking-wide transition-colors bg-amber-500 hover:bg-amber-400 text-black"
            >
              {order.status === 'NEW' ? 'ACCEPT ORDER' : 
               order.status === 'ACCEPTED' ? 'START PREPARING' : 
               'MARK READY'}
            </button>
          </div>
        </div>
      ))}

      {orders.length === 0 && (
        <div className="flex-1 h-full flex flex-col items-center justify-center text-zinc-500">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <p className="text-xl font-serif">No active orders</p>
          <p className="text-sm mt-2">Kitchen is clear</p>
        </div>
      )}
    </div>
  );
}
