import React, { useState } from 'react';
import { Search, Filter, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Transaction } from '../types';
import { Language, translations } from '../utils/i18n';

interface TransactionHistoryProps {
  transactions: Transaction[];
  language: Language;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, language }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const t = translations[language];

  const filtered = transactions.filter(tx => 
    tx.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Open': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center w-fit gap-1 font-medium"><Clock className="w-3 h-3"/> {t.open}</span>;
      case 'Closed': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center w-fit gap-1 font-medium"><CheckCircle className="w-3 h-3"/> {t.closed}</span>;
      case 'Overdue': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs flex items-center w-fit gap-1 font-medium"><AlertCircle className="w-3 h-3"/> {t.overdue}</span>;
      default: return null;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6 h-full flex flex-col bg-[#f3f4f6]">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">{t.transactionHistory}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-2 md:mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t.searchTransactionPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm text-sm md:text-base bg-white"
          />
          <Search className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
        </div>
        <button className="px-4 py-3 border border-slate-300 rounded-xl text-slate-700 bg-white hover:bg-slate-50 flex items-center justify-center space-x-2 font-medium shadow-sm transition-colors">
          <Filter className="w-4 h-4" />
          <span>{t.filter}</span>
        </button>
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Book Title</th>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">{t.checkoutDate}</th>
                <th className="px-6 py-4">{t.dueDate}</th>
                <th className="px-6 py-4">{t.returnDate}</th>
                <th className="px-6 py-4">{t.status}</th>
                <th className="px-6 py-4">{t.fine}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{tx.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{tx.bookTitle}</td>
                  <td className="px-6 py-4">{tx.memberName}</td>
                  <td className="px-6 py-4">{tx.checkoutDate}</td>
                  <td className="px-6 py-4">{tx.dueDate}</td>
                  <td className="px-6 py-4">{tx.returnDate || '-'}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className="px-6 py-4 text-red-600 font-medium">
                    {tx.fineAmount ? `$${tx.fineAmount.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
             <div className="p-8 text-center text-slate-500">No transactions found.</div>
          )}
        </div>
      </div>

      {/* Mobile View: Card List */}
      <div className="md:hidden space-y-4">
        {filtered.map((tx) => (
          <div key={tx.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
             <div className="flex justify-between items-start gap-4">
                <div>
                   <h3 className="font-bold text-slate-800 line-clamp-2 leading-tight">{tx.bookTitle}</h3>
                   <p className="text-xs text-slate-500 mt-1 font-mono">{tx.id}</p>
                </div>
                <div className="shrink-0">
                  {getStatusBadge(tx.status)}
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-2 border-t border-slate-50">
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">{t.checkoutDate}</span>
                  <span className="text-sm font-medium text-slate-700">{tx.checkoutDate}</span>
                </div>
                <div>
                   <span className="text-xs text-slate-400 block mb-0.5">{t.dueDate}</span>
                   <span className={`text-sm font-medium ${tx.status === 'Overdue' ? 'text-red-600' : 'text-slate-700'}`}>
                     {tx.dueDate}
                   </span>
                </div>
                {tx.returnDate && (
                  <div>
                     <span className="text-xs text-slate-400 block mb-0.5">{t.returnDate}</span>
                     <span className="text-sm font-medium text-green-700">{tx.returnDate}</span>
                  </div>
                )}
             </div>

             {tx.fineAmount && tx.fineAmount > 0 && (
                <div className="mt-1 pt-3 border-t border-slate-100 flex justify-between items-center text-red-600 bg-red-50 -mx-5 -mb-5 p-4 rounded-b-xl">
                   <span className="text-sm font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4"/> {t.fine}</span>
                   <span className="font-bold text-lg">${tx.fineAmount.toFixed(2)}</span>
                </div>
             )}
          </div>
        ))}
        {filtered.length === 0 && (
             <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
               No transactions found.
             </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
