import { z } from 'zod';

export const BranchSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  location: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE']).default('ACTIVE'),
  isDefault: z.boolean().default(false),
});

export type BranchFormData = z.infer<typeof BranchSchema>;
