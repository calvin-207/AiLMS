import React, { useState } from 'react';
import { Save, Globe, Type, Image } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface SettingsProps {
  libraryName: string;
  setLibraryName: (name: string) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Settings: React.FC<SettingsProps> = ({ libraryName, setLibraryName, logoUrl, setLogoUrl, language, setLanguage }) => {
  const [localName, setLocalName] = useState(libraryName);
  const [localLogo, setLocalLogo] = useState(logoUrl);
  const t = translations[language];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLibraryName(localName);
    setLogoUrl(localLogo);
    // In a real app, this would persist to backend/localstorage
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{t.systemSettings}</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-700">{t.generalSettings}</h2>
        </div>
        
        <form onSubmit={handleSave} className="p-6 space-y-6">
          
          {/* Library Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Type className="w-4 h-4" /> {t.libraryName}
            </label>
            <input 
              type="text" 
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Image className="w-4 h-4" /> {t.libraryLogo}
            </label>
            <div className="flex gap-4 items-start">
               <input 
                type="text" 
                value={localLogo}
                onChange={(e) => setLocalLogo(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              {localLogo && (
                <div className="w-10 h-10 border border-slate-200 rounded p-1 bg-white shrink-0">
                  <img src={localLogo} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">Provide a direct image URL.</p>
          </div>

          {/* Language Selection */}
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" /> {t.language}
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  language === 'en' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('zh')}
                className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  language === 'zh' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                中文 (Chinese)
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              {t.saveSettings}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Settings;
