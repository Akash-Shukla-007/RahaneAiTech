'use client';

import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  Users, 
  FileText, 
  Activity, 
  TrendingUp,
  Shield,
  Calendar,
  Clock
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

const DashboardPage = () => {
  const { user } = useAuth();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleDescription = () => {
    switch (user?.role) {
      case 'admin':
        return 'You have full access to manage users, content, and view system logs.';
      case 'editor':
        return 'You can create, edit, and manage content.';
      case 'viewer':
        return 'You have read-only access to view content.';
      default:
        return '';
    }
  };

  const getQuickActions = () => {
    const actions = [];
    
    if (user?.role === 'admin') {
      actions.push(
        { name: 'Manage Users', href: '/dashboard/users', icon: Users, color: 'bg-blue-500' },
        { name: 'View Logs', href: '/dashboard/logs', icon: Activity, color: 'bg-red-500' }
      );
    }
    
    if (user?.role === 'editor') {
      actions.push(
        { name: 'Manage Content', href: '/dashboard/content', icon: FileText, color: 'bg-green-500' }
      );
    }

    if (user?.role === 'viewer') {
      actions.push(
        { name: 'View Content', href: '/dashboard/content', icon: FileText, color: 'bg-green-500' }
      );
    }
    
    return actions;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {getWelcomeMessage()}, {user?.username}!
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">{getRoleDescription()}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Role</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 capitalize truncate">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Member Since</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">
                  {formatDate(user?.createdAt || '').split(',')[0]}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Last Login</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">
                  {formatDate(user?.lastLogin || '').split(',')[0]}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Status</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">
                  {user?.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {getQuickActions().map((action) => (
              <a
                key={action.name}
                href={action.href}
                className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${action.color} flex-shrink-0`}>
                  <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900 truncate">
                  {action.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Role Information */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Your Permissions</h2>
          <div className="space-y-3">
            {user?.role === 'admin' && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">Manage all users and their roles</span>
              </div>
            )}
            {user?.role === 'admin' && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">View system activity logs</span>
              </div>
            )}
            {user?.role === 'editor' && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">Create and edit content</span>
              </div>
            )}
            {user?.role === 'viewer' && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">View content and dashboard</span>
              </div>
            )}
            {['admin', 'editor', 'viewer'].includes(user?.role || '') && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">Access dashboard overview</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

