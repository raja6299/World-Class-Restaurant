export interface ModifierDto {
  id: string;
  name: string;
  extraPrice: number;
}

export interface ModifierGroupDto {
  id: string;
  name: string;
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  modifiers: ModifierDto[];
}

export interface CategoryDto {
  id: string;
  name: string;
  sortOrder: number;
}

export interface MenuItemDto {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  category?: CategoryDto;
  imageUrl: string | null;
  isAvailable: boolean;
  preparationTime: number | null;
  
  isVeg: boolean;
  isNonVeg: boolean;
  isEgg: boolean;
  isPureVeg: boolean;
  isJain: boolean;
  isSwaminarayan: boolean;
  isHalal: boolean;
  spiceLevel: number;
  
  modifierGroups: ModifierGroupDto[];
}
