'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save } from 'lucide-react';
import { Input, Toggle, Select } from '@/components/shared/form/FormFields';
import { createBranchAction, updateBranchAction } from '@/src/modules/branches/actions';
import { BranchFormData, BranchSchema } from '@/src/modules/branches/validation';
import { BranchDto } from '@/src/modules/branches/dto';
import { toast } from 'react-hot-toast';

interface BranchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  branch: BranchDto | null;
  restaurantId: string;
}

export default function BranchDrawer({ isOpen, onClose, branch, restaurantId }: BranchDrawerProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormData>({
    resolver: zodResolver(BranchSchema) as unknown as import('react-hook-form').Resolver<BranchFormData>,
    defaultValues: {
      name: '',
      location: '',
      phone: '',
      status: 'ACTIVE',
      isDefault: false,
    },
  });

  useEffect(() => {
    if (branch) {
      reset({
        name: branch.name,
        location: branch.location || '',
        phone: branch.phone || '',
        status: branch.status as 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE',
        isDefault: branch.isDefault,
      });
    } else {
      reset({
        name: '',
        location: '',
        phone: '',
        status: 'ACTIVE',
        isDefault: false,
      });
    }
  }, [branch, reset]);

  const onSubmit = async (data: BranchFormData) => {
    const res = branch 
      ? await updateBranchAction(branch.id, data)
      : await createBranchAction(restaurantId, data);
      
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(branch ? 'Branch updated' : 'Branch created');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl z-50 flex flex-col border-l border-aurum-gold-primary/20 animate-in slide-in-from-right">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-aurum-text-heading">{branch ? 'Edit Branch' : 'New Branch'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="branch-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input label="Branch Name" {...register('name')} error={errors.name?.message} required />
            <Input label="Location (Optional)" {...register('location')} error={errors.location?.message} />
            <Input label="Phone (Optional)" {...register('phone')} error={errors.phone?.message} />
            
            <Select 
              label="Status" 
              {...register('status')} 
              error={errors.status?.message}
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Maintenance', value: 'MAINTENANCE' },
                { label: 'Inactive', value: 'INACTIVE' }
              ]}
            />

            <div className="pt-2">
              <Toggle label="Set as Default Branch" description="Make this the primary branch for the restaurant" {...register('isDefault')} />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" form="branch-form" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-aurum-gold-primary rounded-lg hover:bg-aurum-gold-primary/90 transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Branch'}
          </button>
        </div>
      </div>
    </>
  );
}
