'use client';

import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { 
  Users, 
  FileText, 
  Activity, 
  Settings, 
  LogOut,
  Home,
  User,
  Shield,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      roles: ['admin', 'editor', 'viewer']
    },
    {
      name: 'Users',
      href: '/dashboard/users',
      icon: Users,
      roles: ['admin']
    },
    {
      name: 'Content',
      href: '/dashboard/content',
      icon: FileText,
      roles: ['admin', 'editor', 'viewer']
    },
    {
      name: 'Activity Logs',
      href: '/dashboard/logs',
      icon: Activity,
      roles: ['admin']
    },
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: User,
      roles: ['admin', 'editor', 'viewer']
    }
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || 'viewer')
  );

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      {/* Header with close button for mobile */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">Admin Panel</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex-1 space-y-1 px-2 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose} // Close sidebar on mobile when clicking nav items
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </div>
      
      {/* User section */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.username}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

