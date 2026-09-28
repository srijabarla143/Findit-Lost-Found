import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCard } from '../components/ItemCard';
import { Item, ItemType } from '../types';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../data/sampleData';
import { 
  Search, 
  Filter, 
  MapPin, 
  Tag, 
  Calendar, 
  RotateCcw, 
  Grid, 
  List, 
  HelpCircle, 
  PlusCircle, 
  ShieldCheck, 
  Gift,
  ArrowUpDown
} from 'lucide-react';

interface BrowsePageProps {
  initialType?: 'all' | 'lost' | 'found' | 'returned';
  onViewItem: (item: Item) => void;
}

export const BrowsePage: React.FC<BrowsePageProps> = ({ initialType = 'all', onViewItem }) => {
  const { items, searchFilter, setSearchFilter, setCurrentTab } = useApp();

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState(searchFilter.query);
  const [selectedCategory, setSelectedCategory] = useState(searchFilter.category);
  const [selectedLocation, setSelectedLocation] = useState(searchFilter.location);
  const [selectedType, setSelectedType] = useState<'all' | 'lost' | 'found' | 'returned'>(
    initialType !== 'all' ? initialType : searchFilter.type
  );
  const [selectedDate, setSelectedDate] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [rewardOnly, setRewardOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Type / Status filter
      if (selectedType === 'lost' && item.type !== 'lost') return false;
      if (selectedType === 'found' && item.type !== 'found') return false;
      if (selectedType === 'returned' && item.status !== 'returned') return false;

      // Text query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchLoc = item.location.toLowerCase().includes(query) || (item.specificLocation?.toLowerCase().includes(query) ?? false);
        const matchCat = item.category.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchLoc && !matchCat) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'all' && item.location !== selectedLocation) {
        return false;
      }

      // Date filter
      if (selectedDate && item.date !== selectedDate) {
        return false;
      }

      // Verified filter
      if (verifiedOnly && !item.verified) {
        return false;
      }

      // Reward filter
      if (rewardOnly && !item.reward) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [items, searchTerm, selectedCategory, selectedLocation, selectedType, selectedDate, sortBy, verifiedOnly, rewardOnly]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSelectedType(initialType);
    setSelectedDate('');
    setVerifiedOnly(false);
    setRewardOnly(false);
    setSearchFilter({
      query: '',
      category: 'all',
      location: 'all',
      type: initialType,
      dateRange: 'all'
    });
  };

  const getPageTitle = () => {
    if (selectedType === 'lost') return 'Lost Items on Campus';
    if (selectedType === 'found') return 'Found Items on Campus';
    if (selectedType === 'returned') return 'Reunited Belongings';
    return 'Search & Browse All Items';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Search className="w-4 h-4" />
            <span>Search &amp; Filter Database</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Filter by item name, campus building, category, date, or claim status
          </p>
        </div>

        {/* Quick Report CTAs */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('report-lost')}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm rounded-xl border border-rose-200 flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-rose-500" />
            <span>Report Lost</span>
          </button>
          <button
            onClick={() => setCurrentTab('report-found')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-emerald-100" />
            <span>Report Found</span>
          </button>
        </div>
      </div>

      {/* Filter Control Box */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
        
        {/* Main Search Bar & Status Tabs */}
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by item name, brand, color, or description (e.g., 'AirPods', 'Hydro Flask', 'Backpack')..."
              className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Segmented Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl shrink-0 overflow-x-auto">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setSelectedType('lost')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                selectedType === 'lost'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Lost</span>
            </button>
            <button
              onClick={() => setSelectedType('found')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                selectedType === 'found'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Found</span>
            </button>
            <button
              onClick={() => setSelectedType('returned')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                selectedType === 'returned'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Reunited</span>
            </button>
          </div>

        </div>

        {/* Detailed Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-indigo-500" />
              <span>Category</span>
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Location Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span>Campus Building / Area</span>
            </label>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">All Campus Locations</option>
              {CAMPUS_LOCATIONS.map(loc => (
                <option key={loc.id} value={loc.name}>{loc.name}</option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>Date Reported</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
              <span>Sort Order</span>
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

        </div>

        {/* Toggles & Reset Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={e => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Verified Reports Only
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rewardOnly}
                onChange={e => setRewardOnly(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
              />
              <span className="flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-amber-500" />
                Reward Offered Only
              </span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-600">
          Showing <span className="font-bold text-slate-900">{filteredItems.length}</span> item{filteredItems.length === 1 ? '' : 's'}
          {searchTerm && <span> matching "<strong>{searchTerm}</strong>"</span>}
        </p>
      </div>

      {/* Results Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} onViewDetails={onViewItem} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">No matching items found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              We couldn't find any reports matching your current filter criteria. Try clearing search filters or report a new item.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
            >
              Reset All Filters
            </button>
            <button
              onClick={() => setCurrentTab('report-lost')}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs"
            >
              Report Lost Item
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
