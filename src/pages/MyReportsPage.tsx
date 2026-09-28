import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCard } from '../components/ItemCard';
import { EditItemModal } from '../components/EditItemModal';
import { Item } from '../types';
import { 
  FileText, 
  HelpCircle, 
  PlusCircle, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Tag, 
  Gift, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface MyReportsPageProps {
  onViewItem: (item: Item) => void;
  onOpenAuth: () => void;
}

export const MyReportsPage: React.FC<MyReportsPageProps> = ({ onViewItem, onOpenAuth }) => {
  const { 
    currentUser, 
    items, 
    markAsStatus, 
    deleteItem, 
    updateClaimStatus, 
    setCurrentTab 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Sign In to View Your Reports</h2>
        <p className="text-sm text-slate-600">
          Track the items you reported, manage claims, and mark recovered items as reunited.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors shadow-md"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  // Filter items reported by currentUser
  const myItems = items.filter(i => i.reportedBy?.id === currentUser.id);

  const filteredMyItems = myItems.filter(item => {
    if (activeTab === 'lost') return item.type === 'lost';
    if (activeTab === 'found') return item.type === 'found';
    return true;
  });

  const totalLost = myItems.filter(i => i.type === 'lost').length;
  const totalFound = myItems.filter(i => i.type === 'found').length;
  const totalReturned = myItems.filter(i => i.status === 'returned').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Personal Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            My Reported Items
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your posts, review incoming claims, and update item status
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('report-lost')}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm rounded-xl border border-rose-200 flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-rose-500" />
            <span>+ Report Lost</span>
          </button>
          <button
            onClick={() => setCurrentTab('report-found')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-emerald-100" />
            <span>+ Report Found</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Reports</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{myItems.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Lost Items</p>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">{totalLost}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Found Items</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{totalFound}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Reunited / Returned</p>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">{totalReturned}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All My Reports ({myItems.length})
        </button>
        <button
          onClick={() => setActiveTab('lost')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'lost'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Lost Only ({totalLost})
        </button>
        <button
          onClick={() => setActiveTab('found')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'found'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Found Only ({totalFound})
        </button>
      </div>

      {/* Reports Listing */}
      {filteredMyItems.length > 0 ? (
        <div className="space-y-4">
          {filteredMyItems.map(item => {
            const isLost = item.type === 'lost';
            const isReturned = item.status === 'returned';

            return (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 transition-all hover:border-indigo-200 flex flex-col md:flex-row gap-6"
              >
                {/* Thumbnail */}
                <div 
                  onClick={() => onViewItem(item)}
                  className="w-full md:w-44 h-40 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer relative group"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-xs ${
                      isReturned ? 'bg-purple-600' : isLost ? 'bg-rose-600' : 'bg-emerald-600'
                    }`}>
                      {isReturned ? 'Returned' : isLost ? 'Lost' : 'Found'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold mb-1">
                        <Tag className="w-3.5 h-3.5" />
                        <span>{item.category}</span>
                        {item.verified && (
                          <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-bold text-[10px] border border-blue-200">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <h3 
                        onClick={() => onViewItem(item)}
                        className="text-lg font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                      >
                        {item.title}
                      </h3>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start ${
                      isReturned
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                      {isReturned ? 'Resolved / Returned' : 'Active Listing'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.date}
                    </span>
                    {item.reward && (
                      <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                        <Gift className="w-3 h-3" />
                        Reward: {item.reward}
                      </span>
                    )}
                  </div>

                  {/* Claims on this item */}
                  {item.claims && item.claims.length > 0 && (
                    <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 space-y-2 mt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Claims &amp; Inquiries ({item.claims.length})</span>
                        </span>
                      </div>
                      <div className="space-y-2">
                        {item.claims.map(claim => (
                          <div key={claim.id} className="p-2.5 bg-white rounded-lg border border-amber-200 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{claim.claimantName} ({claim.claimantEmail})</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                claim.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {claim.status}
                              </span>
                            </div>
                            <p className="text-slate-700">{claim.message}</p>
                            {claim.identifyingDetails && (
                              <p className="text-[11px] text-indigo-700 bg-indigo-50 p-1.5 rounded">
                                <strong>Proof:</strong> {claim.identifyingDetails}
                              </p>
                            )}
                            {claim.status === 'pending' && (
                              <div className="flex gap-2 pt-1">
                                <button
                                  onClick={() => updateClaimStatus(item.id, claim.id, 'accepted')}
                                  className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                                >
                                  Accept &amp; Reunite
                                </button>
                                <button
                                  onClick={() => updateClaimStatus(item.id, claim.id, 'rejected')}
                                  className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {!isReturned ? (
                        <button
                          onClick={() => markAsStatus(item.id, 'returned')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Mark as "Returned"</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => markAsStatus(item.id, 'active')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                        >
                          Reopen Item
                        </button>
                      )}

                      <button
                        onClick={() => setEditingItem(item)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Edit</span>
                      </button>

                      {deleteConfirmId === item.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              deleteItem(item.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1.5 bg-slate-200 text-slate-700 text-xs rounded-xl"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => onViewItem(item)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      View Full Details →
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">No reports found under this tab</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              You haven't posted any items yet under "{activeTab}". Report an item now to get started.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setCurrentTab('report-lost')}
              className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700"
            >
              Report Lost Item
            </button>
            <button
              onClick={() => setCurrentTab('report-found')}
              className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700"
            >
              Report Found Item
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <EditItemModal item={editingItem} onClose={() => setEditingItem(null)} />
      )}

    </div>
  );
};
