import React from 'react';
import { ShieldCheck, Truck, Award, Building2, Users, CheckCircle2 } from 'lucide-react';
import { HERO_IMG, CEMENT_IMG, TMT_IMG } from '../data/demoProducts';
import { BUSINESS_PHONE_TEL, WHATSAPP_BASE_URL } from '../services/whatsapp';

export const AboutSection: React.FC = () => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">
            About Shree Shyam Sales
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
            Setting the Benchmark in Construction Material Supply
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Shree Shyam Sales is a premier stockist, distributor, and project supply partner for civil contractors, commercial developers, and independent home builders.
          </p>
        </div>

        {/* 2-Column Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 font-serif">
              Integrity, Tested Quality, and Punctual Site Delivery
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              In construction, structural strength is paramount. Every bag of cement and every metric ton of TMT steel sourced through Shree Shyam Sales comes directly from primary manufacturer plants with BIS/ISO compliance and batch test certificates.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We operate dedicated heavy logistics and yard infrastructure, ensuring your project works never stop due to material shortages. Whether you need 50 bags of OPC 53 for urgent slab casting or 500 tons of Fe 550D rebar for multi-story towers, we execute dispatches on time.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="block text-2xl font-black text-amber-600 tabular-nums">100%</span>
                <span className="text-xs font-bold text-slate-800 block mt-1">Genuine Brands Only</span>
                <span className="text-[11px] text-slate-500">Authorized primary channel distribution</span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="block text-2xl font-black text-slate-900 tabular-nums">15+ Years</span>
                <span className="text-xs font-bold text-slate-800 block mt-1">Industry Standing</span>
                <span className="text-[11px] text-slate-500">Trusted by over 500+ civil engineers</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src={CEMENT_IMG}
                alt="Cement stock"
                className="rounded-2xl object-cover aspect-3/4 w-full shadow-md"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src={TMT_IMG}
                alt="TMT steel yard"
                className="rounded-2xl object-cover aspect-3/4 w-full shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
          <div className="p-6 bg-[#FAFAFA] border border-slate-200 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Direct Yard Certification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every shipment is verified against official weighbridge slips and accompanied by manufacturer test certificates.
            </p>
          </div>

          <div className="p-6 bg-[#FAFAFA] border border-slate-200 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Fleet Logistics Direct to Site</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equipped with hydraulic tippers, flatbed trailers, and crane assistance for quick site unloading without contractor delays.
            </p>
          </div>

          <div className="p-6 bg-[#FAFAFA] border border-slate-200 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Transparent Wholesale Rates</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fair, direct billing with no hidden markups. Volume discounts available for registered developers and institutional projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
