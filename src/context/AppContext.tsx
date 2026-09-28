import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, User, Claim, ItemStatus } from '../types';
import { SAMPLE_ITEMS, SAMPLE_USERS } from '../data/sampleData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

interface AppContextType {
  items: Item[];
  currentUser: User | null;
  currentTab: string;
  selectedItem: Item | null;
  searchFilter: {
    query: string;
    category: string;
    location: string;
    type: 'all' | 'lost' | 'found' | 'returned';
    dateRange: string;
  };
  toasts: Toast[];
  setCurrentTab: (tab: string) => void;
  setSelectedItem: (item: Item | null) => void;
  setSearchFilter: React.Dispatch<React.SetStateAction<{
    query: string;
    category: string;
    location: string;
    type: 'all' | 'lost' | 'found' | 'returned';
    dateRange: string;
  }>>;
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'status' | 'claims' | 'reportedBy'>) => Item;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  markAsStatus: (id: string, status: ItemStatus) => void;
  toggleVerifyItem: (id: string) => void;
  submitClaim: (itemId: string, claimData: Omit<Claim, 'id' | 'itemId' | 'timestamp' | 'status'>) => void;
  updateClaimStatus: (itemId: string, claimId: string, status: 'accepted' | 'rejected') => void;
  login: (email: string, password?: string) => boolean;
  register: (name: string, email: string, password: string, phone?: string) => User;
  logout: () => void;
  loginAsDemoUser: (role: 'student' | 'admin') => void;
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ITEMS: 'findit_items_v1',
  USER: 'findit_current_user_v1',
  USERS_LIST: 'findit_all_users_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load items from storage', e);
    }
    return SAMPLE_ITEMS;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load users list from storage', e);
    }
    return SAMPLE_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load user from storage', e);
    }
    // Default to student Alex Morgan so new visitors immediately can try user features
    return SAMPLE_USERS[0];
  });

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const [searchFilter, setSearchFilter] = useState<{
    query: string;
    category: string;
    location: string;
    type: 'all' | 'lost' | 'found' | 'returned';
    dateRange: string;
  }>({
    query: '',
    category: 'all',
    location: 'all',
    type: 'all',
    dateRange: 'all'
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Could not save items', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error('Could not save user', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(allUsers));
    } catch (e) {
      console.error('Could not save users list', e);
    }
  }, [allUsers]);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addItem = (itemData: Omit<Item, 'id' | 'createdAt' | 'status' | 'claims' | 'reportedBy'>): Item => {
    const userToRecord = currentUser || {
      id: 'guest-' + Date.now(),
      name: itemData.contactName || 'Anonymous Student',
      email: itemData.contactEmail || 'anonymous@campus.edu'
    };

    const newItem: Item = {
      ...itemData,
      id: 'item-' + Date.now(),
      status: 'active',
      verified: currentUser?.role === 'admin',
      reportedBy: {
        id: userToRecord.id,
        name: userToRecord.name,
        email: userToRecord.email
      },
      createdAt: new Date().toISOString(),
      claims: []
    };

    setItems(prev => [newItem, ...prev]);
    showToast(`Successfully reported ${newItem.type === 'lost' ? 'lost' : 'found'} item!`, 'success');
    return newItem;
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        if (selectedItem?.id === id) {
          setSelectedItem(updated);
        }
        return updated;
      }
      return item;
    }));
    showToast('Report updated successfully', 'success');
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
    showToast('Report removed', 'info');
  };

  const markAsStatus = (id: string, status: ItemStatus) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, status };
        if (selectedItem?.id === id) {
          setSelectedItem(updated);
        }
        return updated;
      }
      return item;
    }));
    showToast(status === 'returned' ? 'Item marked as Returned & Reunited! 🎉' : `Status updated to ${status}`, 'success');
  };

  const toggleVerifyItem = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, verified: !item.verified };
        if (selectedItem?.id === id) {
          setSelectedItem(updated);
        }
        return updated;
      }
      return item;
    }));
    showToast('Verification status updated', 'info');
  };

  const submitClaim = (itemId: string, claimData: Omit<Claim, 'id' | 'itemId' | 'timestamp' | 'status'>) => {
    const newClaim: Claim = {
      ...claimData,
      id: 'claim-' + Date.now(),
      itemId,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updated = {
          ...item,
          claims: [...(item.claims || []), newClaim]
        };
        if (selectedItem?.id === itemId) {
          setSelectedItem(updated);
        }
        return updated;
      }
      return item;
    }));

    showToast('Your claim and message have been sent to the reporter!', 'success');
  };

  const updateClaimStatus = (itemId: string, claimId: string, status: 'accepted' | 'rejected') => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId && item.claims) {
        const updatedClaims = item.claims.map(c => c.id === claimId ? { ...c, status } : c);
        const updated = { ...item, claims: updatedClaims };
        if (selectedItem?.id === itemId) {
          setSelectedItem(updated);
        }
        return updated;
      }
      return item;
    }));
    showToast(`Claim marked as ${status}`, status === 'accepted' ? 'success' : 'info');
  };

  const login = (email: string, _password?: string): boolean => {
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      showToast(`Welcome back, ${found.name}!`, 'success');
      return true;
    }
    // If not found, create a student profile
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: email.split('@')[0].replace('.', ' '),
      email,
      role: email.includes('admin') ? 'admin' : 'student',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Welcome to FindIt, ${newUser.name}!`, 'success');
    return true;
  };

  const register = (name: string, email: string, _password: string, phone?: string): User => {
    const newUser: User = {
      id: 'user-' + Date.now(),
      name,
      email,
      phone,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'student',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Account registered successfully. Welcome, ${name}!`, 'success');
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('You have signed out.', 'info');
  };

  const loginAsDemoUser = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      const admin = SAMPLE_USERS.find(u => u.role === 'admin') || SAMPLE_USERS[2];
      setCurrentUser(admin);
      showToast('Logged in as Campus Security / Admin (Officer Sarah Davis)', 'success');
    } else {
      const student = SAMPLE_USERS[0];
      setCurrentUser(student);
      showToast('Logged in as Student (Alex Morgan)', 'success');
    }
  };

  const resetAllData = () => {
    setItems(SAMPLE_ITEMS);
    setAllUsers(SAMPLE_USERS);
    setCurrentUser(SAMPLE_USERS[0]);
    showToast('Reset to original sample data', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        items,
        currentUser,
        currentTab,
        selectedItem,
        searchFilter,
        toasts,
        setCurrentTab,
        setSelectedItem,
        setSearchFilter,
        addItem,
        updateItem,
        deleteItem,
        markAsStatus,
        toggleVerifyItem,
        submitClaim,
        updateClaimStatus,
        login,
        register,
        logout,
        loginAsDemoUser,
        showToast,
        removeToast,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
