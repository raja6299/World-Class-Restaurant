'use client';

import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BranchSettingsSchema, BranchSettingsData, RestaurantSettingsSchema, RestaurantSettingsData } from '@/src/modules/settings/validation';
import { BranchSettingsDto, BrandingDto, FeatureFlagsDto } from '@/src/modules/settings/dto';
import { Input, SubmitButton } from '@/components/shared/form/FormFields';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { updateRestaurantSettingsAction, updateBranchSettingsAction } from '@/src/modules/settings/actions';

interface SettingsClientProps {
  branchId: string;
  restaurantId: string;
  branchSettings: BranchSettingsDto | null;
  branding: BrandingDto | null;
  features: FeatureFlagsDto | null;
  restaurantName: string;
}

export default function SettingsClient({ branchId, restaurantId, branchSettings, branding, restaurantName }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<'financial' | 'branding'>('financial');

  // Form for Financial Settings
  const {
    register: registerFin,
    handleSubmit: handleFinSubmit,
    formState: { errors: finErrors, isSubmitting: isFinSubmitting },
  } = useForm<BranchSettingsData>({
    resolver: zodResolver(BranchSettingsSchema) as unknown as import('react-hook-form').Resolver<BranchSettingsData>,
    defaultValues: {
      currency: branchSettings?.currency || 'INR',
      timezone: branchSettings?.timezone || 'Asia/Kolkata',
      gst: branchSettings?.gst || 5,
      serviceCharge: branchSettings?.serviceCharge || 0,
      upiVpa: branchSettings?.upiVpa || '',
      businessHours: branchSettings?.businessHours ? JSON.stringify(branchSettings.businessHours, null, 2) : '',
    },
  });

  const onFinSubmit = async (data: BranchSettingsData) => {
    const result = await updateBranchSettingsAction(branchId, data);
    if (result.error) alert(result.error);
    else alert('Financial settings updated successfully');
  };

  // Form for Branding Settings
  const {
    register: registerBrand,
    handleSubmit: handleBrandSubmit,
    setValue: setBrandValue,
    control: controlBrand,
    formState: { errors: brandErrors, isSubmitting: isBrandSubmitting },
  } = useForm<RestaurantSettingsData>({
    resolver: zodResolver(RestaurantSettingsSchema) as unknown as import('react-hook-form').Resolver<RestaurantSettingsData>,
    defaultValues: {
      name: restaurantName || '',
      logoUrl: branding?.logoUrl || '',
      primaryColor: branding?.primaryColor || '#D4AF37',
      secondaryColor: branding?.secondaryColor || '#1A1A1A',
      typography: (branding as { fontFamily?: string })?.fontFamily || 'Playfair Display',
    },
  });

  const logoUrl = useWatch({ control: controlBrand, name: 'logoUrl' });

  const onBrandSubmit = async (data: RestaurantSettingsData) => {
    const result = await updateRestaurantSettingsAction(restaurantId, data);
    if (result.error) alert(result.error);
    else alert('Branding settings updated successfully');
  };

  return (
    <div className="bg-aurum-cream-primary rounded-xl border border-aurum-gold-primary/20 shadow-aurum-sm overflow-hidden">
      
      {/* Tabs */}
      <div className="flex border-b border-aurum-gold-primary/10 bg-aurum-cream-secondary px-6">
        <button
          onClick={() => setActiveTab('financial')}
          className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'financial' 
              ? 'border-aurum-gold-primary text-aurum-gold-primary' 
              : 'border-transparent text-aurum-text-body/60 hover:text-aurum-text-heading'
          }`}
        >
          Financial & Operations
        </button>
        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'branding' 
              ? 'border-aurum-gold-primary text-aurum-gold-primary' 
              : 'border-transparent text-aurum-text-body/60 hover:text-aurum-text-heading'
          }`}
        >
          White Label Branding
        </button>
      </div>

      <div className="p-6 md:p-8">
        {activeTab === 'financial' && (
          <form onSubmit={handleFinSubmit(onFinSubmit)} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Currency"
                {...registerFin('currency')}
                error={finErrors.currency?.message as string}
                maxLength={3}
              />
              <Input
                label="Timezone"
                {...registerFin('timezone')}
                error={finErrors.timezone?.message as string}
              />
              <Input
                label="GST (%)"
                type="number"
                step="0.1"
                {...registerFin('gst')}
                error={finErrors.gst?.message as string}
              />
              <Input
                label="Service Charge (%)"
                type="number"
                step="0.1"
                {...registerFin('serviceCharge')}
                error={finErrors.serviceCharge?.message as string}
              />
              <Input
                label="UPI VPA (Virtual Payment Address)"
                className="md:col-span-2"
                {...registerFin('upiVpa')}
                error={finErrors.upiVpa?.message as string}
                placeholder="merchant@upi"
              />
            </div>
            <div className="pt-4 border-t border-aurum-gold-primary/10">
              <SubmitButton isLoading={isFinSubmitting}>
                Save Financial Settings
              </SubmitButton>
            </div>
          </form>
        )}

        {activeTab === 'branding' && (
          <form onSubmit={handleBrandSubmit(onBrandSubmit)} className="space-y-8 max-w-2xl">
            
            <div>
              <label className="block text-sm font-medium text-aurum-text-heading mb-3">
                Restaurant Logo
              </label>
              <ImageUpload
                folder="restaurant-logos"
                value={logoUrl}
                onChange={(url) => setBrandValue('logoUrl', url, { shouldDirty: true })}
                className="max-w-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Restaurant Name"
                {...registerBrand('name')}
                error={brandErrors.name?.message as string}
              />
              <Input
                label="Typography Family"
                {...registerBrand('typography')}
                error={brandErrors.typography?.message as string}
              />
              <Input
                label="Primary Color (Hex)"
                {...registerBrand('primaryColor')}
                error={brandErrors.primaryColor?.message as string}
                placeholder="#D4AF37"
              />
              <Input
                label="Secondary Color (Hex)"
                {...registerBrand('secondaryColor')}
                error={brandErrors.secondaryColor?.message as string}
                placeholder="#1A1A1A"
              />
            </div>
            <div className="pt-4 border-t border-aurum-gold-primary/10">
              <SubmitButton isLoading={isBrandSubmitting}>
                Save Branding Settings
              </SubmitButton>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
