import { z } from 'zod';

export const CustomerProfileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(8, 'Phone is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  preferredLanguage: z.string().default('en'),
  marketingConsent: z.boolean().default(true),
  birthday: z.string().optional().nullable(),
  anniversary: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  internalNotes: z.string().optional().nullable(),
  manualSegment: z.string().optional().nullable(),
});

export type CustomerProfileFormData = z.infer<typeof CustomerProfileSchema>;
