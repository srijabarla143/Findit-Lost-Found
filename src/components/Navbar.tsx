import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Search, 
  PlusCircle, 
  HelpCircle, 
  CheckCircle, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  FileText,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { 
    currentTab, 
    setCurrentTab, 
    items, 
    currentUser, 
    logout, 
    loginAsDemoUser 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const lostCount = items.filter(i => i.type === 'lost' && i.status === 'active').length;
  const foundCount = items.filter(i => i.type === 'found' && i.status === 'active').length;
  const myReportsCount = currentUser ? items.filter(i => i.reportedBy?.id === currentUser.id).length : 0;

  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  FindIt
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60 hidden sm:inline-block">
                  Campus
                </span>
              </div>
              <p className="text-xs text-slate-500 -mt-0.5 font-medium hidden xs:block">
                Lost &amp; Found Portal
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentTab === 'home'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('lost')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                currentTab === 'lost'
                  ? 'bg-rose-50 text-rose-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>Lost Items</span>
              <span className="px-1.5 py-0.2 text-xs font-bold rounded-full bg-rose-100 text-rose-700">
                {lostCount}
              </span>
            </button>
            <button
              onClick={() => navigateTo('found')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                currentTab === 'found'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>Found Items</span>
              <span className="px-1.5 py-0.2 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                {foundCount}
              </span>
            </button>
            <button
              onClick={() => navigateTo('search')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                currentTab === 'search'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search &amp; Filter</span>
            </button>
            {currentUser && (
              <button
                onClick={() => navigateTo('my-reports')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  currentTab === 'my-reports'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>My Reports</span>
                {myReportsCount > 0 && (
                  <span className="px-1.5 py-0.2 text-xs font-bold rounded-full bg-slate-200 text-slate-700">
                    {myReportsCount}
                  </span>
                )}
              </button>
            )}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => navigateTo('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                  currentTab === 'admin'
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Action CTAs & Profile */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Report Lost CTA */}
            <button
              onClick={() => navigateTo('report-lost')}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 active:scale-95 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <HelpCircle className="w-4 h-4 text-rose-500" />
              <span>Report Lost</span>
            </button>

            {/* Report Found CTA */}
            <button
              onClick={() => navigateTo('report-found')}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
            >
              <PlusCircle className="w-4 h-4 text-emerald-100" />
              <span>Report Found</span>
            </button>

            {/* Profile Dropdown / Login Button */}
            <div className="relative ml-1">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/70"
                    aria-label="User menu"
                  >
                    {currentUser.avatar ? (
                      <img 
                        src={currentUser.avatar} 
                        alt={currentUser.name} 
                        className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                        {currentUser.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-slate-700 max-w-[90px] truncate hidden xl:inline">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    {currentUser.role === 'admin' && (
                      <span className="w-2 h-2 rounded-full bg-purple-500" title="Admin"></span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            currentUser.role === 'admin' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {currentUser.role === 'admin' ? 'Campus Admin' : 'Student'}
                          </span>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => navigateTo('my-reports')}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span>My Reported Items</span>
                        </button>

                        {currentUser.role === 'admin' ? (
                          <button
                            onClick={() => navigateTo('admin')}
                            className="w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 font-medium flex items-center gap-2"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-500" />
                            <span>Admin Dashboard</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => loginAsDemoUser('admin')}
                            className="w-full text-left px-4 py-2 text-xs text-indigo-600 hover:bg-indigo-50 font-medium flex items-center gap-2"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Switch to Demo Admin</span>
                          </button>
                        )}

                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => loginAsDemoUser('student')}
                            className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 font-medium flex items-center gap-2"
                          >
                            <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                            <span>Switch to Student Alex</span>
                          </button>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenAuth}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => loginAsDemoUser('student')}
                    className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Demo Mode</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => navigateTo('search')}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => navigateTo('report-lost')}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-rose-500" />
              <span>Report Lost</span>
            </button>
            <button
              onClick={() => navigateTo('report-found')}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-600 text-white flex items-center justify-center gap-2 shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-emerald-100" />
              <span>Report Found</span>
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => navigateTo('home')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
                currentTab === 'home' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
              }`}
            >
              <span>Home</span>
            </button>
            <button
              onClick={() => navigateTo('lost')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
                currentTab === 'lost' ? 'bg-rose-50 text-rose-700' : 'text-slate-700'
              }`}
            >
              <span>Lost Items</span>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-100 text-rose-700">
                {lostCount}
              </span>
            </button>
            <button
              onClick={() => navigateTo('found')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
                currentTab === 'found' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
              }`}
            >
              <span>Found Items</span>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                {foundCount}
              </span>
            </button>
            <button
              onClick={() => navigateTo('search')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
                currentTab === 'search' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
              }`}
            >
              <span>Search &amp; Filter</span>
              <Search className="w-4 h-4 text-slate-400" />
            </button>
            {currentUser && (
              <button
                onClick={() => navigateTo('my-reports')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
                  currentTab === 'my-reports' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                }`}
              >
                <span>My Reports</span>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-200 text-slate-700">
                  {myReportsCount}
                </span>
              </button>
            )}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => navigateTo('admin')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2.5">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-lg object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                      {currentUser.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 capitalize">{currentUser.role}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Log In / Sign Up
                </button>
                <button
                  onClick={() => {
                    loginAsDemoUser('student');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200"
                >
                  Demo Student
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
