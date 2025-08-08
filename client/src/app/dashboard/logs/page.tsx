'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Activity, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface ActivityLog {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export default function LogsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, [currentPage]);

  const fetchLogs = async () => {
    try {
      const response = await api.get(`/logs?page=${currentPage}&limit=10`);
      setLogs(response.data.logs);
      setTotalPages(response.data.totalPages);
      setTotalLogs(response.data.total);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return <User className="w-4 h-4 text-green-600" />;
      case 'logout':
        return <User className="w-4 h-4 text-gray-600" />;
      case 'create':
        return <Activity className="w-4 h-4 text-blue-600" />;
      case 'update':
        return <Activity className="w-4 h-4 text-yellow-600" />;
      case 'delete':
        return <Activity className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return 'bg-green-100 text-green-800';
      case 'logout':
        return 'bg-gray-100 text-gray-800';
      case 'create':
        return 'bg-blue-100 text-blue-800';
      case 'update':
        return 'bg-yellow-100 text-yellow-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Access Denied</h2>
            <p className="text-gray-500">You don't have permission to access activity logs.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Monitor system activity and user actions</p>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              Activity Logs ({totalLogs})
            </h3>
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
                      Action
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getActionIcon(log.action)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-700">
                                {(log.user?.username || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{log.user?.username || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{log.user?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.resource || 'N/A'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {log.details ? (typeof log.details === 'object' ? JSON.stringify(log.details) : log.details) : 'N/A'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ipAddress || 'N/A'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(log.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="sm:hidden divide-y divide-gray-200">
                {logs.map((log) => (
                  <div key={log._id} className="p-4">
                    <div className="flex items-start space-x-3">
                      {getActionIcon(log.action)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(log.timestamp)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-700">
                              {(log.user?.username || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-900">{log.user?.username || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{log.user?.email || 'N/A'}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-xs">
                          <div>
                            <span className="font-medium text-gray-700">Resource:</span>
                            <span className="text-gray-600 ml-1">{log.resource || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">IP:</span>
                            <span className="text-gray-600 ml-1">{log.ipAddress || 'N/A'}</span>
                          </div>
                          {log.details && (
                            <div>
                              <span className="font-medium text-gray-700">Details:</span>
                              <span className="text-gray-600 ml-1 truncate block">
                                {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {logs.length === 0 && !loading && (
            <div className="p-6 text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
              <p className="text-gray-500">No activity logs available.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-4 sm:px-6 py-3 border-t border-gray-200 space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
