
import React, { useState } from 'react';
import { Book, User, Shield, ArrowRight, Mail, UserPlus, LogIn } from 'lucide-react';
import { Member, MemberRole, MemberStatus, UserSession } from '../types';
import { Language, translations } from '../utils/i18n';

interface LoginProps {
  members: Member[];
  onLogin: (session: UserSession) => void;
  onRegister: (member: Member) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  libraryName: string;
  logoUrl: string;
}

const Login: React.FC<LoginProps> = ({ members, onLogin, onRegister, language, setLanguage, libraryName, logoUrl }) => {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [memberId, setMemberId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Register Fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regId, setRegId] = useState('');
  const [regDept, setRegDept] = useState('');

  const t = translations[language];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (role === 'admin') {
      if (username === 'admin' && password === 'admin') {
        onLogin({ id: 'admin', name: 'Administrator', role: 'admin' });
      } else { setError(t.loginError); }
    } else {
      const member = members.find(m => m.id === memberId);
      if (member) {
        if (password !== '123456') { setError(t.loginError); return; }
        if (member.status === 'Suspended') { setError('Account suspended.'); return; }
        onLogin({ id: member.id, name: member.name, role: 'member', memberDetails: member });
      } else { setError(t.memberNotFound); }
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: Member = {
      id: regId,
      name: regName,
      email: regEmail,
      department: regDept,
      role: MemberRole.STUDENT,
      status: MemberStatus.ACTIVE,
      joinDate: new Date().toISOString().split('T')[0],
      currentBorrows: 0,
      maxBorrows: 5,
      totalFinesDue: 0
    };
    onRegister(newMember);
    setSuccess(t.registerSuccess);
    setView('login');
    setRegId(''); setRegName(''); setRegEmail(''); setRegDept('');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f3f4f6]">
      <div className="w-full md:w-1/2 bg-slate-900 text-white p-6 md:p-12 flex flex-col justify-between relative overflow-hidden shrink-0 z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1507842217121-9e9f147d719d?auto=format&fit=crop&w=1920&q=80')] bg-cover opacity-20 z-0"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {logoUrl ? <img src={logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded" /> : <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center"><Book className="text-white" /></div>}
            <span className="text-2xl font-bold tracking-tight">{libraryName}</span>
          </div>
          <div className="flex space-x-3 text-sm font-medium text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-full">
            <button onClick={() => setLanguage('en')} className={language === 'en' ? 'text-white' : ''}>EN</button>
            <span>|</span>
            <button onClick={() => setLanguage('zh')} className={language === 'zh' ? 'text-white' : ''}>中文</button>
          </div>
        </div>
        
        <div className="hidden md:block relative z-10 space-y-6">
           <h1 className="text-5xl font-bold leading-tight">{language === 'en' ? 'Gateway to knowledge.' : '通向知识的大门。'}</h1>
           <p className="text-slate-400 text-lg max-w-md">{language === 'en' ? 'Explore our digital library and discover thousands of resources.' : '探索我们的数字图书馆，发现成千上万的资源。'}</p>
        </div>
        <p className="text-slate-500 text-sm">© 2024 {libraryName}</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800">{view === 'login' ? t.loginTitle : t.registerTitle}</h2>
            {success && <div className="mt-2 text-green-600 bg-green-50 p-2 rounded-lg text-sm">{success}</div>}
          </div>

          {view === 'login' ? (
            <>
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button onClick={() => setRole('member')} className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-xl transition-all ${role === 'member' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}><User className="w-4 h-4 mr-2" />{t.memberLogin}</button>
                <button onClick={() => setRole('admin')} className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-xl transition-all ${role === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}><Shield className="w-4 h-4 mr-2" />{t.adminLogin}</button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {role === 'member' ? (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.memberId}</label>
                    <div className="relative">
                      <input type="text" required value={memberId} onChange={e => setMemberId(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="S2023001" />
                      <User className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.username}</label>
                    <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="admin" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.password}</label>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••" />
                </div>
                {error && <div className="text-red-600 text-xs font-medium text-center">{error}</div>}
                <button type="submit" className={`w-full py-3.5 rounded-2xl text-white font-bold shadow-xl transition-all active:scale-95 flex items-center justify-center ${role === 'member' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-800 hover:bg-slate-900'}`}>{t.loginBtn}<LogIn className="ml-2 w-4 h-4" /></button>
              </form>
              <button onClick={() => { setView('register'); setSuccess(''); }} className="w-full text-slate-500 text-sm font-medium hover:text-blue-600 transition-colors">{t.needAnAccount}</button>
            </>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                <input required value={regName} onChange={e => setRegName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.memberId}</label>
                  <input required value={regId} onChange={e => setRegId(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="S2023..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.department}</label>
                  <input required value={regDept} onChange={e => setRegDept(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="CS" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.email}</label>
                <div className="relative">
                  <input required type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@uni.edu" />
                  <Mail className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center">{t.registerBtn}<UserPlus className="ml-2 w-4 h-4" /></button>
              <button onClick={() => setView('login')} className="w-full text-slate-500 text-sm font-medium hover:text-blue-600 transition-colors">{t.alreadyHaveAccount}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
