
import React, { useState, useEffect } from 'react';
import { Search, UserCheck, BookOpen, AlertTriangle, CheckCircle, ArrowRight, History, Package } from 'lucide-react';
import { Member, Book, Transaction } from '../types';
import { Language, translations } from '../utils/i18n';

interface CirculationProps {
  members: Member[];
  books: Book[];
  onBorrow: (memberId: string, bookId: string) => void;
  onReturn: (bookId: string) => void;
  language?: Language;
}

interface RecentAction {
  id: string;
  type: 'checkout' | 'checkin';
  title: string;
  detail: string;
  time: string;
}

const Circulation: React.FC<CirculationProps> = ({ members, books, onBorrow, onReturn, language = 'en' }) => {
  const [mode, setMode] = useState<'checkout' | 'checkin'>('checkout');
  const [memberId, setMemberId] = useState('');
  const [bookId, setBookId] = useState('');
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [recentActions, setRecentActions] = useState<RecentAction[]>([]);
  
  const t = translations[language];

  // Auto-clear feedback after 5 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const addRecentAction = (type: 'checkout' | 'checkin', title: string, detail: string) => {
    const action: RecentAction = {
      id: Date.now().toString(),
      type,
      title,
      detail,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRecentActions(prev => [action, ...prev].slice(0, 5));
  };

  const handleMemberSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find(m => m.id === memberId || m.email === memberId);
    if (member) {
      setCurrentMember(member);
      setFeedback(null);
    } else {
      setCurrentMember(null);
      setFeedback({ type: 'error', message: t.memberNotFound });
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember) {
      setFeedback({ type: 'error', message: t.identifyMemberFirst });
      return;
    }
    const book = books.find(b => b.id === bookId || b.isbn === bookId);
    if (!book) {
      setFeedback({ type: 'error', message: t.bookNotFound });
      return;
    }
    if (book.availableCopies <= 0) {
      setFeedback({ type: 'error', message: t.noAvailableCopies });
      return;
    }
    if (currentMember.currentBorrows >= currentMember.maxBorrows) {
      setFeedback({ type: 'error', message: `${t.limitReached} (${currentMember.maxBorrows}).` });
      return;
    }

    onBorrow(currentMember.id, book.id);
    addRecentAction('checkout', book.title, `${t.checkout}: ${currentMember.name}`);
    setFeedback({ type: 'success', message: `${t.checkoutSuccess} "${book.title}" -> ${currentMember.name}.` });
    setBookId('');
  };

  const handleCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    const book = books.find(b => b.id === bookId || b.isbn === bookId);
    if (!book) {
      setFeedback({ type: 'error', message: t.bookNotFound });
      return;
    }
    onReturn(book.id);
    addRecentAction('checkin', book.title, t.returnSuccess);
    setFeedback({ type: 'success', message: `"${book.title}" ${t.returnSuccess}.` });
    setBookId('');
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Main Control Panel */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex bg-slate-50 border-b">
              <button
                onClick={() => { setMode('checkout'); setFeedback(null); setBookId(''); }}
                className={`flex-1 py-6 flex items-center justify-center gap-2 font-bold transition-all ${
                  mode === 'checkout' ? 'bg-white text-blue-600 border-b-4 border-blue-600' : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                <Package className="w-5 h-5" />
                {t.checkout}
              </button>
              <button
                onClick={() => { setMode('checkin'); setFeedback(null); setBookId(''); setCurrentMember(null); }}
                className={`flex-1 py-6 flex items-center justify-center gap-2 font-bold transition-all ${
                  mode === 'checkin' ? 'bg-white text-green-600 border-b-4 border-green-600' : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                <RefreshCw className="w-5 h-5" />
                {t.checkin}
              </button>
            </div>

            <div className="p-6 md:p-10 space-y-8">
              {feedback && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top ${
                  feedback.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' :
                  feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' :
                  'bg-blue-50 text-blue-700 border border-blue-100'
                }`}>
                  {feedback.type === 'error' ? <AlertTriangle className="w-5 h-5 shrink-0"/> : <CheckCircle className="w-5 h-5 shrink-0"/>}
                  <span className="text-sm font-medium">{feedback.message}</span>
                </div>
              )}

              {mode === 'checkout' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">1</div>
                      <h3 className="text-lg font-bold text-slate-800">{t.identifyMember}</h3>
                    </div>
                    <form onSubmit={handleMemberSearch} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder={t.scanMemberId}
                          value={memberId}
                          onChange={(e) => setMemberId(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                          autoFocus
                        />
                        <UserCheck className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                      </div>
                      <button type="submit" className="bg-slate-800 text-white px-6 rounded-2xl font-bold hover:bg-slate-900 transition-all">{t.find}</button>
                    </form>

                    {currentMember ? (
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg animate-in zoom-in-95">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                            <UserCheck className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded uppercase tracking-wider">{currentMember.role}</span>
                        </div>
                        <h4 className="text-xl font-bold">{currentMember.name}</h4>
                        <p className="text-blue-100 text-sm mt-1">{currentMember.department}</p>
                        <div className="mt-6 pt-6 border-t border-white/10 flex justify-between">
                          <div>
                            <p className="text-blue-200 text-[10px] uppercase font-bold tracking-widest">{t.borrows}</p>
                            <p className="text-2xl font-bold">{currentMember.currentBorrows} <span className="text-sm font-normal opacity-60">/ {currentMember.maxBorrows}</span></p>
                          </div>
                          {currentMember.totalFinesDue > 0 && (
                            <div className="text-right">
                              <p className="text-red-200 text-[10px] uppercase font-bold tracking-widest">{t.fine}</p>
                              <p className="text-2xl font-bold">${currentMember.totalFinesDue.toFixed(2)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                         <UserCheck className="w-12 h-12 mb-4 opacity-20" />
                         <p className="text-sm font-medium">{t.identifyMemberFirst}</p>
                      </div>
                    )}
                  </div>

                  <div className={`space-y-6 transition-all duration-300 ${!currentMember ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">2</div>
                      <h3 className="text-lg font-bold text-slate-800">{t.scanItem}</h3>
                    </div>
                    <form onSubmit={handleCheckout} className="space-y-4">
                       <div className="relative">
                        <input
                          type="text"
                          placeholder={t.scanBookBarcode}
                          value={bookId}
                          onChange={(e) => setBookId(e.target.value)}
                          className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-lg font-medium"
                          disabled={!currentMember}
                        />
                        <BookOpen className="absolute left-3 top-5 text-slate-400 w-6 h-6" />
                      </div>
                      <button 
                        type="submit" 
                        disabled={!currentMember || !bookId}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-200 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                      >
                        {t.confirm} <ArrowRight className="w-5 h-5" />
                      </button>
                    </form>
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-orange-700 text-xs leading-relaxed">
                      <strong>Note:</strong> {t.scanningNote}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto space-y-8 py-10">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">{t.returnStation}</h3>
                      <p className="text-slate-500">{t.scanToReturn}</p>
                    </div>
                  </div>

                  <form onSubmit={handleCheckin} className="space-y-4 max-w-md mx-auto">
                     <div className="relative">
                        <input
                          type="text"
                          placeholder={t.scanBookBarcode}
                          value={bookId}
                          onChange={(e) => setBookId(e.target.value)}
                          className="w-full pl-12 pr-4 py-5 text-xl border-2 border-slate-200 rounded-3xl focus:border-green-500 outline-none shadow-sm transition-all"
                          autoFocus
                        />
                        <BookOpen className="absolute left-4 top-6 text-slate-400 w-6 h-6" />
                      </div>
                      <button type="submit" disabled={!bookId} className="w-full bg-green-600 text-white py-5 rounded-3xl font-bold hover:bg-green-700 shadow-xl shadow-green-100 disabled:bg-slate-200 disabled:shadow-none transition-all">
                        {t.processReturn}
                      </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity (Desktop Only) */}
        <div className="lg:w-80 shrink-0">
           <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <History className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-slate-800">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                {recentActions.length > 0 ? (
                  recentActions.map(action => (
                    <div key={action.id} className="relative pl-6 pb-4 border-l-2 border-slate-100 last:pb-0">
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${
                        action.type === 'checkout' ? 'bg-blue-500' : 'bg-green-500'
                      }`} />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{action.time}</p>
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1 mt-0.5">{action.title}</h4>
                      <p className="text-xs text-slate-500">{action.detail}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-slate-300">
                    <History className="w-10 h-10 mx-auto mb-2 opacity-10" />
                    <p className="text-xs">No activity yet</p>
                  </div>
                )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// Simple Refresh icon helper
const RefreshCw = ({className}: {className?: string}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);

export default Circulation;
