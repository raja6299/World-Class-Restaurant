export default function Loading() {
  return (
    <div className="min-h-screen bg-aurum-charcoal-primary flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-aurum-gold-primary/30 border-t-aurum-gold-primary rounded-full animate-spin"></div>
      <p className="mt-4 font-playfair text-aurum-gold-primary text-lg">Loading...</p>
    </div>
  );
}
