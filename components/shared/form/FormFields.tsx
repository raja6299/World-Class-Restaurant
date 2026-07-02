import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  description?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-aurum-text-heading mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-lg border bg-aurum-cream-primary px-3 py-2 text-sm text-aurum-text-body transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-aurum-text-body/40",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aurum-gold-primary focus-visible:border-aurum-gold-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500" : "border-aurum-gold-primary/20",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm font-medium text-red-500">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-aurum-text-body/60">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-aurum-text-heading mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "flex min-h-[100px] w-full rounded-lg border bg-aurum-cream-primary px-3 py-2 text-sm text-aurum-text-body transition-colors",
            "placeholder:text-aurum-text-body/40",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aurum-gold-primary focus-visible:border-aurum-gold-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500" : "border-aurum-gold-primary/20",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm font-medium text-red-500">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-aurum-text-body/60">{helperText}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-aurum-text-heading mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-lg border bg-aurum-cream-primary px-3 py-2 text-sm text-aurum-text-body transition-colors",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aurum-gold-primary focus-visible:border-aurum-gold-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500" : "border-aurum-gold-primary/20",
            className
          )}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-sm font-medium text-red-500">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-aurum-text-body/60">{helperText}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, ...props }, ref) => {
    return (
      <label className="flex items-start justify-between cursor-pointer group">
        <div className="flex flex-col pr-4">
          <span className="text-sm font-medium text-aurum-text-heading group-hover:text-aurum-gold-primary transition-colors">{label}</span>
          {description && <span className="text-xs text-aurum-text-body/60 mt-0.5">{description}</span>}
        </div>
        <div className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
          <input type="checkbox" className="sr-only peer" ref={ref} {...props} />
          <div className="w-11 h-6 bg-aurum-gold-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aurum-gold-primary"></div>
        </div>
      </label>
    );
  }
);
Toggle.displayName = 'Toggle';

export const SubmitButton = ({ isLoading, children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean }) => {
  return (
    <button
      type="submit"
      disabled={isLoading || props.disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-aurum-gold-primary px-6 py-2.5 text-sm font-medium text-white shadow hover:bg-aurum-gold-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurum-gold-primary focus-visible:ring-offset-2 transition-colors disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};
