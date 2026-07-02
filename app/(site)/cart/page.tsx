import { getCartAction } from '@/src/modules/cart/actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 0;

export default async function CartPage() {
  const result = await getCartAction();

  if (!result.success || !result.data) {
    // If no active session or cart, redirect to menu
    redirect('/menu');
  }

  const cart = result.data;

  return (
    <div className="min-h-screen bg-aurum-cream-secondary pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-playfair text-4xl text-aurum-text-heading mb-8">Your Order</h1>

        {cart.items.length === 0 ? (
          <div className="bg-aurum-cream-primary p-8 rounded-xl border border-[rgba(212,175,55,0.2)] text-center">
            <p className="text-aurum-text-body/70 text-lg mb-6">Your cart is currently empty.</p>
            <Link
              href="/menu"
              className="bg-aurum-gold-primary text-aurum-cream-primary px-8 py-3 rounded hover:bg-aurum-gold-earthy transition-colors font-medium"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item: { id: string, unitPrice: number, quantity: number, totalPrice: number, notes?: string | null, menuItem: { name: string, imageUrl: string | null } }) => (
                <div key={item.id} className="bg-aurum-cream-primary p-4 rounded-xl border border-[rgba(212,175,55,0.2)] flex gap-4">
                  {item.menuItem.imageUrl && (
                    <div className="w-24 h-24 relative rounded overflow-hidden flex-shrink-0">
                      <Image src={item.menuItem.imageUrl} alt={item.menuItem.name} fill sizes="96px" className="object-cover" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className="font-playfair text-lg text-aurum-text-heading font-semibold">{item.menuItem.name}</h3>
                    <p className="text-sm text-aurum-text-body/70">₹{item.unitPrice}</p>
                    {item.notes && <p className="text-xs text-aurum-gold-primary mt-1">Note: {item.notes}</p>}
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <span className="font-bold text-aurum-gold-primary">₹{item.totalPrice}</span>
                    <div className="flex items-center gap-3 bg-aurum-cream-secondary rounded-full px-3 py-1">
                      <button className="text-aurum-text-body/50 hover:text-aurum-gold-primary">-</button>
                      <span className="text-sm">{item.quantity}</span>
                      <button className="text-aurum-text-body/50 hover:text-aurum-gold-primary">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-aurum-cream-primary p-6 rounded-xl border border-[rgba(212,175,55,0.2)] h-fit sticky top-28">
              <h2 className="font-playfair text-2xl text-aurum-text-heading mb-6">Bill Details</h2>
              
              <div className="space-y-3 text-sm text-aurum-text-body/80 mb-6 border-b border-[rgba(212,175,55,0.2)] pb-6">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span>₹{cart.subTotal}</span>
                </div>
                {cart.discountTotal > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span>-₹{cart.discountTotal}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>₹{cart.taxTotal}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-xl text-aurum-text-heading mb-8">
                <span>Grand Total</span>
                <span className="text-aurum-gold-primary">₹{cart.grandTotal}</span>
              </div>

              <Link href="/checkout">
                <button className="w-full bg-aurum-gold-primary text-aurum-cream-primary py-4 rounded font-medium hover:bg-aurum-gold-earthy transition-colors uppercase tracking-wider">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
