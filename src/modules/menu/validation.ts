import { z } from 'zod';

// Category Schema
export const CategorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Category name is required').max(50),
  sortOrder: z.coerce.number().int().default(0),
});
export type CategoryFormData = z.infer<typeof CategorySchema>;

// Modifier Group Schema
export const ModifierGroupSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Name is required'),
  isRequired: z.boolean().default(false),
  minSelect: z.coerce.number().int().min(0).default(0),
  maxSelect: z.coerce.number().int().min(1).default(1),
  modifiers: z.array(z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, 'Option name is required'),
    extraPrice: z.coerce.number().min(0).default(0),
    isAvailable: z.boolean().default(true),
  })).min(1, 'At least one option is required'),
});
export type ModifierGroupFormData = z.infer<typeof ModifierGroupSchema>;

// Menu Item Schema
export const MenuItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Menu item name is required').max(100),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive('Price must be positive'),
  categoryId: z.string().uuid('Category is required'),
  isAvailable: z.boolean().default(true),
  imageUrl: z.string().url().optional().nullable().or(z.literal('')),
  preparationTime: z.coerce.number().int().min(0).optional().nullable(),
  
  // Dietary Flags
  isVeg: z.boolean().default(false),
  isPureVeg: z.boolean().default(false),
  isJain: z.boolean().default(false),
  isSwaminarayan: z.boolean().default(false),
  isHalal: z.boolean().default(false),
  isEgg: z.boolean().default(false),
  isNonVeg: z.boolean().default(false),
  spiceLevel: z.coerce.number().int().min(0).max(5).default(0),
});
export type MenuItemFormData = z.infer<typeof MenuItemSchema>;
