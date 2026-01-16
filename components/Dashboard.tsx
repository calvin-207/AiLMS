import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Book, Users, AlertCircle, RefreshCw, X } from 'lucide-react';
import { Book as BookType, Member, Transaction } from '../types';
import { Language, translations } from '../utils/i18n';

interface DashboardProps {
  books: BookType[];
  members: Member[];
  transactions: Transaction[];
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ books, members, transactions, language }) => {
  const t = translations[language];
  const [modalData, setModalData] = useState<{title: string, items: any[], type: 'book' | 'member' | 'transaction'} | null>(null);

  const totalBooks = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const totalAvailable = books.reduce((acc, b) => acc + b.availableCopies, 0);
  const activeMembers = members.filter(m => m.status === 'Active');
  const overdueTransactions = transactions.filter(t => t.status === 'Overdue');
  const todayTransactions = transactions.filter(t => t.checkoutDate === new Date().toISOString().split('T')[0] || t.returnDate === new Date().toISOString().split('T')[0]);

  // Mock data for charts
  const categoryData = books.reduce((acc: any[], book) => {
    const existing = acc.find(i => i.name === book.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: book.category, value: 1 });
    }
    return acc;
  }, []);

  const activityData = [
    { name: 'Mon', loans: 12, returns: 10 },
    { name: 'Tue', loans: 19, returns: 15 },
    { name: 'Wed', loans: 8, returns: 12 },
    { name: 'Thu', loans: 15, returns: 8 },
    { name: 'Fri', loans: 22, returns: 18 },
    { name: 'Sat', loans: 30, returns: 25 },
    { name: 'Sun', loans: 10, returns: 5 },
  ];

  const StatCard = ({ title, value, sub, icon: Icon, color, onClick }: any) => (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow cursor-pointer"
    >
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        <p className="text-xs text-slate-400 mt-2">{sub}</p>
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  );

  const handleBarClick = (data: any) => {
    const categoryBooks = books.filter(b => b.category === data.name);
    setModalData({
      title: `${t.books}: ${data.name}`,
      items: categoryBooks,
      type: 'book'
    });
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">{t.overview}</h1>
        <div className="text-sm text-slate-500">Last updated: Just now</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t.totalHoldings} 
          value={totalBooks} 
          sub={`${totalAvailable} ${t.availableNow}`}
          icon={Book} 
          color="bg-blue-500"
          onClick={() => setModalData({ title: t.books, items: books, type: 'book' })}
        />
        <StatCard 
          title={t.activeMembers} 
          value={activeMembers.length} 
          sub={`${members.length - activeMembers.length} ${t.suspended}`}
          icon={Users} 
          color="bg-green-500" 
          onClick={() => setModalData({ title: t.activeMembers, items: activeMembers, type: 'member' })}
        />
        <StatCard 
          title={t.transactionsToday} 
          value={todayTransactions.length} 
          sub="+12% from yesterday"
          icon={RefreshCw} 
          color="bg-purple-500" 
          onClick={() => setModalData({ title: t.transactionsToday, items: todayTransactions, type: 'transaction' })}
        />
        <StatCard 
          title={t.overdueItems} 
          value={overdueTransactions.length} 
          sub={t.requiresAttention}
          icon={AlertCircle} 
          color="bg-red-500" 
          onClick={() => setModalData({ title: t.overdueItems, items: overdueTransactions, type: 'transaction' })}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">{t.holdingsByCategory}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40} 
                  onClick={handleBarClick}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">{t.weeklyActivity}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Line type="monotone" dataKey="loans" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="returns" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Drill-down Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col animate-fade-in">
             <div className="p-6 border-b border-slate-200 flex justify-between items-center">
               <h2 className="text-xl font-bold text-slate-800">{modalData.title}</h2>
               <button onClick={() => setModalData(null)} className="text-slate-500 hover:text-slate-800">
                 <X className="w-6 h-6" />
               </button>
             </div>
             
             <div className="p-6 overflow-y-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">
                        {modalData.type === 'book' ? 'Title' : modalData.type === 'member' ? 'Name' : 'Book Title'}
                      </th>
                      <th className="px-4 py-3">
                        {modalData.type === 'book' ? 'Author' : modalData.type === 'member' ? 'Role' : 'Member'}
                      </th>
                      <th className="px-4 py-3">Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalData.items.map((item: any) => (
                      <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono text-xs">{item.id}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {modalData.type === 'book' ? item.title : modalData.type === 'member' ? item.name : item.bookTitle}
                        </td>
                        <td className="px-4 py-3">
                          {modalData.type === 'book' ? item.author : modalData.type === 'member' ? item.role : item.memberName}
                        </td>
                        <td className="px-4 py-3">
                          {modalData.type === 'book' && `${item.availableCopies}/${item.totalCopies} Available`}
                          {modalData.type === 'member' && item.email}
                          {modalData.type === 'transaction' && (
                            <span className={`${item.status === 'Overdue' ? 'text-red-600' : 'text-slate-600'}`}>
                              {item.status} ({item.dueDate})
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {modalData.items.length === 0 && <p className="text-center text-slate-500 mt-4">No data found.</p>}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
