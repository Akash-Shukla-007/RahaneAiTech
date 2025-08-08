'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { FileText, Plus, Edit, Trash2, MessageSquare, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Content {
  _id: string;
  title: string;
  content: string;
  type: 'post' | 'comment';
  author: {
    _id: string;
    username: string;
    email: string;
  };
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  parentContent?: {
    _id: string;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CreateContentForm {
  title: string;
  content: string;
  type: 'post' | 'comment';
  tags: string;
}

export default function ContentPage() {
  const { user } = useAuth();
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState<CreateContentForm>({
    title: '',
    content: '',
    type: 'post',
    tags: ''
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/content');
      setContent(response.data.content);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/content/${contentId}`);
      toast.success('Content deleted successfully');
      fetchContent();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete content');
    }
  };

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createForm.title.trim() || !createForm.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setCreateLoading(true);
    try {
      const tags = createForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await api.post('/content', {
        title: createForm.title,
        content: createForm.content,
        type: createForm.type,
        status: 'published',
        tags
      });

      toast.success('Content created successfully');
      setShowCreateModal(false);
      setCreateForm({
        title: '',
        content: '',
        type: 'post',
        tags: ''
      });
      fetchContent();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create content');
    } finally {
      setCreateLoading(false);
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      title: '',
      content: '',
      type: 'post',
      tags: ''
    });
  };

  // Check if user has no access at all
  if (!user || !['editor', 'viewer'].includes(user.role)) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Access Denied</h2>
            <p className="text-gray-500">You don't have permission to access content management.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isViewer = user?.role === 'viewer';
  const canEdit = user?.role === 'editor';
  const canView = ['editor', 'viewer'].includes(user?.role || '');

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {isViewer ? 'Content Library' : 'Content Management'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {isViewer 
                ? 'Browse and view published content' 
                : 'Create and manage posts and comments'
              }
            </p>
            {isViewer && (
              <p className="text-sm text-blue-600 mt-1">
                You have read-only access to published content
              </p>
            )}
          </div>
          {canEdit && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Content
            </button>
          )}
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Content ({content.length})</h3>
              {isViewer && (
                <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Published content only
                </span>
              )}
            </div>
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
                      Content
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    {!isViewer && (
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    )}
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    {canEdit && (
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {content.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center">
                          {item.type === 'post' ? (
                            <FileText className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                          ) : (
                            <MessageSquare className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                            <p className="text-sm text-gray-500 truncate">{item.content.substring(0, 100)}...</p>
                            {item.parentContent && (
                              <p className="text-xs text-gray-400">Reply to: {item.parentContent.title}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.type === 'post' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      {!isViewer && (
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.status === 'published' ? 'bg-green-100 text-green-800' :
                            item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      )}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-700">
                                {item.author.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{item.author.username}</div>
                            <div className="text-sm text-gray-500">{item.author.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>
                      {canEdit && (
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Edit Content"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteContent(item._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Content"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="sm:hidden divide-y divide-gray-200">
                {content.map((item) => (
                  <div key={item._id} className="p-4">
                    <div className="flex items-start space-x-3">
                      {item.type === 'post' ? (
                        <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      ) : (
                        <MessageSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.type === 'post' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {item.type}
                            </span>
                            {!isViewer && (
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                item.status === 'published' ? 'bg-green-100 text-green-800' :
                                item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {item.status}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.content.substring(0, 100)}...</p>
                        {item.parentContent && (
                          <p className="text-xs text-gray-400 mb-3">Reply to: {item.parentContent.title}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-700">
                                {item.author.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-900">{item.author.username}</div>
                              <div className="text-xs text-gray-500">{formatDate(item.createdAt)}</div>
                            </div>
                          </div>
                          {canEdit && (
                            <div className="flex items-center space-x-2">
                              <button
                                className="text-yellow-600 hover:text-yellow-900 p-1"
                                title="Edit Content"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteContent(item._id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete Content"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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
          {content.length === 0 && !loading && (
            <div className="p-6 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
              <p className="text-gray-500">
                {isViewer 
                  ? 'No published content available at the moment.' 
                  : 'Create your first content to get started.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Create Content Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Create New Content</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetCreateForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateContent} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={createForm.title}
                      onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter content title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      value={createForm.type}
                      onChange={(e) => setCreateForm({ ...createForm, type: e.target.value as 'post' | 'comment' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="post">Post</option>
                      <option value="comment">Comment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={createForm.content}
                    onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter content..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={createForm.tags}
                    onChange={(e) => setCreateForm({ ...createForm, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetCreateForm();
                    }}
                    className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {createLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Content
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
