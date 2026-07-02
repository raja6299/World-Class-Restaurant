'use client';

import React, { useEffect } from 'react';
import { RightDrawer } from '@/components/shared/RightDrawer';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ModifierGroupSchema, ModifierGroupFormData } from '@/src/modules/menu/validation';
import { Input, Toggle, SubmitButton } from '@/components/shared/form/FormFields';
import { createModifierGroupAction, updateModifierGroupAction } from '@/src/modules/menu/actions';
import { Plus, Trash2 } from 'lucide-react';
import { ModifierGroupDto } from '@/src/modules/menu/dto';

interface ModifierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  group: ModifierGroupDto | null;
  menuItemId: string;
}

export default function ModifierDrawer({ isOpen, onClose, group, menuItemId }: ModifierDrawerProps) {
  const isEditing = !!group;

  const { register, control, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ModifierGroupFormData>({
    resolver: zodResolver(ModifierGroupSchema) as unknown as import('react-hook-form').Resolver<import('../../../../src/modules/menu/validation').ModifierGroupFormData>,
    defaultValues: {
      name: '',
      isRequired: false,
      minSelect: 0,
      maxSelect: 1,
      modifiers: [{ name: '', extraPrice: 0, isAvailable: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "modifiers",
  });

  const isRequired = useWatch({ control, name: 'isRequired' });

  useEffect(() => {
    if (isOpen) {
      if (group) {
        reset({
          name: group.name,
          isRequired: group.isRequired,
          minSelect: group.minSelect,
          maxSelect: group.maxSelect,
          modifiers: group.modifiers.map((m) => ({
            name: m.name,
            extraPrice: m.extraPrice,
            isAvailable: true
          }))
        });
      } else {
        reset({
          name: '',
          isRequired: false,
          minSelect: 0,
          maxSelect: 1,
          modifiers: [{ name: '', extraPrice: 0, isAvailable: true }],
        });
      }
    }
  }, [isOpen, group, reset]);

  const onSubmit = async (data: ModifierGroupFormData) => {
    let result;
    if (isEditing) {
      result = await updateModifierGroupAction(group.id, data);
    } else {
      result = await createModifierGroupAction(menuItemId, data);
    }
    if (result.error) alert(result.error);
    else onClose();
  };

  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Modifier Group' : 'Add Modifier Group'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          
          <div className="space-y-5">
            <Input label="Group Name" placeholder="e.g. Choice of Base" error={errors.name?.message as string} {...register('name')} required />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Min Selections" type="number" min="0" error={errors.minSelect?.message as string} {...register('minSelect')} required />
              <Input label="Max Selections" type="number" min="1" error={errors.maxSelect?.message as string} {...register('maxSelect')} required />
            </div>

            <Toggle label="Is Required?" description="Customer must make a selection" checked={isRequired} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('isRequired', e.target.checked)} />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-aurum-gold-primary/20">
              <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Options</h3>
              <button 
                type="button" 
                onClick={() => append({ name: '', extraPrice: 0, isAvailable: true })}
                className="text-xs font-medium text-aurum-gold-primary hover:text-aurum-gold-secondary transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Option
              </button>
            </div>

            {errors.modifiers?.message && <p className="text-red-500 text-xs">{errors.modifiers.message as string}</p>}

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-start bg-aurum-cream-secondary p-3 rounded-lg border border-aurum-gold-primary/10">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                         <Input placeholder="Option Name (e.g. Large)" {...register(`modifiers.${index}.name` as const)} error={errors.modifiers?.[index]?.name?.message as string} />
                      </div>
                      <div className="col-span-1">
                         <Input type="number" step="0.01" placeholder="+₹0.00" {...register(`modifiers.${index}.extraPrice` as const)} error={errors.modifiers?.[index]?.extraPrice?.message as string} />
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={() => remove(index)} className="mt-2 p-1.5 text-aurum-text-body/40 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-aurum-gold-primary/10 flex items-center justify-end gap-3 mt-auto bg-aurum-cream-primary">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-medium text-aurum-text-body border border-aurum-gold-primary/20 hover:bg-aurum-gold-primary/5 transition-colors">Cancel</button>
          <SubmitButton isLoading={isSubmitting}>{isEditing ? 'Save Changes' : 'Create Group'}</SubmitButton>
        </div>
      </form>
    </RightDrawer>
  );
}
