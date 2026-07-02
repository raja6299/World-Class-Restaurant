import { Supplier, Ingredient, PurchaseOrder, PurchaseOrderItem } from '@prisma/client';

export type SupplierDto = Supplier;
export type IngredientDto = Ingredient;
export type PurchaseOrderDto = PurchaseOrder & {
  items: PurchaseOrderItem[];
  supplier?: Supplier;
};
