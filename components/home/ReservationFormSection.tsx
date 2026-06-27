'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { fadeInUp } from '@/lib/utils/animations';
import { validationRules, partySizeOptions, getTodayDateString } from '@/lib/utils/validation';
import { submitReservation } from '@/lib/firebase/db';
import SectionHeading from '@/components/shared/SectionHeading';

interface FormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: string;
  dietaryReqs: string;
  specialRequests: string;
  agreeToTerms: boolean;
}

export default function ReservationFormSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [submitResult, setSubmitResult] = useState<{ success: boolean; error?: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<FormData>({ mode: 'onChange' });

  const onSubmit = async (data: FormData) => {
    setSubmitResult(null);
    const result = await submitReservation({
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      partySize: data.partySize,
      dietaryReqs: data.dietaryReqs || '',
      specialRequests: data.specialRequests || '',
    });
    setSubmitResult(result);
    if (result.success) reset();
  };

  const inputClass =
    'w-full bg-aurum-cream-primary border border-aurum-gold-brass/40 rounded-lg px-4 py-3 text-aurum-text-body placeholder:text-aurum-gold-earthy/60 focus:border-aurum-gold-primary focus:border-b-2 focus:outline-none transition-colors duration-200';
  const labelClass = 'text-sm font-semibold text-aurum-text-heading mb-1 block';
  const errorClass = 'text-xs text-aurum-energy-deep mt-1';

  return (
    <section id="reservation" className="py-24 px-6 lg:px-12 bg-aurum-cream-secondary">
      <SectionHeading
        title="Reserve Your Table"
        subtitle="Join us for an unforgettable experience."
      />

      <motion.div
        ref={ref}
        variants={fadeInUp}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-[500px] mx-auto mt-12"
      >
        {submitResult?.success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-aurum-cream-primary rounded-xl p-8 border border-[rgba(212,175,55,0.2)] shadow-aurum-md text-center"
          >
            <div className="text-5xl mb-4">✓</div>
            <h3 className="font-playfair text-2xl text-aurum-text-heading mb-2">
              Reservation Confirmed!
            </h3>
            <p className="text-aurum-text-body/70">
              We&apos;ll send details to your email. See you soon!
            </p>
            <button
              onClick={() => setSubmitResult(null)}
              className="mt-6 text-sm text-aurum-gold-primary hover:underline"
            >
              Make another reservation
            </button>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-aurum-cream-primary rounded-xl p-8 border border-[rgba(212,175,55,0.2)] shadow-aurum-md"
          >
            {/* Name */}
            <div className="mb-5">
              <label htmlFor="name" className={labelClass}>Full Name</label>
              <input id="name" type="text" placeholder="Your Name" className={inputClass} {...register('name', validationRules.name)} />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="mb-5">
              <label htmlFor="email" className={labelClass}>Email</label>
              <input id="email" type="email" placeholder="your@email.com" className={inputClass} {...register('email', validationRules.email)} />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="mb-5">
              <label htmlFor="phone" className={labelClass}>Phone</label>
              <input id="phone" type="tel" placeholder="+91 98765 43210" className={inputClass} {...register('phone', validationRules.phone)} />
              {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
            </div>

            {/* Date & Time row */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label htmlFor="date" className={labelClass}>Preferred Date</label>
                <input id="date" type="date" min={getTodayDateString()} className={inputClass} {...register('date', validationRules.date)} />
                {errors.date && <p className={errorClass}>{errors.date.message}</p>}
              </div>
              <div>
                <label htmlFor="time" className={labelClass}>Preferred Time</label>
                <input id="time" type="time" className={inputClass} {...register('time', validationRules.time)} />
                {errors.time && <p className={errorClass}>{errors.time.message}</p>}
              </div>
            </div>

            {/* Party Size */}
            <div className="mb-5">
              <label htmlFor="partySize" className={labelClass}>Party Size</label>
              <select id="partySize" className={inputClass} {...register('partySize', validationRules.partySize)}>
                <option value="">Select party size</option>
                {partySizeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.partySize && <p className={errorClass}>{errors.partySize.message}</p>}
            </div>

            {/* Dietary */}
            <div className="mb-5">
              <label htmlFor="dietaryReqs" className={labelClass}>Dietary Requirements</label>
              <textarea id="dietaryReqs" placeholder="Vegetarian, allergies, preferences..." maxLength={200} rows={2} className={inputClass} {...register('dietaryReqs', validationRules.dietaryReqs)} />
              {errors.dietaryReqs && <p className={errorClass}>{errors.dietaryReqs.message}</p>}
            </div>

            {/* Special Requests */}
            <div className="mb-5">
              <label htmlFor="specialRequests" className={labelClass}>Special Requests</label>
              <textarea id="specialRequests" placeholder="Celebration occasion, special requests..." maxLength={300} rows={2} className={inputClass} {...register('specialRequests', validationRules.specialRequests)} />
              {errors.specialRequests && <p className={errorClass}>{errors.specialRequests.message}</p>}
            </div>

            {/* Terms */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 accent-[#d4af37]" {...register('agreeToTerms', validationRules.agreeToTerms)} />
                <span className="text-sm text-aurum-text-body">
                  I agree to the{' '}
                  <span className="text-aurum-gold-primary hover:underline cursor-pointer">
                    cancellation policy
                  </span>
                </span>
              </label>
              {errors.agreeToTerms && <p className={errorClass}>{errors.agreeToTerms.message}</p>}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={!isValid || isSubmitting}
              whileHover={isValid && !isSubmitting ? { scale: 1.03 } : {}}
              whileTap={isValid && !isSubmitting ? { scale: 0.98 } : {}}
              className="w-full bg-aurum-gold-primary text-aurum-cream-primary hover:bg-aurum-energy-orange py-4 rounded-lg font-bold uppercase tracking-wider text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Booking...' : 'Reserve Now'}
            </motion.button>

            {/* Error Message */}
            {submitResult && !submitResult.success && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-aurum-energy-deep text-center mt-4"
              >
                {submitResult.error || 'Something went wrong. Please try again.'}
              </motion.p>
            )}
          </form>
        )}
      </motion.div>
    </section>
  );
}
