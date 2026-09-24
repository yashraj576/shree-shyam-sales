import { Product, Order, BulkQuote, CartItem, OrderStatus, QuoteStatus } from '../types';
import { DEMO_PRODUCTS, INITIAL_ORDERS, INITIAL_QUOTES } from '../data/demoProducts';

const DB_NAME = 'ShreeShyamSalesDB';
const DB_VERSION = 1;
const PRODUCTS_STORE = 'products';
const ORDERS_STORE = 'orders';
const QUOTES_STORE = 'quotes';

const STORAGE_KEYS = {
  CART: 'sss_cart_v1',
  WISHLIST: 'sss_wishlist_v1',
  LOW_STOCK_THRESHOLD: 'sss_low_stock_threshold',
  DB_FALLBACK_PRODUCTS: 'sss_fb_products_v1',
  DB_FALLBACK_ORDERS: 'sss_fb_orders_v1',
  DB_FALLBACK_QUOTES: 'sss_fb_quotes_v1',
};

// Custom event for reactive cross-component updates
export const DB_UPDATE_EVENT = 'shree_shyam_db_updated';
export function notifyDatabaseChanged(type: 'products' | 'orders' | 'quotes' | 'cart' | 'wishlist') {
  window.dispatchEvent(new CustomEvent(DB_UPDATE_EVENT, { detail: { type, timestamp: Date.now() } }));
}

