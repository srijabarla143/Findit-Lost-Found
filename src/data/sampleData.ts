import { Item, User, CampusLocation } from '../types';

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  { id: 'loc-1', name: 'Main Library (William G. Davis)', building: 'Library Tower, Floors 1-5', zone: 'Central Quad' },
  { id: 'loc-2', name: 'Student Union Building (SUB)', building: 'Student Center, Ground & 1st Fl', zone: 'Central Quad' },
  { id: 'loc-3', name: 'Science & Engineering Hall (SEH)', building: 'SEH Complex Rooms 100-450', zone: 'North Campus' },
  { id: 'loc-4', name: 'University Dining Commons', building: 'Dining Hall & Patio Area', zone: 'South Campus' },
  { id: 'loc-5', name: 'Campus Recreation & Fitness Center', building: 'Gym, Courts & Locker Rooms', zone: 'West Campus' },
  { id: 'loc-6', name: 'Birch & Oak Residence Halls', building: 'Dorm Lobbies & Courtyard', zone: 'East Campus' },
  { id: 'loc-7', name: 'College Bus & Shuttle Stop #3', building: 'Transit Hub Loop', zone: 'South Campus' },
  { id: 'loc-8', name: 'Arts & Humanities Center', building: 'Hall 201 & Auditorium', zone: 'North Campus' },
  { id: 'loc-9', name: 'Campus Green / Central Quad', building: 'Open Lawns & Benches', zone: 'Central Quad' },
  { id: 'loc-10', name: 'University Bookstore & Café', building: 'Campus Store 1st Floor', zone: 'Central Quad' }
];

export const CATEGORIES = [
  'Electronics & Gadgets',
  'Student IDs & Cards',
  'Keys & Keychains',
  'Bags & Backpacks',
  'Water Bottles & Flasks',
  'Books & Notebooks',
  'Glasses & Eyewear',
  'Clothing & Outerwear',
  'Jewelry & Watches',
  'Other Items'
];

