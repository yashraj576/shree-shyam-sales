import React from 'react';
import { Phone, MessageSquare, MapPin, Building2, ShieldCheck, Truck } from 'lucide-react';
import { BUSINESS_PHONE, BUSINESS_PHONE_TEL, WHATSAPP_BASE_URL } from '../services/whatsapp';

interface FooterProps {
  onNavigate: (view: string, categoryFilter?: string) => void;
  onOpenBulkQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBulkQuote }) => {
  const clickTimestampsRef = React.useRef<number[]>([]);

  const handleCopyrightClick = () => {
    const now = Date.now();
    // Keep clicks within 1.5 seconds
    const recentClicks = clickTimestampsRef.current.filter((t) => now - t <= 1500);
    recentClicks.push(now);
    clickTimestampsRef.current = recentClicks;

    if (recentClicks.length >= 3) {
      clickTimestampsRef.current = [];
      onNavigate('admin');
    }
  };
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-slate-950 font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xl font-black font-serif tracking-tight text-white">
                  SHREE SHYAM SALES
                </span>
                <span className="text-[11px] font-medium tracking-wider text-slate-400 uppercase">
                  Quality Building Materials. Reliable Supply.
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Premier stockist and distributor of primary grade Cement (OPC/PPC), Fe 550D TMT Steel Rebars, Heavy-duty Concrete Jersey Barriers, and Modular Steel Barricades.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Genuine Certified Mill Materials</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Dedicated Heavy Fleet for Direct Site Offloading</span>
              </div>
            </div>
          </div>

          {/* Column 2: Material Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Material Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => onNavigate('shop', 'Cement')}
                  className="hover:text-white transition-colors"
                >
                  Cement (OPC 43, OPC 53, PPC)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'TMT Steel')}
                  className="hover:text-white transition-colors"
                >
                  TMT Steel Rebars (8mm - 32mm)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'Steel Barricades')}
                  className="hover:text-white transition-colors"
                >
                  Steel Safety Barricades
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'Concrete Barricades')}
                  className="hover:text-white transition-colors"
                >
                  Concrete Jersey Crash Barriers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'Bricks & Blocks')}
                  className="hover:text-white transition-colors"
                >
                  Red Clay Bricks &amp; AAC Blocks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'Sand')}
                  className="hover:text-white transition-colors"
                >
                  Coarse River Sand &amp; Bajri
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'Aggregates')}
                  className="hover:text-white transition-colors"
                >
                  10mm / 20mm RCC Aggregates
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={onOpenBulkQuote} className="hover:text-white text-amber-300 font-bold">
                  Bulk Wholesale Quotes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white">
                  About the Firm
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white">
                  Contact &amp; Yard
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Phone */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Direct Contact Desk
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block">Orders &amp; Dispatch Line</span>
                  <a
                    href={BUSINESS_PHONE_TEL}
                    className="font-bold text-sm text-white hover:text-amber-400"
                  >
                    {BUSINESS_PHONE}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block">WhatsApp Desk</span>
                  <a
                    href={WHATSAPP_BASE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    +91 8227021000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-slate-400">
                  Main Yard &amp; Warehouse, Industrial Corridor Link, Ranchi, Jharkhand - 834001
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-200 block">Wholesale Notice:</strong>
              Supplying contractors, builders, and infrastructure projects with certified materials. Site delivery and weighbridge slip guaranteed.
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p onClick={handleCopyrightClick} className="select-none cursor-default">
            © 2026 Shree Shyam Sales. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <span>Call: <a href={BUSINESS_PHONE_TEL} className="text-amber-400 font-semibold">{BUSINESS_PHONE}</a></span>
            <span>•</span>
            <a href={WHATSAPP_BASE_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-semibold">
              WhatsApp: +91 8227021000
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
