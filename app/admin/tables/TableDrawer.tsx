'use client';

import React, { useEffect } from 'react';
import { RightDrawer } from '@/components/shared/RightDrawer';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TableSchema, TableFormData } from '@/src/modules/tables/validation';
import { Input, Toggle, SubmitButton } from '@/components/shared/form/FormFields';
import { createTableAction, updateTableAction } from '@/src/modules/tables/actions';
import { TableDto } from '@/src/modules/tables/dto';

interface TableDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  table: TableDto | null;
  branchId: string;
}

export default function TableDrawer({ isOpen, onClose, table, branchId }: TableDrawerProps) {
  const isEditing = !!table;

  const { register, handleSubmit, reset, control, setValue, formState: { errors, isSubmitting } } = useForm<TableFormData>({
    resolver: zodResolver(TableSchema) as unknown as import('react-hook-form').Resolver<TableFormData>,
    defaultValues: {
      tableNumber: '',
      capacity: 4,
      floor: '',
      zone: '',
      isIndoor: true,
      isVip: false,
    },
  });

  const isIndoor = useWatch({ control, name: 'isIndoor' });
  const isVip = useWatch({ control, name: 'isVip' });

  useEffect(() => {
    if (isOpen) {
      if (table) {
        reset({
          tableNumber: table.tableNumber,
          capacity: table.capacity,
          floor: table.floor || '',
          zone: table.zone || '',
          isIndoor: table.isIndoor,
          isVip: table.isVip,
        });
      } else {
        reset({
          tableNumber: '',
          capacity: 4,
          floor: '',
          zone: '',
          isIndoor: true,
          isVip: false,
        });
      }
    }
  }, [isOpen, table, reset]);

  const onSubmit = async (data: TableFormData) => {
    let result;
    if (isEditing) {
      result = await updateTableAction(table.id, data);
    } else {
      result = await createTableAction(branchId, data);
    }
    if (result.error) alert(result.error);
    else onClose();
  };

  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Table' : 'Add Table'} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Table Number" placeholder="e.g. T1" error={errors.tableNumber?.message as string} {...register('tableNumber')} required />
              <Input label="Capacity" type="number" min="1" error={errors.capacity?.message as string} {...register('capacity')} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Floor" placeholder="e.g. Ground" error={errors.floor?.message as string} {...register('floor')} />
              <Input label="Zone" placeholder="e.g. Patio" error={errors.zone?.message as string} {...register('zone')} />
            </div>

            <div className="bg-aurum-cream-secondary p-4 rounded-lg border border-aurum-gold-primary/10 space-y-4">
              <Toggle label="Indoor Seating" description="Table is located inside" checked={isIndoor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('isIndoor', e.target.checked)} />
              <Toggle label="VIP Table" description="Mark as premium seating" checked={isVip} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('isVip', e.target.checked)} />
            </div>
          </div>
          
        </div>

        <div className="pt-6 border-t border-aurum-gold-primary/10 flex items-center justify-end gap-3 mt-auto bg-aurum-cream-primary">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-medium text-aurum-text-body border border-aurum-gold-primary/20 hover:bg-aurum-gold-primary/5 transition-colors">Cancel</button>
          <SubmitButton isLoading={isSubmitting}>{isEditing ? 'Save Changes' : 'Create Table'}</SubmitButton>
        </div>
      </form>
    </RightDrawer>
  );
}
