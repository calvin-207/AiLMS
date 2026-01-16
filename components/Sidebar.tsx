
import React from 'react';
import { LayoutDashboard, Book, Users, Repeat, Search, Settings, Bot, History, LogOut, X, ShieldCheck } from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { UserSession } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  libraryName: string;
  logoUrl: string;
  language: Language;
  user: UserSession;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, libraryName, logoUrl, language, user, onLogout, isOpen, onClose }) => {
  const t = translations[language];

  const adminMenu = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'circulation', label: t.circulation, icon: Repeat },
    { id: 'books', label: t.books, icon: Book },
    { id: 'members', label: t.members, icon: Users },
    { id: 'admins', label: t.admins, icon: ShieldCheck },
    { id: 'history', label: t.history, icon: History },
    { id: 'search', label: t.search, icon: Search },
    { id: 'ai-help', label: t.aiHelp, icon: Bot, special: true },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  const memberMenu = [
    { id: 'search', label: t.search, icon: Search },
    { id: 'history', label: t.myHistory, icon: History },
    { id: 'ai-help', label: t.aiHelp, icon: Bot, special: true },
  ];

  const menuItems = user.role === 'admin' ? adminMenu : memberMenu;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={onClose} />}
      <div className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-2xl`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-3 overflow-hidden">
            {logoUrl ? <img src={logoUrl} className="w-8 h-8 rounded bg-white object-contain" /> : <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"><Book className="w-5 h-5" /></div>}
            <span className="text-lg font-bold truncate">{libraryName}</span>
          </div>
          <button onClick={onClose} className="md:hidden"><X className="w-6 h-6" /></button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); onClose(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
           <div className="flex items-center space-x-3 min-w-0">
             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">{user.name.substring(0,2).toUpperCase()}</div>
             <div className="truncate min-w-0"><p className="text-sm font-bold truncate">{user.name}</p></div>
           </div>
           <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-400 transition-colors"><LogOut className="w-5 h-5" /></button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
