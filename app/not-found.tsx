import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-aurum-charcoal-primary flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <h2 className="text-4xl font-playfair text-aurum-gold-primary font-semibold">404</h2>
        <h3 className="text-2xl font-playfair text-aurum-cream-primary">Page Not Found</h3>
        <p className="text-aurum-cream-secondary">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-block bg-aurum-gold-primary hover:bg-aurum-gold-secondary text-aurum-dark-navy font-medium px-8 py-3 rounded-md transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
