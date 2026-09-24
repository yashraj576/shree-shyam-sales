import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  MessageSquare, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { CartItem } from '../types';
import { openWhatsApp, WHATSAPP_BASE_URL } from '../services/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: (orderMode: 'Regular Order' | 'Bulk Order') => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  const [orderMode, setOrderMode] = useState<'Regular Order' | 'Bulk Order'>('Regular Order');

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const deliveryCharge = orderMode === 'Bulk Order' ? 0 : (subtotal > 20000 || subtotal === 0 ? 0 : 750);
  const grandTotal = subtotal + deliveryCharge;

  // Formatted WhatsApp message for whole cart
  const handleCartWhatsApp = () => {
    if (cart.length === 0) return;

    const itemsSummary = cart
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.product.name} ${
            item.selectedVariation ? `(${item.selectedVariation.name})` : ''
          }\n   Qty: ${item.quantity} ${item.unit} @ ₹${item.unitPrice.toLocaleString('en-IN')}`
      )
      .join('\n\n');

    const message = `Hello Shree Shyam Sales,

I want to place an order for the following building materials:

Order Type:
${orderMode}

Items in Cart:
${itemsSummary}

Estimated Total: ₹${grandTotal.toLocaleString('en-IN')}

Delivery Location:
________________________

Customer Name:
________________________

Phone:
________________________

Please confirm item availability, dispatch timeframe, and freight charges.`;

    openWhatsApp(message);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-slate-900 text-base">Your Materials Cart</h2>
            <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full tabular-nums">
              {cart.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Mode Toggle (Regular vs Bulk / Wholesale Quote) */}
        <div className="px-4 py-3 bg-amber-50/70 border-b border-amber-200/50 flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-800">Order Mode:</span>
          <div className="flex p-1 bg-white rounded-lg border border-amber-200 text-xs font-semibold">
            <button
              onClick={() => setOrderMode('Regular Order')}
              className={`px-3 py-1 rounded-md transition-all ${
                orderMode === 'Regular Order'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Regular Order
            </button>
            <button
              onClick={() => setOrderMode('Bulk Order')}
              className={`px-3 py-1 rounded-md transition-all ${
                orderMode === 'Bulk Order'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bulk Wholesale
            </button>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-800 text-sm">Your cart is empty</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our catalog for genuine Cement, TMT Steel rebars, barricades, and site supplies.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Browse Materials
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const img = item.selectedVariation?.image || item.product.images[0];
              const varLabel = item.selectedVariation?.name || item.selectedVariation?.grade || item.selectedVariation?.size;
              return (
                <div
                  key={item.id}
                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex gap-3 items-start"
                >
                  <img
                    src={img}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        {varLabel && (
                          <span className="text-[11px] font-semibold text-amber-700 block">
                            {varLabel}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-xs">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 text-slate-600 hover:text-slate-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold tabular-nums text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-slate-600 hover:text-slate-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right">
                        <span className="font-bold text-slate-900 tabular-nums">
                          ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <span className="block text-[10px] text-slate-500">
                          (₹{item.unitPrice} / {item.unit})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Actions */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Site Delivery</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE (Over ₹20k or Bulk)</span>
                  ) : (
                    `₹${deliveryCharge.toLocaleString('en-IN')}`
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                <span>Estimated Total</span>
                <span className="text-amber-600 tabular-nums text-base">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => onProceedToCheckout(orderMode)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={handleCartWhatsApp}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Cart to WhatsApp (+91 8227021000)</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={onClearCart}
                className="text-[11px] text-slate-400 hover:text-red-500 transition-colors"
              >
                Empty Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
