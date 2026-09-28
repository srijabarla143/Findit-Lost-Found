import React, { useState } from 'react';
import { Item } from '../types';
import { useApp } from '../context/AppContext';
import { X, ShieldAlert, Send, CheckCircle, Lock } from 'lucide-react';

interface ClaimModalProps {
  item: Item;
  onClose: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ item, onClose }) => {
  const { currentUser, submitClaim } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [identifyingDetails, setIdentifyingDetails] = useState('');
  const [message, setMessage] = useState(
    item.type === 'found'
      ? 'Hi! I saw you found this item. I believe it belongs to me.'
      : 'Hi! I think I might have found your lost item or have information about it.'
  );
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      submitClaim(item.id, {
        claimantId: currentUser?.id,
        claimantName: name,
        claimantEmail: email,
        claimantPhone: phone,
        identifyingDetails,
        message
      });
      setSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {item.type === 'found' ? 'Claim This Item' : 'Contact About Lost Item'}
            </h3>
            <p className="text-xs text-slate-500">Connect securely with the reporter</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Claim Sent Successfully!</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              We notified <span className="font-semibold text-slate-800">{item.contactName}</span> with your message and proof details. Check your email ({email}) for replies.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Target Item summary badge */}
            <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center gap-3">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-12 h-12 rounded-lg object-cover bg-slate-200"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                  {item.type.toUpperCase()} ITEM
                </span>
                <p className="text-sm font-bold text-slate-900 truncate">{item.title}</p>
                <p className="text-xs text-slate-500 truncate">{item.location}</p>
              </div>
            </div>

            {/* Verification Tip */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Campus Verification Rule:</span> To protect students from false claims, provide specific identifying clues that aren't mentioned in the public listing.
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Alex Morgan"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@campus.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="(555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Identifying Proof / Secret Features *
              </label>
              <textarea
                required
                rows={2}
                value={identifyingDetails}
                onChange={e => setIdentifyingDetails(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Lock screen photo is a golden retriever, initials carved inside, scratch on left side, serial number ends in 41..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message to Reporter *</label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Write a message explaining when and where to meet safely on campus..."
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm active:scale-95 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Claim Request</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
