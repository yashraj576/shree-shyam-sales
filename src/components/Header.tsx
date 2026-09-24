import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Search, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ShieldAlert, 
  Building2,
  ChevronRight
} from 'lucide-react';
import { BUSINESS_PHONE, BUSINESS_PHONE_TEL, WHATSAPP_BASE_URL } from '../services/whatsapp';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, categoryFilter?: string) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenBulkQuote: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenSearch,
  onOpenBulkQuote,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: string, categoryFilter?: string) => {
    onNavigate(view, categoryFilter);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-slate-200">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-medium tracking-wide">
              Bulk Orders • Site Delivery Available Across Region • Call/WhatsApp: <span className="text-amber-400 font-semibold">{BUSINESS_PHONE}</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a
              href={BUSINESS_PHONE_TEL}
              className="inline-flex items-center gap-1 text-slate-200 hover:text-white transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Now</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={WHATSAPP_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Wordmark & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left focus:outline-none group flex items-center gap-3"
            >
              <div className="w-11 h-11 bg-slate-900 rounded-lg flex items-center justify-center text-amber-400 font-bold shadow-xs group-hover:bg-slate-800 transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-serif leading-none">
                  SHREE SHYAM SALES
                </span>
                <span className="text-[11px] font-medium tracking-wider text-slate-500 uppercase mt-0.5 block">
                  Quality Building Materials. Reliable Supply.
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-amber-600 transition-colors pb-1 border-b-2 ${
                currentView === 'home' ? 'border-amber-500 text-slate-900 font-bold' : 'border-transparent'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`hover:text-amber-600 transition-colors pb-1 border-b-2 ${
                currentView === 'shop' ? 'border-amber-500 text-slate-900 font-bold' : 'border-transparent'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Cement')}
              className="hover:text-amber-600 transition-colors pb-1 border-b-2 border-transparent"
            >
              Cement
            </button>
            <button
              onClick={() => handleNavClick('shop', 'TMT Steel')}
              className="hover:text-amber-600 transition-colors pb-1 border-b-2 border-transparent"
            >
              TMT Steel
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Steel Barricades')}
              className="hover:text-amber-600 transition-colors pb-1 border-b-2 border-transparent"
            >
              Barricades
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Bricks & Blocks')}
              className="hover:text-amber-600 transition-colors pb-1 border-b-2 border-transparent"
            >
              Building Materials
            </button>
            <button
              onClick={onOpenBulkQuote}
              className="text-amber-600 hover:text-amber-700 transition-colors font-bold"
            >
              Bulk Orders
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`hover:text-amber-600 transition-colors pb-1 border-b-2 ${
                currentView === 'about' ? 'border-amber-500 text-slate-900 font-bold' : 'border-transparent'
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`hover:text-amber-600 transition-colors pb-1 border-b-2 ${
                currentView === 'contact' ? 'border-amber-500 text-slate-900 font-bold' : 'border-transparent'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Icons & Admin Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              aria-label="Search catalog"
              className="p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => handleNavClick('shop')}
              aria-label="Wishlist"
              className="relative p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors hidden sm:inline-flex"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button with Count & Subtotal */}
            <button
              onClick={onOpenCart}
              aria-label="Shopping Cart"
              className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-xs"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 text-slate-950 text-xs font-extrabold rounded-full flex items-center justify-center border-2 border-slate-900 tabular-nums">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-left text-xs">
                <span className="text-[10px] text-slate-300 font-medium leading-none">Your Cart</span>
                <span className="font-bold text-amber-300 tabular-nums leading-tight">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open menu"
              className="p-2 text-slate-700 hover:text-slate-900 xl:hidden rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE SLIDE-DOWN DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left px-3 py-2 rounded-md font-semibold text-sm text-slate-800 hover:bg-slate-50"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className="text-left px-3 py-2 rounded-md font-semibold text-sm text-slate-800 hover:bg-slate-50"
            >
              All Products
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Cement')}
              className="text-left px-3 py-2 rounded-md font-medium text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Cement</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => handleNavClick('shop', 'TMT Steel')}
              className="text-left px-3 py-2 rounded-md font-medium text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>TMT Steel</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Steel Barricades')}
              className="text-left px-3 py-2 rounded-md font-medium text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Steel Barricades</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Concrete Barricades')}
              className="text-left px-3 py-2 rounded-md font-medium text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Concrete Barricades</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Bricks & Blocks')}
              className="text-left px-3 py-2 rounded-md font-medium text-sm text-slate-700 hover:bg-slate-50"
            >
              Bricks &amp; Blocks
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Sand')}
              className="text-left px-3 py-2 rounded-md font-medium text-sm text-slate-700 hover:bg-slate-50"
            >
              Sand &amp; Aggregates
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left px-3 py-2 rounded-md font-medium text-sm text-slate-700 hover:bg-slate-50"
            >
              About Company
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left px-3 py-2 rounded-md font-medium text-sm text-slate-700 hover:bg-slate-50"
            >
              Contact Us
            </button>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBulkQuote();
              }}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-sm text-center shadow-xs transition-colors"
            >
              Request Bulk Wholesale Quote
            </button>
            <div className="flex gap-2">
              <a
                href={BUSINESS_PHONE_TEL}
                className="flex-1 py-2 px-3 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                Call +91 8227021000
              </a>
              <a
                href={WHATSAPP_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp Order
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
