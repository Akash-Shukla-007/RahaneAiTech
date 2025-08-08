'use client';

import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { formatDate } from '@/lib/utils';
import { User, Mail, Calendar, Shield, LogOut, Clock } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">User Not Found</h2>
            <p className="text-gray-500">Unable to load user profile.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-sm sm:text-base text-gray-600">Your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-8">
          {/* Avatar and Name */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl sm:text-2xl font-bold text-blue-600">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{user.username}</h2>
          </div>

          {/* Profile Information */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Email</p>
                <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Role</p>
                <p className="text-sm sm:text-base font-medium text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>

            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Created At</p>
                <p className="text-sm sm:text-base font-medium text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            {user.lastLogin && (
              <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500">Last Login</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">{formatDate(user.lastLogin)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sign Out Button */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full px-4 py-3 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
