'use client';

import React, { useEffect } from 'react';
import { RightDrawer } from '@/components/shared/RightDrawer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IngredientSchema, IngredientFormData } from '@/src/modules/inventory/validation';
import { Input, SubmitButton } from '@/components/shared/form/FormFields';
import { createIngredientAction, updateIngredientAction } from '@/src/modules/inventory/actions';

import { IngredientDto } from '@/src/modules/inventory/dto';

interface IngredientDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: IngredientDto | null;
  branchId: string;
}

export default function IngredientDrawer({ isOpen, onClose, ingredient, branchId }: IngredientDrawerProps) {
  const isEditing = !!ingredient;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<IngredientFormData>({
    resolver: zodResolver(IngredientSchema) as unknown as import('react-hook-form').Resolver<IngredientFormData>,
    defaultValues: {
      name: '',
      currentQuantity: 0,
      minimumThreshold: 10,
      reorderLevel: 15,
      reorderQuantity: 50,
      unit: 'kg',
      batchNumber: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (ingredient) {
        reset({
          name: ingredient.name,
          currentQuantity: ingredient.currentQuantity,
          minimumThreshold: ingredient.minimumThreshold,
          reorderLevel: ingredient.reorderLevel,
          reorderQuantity: ingredient.reorderQuantity,
          unit: ingredient.unit,
          batchNumber: ingredient.batchNumber || '',
        });
      } else {
        reset({
          name: '',
          currentQuantity: 0,
          minimumThreshold: 10,
          reorderLevel: 15,
          reorderQuantity: 50,
          unit: 'kg',
          batchNumber: '',
        });
      }
    }
  }, [isOpen, ingredient, reset]);

  const onSubmit = async (data: IngredientFormData) => {
    let result;
    if (isEditing) {
      result = await updateIngredientAction(ingredient.id, data);
    } else {
      result = await createIngredientAction(branchId, data);
    }
    if (result.error) alert(result.error);
    else onClose();
  };

  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Ingredient' : 'Add Ingredient'} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Basic Info</h3>
            <Input label="Ingredient Name" placeholder="e.g. Basmati Rice" error={errors.name?.message as string} {...register('name')} required />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Current Stock" type="number" step="0.01" error={errors.currentQuantity?.message as string} {...register('currentQuantity')} required />
              <Input label="Unit of Measurement" placeholder="e.g. kg, L, pcs" error={errors.unit?.message as string} {...register('unit')} required />
            </div>
            
            <Input label="Batch Number (Optional)" placeholder="e.g. BATCH-2023" error={errors.batchNumber?.message as string} {...register('batchNumber')} />
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Reorder Rules</h3>
            <Input label="Minimum Threshold" description="Alert if stock goes below this" type="number" step="0.01" error={errors.minimumThreshold?.message as string} {...register('minimumThreshold')} required />
            <Input label="Reorder Level" description="Trigger PO creation at this level" type="number" step="0.01" error={errors.reorderLevel?.message as string} {...register('reorderLevel')} required />
            <Input label="Default Reorder Quantity" description="Amount to order by default" type="number" step="0.01" error={errors.reorderQuantity?.message as string} {...register('reorderQuantity')} required />
          </div>
          
        </div>

        <div className="pt-6 border-t border-aurum-gold-primary/10 flex items-center justify-end gap-3 mt-auto bg-aurum-cream-primary">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-medium text-aurum-text-body border border-aurum-gold-primary/20 hover:bg-aurum-gold-primary/5 transition-colors">Cancel</button>
          <SubmitButton isLoading={isSubmitting}>{isEditing ? 'Save Changes' : 'Create Ingredient'}</SubmitButton>
        </div>
      </form>
    </RightDrawer>
  );
}
