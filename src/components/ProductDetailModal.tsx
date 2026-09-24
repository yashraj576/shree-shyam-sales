import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  MessageSquare, 
  Phone, 
  Check, 
  Truck, 
  ShieldCheck, 
  FileText, 
  Layers, 
  Scale, 
  Ruler, 
  Plus, 
  Minus,
  Sparkles,
  Heart
} from 'lucide-react';
import { Product, ProductVariation } from '../types';
import { BUSINESS_PHONE, BUSINESS_PHONE_TEL, buildProductWhatsAppMessage, openWhatsApp } from '../services/whatsapp';

interface ProductDetailModalProps {
  product: Product | null;
  initialVariationId?: string;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variation?: ProductVariation, quantity?: number, pricingMode?: any) => void;
  onBuyNow: (product: Product, variation?: ProductVariation, quantity?: number, pricingMode?: any) => void;
  onOpenBulkQuote: (productName?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialVariationId,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
  onOpenBulkQuote,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!isOpen || !product) return null;

  const [selectedVariationId, setSelectedVariationId] = useState<string>(
    initialVariationId || (product.variations && product.variations.length > 0 ? product.variations[0].variationId : '')
  );

  const [quantity, setQuantity] = useState<number>(product.minimumOrderQuantity || 1);
  const [tmtPricingMode, setTmtPricingMode] = useState<'Ton' | 'Bundle' | 'Kg'>('Ton');

  // Update selection if prop changes
  useEffect(() => {
    if (initialVariationId) {
      setSelectedVariationId(initialVariationId);
    } else if (product.variations && product.variations.length > 0) {
      setSelectedVariationId(product.variations[0].variationId);
    }
    setQuantity(product.minimumOrderQuantity || 1);
  }, [product, initialVariationId]);

  const activeVariation = product.variations?.find((v) => v.variationId === selectedVariationId) || product.variations?.[0];

  // Calculate dynamic price based on TMT pricing mode or standard unit
  const getDynamicPrice = () => {
    if (!activeVariation) return product.basePrice;
    if (activeVariation.isQuoteOnly || activeVariation.price === 0) return 0;

    if (product.category === 'TMT Steel') {
      if (tmtPricingMode === 'Bundle' && activeVariation.pricePerBundle) {
        return activeVariation.pricePerBundle;
      }
      if (tmtPricingMode === 'Kg' && activeVariation.pricePerKg) {
        return activeVariation.pricePerKg;
      }
      return activeVariation.pricePerTon || activeVariation.price;
    }

    return activeVariation.price;
  };

  const currentPrice = getDynamicPrice();
  const currentUnit = product.category === 'TMT Steel' ? tmtPricingMode : (activeVariation?.unit || product.unit);
  const currentStock = activeVariation ? activeVariation.stock : product.stock;
  const currentSku = activeVariation ? activeVariation.sku : product.sku;
  const currentImage = activeVariation?.image || product.images[0];
  const isQuoteOnly = activeVariation?.isQuoteOnly || currentPrice === 0;

  const handleWhatsAppOrder = () => {
    const msg = buildProductWhatsAppMessage(product, activeVariation, quantity);
    openWhatsApp(msg);
  };

  const handleAddCart = () => {
    onAddToCart(product, activeVariation, quantity, tmtPricingMode);
  };

  const handleBuy = () => {
    onBuyNow(product, activeVariation, quantity, tmtPricingMode);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-bold text-slate-900">{product.brand}</span>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="font-mono text-slate-600">SKU: {currentSku}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist(product.id)}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-slate-200 rounded-lg transition-colors"
              title="Add to wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - 2 Column Layout */}
        <div className="overflow-y-auto p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Product Imagery & Trust Highlights */}
            <div className="md:col-span-6 space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-4/3">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {product.featured && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded shadow-xs uppercase">
                    Featured Material
                  </span>
                )}
              </div>

              {/* Trust & Guarantee Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Guaranteed Genuine &amp; Direct from Authorized Yard</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>Direct Site Delivery with Crane / Unloading Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Mill Test Certificate &amp; Weighbridge Slip Provided</span>
                </div>
              </div>
            </div>

            {/* Right: Purchasing Module */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-extrabold text-amber-600 tracking-wider uppercase block mb-1">
                  {product.brand} Certified
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                  {product.name}
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              {/* Dynamic Price Display */}
              <div className="bg-[#FAF9F6] border border-amber-200/60 p-4 rounded-xl flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Indicative Rate (Ex-Yard / Site Supply)</span>
                  {isQuoteOnly ? (
                    <span className="text-xl font-extrabold text-amber-700">
                      Request Project Quotation
                    </span>
                  ) : (
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-3xl font-black text-slate-950 tabular-nums">
                        ₹{currentPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm font-semibold text-slate-600">
                        / {currentUnit}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    currentStock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {currentStock > 0 ? `${currentStock} ${product.unit}s Available` : 'Made to Order'}
                  </span>
                </div>
              </div>

              {/* 1. CEMENT GRADE SELECTOR */}
              {product.category === 'Cement' && product.variations && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Select Cement Grade:</span>
                    <span className="text-amber-600">{activeVariation?.grade}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {product.variations.map((v) => {
                      const isSelected = v.variationId === selectedVariationId;
                      return (
                        <button
                          key={v.variationId}
                          onClick={() => setSelectedVariationId(v.variationId)}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            isSelected
                              ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                          }`}
                        >
                          <span className="block text-xs font-bold">{v.grade}</span>
                          <span className={`block text-[11px] mt-0.5 tabular-nums ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                            ₹{v.price} / Bag
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. TMT STEEL SIZE & PRICING SELECTOR */}
              {product.category === 'TMT Steel' && (
                <div className="space-y-4">
                  {/* Size Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>Select Rebar Diameter (Size):</span>
                      <span className="text-amber-600 font-extrabold">{activeVariation?.size}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.variations.map((v) => {
                        const isSelected = v.variationId === selectedVariationId;
                        return (
                          <button
                            key={v.variationId}
                            onClick={() => setSelectedVariationId(v.variationId)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                              isSelected
                                ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                            }`}
                          >
                            {v.size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* TMT Pricing Mode Toggle */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-900 block">Pricing Calculation Unit:</span>
                    <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-lg">
                      <button
                        onClick={() => setTmtPricingMode('Ton')}
                        className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                          tmtPricingMode === 'Ton' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Per Ton (₹/MT)
                      </button>
                      <button
                        onClick={() => setTmtPricingMode('Bundle')}
                        className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                          tmtPricingMode === 'Bundle' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Per Bundle
                      </button>
                      <button
                        onClick={() => setTmtPricingMode('Kg')}
                        className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                          tmtPricingMode === 'Kg' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Per Kg
                      </button>
                    </div>
                  </div>

                  {/* TMT Dimensions & Bundle Specs Box */}
                  {activeVariation && (
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs">
                      <div>
                        <span className="text-slate-500 block">Bundle Weight</span>
                        <span className="font-bold text-slate-900 tabular-nums">~{activeVariation.bundleWeight} kg</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Pieces/Bundle</span>
                        <span className="font-bold text-slate-900 tabular-nums">{activeVariation.piecesPerBundle || 1} rods</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Standard Length</span>
                        <span className="font-bold text-slate-900">12 meters</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. BARRICADE SPECIFICATION SELECTOR */}
              {(product.category === 'Steel Barricades' || product.category === 'Concrete Barricades') && product.variations && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-900 block">Choose Variation / Type:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.variations.map((v) => {
                      const isSelected = v.variationId === selectedVariationId;
                      return (
                        <button
                          key={v.variationId}
                          onClick={() => setSelectedVariationId(v.variationId)}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            isSelected
                              ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                          }`}
                        >
                          <span className="block text-xs font-bold">{v.name}</span>
                          <span className="block text-[11px] text-slate-400 mt-0.5">
                            {v.dimensions || v.material}
                          </span>
                          <span className={`block text-xs font-extrabold mt-1 tabular-nums ${isSelected ? 'text-amber-300' : 'text-slate-900'}`}>
                            {v.price > 0 ? `₹${v.price.toLocaleString('en-IN')}` : 'Project Quote'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-slate-100 text-slate-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center text-sm font-bold text-slate-900 focus:outline-none tabular-nums"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-slate-100 text-slate-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-slate-500">
                  <span>Total Est.: </span>
                  <span className="font-extrabold text-slate-900 tabular-nums">
                    {currentPrice > 0 ? `₹${(currentPrice * quantity).toLocaleString('en-IN')}` : 'Quote Request'}
                  </span>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddCart}
                    disabled={currentStock <= 0 && !isQuoteOnly}
                    className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span>ADD TO CART</span>
                  </button>

                  <button
                    onClick={handleBuy}
                    className="py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>BUY NOW</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => onOpenBulkQuote(product.name)}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>BULK QUOTE</span>
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WHATSAPP</span>
                  </button>

                  <a
                    href={BUSINESS_PHONE_TEL}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-700" />
                    <span>CALL ORDER</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications & Description Drawer */}
          <div className="mt-10 pt-8 border-t border-slate-200 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Detailed Product Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Technical Specifications &amp; Quality Parameters
              </h3>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <tbody>
                    {/* Combine product specs and variation specific specs */}
                    {Object.entries({
                      ...product.specifications,
                      ...(activeVariation?.specifications || {}),
                    }).map(([key, value], idx) => (
                      <tr 
                        key={key} 
                        className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}
                      >
                        <td className="py-2.5 px-4 font-semibold text-slate-700 w-1/3 border-b border-slate-200">
                          {key}
                        </td>
                        <td className="py-2.5 px-4 text-slate-900 font-medium border-b border-slate-200">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
