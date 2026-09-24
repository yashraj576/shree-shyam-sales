export type UnitType = 
  | 'Bag' 
  | 'Ton' 
  | 'Kg' 
  | 'Piece' 
  | 'Meter' 
  | 'Bundle' 
  | 'Load' 
  | 'Custom Quote';

export type ProductCategory = 
  | 'Cement' 
  | 'TMT Steel' 
  | 'Steel Barricades' 
  | 'Concrete Barricades' 
  | 'Bricks & Blocks' 
  | 'Sand' 
  | 'Aggregates' 
  | 'Construction Hardware' 
  | 'Other Building Materials';

export type ProductStatus = 'active' | 'draft' | 'archived';

export interface ProductVariation {
  variationId: string;
  name: string;
  sku: string;
  price: number;
  unit: UnitType;
  stock: number;
  image?: string;
  
  // Specific attributes for Cement
  grade?: 'OPC 43' | 'OPC 53' | 'PPC' | 'Weather-Proof';
  
  // Specific attributes for TMT Steel
  size?: '8mm' | '10mm' | '12mm' | '16mm' | '20mm' | '25mm' | '32mm';
  diameter?: number; // in mm
  weightPerMeter?: number; // in kg/m
  bundleWeight?: number; // in kg
  piecesPerBundle?: number;
  pricePerTon?: number;
  pricePerKg?: number;
  pricePerBundle?: number;

  // Specific attributes for Barricades
  type?: string;
  dimensions?: string; // e.g. "6 ft x 3 ft"
  material?: string; // e.g. "MS Steel", "Reinforced M30 Concrete"
  weight?: string; // e.g. "28 kg", "750 kg"
  finish?: string; // e.g. "Powder Coated Yellow/Black", "Natural Cured Concrete"
  color?: string;
  isQuoteOnly?: boolean;

  specifications?: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subcategory?: string;
  brand: string;
  description: string;
  shortDescription: string;
  images: string[];
  basePrice: number;
  unit: UnitType;
  stock: number;
  minimumOrderQuantity: number;
  sku: string;
  status: ProductStatus;
  featured: boolean;
  tags: string[];
  specifications: Record<string, string>;
  variations: ProductVariation[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // unique cart item id
  productId: string;
  product: Product;
  selectedVariationId?: string;
  selectedVariation?: ProductVariation;
  quantity: number;
  unitPrice: number;
  unit: UnitType;
  pricingMode?: 'Ton' | 'Bundle' | 'Kg' | 'Bag' | 'Piece' | 'Standard';
  notes?: string;
}

export type OrderType = 'Regular Order' | 'Bulk Order' | 'Site Delivery';

export type PaymentMethod = 
  | 'Cash on Delivery' 
  | 'Pay on Delivery' 
  | 'Site Delivery Request';

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Dispatched' 
  | 'Delivered' 
  | 'Cancelled';

export interface CustomerDetails {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
}

export interface DeliveryAddress {
  address: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  siteContactPerson: string;
  siteContactNumber: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "SSS-2026-0001"
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: PaymentMethod;
  deliveryType: OrderType;
  deliveryAddress: DeliveryAddress;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type QuoteStatus = 
  | 'Pending' 
  | 'Contacted' 
  | 'Quoted' 
  | 'Accepted' 
  | 'Rejected';

export interface BulkQuote {
  id: string;
  quoteNumber: string; // e.g. "QUOTE-2026-0001"
  customerName: string;
  companyName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  projectName: string;
  projectLocation: string;
  material: string;
  requiredQuantity: string;
  unit: string;
  requiredDeliveryDate: string;
  specialRequirements: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  category: string;
  brand: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  availabilityOnly: boolean;
  unit: string;
  cementGrade: string;
  steelSize: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'name-asc';
}
