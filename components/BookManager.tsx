import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, MapPin, Tag, Book as BookIcon } from 'lucide-react';
import { Book } from '../types';
import { Language, translations } from '../utils/i18n';

interface BookManagerProps {
  books: Book[];
  onAddBook: (book: Book) => void;
  language?: Language;
}

const BookManager: React.FC<BookManagerProps> = ({ books, onAddBook, language = 'en' }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const t = translations[language];
  
  // New Book State
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: '', author: '', category: '', totalCopies: 1, location: ''
  });

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.isbn.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBook.title && newBook.author) {
      onAddBook({
        ...newBook,
        id: `b${Date.now()}`,
        availableCopies: newBook.totalCopies || 1,
        isbn: newBook.isbn || '000-0000000000',
        publishYear: newBook.publishYear || new Date().getFullYear(),
        price: 0,
        publisher: 'Unknown'
      } as Book);
      setShowAddModal(false);
      setNewBook({ title: '', author: '', category: '', totalCopies: 1, location: '' });
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6 h-full flex flex-col bg-[#f3f4f6]">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">{t.books}</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm text-sm md:text-base"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">{t.addNewBook}</span>
          <span className="md:hidden">Add</span>
        </button>
      </div>

      <div className="flex space-x-2 md:space-x-4 mb-2 md:mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t.searchBookPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm md:text-base"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4 md:w-5 md:h-5" />
        </div>
        <button className="px-3 md:px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center space-x-2 bg-white">
          <Filter className="w-4 h-4" />
          <span className="hidden md:inline">{t.filter}</span>
        </button>
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">{t.titleIsbn}</th>
                <th className="px-6 py-4">{t.author}</th>
                <th className="px-6 py-4">{t.category}</th>
                <th className="px-6 py-4">{t.location}</th>
                <th className="px-6 py-4 text-center">{t.availability}</th>
                <th className="px-6 py-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{book.title}</div>
                    <div className="text-xs text-slate-400">{book.isbn}</div>
                  </td>
                  <td className="px-6 py-4">{book.author}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{book.location}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      book.availableCopies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {book.availableCopies} / {book.totalCopies}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 mr-3"><Edit className="w-4 h-4" /></button>
                    <button className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBooks.length === 0 && (
            <div className="p-8 text-center text-slate-500">{t.noBooksFound}</div>
          )}
        </div>
      </div>

      {/* Mobile View: Cards */}
      <div className="md:hidden space-y-4">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
             <div className="flex justify-between items-start gap-2">
               <div className="min-w-0">
                 <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">{book.title}</h3>
                 <p className="text-xs text-slate-500 mt-1">{book.author}</p>
               </div>
               <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  book.availableCopies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
               }`}>
                  {book.availableCopies > 0 ? 'Available' : 'Out'}
               </span>
             </div>
             
             <div className="flex flex-wrap gap-2 text-xs text-slate-600">
               <div className="bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center gap-1">
                 <Tag className="w-3 h-3 text-slate-400"/> {book.category}
               </div>
               <div className="bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center gap-1 font-mono">
                 <MapPin className="w-3 h-3 text-slate-400"/> {book.location}
               </div>
               <div className="bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center gap-1">
                 <BookIcon className="w-3 h-3 text-slate-400"/> {book.availableCopies}/{book.totalCopies} Copies
               </div>
             </div>

             <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">ISBN: {book.isbn}</span>
                <div className="flex gap-3">
                   <button className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                   <button className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
             </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">{t.noBooksFound}</div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{t.addNewBook}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.title}</label>
                <input required className="w-full border rounded-lg p-2" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">{t.author}</label>
                   <input required className="w-full border rounded-lg p-2" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">{t.isbn}</label>
                   <input className="w-full border rounded-lg p-2" value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">{t.category}</label>
                   <input required className="w-full border rounded-lg p-2" value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">{t.location}</label>
                   <input required className="w-full border rounded-lg p-2" value={newBook.location} onChange={e => setNewBook({...newBook, location: e.target.value})} />
                </div>
              </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.totalCopies}</label>
                  <input type="number" min="1" required className="w-full border rounded-lg p-2" value={newBook.totalCopies} onChange={e => setNewBook({...newBook, totalCopies: parseInt(e.target.value)})} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">{t.cancel}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t.saveBook}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManager;
