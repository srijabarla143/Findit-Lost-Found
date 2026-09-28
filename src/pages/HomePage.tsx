import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCard } from '../components/ItemCard';
import { Item } from '../types';
import { CATEGORIES } from '../data/sampleData';
import { 
  HelpCircle, 
  PlusCircle, 
  Search, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  HeartHandshake, 
  ArrowRight,
  Clock,
  Lock,
  MessageSquare
} from 'lucide-react';

interface HomePageProps {
  onViewItem: (item: Item) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onViewItem }) => {
  const { items, setCurrentTab, setSearchFilter } = useApp();
  const [activeRecentTab, setActiveRecentTab] = useState<'all' | 'lost' | 'found'>('all');

  const activeItems = items.filter(i => i.status !== 'resolved');
  const lostItems = items.filter(i => i.type === 'lost' && i.status === 'active');
  const foundItems = items.filter(i => i.type === 'found' && i.status === 'active');
  const returnedCount = items.filter(i => i.status === 'returned').length;

  const recentItems = items
    .filter(i => {
      if (activeRecentTab === 'lost') return i.type === 'lost';
      if (activeRecentTab === 'found') return i.type === 'found';
      return true;
    })
    .slice(0, 6);

  const handleCategoryClick = (category: string) => {
    setSearchFilter(prev => ({ ...prev, category }));
    setCurrentTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/90 via-white to-slate-50/50 pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-slate-200/80">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-300/20 via-emerald-300/15 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-200/80 shadow-xs text-xs font-bold text-indigo-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>FindIt • Campus &amp; Community Lost &amp; Found</span>
          </div>

          {/* Headline & Tagline */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Lost something? Found something?<br />
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-600 bg-clip-text text-transparent">
                Let's reunite it.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              The modern, safe lost-and-found hub for university students, faculty, and campus staff. Report missing belongings, match with finders, and claim what’s yours.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto pt-2">
            
            {/* Report Lost Button */}
            <button
              onClick={() => {
                setCurrentTab('report-lost');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-600/25 active:scale-95 transition-all flex items-center justify-center gap-2.5 group"
            >
              <HelpCircle className="w-5 h-5 text-rose-200 group-hover:rotate-12 transition-transform" />
              <span>Report Lost Item</span>
            </button>

            {/* Report Found Button */}
            <button
              onClick={() => {
                setCurrentTab('report-found');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2.5 group"
            >
              <PlusCircle className="w-5 h-5 text-emerald-200 group-hover:rotate-90 transition-transform" />
              <span>Report Found Item</span>
            </button>

            {/* Search Items Button */}
            <button
              onClick={() => {
                setCurrentTab('search');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200/90 font-bold text-sm sm:text-base shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <Search className="w-5 h-5 text-indigo-600" />
              <span>Search Items</span>
            </button>

          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-md">
              <div className="p-3 text-center border-r border-slate-100 last:border-r-0">
                <p className="text-2xl sm:text-3xl font-black text-slate-900">{items.length}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Total Reports</p>
              </div>
              <div className="p-3 text-center sm:border-r border-slate-100">
                <p className="text-2xl sm:text-3xl font-black text-rose-600">{lostItems.length}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Lost Items</p>
              </div>
              <div className="p-3 text-center border-r border-slate-100">
                <p className="text-2xl sm:text-3xl font-black text-emerald-600">{foundItems.length}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Found Items</p>
              </div>
              <div className="p-3 text-center">
                <p className="text-2xl sm:text-3xl font-black text-indigo-600">{returnedCount + 12}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Reunited Items 🎉</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Recently Reported Items Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              <span>Real-Time Campus Feed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Recently Reported Items
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              See what was just reported missing or picked up around campus
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit">
            <button
              onClick={() => setActiveRecentTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeRecentTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Recent ({items.length})
            </button>
            <button
              onClick={() => setActiveRecentTab('lost')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeRecentTab === 'lost'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost Only
            </button>
            <button
              onClick={() => setActiveRecentTab('found')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeRecentTab === 'found'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found Only
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentItems.map(item => (
            <ItemCard key={item.id} item={item} onViewDetails={onViewItem} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => {
              setCurrentTab('search');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm transition-colors border border-indigo-200/80"
          >
            <span>Explore All Campus Listings ({items.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Quick Category Browser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Browse by Item Category
          </h2>
          <p className="text-sm text-slate-600">
            Select a category to quickly filter through reported campus belongings
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          {CATEGORIES.map(category => {
            const count = items.filter(i => i.category === category).length;
            return (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 hover:border-indigo-300 text-slate-800 text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-sm flex items-center gap-2"
              >
                <span>{category}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* How FindIt Works (3 Simple Steps) */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-black text-slate-900">
              How FindIt Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Designed for college life: quick to post, easy to search, and secure to verify
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative group hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-black text-xl mb-6 shadow-inner">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Report in 60 Seconds</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Lost your water bottle or found AirPods in the library? Submit a quick report with photos, location, and date.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative group hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xl mb-6 shadow-inner">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Search &amp; Connect</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Filter by campus building, date, or category. Click "Claim Item" to message the finder and provide unique identifying proof.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative group hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl mb-6 shadow-inner">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Safe Campus Reunion</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Meet at an official campus drop zone (like the Student Union desk or Campus Security), verify the item, and mark it returned!
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Campus Safe Zones & Handover Spots */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Designated Campus Handover Zones
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Stay Safe: Meet at Official Campus Drop Desks
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Don’t want to meet an unfamiliar person in a private spot? Drop items off at the Student Union Information Desk or Campus Security office. They will store it in a locked locker until the owner verifies it.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" /> Student Union Room 102
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" /> Main Library Front Circulation
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" /> Mon–Fri 8am–8pm
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
