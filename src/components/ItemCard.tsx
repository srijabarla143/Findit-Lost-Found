import React, { useState } from 'react';
import { Item } from '../types';
import { 
  MapPin, 
  Calendar, 
  Tag, 
  ShieldCheck, 
  Gift, 
  ArrowRight, 
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onViewDetails: (item: Item) => void;
  compact?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onViewDetails, compact = false }) => {
  const [imageError, setImageError] = useState(false);

  // Format date nicely
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const isLost = item.type === 'lost';
  const isReturned = item.status === 'returned';

  return (
    <div 
      onClick={() => onViewDetails(item)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image Thumbnail Area */}
      <div className={`relative ${compact ? 'h-40' : 'h-48'} w-full overflow-hidden bg-slate-100`}>
        {item.imageUrl && !imageError ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-400 p-4 text-center">
            {isLost ? (
              <HelpCircle className="w-10 h-10 text-rose-300 mb-1" />
            ) : (
              <CheckCircle className="w-10 h-10 text-emerald-300 mb-1" />
            )}
            <span className="text-xs font-semibold text-slate-500">No Photo Available</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          {isReturned ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-600/90 text-white backdrop-blur-md shadow-xs flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Returned &amp; Reunited
            </span>
          ) : isLost ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600/90 text-white backdrop-blur-md shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              Lost Item
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              Found Item
            </span>
          )}
        </div>

        {/* Verified & Reward Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
          {item.verified && (
            <span 
              className="p-1 rounded-full bg-blue-600 text-white shadow-md backdrop-blur-md" 
              title="Verified Campus Report"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          )}
          {item.reward && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-md flex items-center gap-1">
              <Gift className="w-3 h-3" />
              Reward
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Pill */}
          <div className="flex items-center gap-1 text-slate-400 text-xs font-medium mb-1.5">
            <Tag className="w-3 h-3 text-indigo-500" />
            <span className="text-indigo-600 font-semibold">{item.category}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-base sm:text-lg mb-2">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-3.5 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Location & Date */}
        <div className="pt-3 border-t border-slate-100 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{formatDate(item.date)}</span>
            </div>
            {item.claims && item.claims.length > 0 && (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {item.claims.length} claim{item.claims.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* View Details Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1">
            View Details
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            By {item.reportedBy?.name?.split(' ')[0] || 'Student'}
          </span>
        </div>
      </div>
    </div>
  );
};
