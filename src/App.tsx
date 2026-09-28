/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { AIAssistantChat } from './components/AIAssistantChat';

// Pages
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { ReportItemPage } from './pages/ReportItemPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Item } from './types';

function MainApp() {
  const { 
    currentTab, 
    setCurrentTab, 
    items, 
    selectedItem, 
    setSelectedItem 
  } = useApp();

  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Check URL params for direct item link on initial render
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const itemId = params.get('item');
      if (itemId) {
        const found = items.find(i => i.id === itemId);
        if (found) {
          setSelectedItem(found);
        }
      }
    } catch (e) {
      console.error('URL params parsing error', e);
    }
  }, [items, setSelectedItem]);

  const handleViewItem = (item: Item) => {
    setSelectedItem(item);
  };

  const handleItemCreated = (item: Item) => {
    setSelectedItem(item);
    setCurrentTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Layer */}
      <ToastContainer />

      {/* Main Header / Navigation */}
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />

      {/* Dynamic Content Views */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage onViewItem={handleViewItem} />
        )}

        {currentTab === 'lost' && (
          <BrowsePage initialType="lost" onViewItem={handleViewItem} />
        )}

        {currentTab === 'found' && (
          <BrowsePage initialType="found" onViewItem={handleViewItem} />
        )}

        {currentTab === 'search' && (
          <BrowsePage initialType="all" onViewItem={handleViewItem} />
        )}

        {currentTab === 'report-lost' && (
          <ReportItemPage initialType="lost" onItemCreated={handleItemCreated} />
        )}

        {currentTab === 'report-found' && (
          <ReportItemPage initialType="found" onItemCreated={handleItemCreated} />
        )}

        {currentTab === 'my-reports' && (
          <MyReportsPage 
            onViewItem={handleViewItem} 
            onOpenAuth={() => setAuthModalOpen(true)} 
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardPage onViewItem={handleViewItem} />
        )}
      </main>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}

      {/* Login & Register Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />

      {/* Live AI Assistant Connected to n8n Webhook */}
      <AIAssistantChat />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
