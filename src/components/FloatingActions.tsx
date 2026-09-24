import React from 'react';
import { MessageSquare, Phone } from 'lucide-react';
import { BUSINESS_PHONE_TEL, WHATSAPP_BASE_URL } from '../services/whatsapp';

export const FloatingActions: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* Floating Call Button */}
      <a
        href={BUSINESS_PHONE_TEL}
        className="pointer-events-auto p-3.5 bg-slate-900 text-amber-400 hover:text-white hover:bg-slate-800 rounded-full shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center border border-slate-700"
        title="Call Shree Shyam Sales (+91 8227021000)"
        aria-label="Call +91 8227021000"
      >
        <Phone className="w-5 h-5" />
      </a>

      {/* Floating WhatsApp Button with pulse indicator */}
      <a
        href={WHATSAPP_BASE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border border-emerald-400/40"
        title="Chat on WhatsApp (+91 8227021000)"
        aria-label="Chat on WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageSquare className="w-5 h-5" />
        <span className="text-xs font-black tracking-wide hidden sm:inline-block">
          Order on WhatsApp
        </span>
      </a>
    </div>
  );
};