// Open IndexedDB connection
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(PRODUCTS_STORE)) {
        db.createObjectStore(PRODUCTS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(ORDERS_STORE)) {
        db.createObjectStore(ORDERS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(QUOTES_STORE)) {
        db.createObjectStore(QUOTES_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const ORDERS_CLEARED_FLAG = 'sss_analytics_reset_to_zero_v1';

// Reset orders, quotes, and sales metrics to zero (fresh start for real-time history)
export async function clearOrdersAndQuotes(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction([ORDERS_STORE, QUOTES_STORE], 'readwrite');
    tx.objectStore(ORDERS_STORE).clear();
    tx.objectStore(QUOTES_STORE).clear();
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB clear orders fallback:', err);
  }
  localStorage.setItem(STORAGE_KEYS.DB_FALLBACK_ORDERS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.DB_FALLBACK_QUOTES, JSON.stringify([]));
  notifyDatabaseChanged('orders');
  notifyDatabaseChanged('quotes');
}

// Check and seed default data if database is empty
export async function initializeDatabase(): Promise<void> {
  // Ensure all fake/dummy orders and analytics are reset to zero
  if (typeof window !== 'undefined' && !localStorage.getItem(ORDERS_CLEARED_FLAG)) {
    try {
      await clearOrdersAndQuotes();
      localStorage.setItem(ORDERS_CLEARED_FLAG, 'true');
    } catch (e) {
      console.warn('Initial orders zero reset error:', e);
    }
  }

  try {
    const products = await getProducts();
    if (products.length === 0) {
      await resetDatabaseToDemo();
    }
  } catch (err) {
    console.error('Failed to init IndexedDB, using localStorage fallback', err);
    const fbProds = localStorage.getItem(STORAGE_KEYS.DB_FALLBACK_PRODUCTS);
    if (!fbProds) {
      localStorage.setItem(STORAGE_KEYS.DB_FALLBACK_PRODUCTS, JSON.stringify(DEMO_PRODUCTS));
      localStorage.setItem(STORAGE_KEYS.DB_FALLBACK_ORDERS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.DB_FALLBACK_QUOTES, JSON.stringify([]));
    }
  }
}

// Reset database to rich pre-populated demo data
export async function resetDatabaseToDemo(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction([PRODUCTS_STORE, ORDERS_STORE, QUOTES_STORE], 'readwrite');
    
    // Clear stores
    tx.objectStore(PRODUCTS_STORE).clear();
    tx.objectStore(ORDERS_STORE).clear();
    tx.objectStore(QUOTES_STORE).clear();

    const pStore = tx.objectStore(PRODUCTS_STORE);
    DEMO_PRODUCTS.forEach(p => pStore.put(p));

    const oStore = tx.objectStore(ORDERS_STORE);
    INITIAL_ORDERS.forEach(o => oStore.put(o));

    const qStore = tx.objectStore(QUOTES_STORE);
    INITIAL_QUOTES.forEach(q => qStore.put(q));

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    localStorage.setItem(STORAGE_KEYS.DB_FALLBACK_PRODUCTS, JSON.stringify(DEMO_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.DB_FALLBACK_ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.DB_FALLBACK_QUOTES, JSON.stringify(INITIAL_QUOTES));
  }

  notifyDatabaseChanged('products');
  notifyDatabaseChanged('orders');
  notifyDatabaseChanged('quotes');
}

// ================= PRODUCT REPOSITORY =================

export async function getProducts(): Promise<Product[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PRODUCTS_STORE, 'readonly');
      const store = tx.objectStore(PRODUCTS_STORE);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch {
    const raw = localStorage.getItem(STORAGE_KEYS.DB_FALLBACK_PRODUCTS);
    return raw ? JSON.parse(raw) : DEMO_PRODUCTS;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}

export async function saveProduct(product: Product): Promise<Product> {
  try {
    const db = await openDB();
    const tx = db.transaction(PRODUCTS_STORE, 'readwrite');
    tx.objectStore(PRODUCTS_STORE).put(product);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const prods = await getProducts();
    const idx = prods.findIndex(p => p.id === product.id);
    if (idx >= 0) prods[idx] = product;
    else prods.unshift(product);
    localStorage.setItem(STORAGE_KEYS.DB_FALLBACK_PRODUCTS, JSON.stringify(prods));
  }
  notifyDatabaseChanged('products');
  return product;
}

export async function updateProduct(product: Product): Promise<Product> {
  product.updatedAt = new Date().toISOString();
  return saveProduct(product);
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const db = await openDB();
    const tx = db.transaction(PRODUCTS_STORE, 'readwrite');
    tx.objectStore(PRODUCTS_STORE).delete(id);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const prods = (await getProducts()).filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.DB_FALLBACK_PRODUCTS, JSON.stringify(prods));
  }
  notifyDatabaseChanged('products');
  return true;
}

export async function duplicateProduct(id: string): Promise<Product> {
  const original = await getProductById(id);
  if (!original) throw new Error('Product not found');

  const newId = `prod-${Date.now()}`;
  const duplicate: Product = {
    ...original,
    id: newId,
    name: `${original.name} (Copy)`,
    sku: `${original.sku}-COPY`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variations: original.variations.map(v => ({
      ...v,
      variationId: `${v.variationId}-copy-${Date.now().toString().slice(-4)}`,
      sku: `${v.sku}-COPY`,
    })),
  };
  return saveProduct(duplicate);
}

// ================= ORDER REPOSITORY =================

export async function getOrders(): Promise<Order[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(ORDERS_STORE, 'readonly');
      const store = tx.objectStore(ORDERS_STORE);
      const request = store.getAll();
      request.onsuccess = () => {
        const list: Order[] = request.result || [];
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(list);
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    const raw = localStorage.getItem(STORAGE_KEYS.DB_FALLBACK_ORDERS);
    return raw ? JSON.parse(raw) : INITIAL_ORDERS;
  }
}

export async function createOrder(
  orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
): Promise<Order> {
  const timestamp = Date.now();
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `SSS-${year}-${randomSuffix}`;
  const id = `ord-${timestamp}`;

  const newOrder: Order = {
    ...orderData,
    id,
    orderNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await openDB();
    const tx = db.transaction(ORDERS_STORE, 'readwrite');
    tx.objectStore(ORDERS_STORE).put(newOrder);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const orders = await getOrders();
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.DB_FALLBACK_ORDERS, JSON.stringify(orders));
  }

  // Deduct stocks from products in DB
  try {
    for (const item of newOrder.items) {
      const product = await getProductById(item.productId);
      if (product) {
        if (item.selectedVariationId && product.variations) {
          const vIdx = product.variations.findIndex(v => v.variationId === item.selectedVariationId);
          if (vIdx >= 0) {
            product.variations[vIdx].stock = Math.max(0, product.variations[vIdx].stock - item.quantity);
          }
        }
        product.stock = Math.max(0, product.stock - item.quantity);
        await updateProduct(product);
      }
    }
  } catch (err) {
    console.error('Error updating stocks on order creation', err);
  }

  notifyDatabaseChanged('orders');
  notifyDatabaseChanged('products');
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  const orders = await getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) throw new Error('Order not found');

  order.status = status;
  order.updatedAt = new Date().toISOString();

  try {
    const db = await openDB();
    const tx = db.transaction(ORDERS_STORE, 'readwrite');
    tx.objectStore(ORDERS_STORE).put(order);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    localStorage.setItem(STORAGE_KEYS.DB_FALLBACK_ORDERS, JSON.stringify(orders));
  }

  notifyDatabaseChanged('orders');
  return order;
}

