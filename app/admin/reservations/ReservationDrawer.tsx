'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save } from 'lucide-react';
import { Input, Select } from '@/components/shared/form/FormFields';
import { createReservationAction, updateReservationAction } from '@/src/modules/reservations/actions';
import { ReservationFormData, ReservationSchema } from '@/src/modules/reservations/validation';
import { ReservationDto } from '@/src/modules/reservations/dto';
import { TableDto } from '@/src/modules/tables/dto';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface StaffMember {
  id: string;
  name: string | null;
  role: string;
}

interface ReservationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationDto | null;
  tables: TableDto[];
  staff: StaffMember[];
  branchId: string;
}

export default function ReservationDrawer({ isOpen, onClose, reservation, tables, staff, branchId }: ReservationDrawerProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(ReservationSchema) as unknown as import('react-hook-form').Resolver<ReservationFormData>,
    defaultValues: {
      guestName: '',
      guestPhone: '',
      guestEmail: '',
      guestCount: 2,
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '19:00',
      status: 'PENDING',
      source: 'PHONE',
      expectedDuration: 90,
      deposit: 0,
    },
  });

  useEffect(() => {
    if (reservation) {
      reset({
        guestName: reservation.guestName,
        guestPhone: reservation.guestPhone,
        guestEmail: reservation.guestEmail || '',
        guestCount: reservation.guestCount,
        date: format(new Date(reservation.date), 'yyyy-MM-dd'),
        time: reservation.time,
        status: reservation.status as "PENDING" | "CONFIRMED" | "CANCELLED" | "NO_SHOW" | "COMPLETED",
        source: reservation.source as "ONLINE" | "PHONE" | "WALK_IN",
        tableId: reservation.tableId,
        assignedWaiterId: reservation.assignedWaiterId,
        expectedDuration: reservation.expectedDuration,
        deposit: reservation.deposit,
        arrivalStatus: reservation.arrivalStatus,
        reminderStatus: reservation.reminderStatus,
        specialRequests: reservation.specialRequests,
        occasion: reservation.occasion,
      });
    } else {
      reset({
        guestName: '',
        guestPhone: '',
        guestEmail: '',
        guestCount: 2,
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '19:00',
        status: 'PENDING',
        source: 'PHONE',
        expectedDuration: 90,
        deposit: 0,
      });
    }
  }, [reservation, reset]);

  const onSubmit = async (data: ReservationFormData) => {
    const res = reservation 
      ? await updateReservationAction(reservation.id, data)
      : await createReservationAction(branchId, data);
      
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(reservation ? 'Reservation updated' : 'Reservation created');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[450px] bg-white shadow-2xl z-50 flex flex-col border-l border-aurum-gold-primary/20 animate-in slide-in-from-right">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-aurum-text-heading">{reservation ? 'Edit Reservation' : 'New Reservation'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="res-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Guest Info</h3>
              <Input label="Guest Name" {...register('guestName')} error={errors.guestName?.message} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Phone" {...register('guestPhone')} error={errors.guestPhone?.message} required />
                <Input label="Email" type="email" {...register('guestEmail')} error={errors.guestEmail?.message} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Booking Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Date" type="date" {...register('date')} error={errors.date?.message} required />
                <Input label="Time" type="time" {...register('time')} error={errors.time?.message} required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Guest Count" type="number" min={1} {...register('guestCount')} error={errors.guestCount?.message} required />
                <Input label="Duration (mins)" type="number" step={15} min={15} {...register('expectedDuration')} error={errors.expectedDuration?.message} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select 
                  label="Status" 
                  {...register('status')} 
                  error={errors.status?.message}
                  options={[
                    { label: 'Pending', value: 'PENDING' },
                    { label: 'Confirmed', value: 'CONFIRMED' },
                    { label: 'Waitlist', value: 'WAIT_LIST' },
                    { label: 'Seated', value: 'CHECKED_IN' },
                    { label: 'Completed', value: 'COMPLETED' },
                    { label: 'Walk In', value: 'WALK_IN' },
                    { label: 'Cancelled', value: 'CANCELLED' },
                    { label: 'No Show', value: 'NO_SHOW' }
                  ]}
                />
                <Select 
                  label="Source" 
                  {...register('source')} 
                  error={errors.source?.message}
                  options={[
                    { label: 'Phone', value: 'PHONE' },
                    { label: 'Online', value: 'ONLINE' },
                    { label: 'Walk In', value: 'WALK_IN' }
                  ]}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Assignments & Ops</h3>
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  label="Assign Table" 
                  {...register('tableId')} 
                  error={errors.tableId?.message}
                  options={[
                    { label: 'Unassigned', value: '' },
                    ...tables.map(t => ({ label: `Table ${t.tableNumber} (Cap: ${t.capacity})`, value: t.id }))
                  ]}
                />
                <Select 
                  label="Assign Waiter" 
                  {...register('assignedWaiterId')} 
                  error={errors.assignedWaiterId?.message}
                  options={[
                    { label: 'Unassigned', value: '' },
                    ...staff.map(s => ({ label: `${s.name} (${s.role})`, value: s.id }))
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  label="Arrival" 
                  {...register('arrivalStatus')}
                  options={[
                    { label: 'N/A', value: '' },
                    { label: 'On Time', value: 'ON_TIME' },
                    { label: 'Early', value: 'EARLY' },
                    { label: 'Late', value: 'LATE' }
                  ]}
                />
                <Input label="Deposit Amount" type="number" step={0.01} min={0} {...register('deposit')} error={errors.deposit?.message} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-aurum-gold-primary uppercase tracking-wider">Preferences</h3>
              <Input label="Occasion" {...register('occasion')} placeholder="e.g. Birthday, Anniversary" />
              <div>
                <label className="block text-sm font-medium text-aurum-text-heading mb-1.5">Special Requests / Notes</label>
                <textarea 
                  {...register('specialRequests')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-aurum-gold-primary/20 focus:border-aurum-gold-primary transition-all resize-none h-24"
                  placeholder="Allergies, high chair needed, etc."
                />
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" form="res-form" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-aurum-gold-primary rounded-lg hover:bg-aurum-gold-primary/90 transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Reservation'}
          </button>
        </div>
      </div>
    </>
  );
}
