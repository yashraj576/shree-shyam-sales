import React from 'react';
import { ArrowRight, FileText, MessageSquare, Phone, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';
import { HERO_IMG } from '../data/demoProducts';
import { BUSINESS_PHONE_TEL, WHATSAPP_BASE_URL } from '../services/whatsapp';

interface HeroProps {
  onShopClick: () => void;
  onBulkQuoteClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onBulkQuoteClick }) => {
  return (
    <section className="relative bg-slate-950 text-white overflow-hidden">
      {/* Background Graphic & Texture */}
      <div className="absolute inset-0 opacity-25 mix-blend-luminosity">
        <img
          src={HERO_IMG}
          alt="Shree Shyam Sales Warehouse and Construction Materials"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-md text-amber-400 text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Authorized Distributor &amp; Stockist
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-serif text-balance">
              Build Strong. <br />
              <span className="text-amber-400">Build Better.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Quality Cement, TMT Steel, Barricades and essential building materials delivered for your project. 
              Supplying developers, civil contractors, and home builders with genuine certified materials at direct wholesale rates.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onShopClick}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition-all shadow-md hover:shadow-amber-500/20 inline-flex items-center gap-2"
              >
                <span>Shop Materials</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onBulkQuoteClick}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg text-sm border border-white/20 transition-all inline-flex items-center gap-2 backdrop-blur-xs"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Get Bulk Quote</span>
              </button>

              <a
                href={WHATSAPP_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-sm transition-all inline-flex items-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* Quick trust metrics under buttons */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block text-2xl font-extrabold text-amber-400 tabular-nums">500+</span>
                <span className="text-xs text-slate-400 font-medium">Projects Supplied</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-white tabular-nums">100%</span>
                <span className="text-xs text-slate-400 font-medium">Genuine ISI Brands</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-amber-400 tabular-nums">24 Hr</span>
                <span className="text-xs text-slate-400 font-medium">Site Dispatch Support</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-2xl p-2">
              <div className="relative rounded-xl overflow-hidden aspect-4/3">
                <img
                  src={HERO_IMG}
                  alt="High Grade TMT Steel and Cement Ready for Dispatch"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                        Direct Site Logistics
                      </span>
                      <p className="text-sm font-bold text-white">
                        Dedicated Fleet for Rebar &amp; Bagged Cement
                      </p>
                    </div>
                    <a
                      href={BUSINESS_PHONE_TEL}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors whitespace-nowrap"
                    >
                      Call Sales
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>UltraTech • ACC • Ambuja • Tata Tiscon • Jindal Panther</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Heavy-Duty Concrete &amp; Steel Safety Barricades in Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
