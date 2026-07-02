'use server';

import { MenuService } from './service';
import { CategoryFormData, MenuItemFormData, ModifierGroupFormData } from './validation';
import { revalidatePath } from 'next/cache';
import { Logger } from '@/src/lib/logger';

// --- CATEGORY ACTIONS ---

export async function createCategoryAction(branchId: string, data: CategoryFormData) {
  try {
    await MenuService.createCategory(branchId, data);
    revalidatePath('/admin/menu/categories');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('createCategoryAction failed', { error });
    return { error: (error as Error).message || 'Failed to create category' };
  }
}

export async function updateCategoryAction(id: string, data: CategoryFormData) {
  try {
    await MenuService.updateCategory(id, data);
    revalidatePath('/admin/menu/categories');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('updateCategoryAction failed', { error });
    return { error: (error as Error).message || 'Failed to update category' };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await MenuService.deleteCategory(id);
    revalidatePath('/admin/menu/categories');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('deleteCategoryAction failed', { error });
    return { error: (error as Error).message || 'Failed to delete category' };
  }
}

// --- MENU ITEM ACTIONS ---

export async function createMenuItemAction(branchId: string, data: MenuItemFormData) {
  try {
    await MenuService.createMenuItem(branchId, data);
    revalidatePath('/admin/menu/items');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('createMenuItemAction failed', { error });
    return { error: (error as Error).message || 'Failed to create menu item' };
  }
}

export async function updateMenuItemAction(id: string, data: MenuItemFormData) {
  try {
    await MenuService.updateMenuItem(id, data);
    revalidatePath('/admin/menu/items');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('updateMenuItemAction failed', { error });
    return { error: (error as Error).message || 'Failed to update menu item' };
  }
}

export async function deleteMenuItemAction(id: string) {
  try {
    await MenuService.deleteMenuItem(id);
    revalidatePath('/admin/menu/items');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('deleteMenuItemAction failed', { error });
    return { error: (error as Error).message || 'Failed to delete menu item' };
  }
}

// --- MODIFIER ACTIONS ---

export async function createModifierGroupAction(menuItemId: string, data: ModifierGroupFormData) {
  try {
    await MenuService.createModifierGroup(menuItemId, data);
    revalidatePath('/admin/menu/modifiers');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('createModifierGroupAction failed', { error });
    return { error: (error as Error).message || 'Failed to create modifier group' };
  }
}

export async function updateModifierGroupAction(id: string, data: ModifierGroupFormData) {
  try {
    await MenuService.updateModifierGroup(id, data);
    revalidatePath('/admin/menu/modifiers');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('updateModifierGroupAction failed', { error });
    return { error: (error as Error).message || 'Failed to update modifier group' };
  }
}

export async function deleteModifierGroupAction(id: string) {
  try {
    await MenuService.deleteModifierGroup(id);
    revalidatePath('/admin/menu/modifiers');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('deleteModifierGroupAction failed', { error });
    return { error: (error as Error).message || 'Failed to delete modifier group' };
  }
}
