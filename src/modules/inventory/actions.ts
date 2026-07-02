'use server';

import { InventoryService } from './service';
import { SupplierFormData, IngredientFormData, PurchaseOrderFormData } from './validation';
import { revalidatePath } from 'next/cache';
import { Logger } from '@/src/lib/logger';

// --- SUPPLIER ACTIONS ---
export async function createSupplierAction(branchId: string, data: SupplierFormData) {
  try {
    await InventoryService.createSupplier(branchId, data);
    revalidatePath('/admin/inventory/suppliers');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('createSupplierAction failed', { error });
    return { error: (error as Error).message || 'Failed to create supplier' };
  }
}

export async function updateSupplierAction(id: string, data: SupplierFormData) {
  try {
    await InventoryService.updateSupplier(id, data);
    revalidatePath('/admin/inventory/suppliers');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('updateSupplierAction failed', { error });
    return { error: (error as Error).message || 'Failed to update supplier' };
  }
}

export async function deleteSupplierAction(id: string) {
  try {
    await InventoryService.deleteSupplier(id);
    revalidatePath('/admin/inventory/suppliers');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('deleteSupplierAction failed', { error });
    return { error: (error as Error).message || 'Failed to delete supplier' };
  }
}

// --- INGREDIENT ACTIONS ---
export async function createIngredientAction(branchId: string, data: IngredientFormData) {
  try {
    await InventoryService.createIngredient(branchId, data);
    revalidatePath('/admin/inventory/ingredients');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('createIngredientAction failed', { error });
    return { error: (error as Error).message || 'Failed to create ingredient' };
  }
}

export async function updateIngredientAction(id: string, data: IngredientFormData) {
  try {
    await InventoryService.updateIngredient(id, data);
    revalidatePath('/admin/inventory/ingredients');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('updateIngredientAction failed', { error });
    return { error: (error as Error).message || 'Failed to update ingredient' };
  }
}

export async function deleteIngredientAction(id: string) {
  try {
    await InventoryService.deleteIngredient(id);
    revalidatePath('/admin/inventory/ingredients');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('deleteIngredientAction failed', { error });
    return { error: (error as Error).message || 'Failed to delete ingredient' };
  }
}

// --- PO ACTIONS ---
export async function createPurchaseOrderAction(branchId: string, data: PurchaseOrderFormData) {
  try {
    await InventoryService.createPurchaseOrder(branchId, data);
    revalidatePath('/admin/inventory/po');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('createPurchaseOrderAction failed', { error });
    return { error: (error as Error).message || 'Failed to create PO' };
  }
}

export async function updatePurchaseOrderStatusAction(id: string, status: string) {
  try {
    await InventoryService.updatePurchaseOrderStatus(id, status);
    revalidatePath('/admin/inventory/po');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('updatePurchaseOrderStatusAction failed', { error });
    return { error: (error as Error).message || 'Failed to update PO status' };
  }
}
