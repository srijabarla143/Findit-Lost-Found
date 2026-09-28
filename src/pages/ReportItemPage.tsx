import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ItemType, Item } from '../types';
import { CATEGORIES, CAMPUS_LOCATIONS, PRESET_IMAGE_SUGGESTIONS } from '../data/sampleData';
import { 
  HelpCircle, 
  PlusCircle, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle, 
  MapPin, 
  Tag, 
  Calendar, 
  Gift, 
  Mail, 
  Phone, 
  User as UserIcon, 
  Sparkles, 
  AlertCircle,
  Lock
} from 'lucide-react';

interface ReportItemPageProps {
  initialType?: ItemType;
  onItemCreated: (item: Item) => void;
}

export const ReportItemPage: React.FC<ReportItemPageProps> = ({ 
  initialType = 'lost', 
  onItemCreated 
}) => {
  const { currentUser, addItem, setCurrentTab } = useApp();

  const [type, setType] = useState<ItemType>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0].name);
  const [specificLocation, setSpecificLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [preferredContact, setPreferredContact] = useState<'email' | 'phone' | 'either'>('either');
  const [reward, setReward] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sync user profile when user changes
  useEffect(() => {
    if (currentUser) {
      if (!contactName) setContactName(currentUser.name);
      if (!contactEmail) setContactEmail(currentUser.email);
      if (!contactPhone && currentUser.phone) setContactPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPresetImage = (url: string) => {
    setImageUrl(url);
    setImagePreview(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !contactName.trim() || !contactEmail.trim()) {
      return;
    }

    setSubmitting(true);

    // Fallback default image based on category if empty
    let finalImageUrl = imageUrl;
    if (!finalImageUrl) {
      finalImageUrl = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80';
    }

    setTimeout(() => {
      const createdItem = addItem({
        title,
        type,
        category,
        description,
        date,
        location,
        specificLocation: specificLocation.trim() || undefined,
        imageUrl: finalImageUrl,
        contactName,
        contactEmail,
        contactPhone: contactPhone.trim() || undefined,
        preferredContact,
        reward: type === 'lost' && reward.trim() ? reward : undefined,
        verified: currentUser?.role === 'admin'
      });

      setSubmitting(false);
      onItemCreated(createdItem);
    }, 400);
  };

  const isLost = type === 'lost';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Title & Type Switcher */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {isLost ? 'Report a Lost Item' : 'Report a Found Item'}
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          {isLost 
            ? 'Fill out the details below so fellow students or campus staff can identify and return your missing belongings.' 
            : 'Thank you for being a good Samaritan! Submit the details so the rightful owner can locate and claim it.'}
        </p>

        {/* Tab Toggle */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 shadow-inner">
          <button
            type="button"
            onClick={() => setType('lost')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              isLost
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>I Lost an Item</span>
          </button>
          <button
            type="button"
            onClick={() => setType('found')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              !isLost
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>I Found an Item</span>
          </button>
        </div>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
        
        {/* Step 1: Item Information */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-indigo-600" />
              <span>1. Item Details</span>
            </h2>
            <p className="text-xs text-slate-500">Provide accurate information about the item</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Item Name / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={isLost ? "e.g. Blue North Face Borealis Backpack" : "e.g. White Apple AirPods Pro in Charging Case"}
              className="w-full px-4 py-3 text-sm sm:text-base rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Date {isLost ? 'Lost' : 'Found'} *</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={
                isLost
                  ? "Describe color, model, brand, stickers, contents inside, any identifying scratches or tags..."
                  : "Describe where it was found, general condition, color. (Tip: leave one private detail unmentioned for verification!)"
              }
              className="w-full px-4 py-3 text-sm rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {!isLost && (
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-900">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Pro Tip for Finders:</strong> Don't list everything in the public description! For example, don't mention what photo is on the phone lockscreen so the real owner can verify themselves when they claim it.
              </div>
            </div>
          )}

          {isLost && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-amber-500" />
                <span>Reward for Return (Optional)</span>
              </label>
              <input
                type="text"
                value={reward}
                onChange={e => setReward(e.target.value)}
                placeholder="e.g. $20 cash, Starbucks treat, or free lunch"
                className="w-full px-4 py-2.5 text-sm rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Step 2: Location Information */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <span>2. Campus Location</span>
            </h2>
            <p className="text-xs text-slate-500">Where was the item lost or discovered?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Campus Building / Zone *
              </label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {CAMPUS_LOCATIONS.map(loc => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name} ({loc.zone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Specific Room / Spot (Optional)
              </label>
              <input
                type="text"
                value={specificLocation}
                onChange={e => setSpecificLocation(e.target.value)}
                placeholder="e.g. 2nd floor desk #12, near elevator, lecture hall B"
                className="w-full px-4 py-3 text-sm rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Photo Upload / Image Selection */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
              <span>3. Item Image</span>
            </h2>
            <p className="text-xs text-slate-500">Upload a photo or pick a sample photo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* Upload Box */}
            <div className="md:col-span-2 space-y-3">
              <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/30">
                <Upload className="w-8 h-8 text-indigo-500 mb-2" />
                <span className="text-sm font-bold text-slate-800">Click to upload photo</span>
                <span className="text-xs text-slate-500 mt-0.5">PNG, JPG, WEBP up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Or Paste an Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Or select sample photo:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGE_SUGGESTIONS.map(preset => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => selectPresetImage(preset.url)}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors font-medium"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Image Preview Box */}
            <div className="w-full h-48 rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Item Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-xs font-semibold">Image preview will appear here</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Step 4: Contact Details */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-indigo-600" />
              <span>4. Contact Details</span>
            </h2>
            <p className="text-xs text-slate-500">How students or security can reach you</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Your Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Campus Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="alex.morgan@campus.edu"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  placeholder="(555) 234-5678"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Preferred Contact Method
              </label>
              <select
                value={preferredContact}
                onChange={e => setPreferredContact(e.target.value as 'email' | 'phone' | 'either')}
                className="w-full px-4 py-2.5 text-sm rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="either">Campus Email or Phone</option>
                <option value="email">Campus Email Only</option>
                <option value="phone">Phone / SMS Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            By submitting, you agree to our campus safety community standards.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setCurrentTab('home')}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-white font-bold text-sm sm:text-base shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${
                isLost
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
              }`}
            >
              {submitting ? (
                <span>Submitting Report...</span>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit {isLost ? 'Lost Item Report' : 'Found Item Report'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
