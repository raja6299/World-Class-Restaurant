import { prisma } from '@/src/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0;

export default async function OrderTrackingPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      events: { orderBy: { timestamp: 'asc' } },
    }
  });

  if (!order) {
    redirect('/menu');
  }

  const currentStatus = order.status;
  const statuses = ['CREATED', 'ACCEPTED', 'PREPARING', 'READY', 'SERVED'];
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="min-h-screen bg-aurum-cream-secondary pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-aurum-cream-primary p-8 rounded-xl border border-[rgba(212,175,55,0.2)] text-center shadow-aurum-lg">
          <div className="text-aurum-gold-primary text-5xl mb-4">✨</div>
          <h1 className="font-playfair text-3xl text-aurum-text-heading mb-2">Order Received</h1>
          <p className="text-aurum-text-body/70 mb-8">Order #{order.id.slice(0,8).toUpperCase()}</p>
          
          {/* Tracking Timeline */}
          <div className="relative flex flex-col items-start space-y-6 text-left max-w-sm mx-auto mb-10">
            {statuses.map((status, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;
              return (
                <div key={status} className="flex items-center gap-4 relative z-10 w-full">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-500 ${isCompleted ? 'bg-aurum-gold-primary border-aurum-gold-primary text-aurum-cream-primary' : 'bg-aurum-cream-secondary border-aurum-gold-earthy/30 text-aurum-text-body/30'}`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div className={`font-medium tracking-wide ${isCurrent ? 'text-aurum-gold-primary font-bold' : isCompleted ? 'text-aurum-text-heading' : 'text-aurum-text-body/40'}`}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </div>
                  {/* Line connector */}
                  {index < statuses.length - 1 && (
                    <div className={`absolute left-4 top-8 bottom-[-24px] w-[2px] -ml-[1px] -z-10 ${index < currentIndex ? 'bg-aurum-gold-primary' : 'bg-aurum-gold-earthy/20'}`}></div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-[rgba(212,175,55,0.2)] pt-6 mt-6">
            <h3 className="font-playfair text-xl mb-4">Order Summary</h3>
            <div className="space-y-2 text-left mb-6">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.snapshotName}</span>
                  <span className="text-aurum-gold-primary font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <Link href="/menu">
              <button className="text-aurum-gold-primary hover:underline font-medium">
                Order More Items
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
