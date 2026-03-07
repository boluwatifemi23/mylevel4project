'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}


const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, type = 'text', id, ...props }, ref) => {
    
    const inputId = id ?? (props.name ? `${String(props.name)}-input` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          type={type}
          className={cn(
            'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition',
            error ? 'border-red-500' : 'border-gray-300',
            className
          )}
          {...props}
        />

        {helper && !error && <p className="mt-1 text-sm text-gray-500">{helper}</p>}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
