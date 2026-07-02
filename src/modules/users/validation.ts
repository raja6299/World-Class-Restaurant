import { z } from 'zod';
import { Role } from '@prisma/client';

export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional().nullable(),
  role: z.nativeEnum(Role),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
});

export type UserFormData = z.infer<typeof UserSchema>;