// ================= BULK QUOTE REPOSITORY =================

export async function getQuotes(): Promise<BulkQuote[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(QUOTES_STORE, 'readonly');
      const store = tx.objectStore(QUOTES_STORE);
      const request = store.getAll();
      request.onsuccess = () => {
        const list: BulkQuote[] = request.result || [];
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(list);
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    const raw = localStorage.getItem(STORAGE_KEYS.DB_FALLBACK_QUOTES);
    return raw ? JSON.parse(raw) : INITIAL_QUOTES;
  }
}

export async function createQuote(
  quoteData: Omit<BulkQuote, 'id' | 'quoteNumber' | 'createdAt' | 'updatedAt'>
): Promise<BulkQuote> {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const quoteNumber = `QUOTE-${year}-${randomNum}`;
  const id = `quote-${Date.now()}`;

  const newQuote: BulkQuote = {
    ...quoteData,
    id,
    quoteNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await openDB();
    const tx = db.transaction(QUOTES_STORE, 'readwrite');
    tx.objectStore(QUOTES_STORE).put(newQuote);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const quotes = await getQuotes();
    quotes.unshift(newQuote);
    localStorage.setItem(STORAGE_KEYS.DB_FALLBACK_QUOTES, JSON.stringify(quotes));
  }

  notifyDatabaseChanged('quotes');
  return newQuote;
}

export async function updateQuoteStatus(quoteId: string, status: QuoteStatus): Promise<BulkQuote> {
  const quotes = await getQuotes();
  const quote = quotes.find(q => q.id === quoteId);
  if (!quote) throw new Error('Quote not found');

  quote.status = status;
  quote.updatedAt = new Date().toISOString();

  try {
    const db = await openDB();
    const tx = db.transaction(QUOTES_STORE, 'readwrite');
    tx.objectStore(QUOTES_STORE).put(quote);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    localStorage.setItem(STORAGE_KEYS.DB_FALLBACK_QUOTES, JSON.stringify(quotes));
  }

  notifyDatabaseChanged('quotes');
  return quote;
}

export async function deleteQuote(quoteId: string): Promise<boolean> {
  try {
    const db = await openDB();
    const tx = db.transaction(QUOTES_STORE, 'readwrite');
    tx.objectStore(QUOTES_STORE).delete(quoteId);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const quotes = (await getQuotes()).filter(q => q.id !== quoteId);
    localStorage.setItem(STORAGE_KEYS.DB_FALLBACK_QUOTES, JSON.stringify(quotes));
  }
  notifyDatabaseChanged('quotes');
  return true;
}

// ================= LOCAL STORAGE HELPERS =================

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    notifyDatabaseChanged('cart');
  } catch (err) {
    console.error('Failed to save cart to localStorage', err);
  }
}

export function getWishlist(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWishlist(wishlist: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    notifyDatabaseChanged('wishlist');
  } catch (err) {
    console.error('Failed to save wishlist to localStorage', err);
  }
}

export function getLowStockThreshold(): number {
  const val = localStorage.getItem(STORAGE_KEYS.LOW_STOCK_THRESHOLD);
  return val ? parseInt(val, 10) : 15;
}

export function setLowStockThreshold(val: number): void {
  localStorage.setItem(STORAGE_KEYS.LOW_STOCK_THRESHOLD, val.toString());
}
