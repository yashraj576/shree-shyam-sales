import React from 'react';
import { ArrowRight, Layers, ShieldAlert, Hammer, BrickWall, Sparkles } from 'lucide-react';
import { CEMENT_IMG, TMT_IMG, BARRICADE_IMG } from '../data/demoProducts';

interface ShopByCategoryProps {
  onSelectCategory: (category: string) => void;
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      name: 'Cement',
      subtext: 'OPC 43, OPC 53, PPC & Weather-Proof',
      image: CEMENT_IMG,
      categoryKey: 'Cement',
      badge: 'All Top Brands',
    },
    {
      name: 'TMT Steel Bars',
      subtext: '8mm, 10mm, 12mm, 16mm, 20mm, 25mm, 32mm',
      image: TMT_IMG,
      categoryKey: 'TMT Steel',
      badge: 'Fe 550D High Ductility',
    },
    {
      name: 'Steel Barricades',
      subtext: 'Road Safety, Crowd Control & Modular MS Barriers',
      image: BARRICADE_IMG,
      categoryKey: 'Steel Barricades',
      badge: 'Yellow / Black Powder Coated',
    },
    {
      name: 'Concrete Barricades',
      subtext: 'Precast Jersey Crash Barriers & Kerb Dividers',
      image: BARRICADE_IMG,
      categoryKey: 'Concrete Barricades',
      badge: 'Heavy M30 Reinforced',
    },
    {
      name: 'Bricks & Blocks',
      subtext: 'First-Class Red Clay Bhatta Bricks & AAC Blocks',
      image: CEMENT_IMG,
      categoryKey: 'Bricks & Blocks',
      badge: 'Truckload Supply',
    },
    {
      name: 'Sand',
      subtext: 'River Coarse Washed Sand (Bajri / Ret)',
      image: CEMENT_IMG,
      categoryKey: 'Sand',
      badge: 'Zone-II Screened',
    },
    {
      name: 'Aggregates',
      subtext: '10mm & 20mm Blue Metal Granite Stone (Gitti)',
      image: CEMENT_IMG,
      categoryKey: 'Aggregates',
      badge: 'Low Flakiness RCC Grade',
    },
    {
      name: 'Construction Hardware',
      subtext: '18G Binding Wire, Tie Rods & Accessories',
      image: TMT_IMG,
      categoryKey: 'Construction Hardware',
      badge: 'Rebar Accessories',
    },
  ];

  return (
    <section className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">
              Complete Building Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
              Shop by Material Category
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="mt-3 md:mt-0 text-sm font-bold text-slate-800 hover:text-amber-600 inline-flex items-center gap-1.5 transition-colors group"
          >
            <span>View Full Product Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => onSelectCategory(cat.categoryKey)}
              className="group text-left bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-slate-900/80 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                    {cat.badge}
                  </span>
                </div>
              </div>

              <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {cat.subtext}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="group-hover:text-amber-600 transition-colors">Browse Stock</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
