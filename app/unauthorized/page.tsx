import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-aurum-charcoal-primary p-6">
      <div className="max-w-md w-full bg-aurum-cream-primary rounded-xl border border-aurum-gold-primary/20 p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-playfair font-semibold text-aurum-text-heading mb-4">
          Access Denied
        </h1>
        
        <p className="text-aurum-text-body/70 mb-8">
          You do not have the required permissions to access this page. Please contact your restaurant manager if you believe this is a mistake.
        </p>

        <Link 
          href="/login" 
          className="inline-flex items-center justify-center w-full rounded-lg bg-aurum-gold-primary px-6 py-3 text-sm font-medium text-white shadow hover:bg-aurum-gold-primary/90 transition-colors"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
}
