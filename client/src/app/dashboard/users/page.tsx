'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import api from '@/lib/api';
import { formatDate, getRoleColor } from '@/lib/utils';
import { Users, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string;
}

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (userItem: User) => {
    setEditingUser(userItem);
    setNewRole(userItem.role);
    setShowEditModal(true);
  };

  const handleUpdateRole = async () => {
    if (!editingUser || !newRole) return;

    setUpdateLoading(true);
    try {
      await api.patch(`/users/${editingUser._id}/role`, { role: newRole });
      toast.success('User role updated successfully');
      setShowEditModal(false);
      setEditingUser(null);
      setNewRole('');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Access Denied</h2>
            <p className="text-gray-500">You don't have permission to access user management.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Manage user roles and accounts</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Users ({users.length})</h3>
          </div>
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((userItem) => (
                    <tr key={userItem._id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {userItem.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{userItem.username}</div>
                            <div className="text-sm text-gray-500">{userItem.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(userItem.role)}`}>
                          {userItem.role}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(userItem.createdAt)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditRole(userItem)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Role"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {userItem._id !== user?._id && (
                            <button
                              onClick={() => handleDeleteUser(userItem._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="sm:hidden divide-y divide-gray-200">
                {users.map((userItem) => (
                  <div key={userItem._id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {userItem.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{userItem.username}</div>
                          <div className="text-sm text-gray-500">{userItem.email}</div>
                          <div className="mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(userItem.role)}`}>
                              {userItem.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditRole(userItem)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit Role"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {userItem._id !== user?._id && (
                          <button
                            onClick={() => handleDeleteUser(userItem._id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Created: {formatDate(userItem.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {users.length === 0 && !loading && (
            <div className="p-6 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">No users are currently registered.</p>
            </div>
          )}
        </div>

        {/* Edit Role Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Edit User Role</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    setNewRole('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">User: <span className="font-medium">{editingUser.username}</span></p>
                  <p className="text-sm text-gray-600 mb-4">Email: <span className="font-medium">{editingUser.email}</span></p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingUser(null);
                      setNewRole('');
                    }}
                    className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateRole}
                    disabled={updateLoading || newRole === editingUser.role}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {updateLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      'Update Role'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
