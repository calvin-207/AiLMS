import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BookManager from './components/BookManager';
import Circulation from './components/Circulation';
import AIAssistant from './components/AIAssistant';
import Settings from './components/Settings';
import MemberManager from './components/MemberManager';
import AdminManager from './components/AdminManager';
import TransactionHistory from './components/TransactionHistory';
import BookDetailsModal from './components/BookDetailsModal';
import NotificationCenter from './components/NotificationCenter';
import Login from './components/Login';
import { MOCK_BOOKS, MOCK_MEMBERS, MOCK_TRANSACTIONS } from './constants';
import { Book, Member, Transaction, UserSession, Notification, Reservation } from './types';
import { Search, Menu, Book as BookIcon, Bell } from 'lucide-react';
import { Language, translations } from './utils/i18n';

const App: React.FC = () => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState('search'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Data
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // UI State
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Settings
  const [libraryName, setLibraryName] = useState("LibraTech LMS");
  const [logoUrl, setLogoUrl] = useState("");
  const [language, setLanguage] = useState<Language>('en');
  
  const t = translations[language];

  useEffect(() => {
    document.title = libraryName;
  }, [libraryName]);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') setActiveTab('dashboard');
      else setActiveTab('search');
    }
  }, [user]);

  const addNotification = (title: string, message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    const newNote: Notification = {
      id: `n${Date.now()}`,
      userId: user?.id || 'system',
      title,
      message,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      type
    };
    setNotifications(prev => [newNote, ...prev]);
  };

  const handleBorrow = (memberId: string, bookId: string) => {
    const book = books.find(b => b.id === bookId || b.isbn === bookId);
    const member = members.find(m => m.id === memberId);
    if (!book || !member) return;

    const newTx: Transaction = {
      id: `TX${Date.now()}`,
      bookCopyId: `${book.id}_copy`,
      bookTitle: book.title,
      memberId: member.id,
      memberName: member.name,
      checkoutDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Open'
    };

    setTransactions(prev => [newTx, ...prev]);
    setBooks(prev => prev.map(b => b.id === book.id ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b));
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, currentBorrows: m.currentBorrows + 1 } : m));
    
    addNotification(t.newNotification, `${t.checkoutSuccess} ${book.title}`, 'success');
  };

  const handleReturn = (bookId: string) => {
    const bookToReturn = books.find(b => b.id === bookId || b.isbn === bookId);
    if (!bookToReturn) return;
    
    // Find the latest open transaction for this book title or member (simplified for mock)
    // Ideally, we'd use a unique barcode for each physical copy
    const tx = transactions.find(t => t.bookTitle === bookToReturn.title && t.status !== 'Closed');
    
    if (tx) {
        setTransactions(prev => prev.map(t => t.id === tx.id ? { ...t, status: 'Closed', returnDate: new Date().toISOString().split('T')[0] } : t));
        setBooks(prev => prev.map(b => b.id === bookToReturn.id ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) } : b));
        setMembers(prev => prev.map(m => m.id === tx.memberId ? { ...m, currentBorrows: Math.max(0, m.currentBorrows - 1) } : m));
        addNotification(t.newNotification, `${bookToReturn.title} ${t.returnSuccess}`, 'success');
    } else {
        addNotification("Notice", t.bookNotFound, "warning");
    }
  };

  const handleReserve = (bookId: string) => {
    if (!user) return;
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const newRes: Reservation = {
      id: `r${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      memberId: user.id,
      memberName: user.name,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setReservations(prev => [...prev, newRes]);
    addNotification(t.newNotification, `${t.reserveSuccess}: ${book.title}`, 'success');
  };

  const handleRegister = (member: Member) => {
    setMembers(prev => [...prev, member]);
  };

  const renderContent = () => {
    const isAdmin = user?.role === 'admin';

    switch (activeTab) {
      case 'dashboard': return isAdmin ? <Dashboard books={books} members={members} transactions={transactions} language={language} /> : null;
      case 'books': return isAdmin ? <BookManager books={books} onAddBook={b => setBooks(prev => [...prev, b])} language={language} /> : null;
      case 'members': return isAdmin ? <MemberManager members={members} onAddMember={handleRegister} language={language} /> : null;
      case 'admins': return isAdmin ? <AdminManager language={language} /> : null;
      case 'circulation': return isAdmin ? <Circulation members={members} books={books} onBorrow={handleBorrow} onReturn={handleReturn} language={language} /> : null;
      case 'history': return <TransactionHistory transactions={isAdmin ? transactions : transactions.filter(t => t.memberId === user?.id)} language={language} />;
      case 'settings': return isAdmin ? <Settings libraryName={libraryName} setLibraryName={setLibraryName} logoUrl={logoUrl} setLogoUrl={setLogoUrl} language={language} setLanguage={setLanguage} /> : null;
      case 'ai-help': return <AIAssistant books={books} language={language} />;
      case 'search':
        return (
            <div className="p-4 md:p-8">
                <div className="bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-slate-200 text-center space-y-6 max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-slate-800">{libraryName} {t.publicCatalog}</h1>
                     <div className="relative max-w-2xl mx-auto">
                        <input type="text" placeholder={t.searchCatalogPlaceholder} className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-full shadow-sm focus:ring-4 focus:ring-blue-100 outline-none text-lg" />
                        <Search className="absolute left-4 top-5 text-slate-400 w-6 h-6" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left mt-8">
                        {books.map(b => (
                            <div key={b.id} onClick={() => setSelectedBook(b)} className="border border-slate-100 p-4 rounded-2xl flex space-x-4 bg-white hover:border-blue-300 hover:shadow-xl transition-all cursor-pointer group">
                                <img src={b.coverUrl} className="w-16 h-24 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform" alt="cover"/>
                                <div className="min-w-0 flex flex-col justify-between">
                                    <div><h4 className="font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{b.title}</h4><p className="text-sm text-slate-500 truncate">{b.author}</p></div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter w-fit ${b.availableCopies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{b.availableCopies > 0 ? t.available : t.onLoan}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
      default: return null;
    }
  };

  if (!user) {
    return (
      <Login 
        members={members}
        onLogin={setUser}
        onRegister={handleRegister}
        language={language}
        setLanguage={setLanguage}
        libraryName={libraryName}
        logoUrl={logoUrl}
      />
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex min-h-screen bg-[#f3f4f6] relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} libraryName={libraryName} logoUrl={logoUrl} language={language} user={user} onLogout={() => setUser(null)} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300 w-full min-w-0">
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center space-x-3">
             <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"><Menu className="w-6 h-6" /></button>
             <span className="font-bold text-slate-800 truncate md:text-xl">{libraryName}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowNotifications(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-pulse">{unreadCount}</span>}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden min-h-0">{renderContent()}</main>
      </div>

      {showNotifications && (
        <NotificationCenter 
          notifications={notifications} 
          onClose={() => setShowNotifications(false)} 
          onRead={id => setNotifications(prev => prev.map(n => n.id === id ? {...n, isRead: true} : n))}
          onReadAll={() => setNotifications(prev => prev.map(n => ({...n, isRead: true})))}
          language={language} 
        />
      )}

      {selectedBook && (
        <BookDetailsModal 
          book={selectedBook}
          history={transactions.filter(tx => tx.bookTitle === selectedBook.title)}
          language={language}
          user={user}
          isReserved={reservations.some(r => r.bookId === selectedBook.id && r.memberId === user.id)}
          onReserve={handleReserve}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

export default App;