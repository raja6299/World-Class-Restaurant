import { z } from 'zod';

export const SupplierSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Supplier name is required'),
  gstin: z.string().optional().nullable(),
  pan: z.string().optional().nullable(),
  fssaiLicense: z.string().optional().nullable(),
  contactPerson: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email('Invalid email').optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable(),
  paymentTerms: z.string().optional().nullable(),
  isPreferred: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const IngredientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Ingredient name is required'),
  currentQuantity: z.coerce.number().min(0).default(0),
  minimumThreshold: z.coerce.number().min(0).default(10),
  reorderLevel: z.coerce.number().min(0).default(15),
  reorderQuantity: z.coerce.number().min(0).default(50),
  unit: z.string().min(1, 'Unit is required'),
  batchNumber: z.string().optional().nullable(),
});

export const PurchaseOrderSchema = z.object({
  id: z.string().uuid().optional(),
  supplierId: z.string().uuid('Supplier is required'),
  status: z.enum(['DRAFT', 'SENT', 'APPROVED', 'RECEIVED', 'CANCELLED']).default('DRAFT'),
  expectedOn: z.string().optional().nullable(),
  items: z.array(z.object({
    ingredientId: z.string().uuid('Ingredient required'),
    orderedQuantity: z.coerce.number().min(0.01, 'Quantity must be positive'),
    unitPrice: z.coerce.number().min(0, 'Price cannot be negative'),
  })).min(1, 'At least one item is required'),
});

export type SupplierFormData = z.infer<typeof SupplierSchema>;
export type IngredientFormData = z.infer<typeof IngredientSchema>;
export type PurchaseOrderFormData = z.infer<typeof PurchaseOrderSchema>;
