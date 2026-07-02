'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, History, Phone, Mail } from 'lucide-react';
import { Input, Toggle, Select } from '@/components/shared/form/FormFields';
import { updateCustomerProfileAction } from '@/src/modules/crm/actions';
import { CustomerProfileFormData, CustomerProfileSchema } from '@/src/modules/crm/validation';
import { CustomerProfileDto } from '@/src/modules/crm/dto';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface CustomerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerProfileDto | null;
}

export default function CustomerDrawer({ isOpen, onClose, customer }: CustomerDrawerProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'notes'>('profile');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CustomerProfileFormData>({
    resolver: zodResolver(CustomerProfileSchema) as unknown as import('react-hook-form').Resolver<CustomerProfileFormData>,
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      preferredLanguage: 'en',
      marketingConsent: true,
      birthday: '',
      anniversary: '',
      tags: [],
      internalNotes: '',
      manualSegment: '',
    },
  });


  useEffect(() => {
    if (isOpen && customer) {
      reset({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        preferredLanguage: customer.profile?.preferredLanguage || 'en',
        marketingConsent: customer.profile?.marketingConsent ?? true,
        birthday: customer.profile?.birthday ? format(new Date(customer.profile.birthday), 'yyyy-MM-dd') : '',
        anniversary: customer.profile?.anniversary ? format(new Date(customer.profile.anniversary), 'yyyy-MM-dd') : '',
        tags: customer.profile?.tags || [],
        internalNotes: customer.profile?.internalNotes || '',
        manualSegment: customer.profile?.manualSegment || '',
      });
      // Removing setActiveTab to avoid state update in effect.
      // Can be set on open button click if needed, or default it to profile.
    }
  }, [isOpen, customer, reset]);

  const onSubmit = async (data: CustomerProfileFormData) => {
    if (!customer) return;
    const res = await updateCustomerProfileAction(customer.id, data);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success('Profile updated successfully');
    }
  };

  if (!isOpen || !customer) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[500px] bg-white shadow-2xl z-50 flex flex-col border-l border-aurum-gold-primary/20 animate-in slide-in-from-right">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-aurum-charcoal-primary text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair font-semibold">{customer.name || 'Anonymous'}</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-4 mt-3 text-sm text-aurum-cream-secondary/80">
            {customer.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5"/> {customer.phone}</span>}
            {customer.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5"/> {customer.email}</span>}
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className="px-2 py-0.5 bg-aurum-gold-primary text-aurum-charcoal-primary text-xs font-bold uppercase tracking-wider rounded">
              {customer.segment}
            </span>
            <span className="text-sm font-medium">LTV: ₹{(customer.profile?.lifetimeValue || 0).toFixed(2)}</span>
            <span className="text-sm font-medium">Visits: {customer.profile?.totalVisits || 0}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-gray-100 bg-gray-50/50 px-6">
          <button onClick={() => setActiveTab('profile')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile' ? 'border-aurum-gold-primary text-aurum-gold-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Profile & Settings</button>
          <button onClick={() => setActiveTab('history')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-aurum-gold-primary text-aurum-gold-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Order History</button>
          <button onClick={() => setActiveTab('notes')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'notes' ? 'border-aurum-gold-primary text-aurum-gold-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Internal Notes</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'profile' && (
            <form id="crm-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Contact Info</h3>
                <Input label="Name" {...register('name')} error={errors.name?.message} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Phone" {...register('phone')} error={errors.phone?.message} required />
                  <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Special Dates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Birthday" type="date" {...register('birthday')} error={errors.birthday?.message} />
                  <Input label="Anniversary" type="date" {...register('anniversary')} error={errors.anniversary?.message} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Select 
                    label="Preferred Language" 
                    {...register('preferredLanguage')} 
                    error={errors.preferredLanguage?.message}
                    options={[
                      { label: 'English', value: 'en' },
                      { label: 'Hindi', value: 'hi' },
                      { label: 'Spanish', value: 'es' },
                      { label: 'Arabic', value: 'ar' }
                    ]}
                  />
                  
                  <Select 
                    label="Manual Segment" 
                    {...register('manualSegment')}
                    options={[
                      { label: 'Auto (Calculated)', value: '' },
                      { label: 'VIP', value: 'VIP' },
                      { label: 'Blacklisted', value: 'BLACKLISTED' },
                      { label: 'Corporate', value: 'CORPORATE' },
                      { label: 'Family', value: 'FAMILY' }
                    ]}
                  />
                </div>
                <div className="pt-2">
                  <Toggle label="Marketing Consent" description="Allow SMS and Email promotional messages" {...register('marketingConsent')} />
                </div>
              </div>

            </form>
          )}

          {activeTab === 'history' && (
            <div className="p-6">
              {customer.orders && customer.orders.length > 0 ? (
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                  {customer.orders.map((order) => (
                    <div key={order.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-aurum-gold-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <History className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <time className="text-xs font-medium text-aurum-gold-primary">{format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}</time>
                          <span className="text-[10px] uppercase font-bold text-gray-500">{order.status}</span>
                        </div>
                        <div className="text-sm font-semibold text-aurum-text-heading mt-2">
                          Order Total: ₹{order.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-aurum-text-body/60 mt-1">ID: {order.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">No order history available</div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <form id="crm-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-aurum-text-heading mb-1.5">Internal Notes (Staff Only)</label>
                <textarea 
                  {...register('internalNotes')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-aurum-gold-primary/20 focus:border-aurum-gold-primary transition-all h-48 resize-none"
                  placeholder="Record dietary restrictions, favorite drinks, complaints, or general observations..."
                />
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        {(activeTab === 'profile' || activeTab === 'notes') && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Close
            </button>
            <button type="submit" form="crm-form" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-aurum-gold-primary rounded-lg hover:bg-aurum-gold-primary/90 transition-colors disabled:opacity-50">
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
