import { z } from 'zod';

export const TableSchema = z.object({
  id: z.string().uuid().optional(),
  tableNumber: z.string().min(1, 'Table number is required'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1').default(4),
  floor: z.string().optional().nullable(),
  zone: z.string().optional().nullable(),
  isIndoor: z.boolean().default(true),
  isVip: z.boolean().default(false),
});

export type TableFormData = z.infer<typeof TableSchema>;
