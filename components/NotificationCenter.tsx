
import React from 'react';
import { X, Bell, Check, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Notification } from '../types';
import { Language, translations } from '../utils/i18n';

interface NotificationCenterProps {
  notifications: Notification[];
  onClose: () => void;
  onRead: (id: string) => void;
  onReadAll: () => void;
  language: Language;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onClose, onRead, onReadAll, language }) => {
  const t = translations[language];

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-[100] border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-800">{t.notifications}</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full"><X className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length > 0 ? (
          notifications.map(n => (
            <div 
              key={n.id} 
              onClick={() => onRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                n.isRead ? 'bg-white border-slate-100 opacity-60' : 'bg-indigo-50/30 border-indigo-100 shadow-sm'
              }`}
            >
              <div className="flex gap-3">
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  n.type === 'warning' ? 'bg-orange-100 text-orange-600' : 
                  n.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {n.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : 
                   n.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{n.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">{n.date}</span>
                </div>
                {!n.isRead && <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 shrink-0"></div>}
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 space-y-4">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center"><Bell className="w-8 h-8" /></div>
             <p className="font-medium">{t.noNotifications}</p>
          </div>
        )}
      </div>

      {notifications.some(n => !n.isRead) && (
        <div className="p-4 border-t">
          <button 
            onClick={onReadAll}
            className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors"
          >
            <Check className="w-4 h-4" />
            {t.markAllRead}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
