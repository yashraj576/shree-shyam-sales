import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustStrip } from './components/TrustStrip';
import { ShopByCategory } from './components/ShopByCategory';
import { ProductCard } from './components/ProductCard';
import { ShopPage } from './components/ShopPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { BulkQuoteModal } from './components/BulkQuoteModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SearchModal } from './components/SearchModal';
import { PromotionalBanner } from './components/PromotionalBanner';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';

import { Product, ProductVariation, CartItem } from './types';
import { 
  initializeDatabase, 
  getProducts, 
  getCart, 
  saveCart, 
  getWishlist, 
  saveWishlist,
  DB_UPDATE_EVENT 
} from './services/db';
import { ArrowRight } from 'lucide-react';

const getInitialView = (): 'home' | 'shop' | 'about' | 'contact' | 'admin' => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (path === '/shop' || hash === '#shop' || search.includes('view=shop')) return 'shop';
    if (path === '/about' || hash === '#about' || search.includes('view=about')) return 'about';
    if (path === '/contact' || hash === '#contact' || search.includes('view=contact')) return 'contact';
    // Navigate directly to admin route for immediate testing
    return 'admin';
  }
  return 'admin';
};

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'about' | 'contact' | 'admin'>(getInitialView);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Database States
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(getCart());
  const [wishlist, setWishlist] = useState<string[]>(getWishlist());

  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutOrderType, setCheckoutOrderType] = useState<'Regular Order' | 'Bulk Order'>('Regular Order');
  const [isBulkQuoteOpen, setIsBulkQuoteOpen] = useState(false);
  const [bulkQuoteInitialMaterial, setBulkQuoteInitialMaterial] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Product Detail Modal State
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedVariationIdForDetail, setSelectedVariationIdForDetail] = useState<string | undefined>(undefined);

  // Initialize DB and load products
  const loadStoreProducts = async () => {
    try {
      const prods = await getProducts();
      setProducts(prods);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await initializeDatabase();
      await loadStoreProducts();
      if (window.location.pathname !== '/admin') {
        window.history.replaceState(null, '', '/admin');
      }
    };
    init();

    // Listen to database reactive events from admin/orders
    const handleDbUpdate = () => {
      loadStoreProducts();
      setCart(getCart());
      setWishlist(getWishlist());
    };

    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#/admin' || hash === '#admin' || search.includes('view=admin')) {
        setCurrentView('admin');
      } else if (path === '/about' || hash === '#about') {
        setCurrentView('about');
      } else if (path === '/contact' || hash === '#contact') {
        setCurrentView('contact');
      } else if (path === '/shop' || hash === '#shop') {
        setCurrentView('shop');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener(DB_UPDATE_EVENT, handleDbUpdate);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener(DB_UPDATE_EVENT, handleDbUpdate);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Save cart to local storage and state
  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    saveCart(newCart);
  };

  // Add to cart with variation support
  const handleAddToCart = (
    product: Product,
    variation?: ProductVariation,
    quantity: number = 1,
    tmtPricingMode?: 'Ton' | 'Bundle' | 'Kg'
  ) => {
    const variationId = variation ? variation.variationId : 'default';
    const cartItemId = `${product.id}-${variationId}-${tmtPricingMode || 'standard'}`;

    // Determine unit price
    let unitPrice = variation ? variation.price : product.basePrice;
    let unit = variation?.unit || product.unit;

    if (product.category === 'TMT Steel' && variation) {
      if (tmtPricingMode === 'Bundle' && variation.pricePerBundle) {
        unitPrice = variation.pricePerBundle;
        unit = 'Bundle';
      } else if (tmtPricingMode === 'Kg' && variation.pricePerKg) {
        unitPrice = variation.pricePerKg;
        unit = 'Kg';
      } else {
        unitPrice = variation.pricePerTon || variation.price;
        unit = 'Ton';
      }
    }

    const existingIndex = cart.findIndex((item) => item.id === cartItemId);
    let updatedCart: CartItem[];

    if (existingIndex >= 0) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        product,
        selectedVariationId: variation?.variationId,
        selectedVariation: variation,
        quantity,
        unitPrice,
        unit,
      };
      updatedCart = [...cart, newItem];
    }

    updateCart(updatedCart);
    setIsCartOpen(true);
  };

  // Buy now shortcut
  const handleBuyNow = (
    product: Product,
    variation?: ProductVariation,
    quantity: number = 1,
    tmtPricingMode?: 'Ton' | 'Bundle' | 'Kg'
  ) => {
    handleAddToCart(product, variation, quantity, tmtPricingMode);
    setIsCartOpen(false);
    setSelectedProductForDetail(null);
    setIsCheckoutOpen(true);
  };

  // Cart quantity update
  const handleUpdateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    const updated = cart.map((item) =>
      item.id === cartItemId ? { ...item, quantity: newQuantity } : item
    );
    updateCart(updated);
  };

  // Remove cart item
  const handleRemoveCartItem = (cartItemId: string) => {
    const updated = cart.filter((item) => item.id !== cartItemId);
    updateCart(updated);
  };

  // Clear cart
  const handleClearCart = () => {
    updateCart([]);
  };

  // Toggle wishlist
  const handleToggleWishlist = (productId: string) => {
    let updatedWishlist: string[];
    if (wishlist.includes(productId)) {
      updatedWishlist = wishlist.filter((id) => id !== productId);
    } else {
      updatedWishlist = [...wishlist, productId];
    }
    setWishlist(updatedWishlist);
    saveWishlist(updatedWishlist);
  };

  // Navigation handler
  const handleNavigate = (view: string, filter?: string) => {
    if (view === 'admin') {
      window.history.pushState(null, '', '/admin');
      setCurrentView('admin');
    } else if (filter) {
      setCategoryFilter(filter);
      setCurrentView('shop');
      window.history.pushState(null, '', '/shop');
    } else {
      setCurrentView(view as any);
      window.history.pushState(null, '', view === 'home' ? '/' : `/${view}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open detail modal
  const handleOpenProductDetail = (product: Product, variationId?: string) => {
    setSelectedProductForDetail(product);
    setSelectedVariationIdForDetail(variationId);
  };

  // Open bulk quote with optional material prefill
  const handleOpenBulkQuote = (materialName?: string) => {
    setBulkQuoteInitialMaterial(materialName || '');
    setIsBulkQuoteOpen(true);
  };

  // Cart metrics
  const totalCartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalCartPrice = cart.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);

  // Featured materials for homepage
  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

  // 1. ISOLATED ADMIN ROUTE (/admin)
  // When an unauthorized person opens /admin, they see ONLY the secure Admin Login screen.
  // When authorized, they see the dedicated Control Center.
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 selection:bg-amber-500 selection:text-slate-950">
        <AdminPanel onBackToStore={() => handleNavigate('home')} />
      </div>
    );
  }

  // 2. REGULAR CUSTOMER STOREFRONT (No Admin links or buttons visible)
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-amber-500 selection:text-slate-950">
      {/* 1. STICKY MAIN HEADER & TOP ANNOUNCEMENT BAR */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        cartTotal={totalCartPrice}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBulkQuote={() => handleOpenBulkQuote()}
      />

      {/* 2. MAIN BODY CONTENT SWITCHER */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div>
            {/* HERO SECTION */}
            <Hero
              onShopClick={() => handleNavigate('shop')}
              onBulkQuoteClick={() => handleOpenBulkQuote()}
            />

            {/* TRUST & SERVICE STRIP */}
            <TrustStrip />

            {/* SHOP BY MATERIAL CATEGORY */}
            <ShopByCategory
              onSelectCategory={(cat) => {
                if (cat === 'all') handleNavigate('shop');
                else handleNavigate('shop', cat);
              }}
            />

            {/* POPULAR MATERIALS / BEST SELLERS SECTION */}
            <section className="py-14 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">
                      Direct from Yard
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                      Popular Construction Materials
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      High-demand cement grades, Fe 550D TMT rebars, and site safety barricades ready for dispatch.
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigate('shop')}
                    className="mt-3 sm:mt-0 text-sm font-bold text-slate-900 hover:text-amber-600 inline-flex items-center gap-1.5 transition-colors group"
                  >
                    <span>View All Materials</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(prod, variation, qty) => handleAddToCart(prod, variation, qty)}
                      onOpenDetails={(prod, varId) => handleOpenProductDetail(prod, varId)}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* PROMOTIONAL WHOLESALE / BULK BANNER */}
            <PromotionalBanner onOpenBulkQuote={() => handleOpenBulkQuote()} />

            {/* BRAND REPUTATION & CERTIFICATION STRIP */}
            <section className="py-12 bg-slate-50 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  Authorized Stockist For India's Leading Infrastructure Brands
                </span>
                <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-700 font-serif font-black text-lg sm:text-2xl opacity-80">
                  <span className="tracking-wider">ULTRATECH</span>
                  <span className="tracking-wider">TATA TISCON</span>
                  <span className="tracking-wider">ACC CEMENT</span>
                  <span className="tracking-wider">JINDAL PANTHER</span>
                  <span className="tracking-wider">AMBUJA CEMENT</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === 'shop' && (
          <ShopPage
            products={products}
            selectedCategory={categoryFilter}
            onCategoryChange={(cat) => setCategoryFilter(cat)}
            onAddToCart={(prod, variation, qty) => handleAddToCart(prod, variation, qty)}
            onOpenDetails={(prod, varId) => handleOpenProductDetail(prod, varId)}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {currentView === 'about' && <AboutSection />}

        {currentView === 'contact' && <ContactSection />}
      </main>

      {/* 3. COMPREHENSIVE FOOTER (Customer only, no Admin links) */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBulkQuote={() => handleOpenBulkQuote()}
      />

      {/* 4. FLOATING QUICK WHATSAPP & PHONE ACTION BUTTONS */}
      <FloatingActions />

      {/* 5. SLIDE-OVER CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={(mode) => {
          setCheckoutOrderType(mode);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 6. CHECKOUT MODAL */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        defaultOrderType={checkoutOrderType}
        onOrderSuccess={() => {
          handleClearCart();
        }}
      />

      {/* 7. BULK WHOLESALE QUOTE MODAL */}
      <BulkQuoteModal
        isOpen={isBulkQuoteOpen}
        onClose={() => setIsBulkQuoteOpen(false)}
        initialMaterial={bulkQuoteInitialMaterial}
      />

      {/* 8. PRODUCT DETAIL MODAL */}
      <ProductDetailModal
        product={selectedProductForDetail}
        initialVariationId={selectedVariationIdForDetail}
        isOpen={!!selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToCart={(prod, variation, qty, pricingMode) => {
          handleAddToCart(prod, variation, qty, pricingMode);
        }}
        onBuyNow={(prod, variation, qty, pricingMode) => {
          handleBuyNow(prod, variation, qty, pricingMode);
        }}
        onOpenBulkQuote={(materialName) => {
          setSelectedProductForDetail(null);
          handleOpenBulkQuote(materialName);
        }}
        isWishlisted={selectedProductForDetail ? wishlist.includes(selectedProductForDetail.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 9. SEARCH MODAL */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(prod) => {
          handleOpenProductDetail(prod);
        }}
        onSelectCategory={(cat) => {
          handleNavigate('shop', cat);
        }}
      />
    </div>
  );
}
