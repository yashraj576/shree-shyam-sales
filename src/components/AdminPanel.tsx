import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  LogOut, 
  Package, 
  ShoppingBag, 
  FileText, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  CheckCircle, 
  Clock, 
  RotateCcw, 
  Layers, 
  Search, 
  Save, 
  X,
  ExternalLink,
  Phone,
  MessageSquare,
  Eye,
  EyeOff,
  Download
} from 'lucide-react';
import { Product, Order, BulkQuote, OrderStatus, QuoteStatus, ProductCategory } from '../types';
import { 
  getProducts, 
  saveProduct, 
  updateProduct, 
  deleteProduct, 
  duplicateProduct, 
  getOrders, 
  updateOrderStatus, 
  getQuotes, 
  updateQuoteStatus, 
  deleteQuote, 
  resetDatabaseToDemo,
  clearOrdersAndQuotes,
  getLowStockThreshold,
  setLowStockThreshold
} from '../services/db';
import { buildBulkQuoteWhatsAppMessage, openWhatsApp, BUSINESS_PHONE_TEL } from '../services/whatsapp';

const PRIMARY_ADMIN_PASSWORD = 'admin1234';
const SECONDARY_ADMIN_PASSWORD = 'ShreeShyam2026';
const LEGACY_ADMIN_PASSWORD = 'श्री श्याम सेल चतरा 2026';
const ADMIN_SESSION_STORAGE_KEY = 'sss_admin_authenticated_session';

