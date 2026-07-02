import { z } from 'zod';

export const ReservationSchema = z.object({
  id: z.string().uuid().optional(),
  guestName: z.string().min(2, 'Guest name is required'),
  guestPhone: z.string().min(8, 'Valid phone number is required'),
  guestEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  guestCount: z.coerce.number().int().min(1, 'At least 1 guest required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be HH:MM'),
  status: z.enum(['PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'WALK_IN', 'WAIT_LIST']).default('PENDING'),
  source: z.enum(['WALK_IN', 'ONLINE', 'PHONE']).default('PHONE'),
  tableId: z.string().uuid().optional().nullable(),
  assignedWaiterId: z.string().uuid().optional().nullable(),
  expectedDuration: z.coerce.number().int().default(90),
  deposit: z.coerce.number().default(0),
  arrivalStatus: z.string().optional().nullable(),
  reminderStatus: z.string().optional().nullable(),
  specialRequests: z.string().optional().nullable(),
  occasion: z.string().optional().nullable(),
});

export type ReservationFormData = z.infer<typeof ReservationSchema>;
