export type ItemType = 'lost' | 'found';
export type ItemStatus = 'active' | 'returned' | 'resolved';

export interface Claim {
  id: string;
  itemId: string;
  claimantId?: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone?: string;
  message: string;
  identifyingDetails?: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Item {
  id: string;
  title: string;
  type: ItemType;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  location: string;
  specificLocation?: string;
  imageUrl: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  preferredContact: 'email' | 'phone' | 'either';
  reward?: string;
  status: ItemStatus;
  verified: boolean;
  reportedBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  claims?: Claim[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'student' | 'staff' | 'admin';
  joinedDate: string;
  avatar?: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  building: string;
  zone: 'North Campus' | 'South Campus' | 'Central Quad' | 'West Campus' | 'East Campus';
}

export interface CategoryInfo {
  id: string;
  name: string;
  iconName: string;
}
