import { z } from 'zod';

export const RestaurantSettingsSchema = z.object({
  name: z.string().min(2, 'Restaurant name is required'),
  logoUrl: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Must be a valid hex color'),
  secondaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Must be a valid hex color'),
  typography: z.string(),
});

export const BranchSettingsSchema = z.object({
  currency: z.string().length(3),
  timezone: z.string(),
  gst: z.coerce.number().min(0).max(100),
  serviceCharge: z.coerce.number().min(0).max(100),
  upiVpa: z.string().optional().or(z.literal('')),
  businessHours: z.string().optional(), // For simplicity right now, a JSON string
});

export type RestaurantSettingsData = z.infer<typeof RestaurantSettingsSchema>;
export type BranchSettingsData = z.infer<typeof BranchSettingsSchema>;
