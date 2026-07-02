'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, SubmitButton } from '@/components/shared/form/FormFields';
import { loginAction } from '@/src/modules/auth/actions';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema) as unknown as import('react-hook-form').Resolver<z.infer<typeof loginSchema>>,
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    if (data.remember) formData.append('remember', 'on');

    const result = await loginAction(formData);
    
    if (result?.error) {
      setServerError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      {serverError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
          {serverError}
        </div>
      )}

      <Input
        label="Email Address"
        type="email"
        placeholder="admin@restaurant.com"
        error={errors.email?.message as string}
        {...register('email')}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.password?.message as string}
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-aurum-text-body/40 hover:text-aurum-gold-primary transition-colors focus:outline-none"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-aurum-gold-primary/30 text-aurum-gold-primary focus:ring-aurum-gold-primary accent-aurum-gold-primary"
            {...register('remember')}
          />
          <span className="text-sm font-medium text-aurum-text-body/70 group-hover:text-aurum-gold-primary transition-colors">
            Remember me
          </span>
        </label>
        
        <Link href="/forgot-password" className="text-sm font-medium text-aurum-gold-primary hover:underline">
          Forgot Password?
        </Link>
      </div>

      <SubmitButton isLoading={isSubmitting} className="w-full mt-4">
        Sign In to Operations
      </SubmitButton>
    </form>
  );
}
