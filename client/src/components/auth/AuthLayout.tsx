'use client';

import { Shield } from 'lucide-react';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  gradientFrom: string;
  gradientTo: string;
}

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  gradientFrom, 
  gradientTo 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {subtitle}
          </p>
        </div>
        
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 shadow-xl rounded-xl border border-gray-100">
          {children}
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            By using this service, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
