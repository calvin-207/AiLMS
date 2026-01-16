
import React, { useState } from 'react';
import { Plus, Search, Shield, Trash2, UserPlus } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

interface AdminManagerProps {
  language: Language;
}

const AdminManager: React.FC<AdminManagerProps> = ({ language }) => {
  const t = translations[language];
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [admins, setAdmins] = useState<Admin[]>([
    { id: 'A001', name: 'System Admin', email: 'admin@library.com', role: 'Super Admin', lastLogin: '2024-03-20' },
    { id: 'A002', name: 'Librarian Wang', email: 'wang@library.com', role: 'Staff', lastLogin: '2024-03-19' },
  ]);

  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const admin: Admin = {
      id: `A00${admins.length + 1}`,
      name: newAdmin.name,
      email: newAdmin.email,
      role: 'Staff',
      lastLogin: '-'
    };
    setAdmins([...admins, admin]);
    setShowAddModal(false);
    setNewAdmin({ name: '', email: '', password: '' });
  };

  const filtered = admins.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">{t.adminCatalog}</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.addNewAdmin}</span>
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search admins..."
          className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b">
              <tr>
                <th className="px-6 py-4">Admin Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(admin => (
                <tr key={admin.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <Shield className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-800">{admin.name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold">{admin.role}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{admin.lastLogin}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold">{t.addNewAdmin}</h2>
            <input required placeholder="Full Name" className="w-full border p-2 rounded-lg" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} />
            <input required type="email" placeholder="Email" className="w-full border p-2 rounded-lg" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} />
            <input required type="password" placeholder="Password" className="w-full border p-2 rounded-lg" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} />
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-500">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-lg">Save Admin</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminManager;
