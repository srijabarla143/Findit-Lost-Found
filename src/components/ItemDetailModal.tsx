import React, { useState } from 'react';
import { Item } from '../types';
import { useApp } from '../context/AppContext';
import { ClaimModal } from './ClaimModal';
import { PrintFlyerModal } from './PrintFlyerModal';
import { EditItemModal } from './EditItemModal';
import { 
  X, 
  MapPin, 
  Calendar, 
  Tag, 
  ShieldCheck, 
  Gift, 
  Mail, 
  Phone, 
  User as UserIcon, 
  CheckCircle, 
  HelpCircle, 
  Share2, 
  Printer, 
  Edit3, 
  Trash2, 
  MessageSquare,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface ItemDetailModalProps {
  item: Item;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  const { 
    currentUser, 
    markAsStatus, 
    deleteItem, 
    toggleVerifyItem, 
    updateClaimStatus,
    showToast 
  } = useApp();

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isOwner = currentUser && item.reportedBy?.id === currentUser.id;
  const isAdmin = currentUser?.role === 'admin';
  const canManage = isOwner || isAdmin;
  const isLost = item.type === 'lost';
  const isReturned = item.status === 'returned';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}?item=${item.id}`);
      showToast('Listing link copied to clipboard!', 'success');
    }
  };

  const handleDelete = () => {
    deleteItem(item.id);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isReturned
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : isLost
                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}>
                {isReturned ? 'Returned / Reunited' : isLost ? 'Lost Item' : 'Found Item'}
              </span>
              {item.verified && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Campus Verified
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShare}
                className="p-2 text-slate-500 hover:text-indigo-600 rounded-xl hover:bg-slate-200/60 transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowPrintModal(true)}
                className="p-2 text-slate-500 hover:text-indigo-600 rounded-xl hover:bg-slate-200/60 transition-colors"
                title="Print Bulletin Flyer"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors ml-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* Top row: Image & Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Image Frame */}
              <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4">
                    {isLost ? <HelpCircle className="w-12 h-12 text-rose-300 mb-2" /> : <CheckCircle className="w-12 h-12 text-emerald-300 mb-2" />}
                    <p className="text-xs font-semibold">No Image Provided</p>
                  </div>
                )}
                {item.reward && (
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 backdrop-blur-md">
                    <Gift className="w-3.5 h-3.5" />
                    <span>Reward: {item.reward}</span>
                  </div>
                )}
              </div>

              {/* Core Details */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold mb-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{item.category}</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">
                    {item.title}
                  </h2>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5 text-sm">
                  <div className="flex items-start gap-2.5 text-slate-700">
                    <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">{item.location}</p>
                      {item.specificLocation && (
                        <p className="text-xs text-slate-500">{item.specificLocation}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-700 text-xs sm:text-sm">
                    <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Reported date: <strong className="text-slate-900">{item.date}</strong></span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-700 text-xs sm:text-sm">
                    <UserIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Reported by: <strong className="text-slate-900">{item.contactName}</strong></span>
                  </div>
                </div>

                {/* Primary Action Button */}
                {!isReturned ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowClaimModal(true)}
                      className={`w-full py-3.5 px-6 rounded-2xl text-white font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 ${
                        isLost
                          ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                          : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                      }`}
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>{isLost ? 'I Have Found This / Contact Owner' : 'Claim This Item / Contact Finder'}</span>
                    </button>
                    <p className="text-[11px] text-center text-slate-500">
                      Safe &amp; private: Connect via campus email or verified phone
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-center space-y-1">
                    <p className="text-sm font-bold text-purple-900">Successfully Reunited! 🎉</p>
                    <p className="text-xs text-purple-700">This item has been returned to its rightful owner.</p>
                  </div>
                )}

              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detailed Description</h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {item.description}
              </p>
            </div>

            {/* Contact details card */}
            <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">Reporter Contact</span>
                <p className="font-bold text-slate-900 text-sm">{item.contactName}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Mail className="w-3.5 h-3.5 text-indigo-500" />
                    {item.contactEmail}
                  </span>
                  {item.contactPhone && (
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3.5 h-3.5 text-indigo-500" />
                      {item.contactPhone}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowPrintModal(true)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Flyer Preview</span>
              </button>
            </div>

            {/* Owner & Admin Management Controls */}
            {canManage && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Manage This Listing ({isOwner ? 'You are the reporter' : 'Campus Admin'})</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {!isReturned ? (
                    <button
                      onClick={() => markAsStatus(item.id, 'returned')}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Mark as "Returned &amp; Reunited"</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => markAsStatus(item.id, 'active')}
                      className="px-3.5 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Re-open Listing
                    </button>
                  )}

                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Info</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => toggleVerifyItem(item.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        item.verified
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{item.verified ? 'Remove Verification' : 'Verify Post'}</span>
                    </button>
                  )}

                  {confirmDelete ? (
                    <div className="flex items-center gap-1.5 bg-rose-50 px-2 py-1 rounded-xl border border-rose-200">
                      <span className="text-xs text-rose-700 font-semibold">Confirm delete?</span>
                      <button
                        onClick={handleDelete}
                        className="px-2 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>

                {/* Claims received list (if owner or admin) */}
                {item.claims && item.claims.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-amber-200/60 space-y-2">
                    <p className="text-xs font-bold text-slate-800">
                      Claims / Messages Received ({item.claims.length})
                    </p>
                    <div className="space-y-2">
                      {item.claims.map(claim => (
                        <div key={claim.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{claim.claimantName}</span>
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                              claim.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-700'
                                : claim.status === 'rejected'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {claim.status}
                            </span>
                          </div>
                          <p className="text-slate-600">{claim.message}</p>
                          {claim.identifyingDetails && (
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-700 border border-slate-200">
                              <span className="font-semibold text-indigo-700">Identifying proof: </span>
                              {claim.identifyingDetails}
                            </div>
                          )}
                          <div className="flex items-center justify-between text-slate-400 pt-1">
                            <span>Email: <strong className="text-slate-700">{claim.claimantEmail}</strong></span>
                            {claim.status === 'pending' && canManage && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updateClaimStatus(item.id, claim.id, 'accepted')}
                                  className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold hover:bg-emerald-700"
                                >
                                  Accept Claim
                                </button>
                                <button
                                  onClick={() => updateClaimStatus(item.id, claim.id, 'rejected')}
                                  className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[11px] font-bold hover:bg-slate-300"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Campus Safe Handover Advisory */}
            <div className="p-4 bg-slate-100/70 rounded-2xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
              <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Campus Safety Reminder:</strong> When meeting up to return or claim an item, always meet in a public campus space during daylight hours (e.g. Student Union lobby or Campus Police desk). Never wire money or share passwords.
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Sub-modals */}
      {showClaimModal && (
        <ClaimModal item={item} onClose={() => setShowClaimModal(false)} />
      )}
      {showPrintModal && (
        <PrintFlyerModal item={item} onClose={() => setShowPrintModal(false)} />
      )}
      {showEditModal && (
        <EditItemModal item={item} onClose={() => setShowEditModal(false)} />
      )}
    </>
  );
};
