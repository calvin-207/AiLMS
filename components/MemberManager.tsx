import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, User, Mail, Briefcase } from 'lucide-react';
import { Member, MemberRole, MemberStatus } from '../types';
import { Language, translations } from '../utils/i18n';

interface MemberManagerProps {
  members: Member[];
  onAddMember: (member: Member) => void;
  language: Language;
}

const MemberManager: React.FC<MemberManagerProps> = ({ members, onAddMember, language }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const t = translations[language];
  
  // New Member State
  const [newMember, setNewMember] = useState<Partial<Member>>({
    name: '', email: '', role: MemberRole.STUDENT, department: '', status: MemberStatus.ACTIVE
  });

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMember.name && newMember.email) {
      onAddMember({
        ...newMember,
        id: newMember.role === MemberRole.TEACHER ? `T${Date.now()}` : `S${Date.now()}`,
        joinDate: new Date().toISOString().split('T')[0],
        currentBorrows: 0,
        maxBorrows: newMember.role === MemberRole.TEACHER ? 20 : 5,
        totalFinesDue: 0
      } as Member);
      setShowAddModal(false);
      setNewMember({ name: '', email: '', role: MemberRole.STUDENT, department: '', status: MemberStatus.ACTIVE });
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6 h-full flex flex-col bg-[#f3f4f6]">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">{t.memberCatalog}</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm text-sm md:text-base"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">{t.addNewMember}</span>
          <span className="md:hidden">Add</span>
        </button>
      </div>

      <div className="flex space-x-2 md:space-x-4 mb-2 md:mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t.searchMemberPlaceholder}
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
                <th className="px-6 py-4">Name / ID</th>
                <th className="px-6 py-4">{t.role}</th>
                <th className="px-6 py-4">{t.department}</th>
                <th className="px-6 py-4">{t.status}</th>
                <th className="px-6 py-4 text-center">{t.borrows}</th>
                <th className="px-6 py-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User className="w-4 h-4"/>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{member.name}</div>
                        <div className="text-xs text-slate-400">{member.id} • {member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-xs text-xs font-medium border
                      ${member.role === MemberRole.TEACHER ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{member.department}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-mono">
                    {member.currentBorrows} / {member.maxBorrows}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 mr-3"><Edit className="w-4 h-4" /></button>
                    <button className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMembers.length === 0 && (
            <div className="p-8 text-center text-slate-500">No members found.</div>
          )}
        </div>
      </div>

      {/* Mobile View: Cards */}
      <div className="md:hidden space-y-4">
        {filteredMembers.map((member) => (
           <div key={member.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <User className="w-5 h-5"/>
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-800 text-sm">{member.name}</h3>
                       <p className="text-xs text-slate-500 font-mono">{member.id}</p>
                    </div>
                 </div>
                 <button className="text-slate-400 p-1"><Edit className="w-4 h-4"/></button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                 <div className="bg-slate-50 p-2 rounded flex items-center gap-2">
                    <Briefcase className="w-3 h-3 text-slate-400"/>
                    <span className="text-slate-700">{member.department}</span>
                 </div>
                 <div className="bg-slate-50 p-2 rounded flex items-center gap-2">
                    <Mail className="w-3 h-3 text-slate-400"/>
                    <span className="text-slate-700 truncate">{member.email}</span>
                 </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                 <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                       member.role === MemberRole.TEACHER ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>{member.role}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                       member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>{member.status}</span>
                 </div>
                 <div className="text-xs font-medium text-slate-600">
                    Borrows: <span className="text-slate-900">{member.currentBorrows}</span>/{member.maxBorrows}
                 </div>
              </div>
           </div>
        ))}
         {filteredMembers.length === 0 && (
            <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">No members found.</div>
         )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{t.addNewMember}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required className="w-full border rounded-lg p-2" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                 <input type="email" required className="w-full border rounded-lg p-2" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">{t.role}</label>
                   <select className="w-full border rounded-lg p-2" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value as MemberRole})}>
                     {Object.values(MemberRole).map(r => <option key={r} value={r}>{r}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">{t.department}</label>
                   <input required className="w-full border rounded-lg p-2" value={newMember.department} onChange={e => setNewMember({...newMember, department: e.target.value})} />
                </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">{t.status}</label>
                 <select className="w-full border rounded-lg p-2" value={newMember.status} onChange={e => setNewMember({...newMember, status: e.target.value as MemberStatus})}>
                   {Object.values(MemberStatus).map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">{t.cancel}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManager;
