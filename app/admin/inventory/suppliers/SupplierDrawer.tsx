'use client';

import React, { useEffect } from 'react';
import { RightDrawer } from '@/components/shared/RightDrawer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SupplierSchema, SupplierFormData } from '@/src/modules/inventory/validation';
import { Input, Toggle, SubmitButton } from '@/components/shared/form/FormFields';
import { createSupplierAction, updateSupplierAction } from '@/src/modules/inventory/actions';

import { SupplierDto } from '@/src/modules/inventory/dto';

interface SupplierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: SupplierDto | null;
  branchId: string;
}

export default function SupplierDrawer({ isOpen, onClose, supplier, branchId }: SupplierDrawerProps) {
  const isEditing = !!supplier;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(SupplierSchema),
    defaultValues: {
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      gstin: '',
      pan: '',
      fssaiLicense: '',
      address: '',
      paymentTerms: '',
      isPreferred: false,
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (supplier) {
        reset({
          name: supplier.name,
          contactPerson: supplier.contactPerson || '',
          phone: supplier.phone || '',
          email: supplier.email || '',
          gstin: supplier.gstin || '',
          pan: supplier.pan || '',
          fssaiLicense: supplier.fssaiLicense || '',
          address: supplier.address || '',
          paymentTerms: supplier.paymentTerms || '',
          isPreferred: supplier.isPreferred,
          isActive: supplier.isActive,
        });
      } else {
        reset({
          name: '',
          contactPerson: '',
          phone: '',
          email: '',
          gstin: '',
          pan: '',
          fssaiLicense: '',
          address: '',
          paymentTerms: '',
          isPreferred: false,
          isActive: true,
        });
      }
    }
  }, [isOpen, supplier, reset]);

  const onSubmit = async (data: SupplierFormData) => {
    let result;
    if (isEditing) {
      result = await updateSupplierAction(supplier.id, data);
    } else {
      result = await createSupplierAction(branchId, data);
    }
    if (result.error) alert(result.error);
    else onClose();
  };

  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Supplier' : 'Add Supplier'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pr-2 space-y-8">
          
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Compunknown Details</h3>
            <Input label="Supplier Name" placeholder="e.g. Fresh Produce Co." error={errors.name?.message as string} {...register('name')} required />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="GSTIN" placeholder="29XXXXX..." error={errors.gstin?.message as string} {...register('gstin')} />
              <Input label="FSSAI License" error={errors.fssaiLicense?.message as string} {...register('fssaiLicense')} />
            </div>
            
            <Input label="PAN" error={errors.pan?.message as string} {...register('pan')} />
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Contact Details</h3>
            <Input label="Contact Person" placeholder="e.g. Rajesh Kumar" error={errors.contactPerson?.message as string} {...register('contactPerson')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone Number" placeholder="+91..." error={errors.phone?.message as string} {...register('phone')} />
              <Input label="Email" type="email" error={errors.email?.message as string} {...register('email')} />
            </div>
            <Input label="Address" error={errors.address?.message as string} {...register('address')} />
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Settings</h3>
            <Input label="Payment Terms" placeholder="e.g. Net 30, Cash on Delivery" error={errors.paymentTerms?.message as string} {...register('paymentTerms')} />
            <div className="bg-aurum-cream-secondary p-4 rounded-lg border border-aurum-gold-primary/10 grid grid-cols-2 gap-4">
              <Toggle label="Preferred Supplier" description="Prioritize for auto-PO" {...register('isPreferred')} />
              <Toggle label="Active Status" description="Toggle off to disable" {...register('isActive')} />
            </div>
          </div>
          
        </div>

        <div className="pt-6 border-t border-aurum-gold-primary/10 flex items-center justify-end gap-3 mt-auto bg-aurum-cream-primary">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-medium text-aurum-text-body border border-aurum-gold-primary/20 hover:bg-aurum-gold-primary/5 transition-colors">Cancel</button>
          <SubmitButton isLoading={isSubmitting}>{isEditing ? 'Save Changes' : 'Create Supplier'}</SubmitButton>
        </div>
      </form>
    </RightDrawer>
  );
}
