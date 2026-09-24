import React from 'react';
import { FileText, Phone, MessageSquare, ShieldCheck, Truck, Check } from 'lucide-react';
import { BUSINESS_PHONE_TEL, WHATSAPP_BASE_URL } from '../services/whatsapp';

interface PromotionalBannerProps {
  onOpenBulkQuote: () => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ onOpenBulkQuote }) => {
  return (
    <section className="py-14 bg-slate-900 text-white relative overflow-hidden border-t border-b border-slate-800">
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold rounded uppercase tracking-wider">
                Wholesale &amp; Institutional Supply
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
                Planning a Large Construction or Infrastructure Project?
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Get special wholesale pricing for builders, contractors, and infrastructure projects. 
                Full truckload dispatches of certified Cement, TMT Steel Rebars, Heavy-duty Concrete Jersey Barriers, and Modular Steel Barricades.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>Weighbridge Slip Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>Direct Plant / Yard Billing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>Scheduled Batch Dispatches</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                onClick={onOpenBulkQuote}
                className="w-full py-3.5 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Request Bulk Project Quote</span>
              </button>

              <a
                href={BUSINESS_PHONE_TEL}
                className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all border border-white/20 flex items-center justify-center gap-2 backdrop-blur-xs"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Talk to Commercial Sales</span>
              </a>

              <a
                href={WHATSAPP_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Procurement Desk</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
