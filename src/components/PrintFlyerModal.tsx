import React from 'react';
import { Item } from '../types';
import { X, Printer, Download, Sparkles } from 'lucide-react';

interface PrintFlyerModalProps {
  item: Item;
  onClose: () => void;
}

export const PrintFlyerModal: React.FC<PrintFlyerModalProps> = ({ item, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const isLost = item.type === 'lost';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Toolbar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm">Printable Campus Bulletin Flyer</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Flyer</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Flyer Sheet */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-slate-50 flex justify-center">
          <div 
            id="printable-flyer" 
            className="w-full max-w-xl bg-white p-8 border-2 border-dashed border-slate-300 rounded-xl shadow-md text-slate-900 space-y-6"
          >
            {/* Big Headline */}
            <div className={`text-center py-4 rounded-xl border-4 ${
              isLost ? 'border-rose-600 bg-rose-50 text-rose-700' : 'border-emerald-600 bg-emerald-50 text-emerald-800'
            }`}>
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-wider">
                {isLost ? 'LOST ITEM' : 'FOUND ITEM'}
              </h1>
              <p className="text-sm font-bold uppercase tracking-widest mt-1">
                PLEASE CONTACT IF YOU HAVE ANY INFORMATION
              </p>
            </div>

            {/* Photo & Title */}
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-black text-slate-900">{item.title}</h2>
              {item.imageUrl && (
                <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 flex items-center justify-center">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Reward Banner */}
            {item.reward && (
              <div className="p-3 bg-amber-100 border-2 border-amber-400 rounded-xl text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800">REWARD OFFERED</p>
                <p className="text-xl font-black text-amber-950">{item.reward}</p>
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-xs border-y border-slate-200 py-3">
              <div>
                <span className="font-bold text-slate-500 uppercase block">Category:</span>
                <span className="font-semibold text-slate-900 text-sm">{item.category}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase block">Date:</span>
                <span className="font-semibold text-slate-900 text-sm">{item.date}</span>
              </div>
              <div className="col-span-2">
                <span className="font-bold text-slate-500 uppercase block">Campus Location:</span>
                <span className="font-semibold text-slate-900 text-sm">{item.location} {item.specificLocation && `(${item.specificLocation})`}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Description &amp; Details:</span>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {item.description}
              </p>
            </div>

            {/* Contact info box */}
            <div className="bg-slate-900 text-white p-4 rounded-xl text-center space-y-1">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Contact Person</p>
              <p className="text-lg font-bold">{item.contactName}</p>
              <p className="text-sm text-indigo-300 font-mono">Email: {item.contactEmail}</p>
              {item.contactPhone && (
                <p className="text-sm text-emerald-300 font-mono">Phone/Text: {item.contactPhone}</p>
              )}
            </div>

            {/* Tear-off Slips at bottom */}
            <div className="pt-4 border-t-2 border-dashed border-slate-400">
              <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest mb-3">
                Cut along dotted lines for tear-off slips
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-center text-[10px] border-t border-slate-300 pt-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="border-r border-slate-200 last:border-r-0 pr-1 space-y-1">
                    <p className="font-bold text-slate-900 truncate">{item.title.split(' ')[0]}</p>
                    <p className="text-indigo-600 font-semibold truncate text-[9px]">
                      {item.contactPhone || item.contactEmail.split('@')[0]}
                    </p>
                    <p className="text-[8px] text-slate-400">FindIt Portal</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
