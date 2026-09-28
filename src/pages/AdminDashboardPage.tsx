import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Item, User } from '../types';
import { 
  ShieldCheck, 
  Trash2, 
  CheckCircle, 
  Users, 
  FileText, 
  AlertTriangle, 
  Search, 
  RotateCcw, 
  MapPin, 
  Sparkles, 
  Download,
  Eye,
  Filter,
  TrendingUp,
  Tag
} from 'lucide-react';

interface AdminDashboardPageProps {
  onViewItem: (item: Item) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onViewItem }) => {
  const { 
    currentUser, 
    items, 
    deleteItem, 
    markAsStatus, 
    toggleVerifyItem, 
    loginAsDemoUser,
    resetAllData,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reports' | 'users' | 'analytics'>('reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'lost' | 'found' | 'unverified'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // If not admin, provide 1-click option to switch to admin role
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Campus Admin Access Required</h2>
        <p className="text-sm text-slate-600">
          This dashboard is reserved for Campus Security and Student Union Administrators to moderate posts, verify claims, and manage student reports.
        </p>
        <button
          onClick={() => loginAsDemoUser('admin')}
          className="px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-colors shadow-md flex items-center gap-2 mx-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Log In as Demo Admin (Officer Davis)</span>
        </button>
      </div>
    );
  }

  // Filter reports
  const filteredReports = items.filter(item => {
    if (typeFilter === 'lost' && item.type !== 'lost') return false;
    if (typeFilter === 'found' && item.type !== 'found') return false;
    if (typeFilter === 'unverified' && item.verified) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchReporter = item.contactName.toLowerCase().includes(q) || item.contactEmail.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      if (!matchTitle && !matchReporter && !matchLoc) return false;
    }
    return true;
  });

  const totalReports = items.length;
  const activeLost = items.filter(i => i.type === 'lost' && i.status === 'active').length;
  const activeFound = items.filter(i => i.type === 'found' && i.status === 'active').length;
  const reunitedCount = items.filter(i => i.status === 'returned').length;
  const unverifiedCount = items.filter(i => !i.verified).length;

  // Mock campus users extracted from reports
  const uniqueUsersMap = new Map<string, { name: string; email: string; count: number }>();
  items.forEach(item => {
    const key = item.contactEmail;
    const existing = uniqueUsersMap.get(key) || { name: item.contactName, email: item.contactEmail, count: 0 };
    existing.count += 1;
    uniqueUsersMap.set(key, existing);
  });
  const userList = Array.from(uniqueUsersMap.values());

  const handleExportCSV = () => {
    const headers = 'ID,Title,Type,Category,Date,Location,Status,Reporter,Email\n';
    const rows = items.map(i => 
      `"${i.id}","${i.title.replace(/"/g, '""')}","${i.type}","${i.category}","${i.date}","${i.location}","${i.status}","${i.contactName}","${i.contactEmail}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `findit-campus-reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Exported reports to CSV successfully', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Campus Security &amp; Admin Panel</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Logged in as <strong>{currentUser.name}</strong> ({currentUser.email})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={resetAllData}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            title="Reset to default items"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Reports</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalReports}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Active Lost</p>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">{activeLost}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active Found</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{activeFound}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Reunited Items</p>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">{reunitedCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Verify</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{unverifiedCount}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'reports'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Manage Reports ({items.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Campus Users ({userList.length})</span>
        </button>
      </div>

      {/* Tab 1: Manage Reports Table */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search posts or reporter email..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto overflow-x-auto">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  typeFilter === 'all' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter('lost')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  typeFilter === 'lost' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Lost
              </button>
              <button
                onClick={() => setTypeFilter('found')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  typeFilter === 'found' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Found
              </button>
              <button
                onClick={() => setTypeFilter('unverified')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  typeFilter === 'unverified' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Unverified ({unverifiedCount})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Item</th>
                    <th className="py-3.5 px-3">Type</th>
                    <th className="py-3.5 px-3">Location &amp; Date</th>
                    <th className="py-3.5 px-3">Reporter</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredReports.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <p 
                              onClick={() => onViewItem(item)}
                              className="font-bold text-slate-900 hover:text-purple-600 cursor-pointer truncate max-w-xs"
                            >
                              {item.title}
                            </p>
                            <span className="text-[11px] text-slate-500">{item.category}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.type}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800 truncate max-w-xs">{item.location}</p>
                          <p className="text-slate-400">{item.date}</p>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800">{item.contactName}</p>
                          <p className="text-slate-400 font-mono text-[11px]">{item.contactEmail}</p>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'returned'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {item.status}
                          </span>
                          {item.verified ? (
                            <span className="text-[10px] text-blue-700 flex items-center gap-0.5 font-semibold">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-600 font-semibold">
                              Unverified
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleVerifyItem(item.id)}
                            className={`p-1.5 rounded-lg text-xs font-semibold ${
                              item.verified
                                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                            title={item.verified ? "Remove Verification" : "Verify Report"}
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onViewItem(item)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {deleteConfirmId === item.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  deleteItem(item.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-2 py-1 bg-rose-600 text-white text-[11px] font-bold rounded"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-1.5 py-1 bg-slate-200 text-slate-700 text-[11px] rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(item.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                              title="Remove Inappropriate Post"
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
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-900 text-sm">Registered Campus Community Members</h3>
            <p className="text-xs text-slate-500">List of students and staff with active listings</p>
          </div>
          <div className="divide-y divide-slate-100">
            {userList.map((user, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                    {user.count} post{user.count > 1 ? 's' : ''} reported
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active Student
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
