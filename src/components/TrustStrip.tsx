import React from 'react';
import { ShieldCheck, Truck, Percent, PhoneCall } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Quality Materials',
      description: 'Genuine products from trusted brands with BIS & ISO certifications.',
      accent: 'text-amber-600 bg-amber-50',
    },
    {
      icon: Percent,
      title: 'Bulk Supply',
      description: 'Competitive wholesale pricing for contractors, builders, and engineers.',
      accent: 'text-blue-600 bg-blue-50',
    },
    {
      icon: Truck,
      title: 'Site Delivery',
      description: 'Dedicated crane and tipper delivery support direct to construction sites.',
      accent: 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: PhoneCall,
      title: 'Easy Ordering',
      description: 'Call, WhatsApp or order online with flexible pay-on-delivery options.',
      accent: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <section className="bg-white border-b border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-[#FAFAFA] transition-all"
              >
                <div className={`p-3 rounded-lg ${item.accent} shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
