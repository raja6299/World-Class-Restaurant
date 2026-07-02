'use client';

import React, { useEffect, useMemo } from 'react';
import { RightDrawer } from '@/components/shared/RightDrawer';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PurchaseOrderSchema, PurchaseOrderFormData } from '@/src/modules/inventory/validation';
import { Input, Select, SubmitButton } from '@/components/shared/form/FormFields';
import { createPurchaseOrderAction } from '@/src/modules/inventory/actions';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { SupplierDto, IngredientDto } from '@/src/modules/inventory/dto';

interface PurchaseOrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: SupplierDto[];
  ingredients: IngredientDto[];
  branchId: string;
}

export default function PurchaseOrderDrawer({ isOpen, onClose, suppliers, ingredients, branchId }: PurchaseOrderDrawerProps) {
  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(PurchaseOrderSchema) as unknown as import('react-hook-form').Resolver<PurchaseOrderFormData>,
    defaultValues: {
      supplierId: '',
      status: 'SENT',
      expectedOn: '',
      items: [{ ingredientId: '', orderedQuantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = useWatch({ control, name: 'items' });

  useEffect(() => {
    if (isOpen) {
      reset({
        supplierId: suppliers.length > 0 ? suppliers[0].id : '',
        status: 'SENT',
        expectedOn: format(new Date(Date.now() + 86400000 * 2), 'yyyy-MM-dd'),
        items: [{ ingredientId: ingredients.length > 0 ? ingredients[0].id : '', orderedQuantity: 1, unitPrice: 0 }],
      });
    }
  }, [isOpen, reset, suppliers, ingredients]);

  const onSubmit = async (data: PurchaseOrderFormData) => {
    const result = await createPurchaseOrderAction(branchId, data);
    if (result.error) alert(result.error);
    else onClose();
  };

  const supplierOptions = suppliers.map(s => ({ label: s.name, value: s.id }));
  const ingredientOptions = ingredients.map(i => ({ label: `${i.name} (${i.unit})`, value: i.id }));

  const grandTotal = useMemo(() => {
    return watchItems?.reduce((sum: number, item: { orderedQuantity: number, unitPrice: number }) => sum + (Number(item.orderedQuantity || 0) * Number(item.unitPrice || 0)), 0) || 0;
  }, [watchItems]);

  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title="Create Purchase Order" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pr-2 space-y-8">
          
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Order Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Select label="Supplier" options={supplierOptions} error={errors.supplierId?.message as string} {...register('supplierId')} required />
              <Input label="Expected Date" type="date" error={errors.expectedOn?.message as string} {...register('expectedOn')} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-aurum-gold-primary/20">
              <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Order Items</h3>
              <button 
                type="button" 
                onClick={() => append({ ingredientId: ingredients[0]?.id || '', orderedQuantity: 1, unitPrice: 0 })}
                className="text-xs font-medium text-aurum-gold-primary hover:text-aurum-gold-secondary transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            {(errors as unknown as { items?: { message?: string } }).items?.message && <p className="text-red-500 text-xs">{(errors as unknown as { items: { message: string } }).items.message}</p>}

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-start bg-aurum-cream-secondary p-4 rounded-lg border border-aurum-gold-primary/10">
                  <div className="flex-1 grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <Select label="Ingredient" options={ingredientOptions} {...register(`items.${index}.ingredientId`)} error={(errors as unknown as { items?: Array<{ ingredientId?: { message?: string } }> }).items?.[index]?.ingredientId?.message} required />
                    </div>
                    <div className="col-span-3">
                      <Input label="Quantity" type="number" step="0.01" {...register(`items.${index}.orderedQuantity`)} error={(errors as unknown as { items?: Array<{ orderedQuantity?: { message?: string } }> }).items?.[index]?.orderedQuantity?.message} required />
                    </div>
                    <div className="col-span-3">
                      <Input label="Unit Price (₹)" type="number" step="0.01" {...register(`items.${index}.unitPrice`)} error={(errors as unknown as { items?: Array<{ unitPrice?: { message?: string } }> }).items?.[index]?.unitPrice?.message} required />
                    </div>
                  </div>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(index)} className="mt-8 p-1.5 text-aurum-text-body/40 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <div className="text-right">
                <p className="text-sm text-aurum-text-body/60">Grand Total</p>
                <p className="text-2xl font-semibold text-aurum-text-heading">₹{grandTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-aurum-gold-primary/10 flex items-center justify-end gap-3 mt-auto bg-aurum-cream-primary">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-medium text-aurum-text-body border border-aurum-gold-primary/20 hover:bg-aurum-gold-primary/5 transition-colors">Cancel</button>
          <SubmitButton isLoading={isSubmitting}>Create PO</SubmitButton>
        </div>
      </form>
    </RightDrawer>
  );
}
