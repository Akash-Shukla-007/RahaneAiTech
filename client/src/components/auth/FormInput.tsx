'use client';

import { AlertCircle } from 'lucide-react';
import { ReactNode } from 'react';

interface FormInputProps {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  icon: ReactNode;
  error?: string;
  register: any;
  autoComplete?: string;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
}

export default function FormInput({
  label,
  id,
  type,
  placeholder,
  icon,
  error,
  register,
  autoComplete,
  rightIcon,
  onRightIconClick
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          {...register}
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          className={`block w-full pl-10 ${rightIcon ? 'pr-12' : 'pr-3'} py-3 border rounded-lg shadow-sm placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={placeholder}
        />
        {rightIcon && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onRightIconClick}
          >
            {rightIcon}
          </button>
        )}
      </div>
      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="break-words">{error}</span>
        </div>
      )}
    </div>
  );
}
