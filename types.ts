
export enum BookStatus {
  AVAILABLE = 'Available',
  BORROWED = 'Borrowed',
  LOST = 'Lost',
  MAINTENANCE = 'Maintenance',
  RESERVED = 'Reserved'
}

export enum MemberRole {
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  STAFF = 'Staff'
}

export enum MemberStatus {
  ACTIVE = 'Active',
  SUSPENDED = 'Suspended',
  EXPIRED = 'Expired'
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  category: string;
  location: string;
  price: number;
  totalCopies: number;
  availableCopies: number;
  coverUrl?: string;
}

export interface Member {
  id: string;
  name: string;
  role: MemberRole;
  department: string;
  email: string;
  status: MemberStatus;
  joinDate: string;
  currentBorrows: number;
  maxBorrows: number;
  totalFinesDue: number;
}

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  requestDate: string;
  status: 'Pending' | 'Fulfilled' | 'Cancelled';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success';
}

export interface Transaction {
  id: string;
  bookCopyId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  checkoutDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Open' | 'Closed' | 'Overdue';
  fineAmount?: number;
}

export interface UserSession {
  id: string;
  name: string;
  role: 'admin' | 'member';
  memberDetails?: Member;
}
