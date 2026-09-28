import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, ShieldCheck, MapPin, Phone, Clock, Heart, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentTab, loginAsDemoUser } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">FindIt</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              "Lost something? Found something? Let's reunite it."<br />
              FindIt is the official collegiate community lost-and-found hub connecting students, faculty, and campus staff quickly, securely, and transparently.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Campus Safe Network
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Award className="w-3.5 h-3.5" />
                100% Free for Students
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => { setCurrentTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('lost'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-rose-400 transition-colors"
                >
                  Browse Lost Items
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('found'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Browse Found Items
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('search'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Search with Filters
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('my-reports'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  My Reports &amp; Claims
                </button>
              </li>
            </ul>
          </div>

          {/* Action Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Report &amp; Admin</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => { setCurrentTab('report-lost'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-rose-400 hover:text-rose-300 font-medium transition-colors"
                >
                  + Report a Lost Item
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('report-found'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  + Report a Found Item
                </button>
              </li>
              <li>
                <button 
                  onClick={() => loginAsDemoUser('admin')}
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Security Admin Login
                </button>
              </li>
              <li>
                <button 
                  onClick={() => loginAsDemoUser('student')}
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Student Demo Login
                </button>
              </li>
            </ul>
          </div>

          {/* Campus Desk Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Campus Drop-off Desk</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Student Union Bldg, Room 102 (Campus Info &amp; Security Desk)</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Mon – Fri: 8:00 AM – 8:00 PM<br />Sat – Sun: 10:00 AM – 4:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Campus Helpline: (555) 019-LOST</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FindIt Campus Portal. Built for students, faculty &amp; community.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with care to reunite lost belongings</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
