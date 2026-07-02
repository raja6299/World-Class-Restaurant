import { MenuRepository } from './repository';
import { CategoryFormData, ModifierGroupFormData, MenuItemFormData, CategorySchema, ModifierGroupSchema, MenuItemSchema } from './validation';

export class MenuService {
  // --- CATEGORIES ---
  static async getCategories(branchId: string) {
    return MenuRepository.getCategories(branchId);
  }

  static async createCategory(branchId: string, data: CategoryFormData) {
    const validated = CategorySchema.parse(data);
    return MenuRepository.createCategory(branchId, validated);
  }

  static async updateCategory(id: string, data: CategoryFormData) {
    const validated = CategorySchema.parse(data);
    return MenuRepository.updateCategory(id, validated);
  }

  static async deleteCategory(id: string) {
    return MenuRepository.deleteCategory(id);
  }

  // --- MENU ITEMS ---
  static async getMenuItems(branchId: string) {
    return MenuRepository.getMenuItems(branchId);
  }

  static async createMenuItem(branchId: string, data: MenuItemFormData) {
    const validated = MenuItemSchema.parse(data);
    return MenuRepository.createMenuItem(branchId, validated);
  }

  static async updateMenuItem(id: string, data: MenuItemFormData) {
    const validated = MenuItemSchema.parse(data);
    return MenuRepository.updateMenuItem(id, validated);
  }

  static async deleteMenuItem(id: string) {
    return MenuRepository.deleteMenuItem(id);
  }

  // --- MODIFIER GROUPS ---
  static async getModifierGroups(menuItemId: string) {
    return MenuRepository.getModifierGroups(menuItemId);
  }

  static async createModifierGroup(menuItemId: string, data: ModifierGroupFormData) {
    const validated = ModifierGroupSchema.parse(data);
    return MenuRepository.createModifierGroup(menuItemId, validated);
  }

  static async updateModifierGroup(id: string, data: ModifierGroupFormData) {
    const validated = ModifierGroupSchema.parse(data);
    return MenuRepository.updateModifierGroup(id, validated);
  }

  static async deleteModifierGroup(id: string) {
    return MenuRepository.deleteModifierGroup(id);
  }
}