export const SAMPLE_USERS: User[] = [
  {
    id: 'user-alex',
    name: 'Alex Morgan',
    email: 'alex.morgan@campus.edu',
    phone: '(555) 234-5678',
    role: 'student',
    joinedDate: '2026-08-15',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-jordan',
    name: 'Jordan Lee',
    email: 'jordan.lee@campus.edu',
    phone: '(555) 876-5432',
    role: 'student',
    joinedDate: '2026-09-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-admin',
    name: 'Officer Sarah Davis',
    email: 'admin@findit.college',
    phone: '(555) 019-2834',
    role: 'admin',
    joinedDate: '2025-01-10',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

export const SAMPLE_ITEMS: Item[] = [
  {
    id: 'item-1',
    title: 'Apple AirPods Pro (2nd Gen) in White Case',
    type: 'found',
    category: 'Electronics & Gadgets',
    description: 'Found on a study desk on the 2nd floor of Main Library near the quiet cubicles. Case has a small holographic astronaut sticker on the back. Kept safe at the library front desk or contact me.',
    date: '2026-09-26',
    location: 'Main Library (William G. Davis)',
    specificLocation: '2nd Floor Quiet Area, Desk #42',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    contactName: 'Jordan Lee',
    contactEmail: 'jordan.lee@campus.edu',
    contactPhone: '(555) 876-5432',
    preferredContact: 'either',
    status: 'active',
    verified: true,
    reportedBy: {
      id: 'user-jordan',
      name: 'Jordan Lee',
      email: 'jordan.lee@campus.edu'
    },
    createdAt: '2026-09-26T14:30:00Z',
    claims: [
      {
        id: 'claim-1',
        itemId: 'item-1',
        claimantName: 'Chris Taylor',
        claimantEmail: 'chris.t@campus.edu',
        claimantPhone: '(555) 443-2211',
        message: 'Hi Jordan, I think those are mine! I studied there from 1pm to 3pm yesterday.',
        identifyingDetails: 'The name on Bluetooth is "Chris\'s Pods" and case has a faint scratch near charging port.',
        timestamp: '2026-09-26T16:10:00Z',
        status: 'pending'
      }
    ]
  },
  {
    id: 'item-2',
    title: 'Blue North Face Borealis Backpack',
    type: 'lost',
    category: 'Bags & Backpacks',
    description: 'Accidentally left under a booth table in the Student Union dining area during lunch rush. Contains my CS 101 notebook, silver water bottle, and charging cables. Urgent, please return!',
    date: '2026-09-27',
    location: 'Student Union Building (SUB)',
    specificLocation: 'Ground floor dining area booth near Panda Express',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    contactName: 'Alex Morgan',
    contactEmail: 'alex.morgan@campus.edu',
    contactPhone: '(555) 234-5678',
    preferredContact: 'phone',
    reward: '$25 gift card or free lunch',
    status: 'active',
    verified: true,
    reportedBy: {
      id: 'user-alex',
      name: 'Alex Morgan',
      email: 'alex.morgan@campus.edu'
    },
    createdAt: '2026-09-27T13:15:00Z',
    claims: []
  },
  {
    id: 'item-3',
    title: 'Official Campus Student ID - "Maya Chen"',
    type: 'found',
    category: 'Student IDs & Cards',
    description: 'Found on the ground outside the Recreation Center basketball courts. ID card has the student number ending in 8942 and a dining plan sticker.',
    date: '2026-09-27',
    location: 'Campus Recreation & Fitness Center',
    specificLocation: 'Court 2 spectator bleachers',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    contactName: 'Officer Sarah Davis',
    contactEmail: 'admin@findit.college',
    contactPhone: '(555) 019-2834',
    preferredContact: 'email',
    status: 'active',
    verified: true,
    reportedBy: {
      id: 'user-admin',
      name: 'Officer Sarah Davis',
      email: 'admin@findit.college'
    },
    createdAt: '2026-09-27T10:00:00Z',
    claims: []
  },
  {
    id: 'item-4',
    title: 'TI-84 Plus CE Graphing Calculator (Rose Gold / Pink)',
    type: 'lost',
    category: 'Electronics & Gadgets',
    description: 'Lost right after Calculus II midterm in Science & Engineering Hall. Has my initials "M.K." in silver sharpie inside the sliding cover.',
    date: '2026-09-25',
    location: 'Science & Engineering Hall (SEH)',
    specificLocation: 'Room 210, 3rd row center',
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80',
    contactName: 'Maya Kapoor',
    contactEmail: 'm.kapoor@campus.edu',
    contactPhone: '(555) 912-3344',
    preferredContact: 'either',
    reward: '$15 coffee treat',
    status: 'active',
    verified: true,
    reportedBy: {
      id: 'user-maya',
      name: 'Maya Kapoor',
      email: 'm.kapoor@campus.edu'
    },
    createdAt: '2026-09-25T17:40:00Z',
    claims: []
  },
  {
    id: 'item-5',
    title: 'Dorm Room Keyring with Spider-Man Lanyard',
    type: 'found',
    category: 'Keys & Keychains',
    description: 'Found on the pathway between Birch Hall and Oak Hall. Has two brass door keys, a black RFID fob tag, and a red Marvel lanyard.',
    date: '2026-09-27',
    location: 'Birch & Oak Residence Halls',
    specificLocation: 'Pathway bench outside Birch Hall entrance',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
    contactName: 'Alex Morgan',
    contactEmail: 'alex.morgan@campus.edu',
    contactPhone: '(555) 234-5678',
    preferredContact: 'email',
    status: 'active',
    verified: true,
    reportedBy: {
      id: 'user-alex',
      name: 'Alex Morgan',
      email: 'alex.morgan@campus.edu'
    },
    createdAt: '2026-09-27T08:20:00Z',
    claims: []
  },
  {
    id: 'item-6',
    title: 'Hydro Flask 32oz Wide Mouth (Olive Green)',
    type: 'lost',
    category: 'Water Bottles & Flasks',
    description: 'Lost at the campus coffee shop. Bottle is olive green with several National Park stickers (Yosemite, Grand Canyon) and a boot protector on the bottom.',
    date: '2026-09-26',
    location: 'University Bookstore & Café',
    specificLocation: 'Corner sofa lounge',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    contactName: 'Liam Chen',
    contactEmail: 'l.chen@campus.edu',
    preferredContact: 'email',
    status: 'active',
    verified: false,
    reportedBy: {
      id: 'user-liam',
      name: 'Liam Chen',
      email: 'l.chen@campus.edu'
    },
    createdAt: '2026-09-26T19:00:00Z',
    claims: []
  },
  {
    id: 'item-7',
    title: 'Tortoiseshell Ray-Ban Prescription Glasses',
    type: 'found',
    category: 'Glasses & Eyewear',
    description: 'Found inside a brown leather case on the seat at Lecture Hall B. Brand is Ray-Ban with gold hinge accents.',
    date: '2026-09-25',
    location: 'Arts & Humanities Center',
    specificLocation: 'Lecture Hall B, Row F Seat 12',
    imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop&q=80',
    contactName: 'Officer Sarah Davis',
    contactEmail: 'admin@findit.college',
    contactPhone: '(555) 019-2834',
    preferredContact: 'phone',
    status: 'active',
    verified: true,
    reportedBy: {
      id: 'user-admin',
      name: 'Officer Sarah Davis',
      email: 'admin@findit.college'
    },
    createdAt: '2026-09-25T11:30:00Z',
    claims: []
  },
  {
    id: 'item-8',
    title: 'Space Gray MacBook Air M2 in Felt Sleeve',
    type: 'found',
    category: 'Electronics & Gadgets',
    description: 'Left on the high table at University Dining Commons. Successfully claimed and reunited with student David on Sept 26!',
    date: '2026-09-24',
    location: 'University Dining Commons',
    specificLocation: 'High-top bar area near smoothie counter',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    contactName: 'Jordan Lee',
    contactEmail: 'jordan.lee@campus.edu',
    preferredContact: 'email',
    status: 'returned',
    verified: true,
    reportedBy: {
      id: 'user-jordan',
      name: 'Jordan Lee',
      email: 'jordan.lee@campus.edu'
    },
    createdAt: '2026-09-24T15:20:00Z',
    claims: []
  },
  {
    id: 'item-9',
    title: 'Navy Blue Windproof Travel Umbrella',
    type: 'found',
    category: 'Other Items',
    description: 'Left on the bench at the campus shuttle loop during Tuesday morning rain. Automatic push button handle.',
    date: '2026-09-26',
    location: 'College Bus & Shuttle Stop #3',
    specificLocation: 'Sheltered bench near stop sign',
    imageUrl: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&auto=format&fit=crop&q=80',
    contactName: 'Alex Morgan',
    contactEmail: 'alex.morgan@campus.edu',
    preferredContact: 'email',
    status: 'active',
    verified: true,
    reportedBy: {
      id: 'user-alex',
      name: 'Alex Morgan',
      email: 'alex.morgan@campus.edu'
    },
    createdAt: '2026-09-26T09:10:00Z',
    claims: []
  },
  {
    id: 'item-10',
    title: 'Organic Chemistry II Spiral Notebook & Flashcards',
    type: 'lost',
    category: 'Books & Notebooks',
    description: 'Purple 5-subject spiral notebook with handwritten rxn mechanisms and ringed flashcards. Has exam notes for this Friday!',
    date: '2026-09-27',
    location: 'Main Library (William G. Davis)',
    specificLocation: '1st Floor collaborative group table #6',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    contactName: 'Emily Watson',
    contactEmail: 'e.watson@campus.edu',
    contactPhone: '(555) 667-8899',
    preferredContact: 'either',
    reward: 'Free Starbucks drinks for a week',
    status: 'active',
    verified: true,
    reportedBy: {
      id: 'user-emily',
      name: 'Emily Watson',
      email: 'e.watson@campus.edu'
    },
    createdAt: '2026-09-27T16:00:00Z',
    claims: []
  }
];

export const PRESET_IMAGE_SUGGESTIONS = [
  { name: 'AirPods / Earbuds', url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80' },
  { name: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80' },
  { name: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80' },
  { name: 'Keys / Keychain', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80' },
  { name: 'Laptop / Tablet', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80' },
  { name: 'Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80' },
  { name: 'Eyeglasses', url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop&q=80' },
  { name: 'Wallet / Cards', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80' },
  { name: 'Phone', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80' },
  { name: 'Hoodie / Jacket', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80' }
];
