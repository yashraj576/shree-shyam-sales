import React, { useState } from 'react';
import { Heart, ShoppingBag, MessageSquare, ShieldCheck, Check, Eye } from 'lucide-react';
import { Product, ProductVariation } from '../types';
import { buildProductWhatsAppMessage, openWhatsApp } from '../services/whatsapp';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variation?: ProductVariation, quantity?: number) => void;
  onOpenDetails: (product: Product, variationId?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenDetails,
  isWishlisted,
  onToggleWishlist,
}) => {
  // Default selected variation is the first variation or undefined
  const [selectedVariationId, setSelectedVariationId] = useState<string>(
    product.variations && product.variations.length > 0 ? product.variations[0].variationId : ''
  );

  const selectedVariation: ProductVariation | undefined = product.variations?.find(
    (v) => v.variationId === selectedVariationId
  ) || product.variations?.[0];

  const currentPrice = selectedVariation ? selectedVariation.price : product.basePrice;
  const currentUnit = selectedVariation?.unit || product.unit;
  const currentStock = selectedVariation ? selectedVariation.stock : product.stock;
  const currentImage = selectedVariation?.image || product.images[0];
  const isQuoteOnly = selectedVariation?.isQuoteOnly || currentPrice === 0;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = buildProductWhatsAppMessage(product, selectedVariation, 1);
    openWhatsApp(msg);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedVariation, 1);
  };

  return (
    <div
      onClick={() => onOpenDetails(product, selectedVariationId)}
      className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Image Area */}
      <div className="relative aspect-4/3 w-full bg-slate-50 overflow-hidden">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-red-500 shadow-xs transition-colors"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Featured Tag or Low Stock Indicator */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.featured && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wide uppercase">
              Featured
            </span>
          )}
          {currentStock <= 0 ? (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              Out of Stock
            </span>
          ) : currentStock < 10 ? (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              Low Stock: {currentStock} left
            </span>
          ) : null}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category line */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold text-slate-700 uppercase tracking-wider">{product.brand}</span>
            <span>{product.category}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Dynamic Variation Selector Chips */}
          {product.variations && product.variations.length > 1 && (
            <div className="mt-3 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                {product.category === 'Cement'
                  ? 'Select Grade:'
                  : product.category === 'TMT Steel'
                  ? 'Select Size:'
                  : 'Select Specification:'}
              </span>
              <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
                {product.variations.slice(0, 5).map((v) => {
                  const isSelected = v.variationId === selectedVariationId;
                  const label = v.grade || v.size || v.name;
                  return (
                    <button
                      key={v.variationId}
                      onClick={() => setSelectedVariationId(v.variationId)}
                      className={`px-2 py-1 text-[11px] font-semibold rounded transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
                {product.variations.length > 5 && (
                  <span className="text-[10px] text-slate-400 self-center">
                    +{product.variations.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Stock Status */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              {isQuoteOnly ? (
                <span className="text-sm font-bold text-amber-600">Custom Project Quote</span>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-extrabold text-slate-900 tabular-nums">
                    ₹{currentPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    / {currentUnit}
                  </span>
                </div>
              )}
            </div>

            <div className="text-right">
              <span className={`text-[11px] font-semibold ${currentStock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {currentStock > 0 ? `In Stock (${currentStock})` : 'Order on Quote'}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCartClick}
              disabled={currentStock <= 0 && !isQuoteOnly}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                currentStock <= 0 && !isQuoteOnly
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleWhatsAppClick}
              className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
