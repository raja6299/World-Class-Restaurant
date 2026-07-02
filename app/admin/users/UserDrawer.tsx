'use client';

import React, { useEffect } from 'react';
import { RightDrawer } from '@/components/shared/RightDrawer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema, UserFormData } from '@/src/modules/users/validation';
import { Input, Select, SubmitButton } from '@/components/shared/form/FormFields';
import { UserDto } from '@/src/modules/users/dto';
import { createUserAction, updateUserAction } from '@/src/modules/users/actions';
import { Role } from '@prisma/client';

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDto | null;
}

export default function UserDrawer({ isOpen, onClose, user }: UserDrawerProps) {
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: Role.WAITER,
      password: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (user) {
        reset({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          role: (user.role as import('@prisma/client').Role) || 'WAITER',
          password: '', // Empty unless they want to change it
        });
      } else {
        reset({
          name: '',
          email: '',
          phone: '',
          role: Role.WAITER,
          password: '',
        });
      }
    }
  }, [isOpen, user, reset]);

  const onSubmit = async (data: UserFormData) => {
    let result;
    if (isEditing) {
      result = await updateUserAction(user.id, data);
    } else {
      if (!data.password) {
        alert('Password is required for new users');
        return;
      }
      result = await createUserAction(data);
    }

    if (result.error) {
      alert(result.error);
    } else {
      onClose();
    }
  };

  const roleOptions = Object.values(Role).map(role => ({
    label: role.charAt(0) + role.slice(1).toLowerCase(),
    value: role
  }));

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={() => {
        if (isDirty) {
          if (confirm('You have unsaved changes. Are you sure you want to close?')) {
            onClose();
          }
        } else {
          onClose();
        }
      }}
      title={isEditing ? 'Edit Staff Member' : 'Add Staff Member'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex flex-col h-full">
        <div className="flex-1 space-y-5">
          <Input
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message as string}
            {...register('name')}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@restaurant.com"
            error={errors.email?.message as string}
            {...register('email')}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 9876543210"
            error={errors.phone?.message as string}
            {...register('phone')}
          />

          <Select
            label="Role"
            options={roleOptions}
            error={errors.role?.message as string}
            {...register('role')}
            required
          />

          <Input
            label={isEditing ? "New Password (Optional)" : "Password"}
            type="password"
            placeholder="••••••••"
            error={errors.password?.message as string}
            {...register('password')}
            required={!isEditing}
            helperText={isEditing ? "Leave blank to keep the current password" : "At least 6 characters"}
          />
        </div>

        <div className="pt-6 border-t border-aurum-gold-primary/10 flex items-center justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-aurum-text-body border border-aurum-gold-primary/20 hover:bg-aurum-gold-primary/5 transition-colors"
          >
            Cancel
          </button>
          <SubmitButton isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Staff'}
          </SubmitButton>
        </div>
      </form>
    </RightDrawer>
  );
}
