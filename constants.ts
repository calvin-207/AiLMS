// Fixed import error by removing non-existent BookCopy and unused BookStatus
import { Book, Member, MemberRole, MemberStatus, Transaction } from './types';

export const MOCK_BOOKS: Book[] = [
  {
    id: 'b1',
    isbn: '978-0134685991',
    title: 'Effective Java',
    author: 'Joshua Bloch',
    publisher: 'Addison-Wesley',
    publishYear: 2018,
    category: 'Computer Science',
    location: '2F-CS-01',
    price: 45.00,
    totalCopies: 5,
    availableCopies: 3,
    coverUrl: 'https://picsum.photos/200/300?random=1'
  },
  {
    id: 'b2',
    isbn: '978-0262033848',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    publisher: 'MIT Press',
    publishYear: 2009,
    category: 'Computer Science',
    location: '2F-CS-02',
    price: 90.00,
    totalCopies: 3,
    availableCopies: 1,
    coverUrl: 'https://picsum.photos/200/300?random=2'
  },
  {
    id: 'b3',
    isbn: '978-1400079988',
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    publisher: 'Vintage',
    publishYear: 1869,
    category: 'Literature',
    location: '1F-LIT-05',
    price: 20.00,
    totalCopies: 2,
    availableCopies: 2,
    coverUrl: 'https://picsum.photos/200/300?random=3'
  },
  {
    id: 'b4',
    isbn: '978-0062316097',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    publisher: 'Harper',
    publishYear: 2015,
    category: 'History',
    location: '3F-HIS-12',
    price: 35.00,
    totalCopies: 8,
    availableCopies: 6,
    coverUrl: 'https://picsum.photos/200/300?random=4'
  }
];

export const MOCK_MEMBERS: Member[] = [
  {
    id: 'S2023001',
    name: 'Alice Johnson',
    role: MemberRole.STUDENT,
    department: 'Computer Science',
    email: 'alice.j@uni.edu',
    status: MemberStatus.ACTIVE,
    joinDate: '2023-09-01',
    currentBorrows: 2,
    maxBorrows: 5,
    totalFinesDue: 0
  },
  {
    id: 'T2010055',
    name: 'Dr. Robert Smith',
    role: MemberRole.TEACHER,
    department: 'History',
    email: 'r.smith@uni.edu',
    status: MemberStatus.ACTIVE,
    joinDate: '2010-08-15',
    currentBorrows: 1,
    maxBorrows: 20,
    totalFinesDue: 0
  },
  {
    id: 'S2023045',
    name: 'Michael Brown',
    role: MemberRole.STUDENT,
    department: 'Physics',
    email: 'mike.b@uni.edu',
    status: MemberStatus.SUSPENDED,
    joinDate: '2023-09-01',
    currentBorrows: 1,
    maxBorrows: 5,
    totalFinesDue: 15.50
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1001',
    bookCopyId: 'b2_c1',
    bookTitle: 'Introduction to Algorithms',
    memberId: 'S2023001',
    memberName: 'Alice Johnson',
    checkoutDate: '2023-10-01',
    dueDate: '2023-10-15',
    returnDate: '2023-10-14',
    status: 'Closed'
  },
  {
    id: 'tx_1002',
    bookCopyId: 'b1_c1',
    bookTitle: 'Effective Java',
    memberId: 'S2023001',
    memberName: 'Alice Johnson',
    checkoutDate: '2023-10-20',
    dueDate: '2023-11-03',
    status: 'Open'
  },
  {
    id: 'tx_1003',
    bookCopyId: 'b4_c2',
    bookTitle: 'Sapiens',
    memberId: 'S2023045',
    memberName: 'Michael Brown',
    checkoutDate: '2023-09-01',
    dueDate: '2023-09-15',
    status: 'Overdue',
    fineAmount: 15.50
  }
];