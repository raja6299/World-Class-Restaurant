import { z } from 'zod';

// Define the schema for our environment variables
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // Database Configurations
  DATABASE_URL: z.string().url("Must be a valid Postgres connection string").optional(),
  DIRECT_URL: z.string().url("Must be a valid Postgres direct connection string").optional(),

  // Supabase Configurations (Authentication)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Must be a valid Supabase URL").optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key is required").optional(),

  // Default Business Configurations (White-Label Settings)
  NEXT_PUBLIC_DEFAULT_CURRENCY: z.string().default('INR'),
  NEXT_PUBLIC_DEFAULT_TIMEZONE: z.string().default('Asia/Kolkata'),

  // Enterprise Provider Configurations
  PAYMENT_PROVIDER: z.enum(['STRIPE', 'RAZORPAY', 'PHONEPE']).optional(),
  POS_PROVIDER: z.enum(['PETPOOJA', 'POSIST', 'SQUARE']).optional(),
  HARDWARE_PROVIDER: z.enum(['EPSON', 'SUNMI']).optional(),
  NOTIFICATION_PROVIDER: z.enum(['TWILIO', 'EMAIL', 'SUPABASE']).optional(),
  MONITORING_PROVIDER: z.enum(['SENTRY', 'DATADOG', 'NEWRELIC']).optional(),
  AI_PROVIDER: z.enum(['GEMINI', 'OPENAI', 'CLAUDE', 'OPENROUTER']).optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:\n', _env.error.format());
  // Do not throw during Vercel build to prevent build crashes
  // throw new Error('Invalid environment variables');
}

export const env = _env.success ? _env.data : process.env as unknown as z.infer<typeof envSchema>;