interface AdminPanelProps {
  onBackToStore: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToStore }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === 'true';
    }
    return false;
  });
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'quotes' | 'settings'>('dashboard');

  // Database Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<BulkQuote[]>([]);
  const [lowStockThreshold, setLowStockThresholdState] = useState<number>(getLowStockThreshold());

  // Editing Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // Selected Order / Quote detail modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<BulkQuote | null>(null);

  // Status message alert
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const loadData = async () => {
    try {
      const [prods, ords, qts] = await Promise.all([
        getProducts(),
        getOrders(),
        getQuotes(),
      ]);

      // If any lingering fake/dummy orders exist, purge them to ensure clean zero state
      const hasDummyOrders = ords.some(o => o.id === 'ord-001' || o.id === 'ord-002');
      const hasDummyQuotes = qts.some(q => q.id === 'quote-001' || q.id === 'quote-002');
      if (hasDummyOrders || hasDummyQuotes) {
        await clearOrdersAndQuotes();
        setProducts(prods);
        setOrders([]);
        setQuotes([]);
        return;
      }

      setProducts(prods);
      setOrders(ords);
      setQuotes(qts);
    } catch (err) {
      console.error('Failed to load admin data', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Handle Direct Password Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanInput = adminPassword.trim();
    const normInput = cleanInput.replace(/\s+/g, ' ').normalize('NFC');
    const normLegacy = LEGACY_ADMIN_PASSWORD.replace(/\s+/g, ' ').normalize('NFC');

    const isMatch = 
      cleanInput === PRIMARY_ADMIN_PASSWORD ||
      cleanInput === SECONDARY_ADMIN_PASSWORD ||
      cleanInput.toLowerCase() === SECONDARY_ADMIN_PASSWORD.toLowerCase() ||
      cleanInput === LEGACY_ADMIN_PASSWORD ||
      normInput === normLegacy;

    if (isMatch) {
      localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setAdminPassword('');
      setLoginError('');
      loadData();
    } else {
      setLoginError('गलत पासवर्ड! (Incorrect Password)');
      alert('गलत पासवर्ड! (Incorrect Password)');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    setIsAuthenticated(false);
    setAdminPassword('');
    setLoginError('');
  };

  // Product CRUD
  const handleOpenNewProduct = () => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: '',
      brand: 'UltraTech',
      category: 'Cement',
      shortDescription: '',
      description: '',
      sku: `SSS-${Math.floor(1000 + Math.random() * 9000)}`,
      basePrice: 380,
      unit: 'Bag',
      minimumOrderQuantity: 10,
      stock: 100,
      featured: false,
      status: 'active',
      tags: ['Cement', 'Building Material'],
      images: ['https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80'],
      specifications: {
        'Standard Compliance': 'IS 269:2015',
        'Packaging': '50 kg Tamper-proof bag',
      },
      variations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingProduct(newProd);
    setIsNewProduct(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.name.trim()) {
      alert('Product name is required');
      return;
    }

    try {
      await saveProduct(editingProduct);
      setEditingProduct(null);
      await loadData();
      showToast('Product saved successfully');
    } catch (err) {
      console.error('Failed to save product', err);
      alert('Error saving product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      await loadData();
      showToast('Product deleted');
    }
  };

  const handleDuplicateProduct = async (id: string) => {
    try {
      await duplicateProduct(id);
      await loadData();
      showToast('Product duplicated');
    } catch (err) {
      console.error(err);
    }
  };

  // Order Status Change
  const handleOrderStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      await loadData();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
      showToast(`Order updated to ${status}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Quote Status Change
  const handleQuoteStatusChange = async (quoteId: string, status: QuoteStatus) => {
    try {
      await updateQuoteStatus(quoteId, status);
      await loadData();
      if (selectedQuote && selectedQuote.id === quoteId) {
        setSelectedQuote({ ...selectedQuote, status });
      }
      showToast(`Quote updated to ${status}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Reset to Demo Catalog
  const handleResetDemo = async () => {
    if (window.confirm('Reset all catalog products to default demo catalog? (Orders will remain empty)')) {
      await resetDatabaseToDemo();
      await loadData();
      showToast('Database reset to fresh demo catalog');
    }
  };

  // Reset Analytics & Orders to Zero
  const handleResetAnalytics = async () => {
    if (window.confirm('Reset all analytics, orders, and sales metrics to ₹0?')) {
      await clearOrdersAndQuotes();
      await loadData();
      showToast('All sales metrics, orders, and quotes reset to zero (₹0)!');
    }
  };

  // Quick Inline Stock / Price Update
  const handleInlineStockChange = async (product: Product, newStock: number) => {
    product.stock = Math.max(0, newStock);
    await updateProduct(product);
    await loadData();
    showToast(`Stock updated for ${product.name}`);
  };

  const handleInlinePriceChange = async (product: Product, newPrice: number) => {
    product.basePrice = Math.max(0, newPrice);
    await updateProduct(product);
    await loadData();
    showToast(`Base price updated for ${product.name}`);
  };

  // Unauthorized View: Direct Password Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400 mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 font-serif">
              Admin Login
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Please enter the Admin Password to access the control center.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-bold text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter Admin Password (e.g. admin1234)"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full p-3 pr-10 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              Login
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onBackToStore}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              ← Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics for Dashboard
  const totalRevenue = orders.reduce((acc, o) => (o.status !== 'Cancelled' ? acc + o.total : acc), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const pendingQuotes = quotes.filter((q) => q.status === 'Pending').length;
  const lowStockProducts = products.filter((p) => p.stock <= lowStockThreshold);

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Navbar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-amber-400 font-black">
              SSS
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 font-serif">
                SHREE SHYAM SALES — Control Center
              </h1>
              <p className="text-xs text-slate-500">
                Authorized Administrator Session Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex flex-col text-right pr-2 border-r border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Session</span>
              <span className="text-xs font-bold text-emerald-600">● Master Admin Active</span>
            </div>
            <button
              onClick={onBackToStore}
              className="px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              View Storefront
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-white border border-slate-200 rounded-xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products &amp; Pricing ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
            {pendingOrders > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center">
                {pendingOrders}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'quotes'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Bulk Quotes ({quotes.length})</span>
            {pendingQuotes > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                {pendingQuotes}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Settings &amp; Reset</span>
          </button>
        </div>

        {/* ================= 1. DASHBOARD TAB ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Total Order Value
                </span>
                <span className="text-2xl font-black text-slate-900 tabular-nums mt-1 block">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  From {orders.length} registered orders
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Pending Dispatch Orders
                </span>
                <span className="text-2xl font-black text-amber-600 tabular-nums mt-1 block">
                  {pendingOrders}
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  Awaiting site confirmation
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Bulk Wholesale Quotes
                </span>
                <span className="text-2xl font-black text-blue-600 tabular-nums mt-1 block">
                  {quotes.length}
                </span>
                <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
                  {pendingQuotes} awaiting rates
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Low Stock Warnings
                </span>
                <span className={`text-2xl font-black tabular-nums mt-1 block ${lowStockProducts.length > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                  {lowStockProducts.length}
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  Threshold: ≤ {lowStockThreshold} units
                </span>
              </div>
            </div>

            {/* Low Stock Alerts */}
            {lowStockProducts.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Materials Requiring Stock Replenishment</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="p-3 bg-white rounded-lg border border-amber-200 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block truncate max-w-[180px]">{p.name}</span>
                        <span className="text-slate-500">{p.brand}</span>
                      </div>
                      <span className="font-extrabold text-red-600 bg-red-50 px-2 py-1 rounded">
                        {p.stock} {p.unit}s
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Recent Site Deliveries &amp; Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Site City</th>
                      <th className="py-2.5 px-3">Total Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                          <p className="font-bold text-slate-700 text-xs">No orders placed yet (₹0 Sales)</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Real-time contractor and site delivery orders placed on the store will show up here.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                          <td className="py-3 px-3">{ord.customer.name}</td>
                          <td className="py-3 px-3">{ord.deliveryAddress.city}</td>
                          <td className="py-3 px-3 font-bold text-slate-900 tabular-nums">
                            ₹{ord.total.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="text-amber-600 hover:text-amber-700 font-bold"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. PRODUCTS & PRICING TAB ================= */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Material Catalog &amp; Live Inventory</h3>
                <p className="text-xs text-slate-500">
                  Manage grades, rebar diameters, wholesale pricing, stock counts, and variations.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    placeholder="Filter products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  onClick={handleOpenNewProduct}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add Material</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider bg-slate-50">
                    <th className="py-3 px-3">Product Name &amp; SKU</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Base Price</th>
                    <th className="py-3 px-3">Available Stock</th>
                    <th className="py-3 px-3">Variations</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {products
                    .filter(
                      (p) =>
                        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                        p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
                        p.sku.toLowerCase().includes(productSearch.toLowerCase())
                    )
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-10 h-10 rounded-md object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block truncate max-w-xs">{p.name}</span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {p.brand} • {p.sku}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{p.category}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1">
                            <span>₹</span>
                            <input
                              type="number"
                              value={p.basePrice}
                              onChange={(e) => handleInlinePriceChange(p, parseFloat(e.target.value) || 0)}
                              className="w-20 p-1 border border-slate-200 rounded font-bold text-slate-900 tabular-nums focus:outline-none focus:border-slate-900"
                            />
                            <span className="text-slate-400 text-[10px]">/{p.unit}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={p.stock}
                            onChange={(e) => handleInlineStockChange(p, parseInt(e.target.value) || 0)}
                            className={`w-16 p-1 border rounded font-bold tabular-nums focus:outline-none ${
                              p.stock <= lowStockThreshold
                                ? 'border-red-300 text-red-600 bg-red-50'
                                : 'border-slate-200 text-slate-900'
                            }`}
                          />
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-slate-500 font-semibold">
                            {p.variations ? `${p.variations.length} options` : 'None'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsNewProduct(false);
                            }}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicateProduct(p.id)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                            title="Duplicate Product"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 3. CUSTOMER ORDERS TAB ================= */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Site Orders &amp; Dispatches</h3>
                <p className="text-xs text-slate-500">
                  Manage contractor site orders, update dispatch statuses, and verify delivery receipts.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider bg-slate-50">
                    <th className="py-3 px-3">Order Number</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Customer Contact</th>
                    <th className="py-3 px-3">Items Count</th>
                    <th className="py-3 px-3">Grand Total</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">View / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-14 text-center text-slate-500">
                        <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="font-bold text-slate-700 text-sm">No Customer Orders Yet (₹0 Revenue)</p>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                          All fake/dummy orders have been cleared. Real-time orders placed on the store or via WhatsApp checkout will appear here.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                        <td className="py-3 px-3 text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{ord.customer.name}</span>
                          <span className="text-[11px] text-slate-500">{ord.customer.phone}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-700">{ord.items.length} materials</td>
                        <td className="py-3 px-3 font-bold text-slate-900 tabular-nums">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={ord.status}
                            onChange={(e) => handleOrderStatusChange(ord.id, e.target.value as OrderStatus)}
                            className={`p-1 rounded text-xs font-bold border ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : ord.status === 'Pending'
                                ? 'bg-amber-50 border-amber-200 text-amber-800'
                                : 'bg-blue-50 border-blue-200 text-blue-800'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-800 font-bold"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 4. BULK QUOTES TAB ================= */}
        {activeTab === 'quotes' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Bulk Wholesale Quotations</h3>
                <p className="text-xs text-slate-500">
                  Review contractor requisitions, generate commercial rate slips, and follow up via WhatsApp.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider bg-slate-50">
                    <th className="py-3 px-3">Quote ID</th>
                    <th className="py-3 px-3">Contractor / Firm</th>
                    <th className="py-3 px-3">Material &amp; Quantity</th>
                    <th className="py-3 px-3">Site Location</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">WhatsApp Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {quotes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-14 text-center text-slate-500">
                        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="font-bold text-slate-700 text-sm">No Bulk Quote Requests Yet</p>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                          All fake quotes cleared. New contractor bulk estimates and commercial rate inquiries will appear here in real-time.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    quotes.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{q.quoteNumber}</td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{q.customerName}</span>
                          <span className="text-slate-400 text-[11px]">{q.companyName || 'Individual Contractor'}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-800 block truncate max-w-xs">{q.material}</span>
                          <span className="text-amber-700 font-bold text-[11px]">
                            {q.requiredQuantity} {q.unit}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{q.projectLocation}</td>
                        <td className="py-3 px-3">
                          <select
                            value={q.status}
                            onChange={(e) => handleQuoteStatusChange(q.id, e.target.value as QuoteStatus)}
                            className="p-1 rounded text-xs font-bold border border-slate-200 bg-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Quoted">Quoted</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              const msg = buildBulkQuoteWhatsAppMessage(q);
                              openWhatsApp(msg);
                            }}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-bold inline-flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-600" />
                            <span>Reply</span>
                          </button>
                          <button
                            onClick={() => setSelectedQuote(q)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 5. SETTINGS & RESET TAB ================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 max-w-2xl">
            <h3 className="font-bold text-slate-900 text-base">Database &amp; Storefront Settings</h3>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="font-bold text-slate-900 block text-sm">Inventory Alert Threshold</span>
                <p className="text-slate-500">
                  Flag products with a warning badge when stock drops below this number:
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setLowStockThresholdState(val);
                      setLowStockThreshold(val);
                    }}
                    className="w-24 p-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900"
                  />
                  <span className="text-slate-600 font-semibold">units / bags / tons</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 block text-sm">Download Project Source Code (.ZIP)</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold">3.7 MB</span>
                </div>
                <p className="text-emerald-800">
                  Directly download the complete source code package containing all components, styles, TypeScript logic, assets, configuration, and README.md.
                </p>
                <a
                  href="/shree-shyam-sales-source.zip"
                  download="shree-shyam-sales-source.zip"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors shadow-sm cursor-pointer text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Complete ZIP Package</span>
                </a>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
                <span className="font-bold text-amber-900 block text-sm">Reset Sales Metrics &amp; Orders to Zero</span>
                <p className="text-amber-800">
                  Purge all order history and dummy quotes. Resets Total Order Value to ₹0 and Total Orders to 0 for a clean start with real-time customer transactions.
                </p>
                <button
                  onClick={handleResetAnalytics}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Analytics to ₹0</span>
                </button>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
                <span className="font-bold text-red-900 block text-sm">Demo Data Factory Reset</span>
                <p className="text-red-700">
                  Reset the catalog back to original pre-populated cement, TMT steel, and barricade products (orders remain ₹0).
                </p>
                <button
                  onClick={handleResetDemo}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Demo Catalog</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= EDIT / CREATE PRODUCT MODAL ================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                {isNewProduct ? 'Add New Material' : `Edit Material: ${editingProduct.name}`}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Cement">Cement</option>
                    <option value="TMT Steel">TMT Steel</option>
                    <option value="Steel Barricades">Steel Barricades</option>
                    <option value="Concrete Barricades">Concrete Barricades</option>
                    <option value="Bricks & Blocks">Bricks &amp; Blocks</option>
                    <option value="Sand">Sand</option>
                    <option value="Aggregates">Aggregates</option>
                    <option value="Construction Hardware">Construction Hardware</option>
                    <option value="Other Building Materials">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.basePrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={editingProduct.unit}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value as any })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available Stock Count</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={editingProduct.shortDescription}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={editingProduct.featured}
                  onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <label htmlFor="featured-check" className="font-bold text-slate-800">
                  Feature this material on Homepage
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>Save Material</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ORDER DETAILS INSPECTION MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600">{selectedOrder.orderNumber}</span>
                <h3 className="font-bold text-slate-900 text-base">Site Order Details</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Customer: {selectedOrder.customer.name}</span>
                  <a href={`tel:${selectedOrder.customer.phone}`} className="text-amber-600">
                    {selectedOrder.customer.phone}
                  </a>
                </div>
                <div className="text-slate-600">
                  <strong>Delivery Site:</strong> {selectedOrder.deliveryAddress.address},{' '}
                  {selectedOrder.deliveryAddress.city} - {selectedOrder.deliveryAddress.pinCode}
                </div>
                <div className="text-slate-600">
                  <strong>Site Contact:</strong> {selectedOrder.deliveryAddress.siteContactPerson} (
                  {selectedOrder.deliveryAddress.siteContactNumber})
                </div>
                <div className="text-slate-600">
                  <strong>Payment Terms:</strong> {selectedOrder.paymentMethod}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-2">Order Line Items:</span>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg p-3 space-y-2">
                  {selectedOrder.items.map((it) => (
                    <div key={it.id} className="pt-2 first:pt-0 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900 block">{it.product.name}</span>
                        <span className="text-slate-500 text-[11px]">
                          Qty: {it.quantity} {it.unit} @ ₹{it.unitPrice}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 tabular-nums">
                        ₹{(it.quantity * it.unitPrice).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-slate-200 flex justify-between font-extrabold text-slate-900 text-sm">
                    <span>Order Total:</span>
                    <span className="text-amber-600 tabular-nums">₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= QUOTE DETAILS INSPECTION MODAL ================= */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600">{selectedQuote.quoteNumber}</span>
                <h3 className="font-bold text-slate-900 text-base">Bulk Quotation Requisition</h3>
              </div>
              <button onClick={() => setSelectedQuote(null)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Contractor / Firm:</span>
                  <span className="font-bold text-slate-900">
                    {selectedQuote.customerName} ({selectedQuote.companyName || 'Individual'})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-bold text-slate-900">{selectedQuote.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Project Location:</span>
                  <span className="font-bold text-slate-900">{selectedQuote.projectLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Required Material:</span>
                  <span className="font-bold text-slate-900">{selectedQuote.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quantity Needed:</span>
                  <span className="font-bold text-amber-700 text-sm">
                    {selectedQuote.requiredQuantity} {selectedQuote.unit}
                  </span>
                </div>
                {selectedQuote.specialRequirements && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-500 block mb-1">Contractor Notes:</span>
                    <p className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-800">
                      {selectedQuote.specialRequirements}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
              <button
                onClick={() => {
                  const msg = buildBulkQuoteWhatsAppMessage(selectedQuote);
                  openWhatsApp(msg);
                }}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Send WhatsApp Quote</span>
              </button>
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
