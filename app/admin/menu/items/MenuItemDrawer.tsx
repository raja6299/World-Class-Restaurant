'use client';

import React, { useEffect } from 'react';
import { RightDrawer } from '@/components/shared/RightDrawer';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MenuItemSchema, MenuItemFormData } from '@/src/modules/menu/validation';
import { Input, Select, Toggle, SubmitButton } from '@/components/shared/form/FormFields';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { createMenuItemAction, updateMenuItemAction } from '@/src/modules/menu/actions';
import { MenuItemDto, CategoryDto } from '@/src/modules/menu/dto';

interface MenuItemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItemDto | null;
  categories: CategoryDto[];
  branchId: string;
}

export default function MenuItemDrawer({ isOpen, onClose, item, categories, branchId }: MenuItemDrawerProps) {
  const isEditing = !!item;

  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(MenuItemSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      isAvailable: true,
      imageUrl: '',
      preparationTime: 15,
      isVeg: false,
      isPureVeg: false,
      isJain: false,
      isSwaminarayan: false,
      isHalal: false,
      isEgg: false,
      isNonVeg: false,
      spiceLevel: 0,
    },
  });

  const imageUrl = useWatch({ control, name: 'imageUrl' });
  const toggles = useWatch({
    control,
    name: ['isAvailable', 'isVeg', 'isNonVeg', 'isEgg', 'isPureVeg', 'isJain', 'isHalal']
  });
  
  const [isAvailable, isVeg, isNonVeg, isEgg, isPureVeg, isJain, isHalal] = toggles;

  useEffect(() => {
    if (isOpen) {
      if (item) {
        reset({
          name: item.name,
          description: item.description || '',
          price: item.price,
          categoryId: item.categoryId,
          isAvailable: item.isAvailable,
          imageUrl: item.imageUrl || '',
          preparationTime: item.preparationTime || 15,
          isVeg: item.isVeg,
          isPureVeg: item.isPureVeg,
          isJain: item.isJain,
          isSwaminarayan: item.isSwaminarayan,
          isHalal: item.isHalal,
          isEgg: item.isEgg,
          isNonVeg: item.isNonVeg,
          spiceLevel: item.spiceLevel,
        });
      } else {
        reset({
          name: '',
          description: '',
          price: 0,
          categoryId: categories.length > 0 ? categories[0].id : '',
          isAvailable: true,
          imageUrl: '',
          preparationTime: 15,
          isVeg: false,
          isPureVeg: false,
          isJain: false,
          isSwaminarayan: false,
          isHalal: false,
          isEgg: false,
          isNonVeg: false,
          spiceLevel: 0,
        });
      }
    }
  }, [isOpen, item, reset, categories]);

  const onSubmit = async (data: MenuItemFormData) => {
    let result;
    if (isEditing) {
      result = await updateMenuItemAction(item.id, data);
    } else {
      result = await createMenuItemAction(branchId, data);
    }
    if (result.error) alert(result.error);
    else onClose();
  };

  const categoryOptions = categories.map(c => ({ label: c.name, value: c.id }));

  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Menu Item' : 'Add Menu Item'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-8 pr-2">
          
          {/* Basic Details */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Basic Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Dish Name" placeholder="e.g. Truffle Fries" error={errors.name?.message as string} {...register('name')} required />
              <Input label="Price" type="number" step="0.01" error={errors.price?.message as string} {...register('price')} required />
              
              <div className="md:col-span-2">
                <Select label="Category" options={categoryOptions} error={errors.categoryId?.message as string} {...register('categoryId')} required />
              </div>
              
              <div className="md:col-span-2">
                <Input label="Description" placeholder="A brief description of the dish..." error={errors.description?.message as string} {...register('description')} />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Dish Image</h3>
            <ImageUpload folder="menu-images" value={imageUrl || undefined} onChange={(url) => setValue('imageUrl', url, { shouldDirty: true })} className="max-w-md" />
          </div>

          {/* Operational Details */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Operational & Dietary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Preparation Time (mins)" type="number" error={errors.preparationTime?.message as string} {...register('preparationTime')} />
              <Input label="Spice Level (0-5)" type="number" min="0" max="5" error={errors.spiceLevel?.message as string} {...register('spiceLevel')} />
            </div>

            <div className="bg-aurum-cream-secondary p-4 rounded-lg border border-aurum-gold-primary/10 grid grid-cols-2 gap-4">
              <Toggle label="Available for Order" description="Turn off to mark as out of stock" checked={isAvailable} onChange={(e) => setValue('isAvailable', e.target.checked)} />
              <Toggle label="Vegetarian" description="Standard veg" checked={isVeg} onChange={(e) => setValue('isVeg', e.target.checked)} />
              <Toggle label="Non-Vegetarian" description="Contains meat" checked={isNonVeg} onChange={(e) => setValue('isNonVeg', e.target.checked)} />
              <Toggle label="Contains Egg" description="Eggetarian" checked={isEgg} onChange={(e) => setValue('isEgg', e.target.checked)} />
              <Toggle label="Pure Veg" description="Strictly vegetarian kitchen" checked={isPureVeg} onChange={(e) => setValue('isPureVeg', e.target.checked)} />
              <Toggle label="Jain" description="No onion, no garlic" checked={isJain} onChange={(e) => setValue('isJain', e.target.checked)} />
              <Toggle label="Halal" description="Halal certified meat" checked={isHalal} onChange={(e) => setValue('isHalal', e.target.checked)} />
            </div>
          </div>

        </div>
        <div className="pt-6 border-t border-aurum-gold-primary/10 flex items-center justify-end gap-3 mt-auto bg-aurum-cream-primary">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-medium text-aurum-text-body border border-aurum-gold-primary/20 hover:bg-aurum-gold-primary/5 transition-colors">Cancel</button>
          <SubmitButton isLoading={isSubmitting}>{isEditing ? 'Save Changes' : 'Create Menu Item'}</SubmitButton>
        </div>
      </form>
    </RightDrawer>
  );
}
