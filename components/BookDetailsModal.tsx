
import React from 'react';
import { X, Book, MapPin, Tag, BarChart3, History, Calendar, User, Info, BookmarkPlus, CheckCircle } from 'lucide-react';
import { Book as BookType, Transaction, UserSession } from '../types';
import { Language, translations } from '../utils/i18n';

interface BookDetailsModalProps {
  book: BookType;
  history: Transaction[];
  language: Language;
  user: UserSession;
  isReserved?: boolean;
  onReserve: (bookId: string) => void;
  onClose: () => void;
}

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ book, history, language, user, isReserved, onReserve, onClose }) => {
  const t = translations[language];
  const totalBorrowed = history.length;
  const currentOut = book.totalCopies - book.availableCopies;
  const canReserve = book.availableCopies === 0 && user.role === 'member';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="md:w-1/3 bg-slate-50 border-r border-slate-100 p-6 flex flex-col items-center shrink-0">
          <div className="relative mb-6">
            <img src={book.coverUrl || 'https://via.placeholder.com/200x300?text=No+Cover'} alt={book.title} className="w-40 md:w-48 aspect-[2/3] object-cover rounded-xl shadow-lg border-4 border-white" />
            <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-bold shadow-md ${book.availableCopies > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {book.availableCopies > 0 ? t.available : t.onLoan}
            </div>
          </div>

          <div className="w-full space-y-3 mb-6">
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between"><div className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-500" /><span className="text-xs font-medium text-slate-500">{t.totalCopies}</span></div><span className="font-bold text-slate-800">{book.totalCopies}</span></div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between"><div className="flex items-center gap-2"><History className="w-4 h-4 text-purple-500" /><span className="text-xs font-medium text-slate-500">{t.totalBorrowedTimes}</span></div><span className="font-bold text-slate-800">{totalBorrowed}</span></div>
          </div>

          {canReserve && (
             <button 
               disabled={isReserved}
               onClick={() => onReserve(book.id)}
               className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                 isReserved ? 'bg-orange-100 text-orange-600' : 'bg-orange-500 text-white hover:bg-orange-600'
               }`}
             >
               {isReserved ? <CheckCircle className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />}
               {isReserved ? t.alreadyReserved : t.reserve}
             </button>
          )}
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-start">
            <div className="min-w-0"><h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">{book.title}</h2><p className="text-slate-500 font-medium">{book.author}</p></div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X className="w-6 h-6" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t.category}</span><div className="flex items-center gap-2 text-sm text-slate-700"><Tag className="w-4 h-4 text-slate-400" /> {book.category}</div></div>
              <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t.location}</span><div className="flex items-center gap-2 text-sm text-slate-700"><MapPin className="w-4 h-4 text-slate-400" /> {book.location}</div></div>
              <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">ISBN</span><div className="flex items-center gap-2 text-sm font-mono text-slate-700">{book.isbn}</div></div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4"><History className="w-5 h-5 text-indigo-500" />{t.borrowHistory}</h3>
              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((tx) => (
                    <div key={tx.id} className="bg-white border border-slate-100 p-4 md:grid md:grid-cols-4 md:items-center hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><User className="w-4 h-4" /></div><span className="font-medium text-slate-800 text-sm truncate">{tx.memberName}</span></div>
                      <div className="text-xs text-slate-600"><span className="md:hidden font-bold">OUT: </span>{tx.checkoutDate}</div>
                      <div className="text-xs text-slate-600"><span className="md:hidden font-bold">IN: </span>{tx.returnDate || '-'}</div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter w-fit ${tx.status === 'Open' ? 'bg-blue-100 text-blue-700' : tx.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{tx.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200"><p className="text-slate-400 text-sm">{t.noHistory}</p></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;
