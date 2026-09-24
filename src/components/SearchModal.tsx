import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickTags = ['UltraTech', '12mm', 'Fe 550D', 'OPC 53', 'Concrete Barricade', 'Steel Barrier', 'ACC Suraksha'];

  const results = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.variations?.some((v) => v.name.toLowerCase().includes(q) || (v.size && v.size.toLowerCase().includes(q)))
        );
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search cement grade, TMT rebar size, barricades..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base font-medium text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Suggestions */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-slate-400 font-semibold text-[11px]">Popular:</span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type product name, brand, or specifications to search live catalog.
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm font-bold text-slate-800">No matching materials found for "{query}"</p>
              <p className="text-xs text-slate-500">
                Check spelling or reach out to our team via WhatsApp for direct procurement.
              </p>
            </div>
          ) : (
            results.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="w-full p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between border border-transparent hover:border-slate-200 text-left group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-500 block uppercase">
                      {product.brand} • {product.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                      {product.name}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sm text-slate-900 block tabular-nums">
                    ₹{product.basePrice.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-500">/{product.unit}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600">
                    {product.stock} available
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
