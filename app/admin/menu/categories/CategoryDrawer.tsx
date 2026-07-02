'use client';

import React, { useEffect } from 'react';
import { RightDrawer } from '@/components/shared/RightDrawer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategorySchema, CategoryFormData } from '@/src/modules/menu/validation';
import { Input, SubmitButton } from '@/components/shared/form/FormFields';
import { createCategoryAction, updateCategoryAction } from '@/src/modules/menu/actions';

import { CategoryDto } from '@/src/modules/menu/dto';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryDto | null;
  branchId: string;
}

export default function CategoryDrawer({ isOpen, onClose, category, branchId }: CategoryDrawerProps) {
  const isEditing = !!category;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema) as unknown as import('react-hook-form').Resolver<CategoryFormData>,
    defaultValues: {
      name: '',
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (category) {
        reset({ name: category.name, sortOrder: category.sortOrder });
      } else {
        reset({ name: '', sortOrder: 0 });
      }
    }
  }, [isOpen, category, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    let result;
    if (isEditing) {
      result = await updateCategoryAction(category.id, data);
    } else {
      result = await createCategoryAction(branchId, data);
    }
    if (result.error) alert(result.error);
    else onClose();
  };

  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Category' : 'Add Category'} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex flex-col h-full">
        <div className="flex-1 space-y-5">
          <Input label="Category Name" placeholder="e.g. Starters" error={errors.name?.message as string} {...register('name')} required />
          <Input label="Sort Order" type="number" error={errors.sortOrder?.message as string} {...register('sortOrder')} required />
        </div>
        <div className="pt-6 border-t border-aurum-gold-primary/10 flex items-center justify-end gap-3 mt-auto">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-medium text-aurum-text-body border border-aurum-gold-primary/20 hover:bg-aurum-gold-primary/5 transition-colors">Cancel</button>
          <SubmitButton isLoading={isSubmitting}>{isEditing ? 'Save Changes' : 'Create Category'}</SubmitButton>
        </div>
      </form>
    </RightDrawer>
  );
}
