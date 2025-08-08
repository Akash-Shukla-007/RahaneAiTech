'use client';

import { Crown, Edit, Eye as Viewer } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  error?: string;
}

export default function RoleSelector({ selectedRole, onRoleChange, error }: RoleSelectorProps) {
  const roles = [
    { value: 'viewer', label: 'Viewer', icon: <Viewer className="h-4 w-4" /> },
    { value: 'editor', label: 'Editor', icon: <Edit className="h-4 w-4" /> },
    { value: 'admin', label: 'Admin', icon: <Crown className="h-4 w-4" /> }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Role
      </label>
      <div className="grid grid-cols-3 gap-2">
        {roles.map((role) => (
          <label
            key={role.value}
            className={`relative flex items-center justify-center p-2 sm:p-3 border rounded-lg cursor-pointer transition-all ${
              selectedRole === role.value
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              type="radio"
              value={role.value}
              checked={selectedRole === role.value}
              onChange={(e) => onRoleChange(e.target.value)}
              className="sr-only"
            />
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
              {role.icon}
              <span className="text-xs sm:text-sm font-medium capitalize">{role.label}</span>
            </div>
          </label>
        ))}
      </div>
      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <span className="break-words">{error}</span>
        </div>
      )}
    </div>
  );
}
