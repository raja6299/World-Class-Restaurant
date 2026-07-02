'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, SubmitButton } from '@/components/shared/form/FormFields';
import { forgotPasswordAction } from '@/src/modules/auth/actions';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    setSuccess(false);
    
    const formData = new FormData();
    formData.append('email', data.email);

    const result = await forgotPasswordAction(formData);
    
    if (result?.error) {
      setServerError(result.error);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aurum-charcoal-primary p-6">
      <div className="max-w-md w-full bg-aurum-cream-primary rounded-xl border border-aurum-gold-primary/20 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-semibold text-aurum-text-heading mb-2">
            Reset Password
          </h1>
          <p className="text-aurum-text-body/70 text-sm">
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium mb-6">
              Password reset link sent! Please check your email.
            </div>
            <Link 
              href="/login" 
              className="text-sm font-medium text-aurum-gold-primary hover:underline"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {serverError && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                {serverError}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="admin@restaurant.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <SubmitButton isLoading={isSubmitting} className="w-full">
              Send Reset Link
            </SubmitButton>

            <div className="text-center pt-4">
              <Link 
                href="/login" 
                className="text-sm font-medium text-aurum-text-body/60 hover:text-aurum-gold-primary transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
