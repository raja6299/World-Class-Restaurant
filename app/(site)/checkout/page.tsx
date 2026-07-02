import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCartAction } from '@/src/modules/cart/actions';
import { OrderService } from '@/src/modules/orders/service';

export const revalidate = 0;

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('dining_session_id')?.value;

  if (!sessionId) {
    redirect('/menu');
  }

  const result = await getCartAction();
  if (!result.success || !result.data || result.data.items.length === 0) {
    redirect('/cart');
  }

  const cart = result.data;

  // Mock checkout handler: In a real app this would be a Client Component calling a Server Action
  // For the enterprise implementation plan, we provide the UI layout for payment methods.

  return (
    <div className="min-h-screen bg-aurum-cream-secondary pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-playfair text-4xl text-aurum-text-heading mb-8">Checkout</h1>
        
        <div className="bg-aurum-cream-primary p-8 rounded-xl border border-[rgba(212,175,55,0.2)] mb-8 text-center">
          <h2 className="font-playfair text-2xl text-aurum-gold-primary mb-2">Total Amount</h2>
          <div className="text-4xl font-bold text-aurum-text-heading mb-8">₹{cart.grandTotal}</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="border-2 border-aurum-gold-primary/30 hover:border-aurum-gold-primary p-4 rounded-lg flex flex-col items-center gap-2 transition-colors">
              <span className="text-2xl">📱</span>
              <span className="font-medium text-aurum-text-heading">Pay via UPI</span>
              <span className="text-xs text-aurum-text-body/60">GPay, PhonePe, Paytm</span>
            </button>
            <button className="border-2 border-aurum-gold-primary/30 hover:border-aurum-gold-primary p-4 rounded-lg flex flex-col items-center gap-2 transition-colors">
              <span className="text-2xl">💳</span>
              <span className="font-medium text-aurum-text-heading">Pay via Card</span>
              <span className="text-xs text-aurum-text-body/60">Visa, Mastercard</span>
            </button>
            <button className="border-2 border-aurum-gold-primary/30 hover:border-aurum-gold-primary p-4 rounded-lg flex flex-col items-center gap-2 transition-colors md:col-span-2">
              <span className="text-2xl">🍽️</span>
              <span className="font-medium text-aurum-text-heading">Pay at Table / Cash</span>
              <span className="text-xs text-aurum-text-body/60">Our staff will assist you</span>
            </button>
          </div>
        </div>

        <form action={async () => {
          'use server';
          // Convert Cart to Order
          const order = await OrderService.convertCartToOrder(cart.id);
          redirect(`/track/${order.id}`);
        }}>
          <button type="submit" className="w-full bg-aurum-gold-primary text-aurum-cream-primary py-4 rounded font-medium hover:bg-aurum-gold-earthy transition-colors uppercase tracking-wider">
            Confirm & Place Order
          </button>
        </form>

      </div>
    </div>
  );
}
