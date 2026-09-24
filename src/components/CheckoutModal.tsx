import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Phone, 
  MessageSquare, 
  Printer, 
  Building2,
  FileCheck2
} from 'lucide-react';
import { CartItem, Order, OrderType, PaymentMethod } from '../types';
import { createOrder } from '../services/db';
import { buildOrderWhatsAppMessage, openWhatsApp, BUSINESS_PHONE_TEL, BUSINESS_PHONE } from '../services/whatsapp';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  defaultOrderType?: OrderType;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  defaultOrderType = 'Site Delivery',
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form State
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
  });

  const [address, setAddress] = useState({
    address: '',
    area: '',
    city: 'Ranchi',
    state: 'Jharkhand',
    pinCode: '',
    siteContactPerson: '',
    siteContactNumber: '',
  });

  const [deliveryType, setDeliveryType] = useState<OrderType>(defaultOrderType);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Pay on Delivery');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
  const deliveryCharge = deliveryType === 'Bulk Order' || subtotal > 20000 ? 0 : 750;
  const grandTotal = subtotal + deliveryCharge;

  // Step Validation
  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!customer.name.trim()) {
        setErrorMsg('Please enter your full name or company contact.');
        return;
      }
      if (!customer.phone.trim() || customer.phone.trim().length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (!customer.whatsapp.trim()) {
        setCustomer({ ...customer, whatsapp: customer.phone });
      }
      setStep(2);
    } else if (step === 2) {
      if (!address.address.trim()) {
        setErrorMsg('Please enter your plot / construction site address.');
        return;
      }
      if (!address.city.trim()) {
        setErrorMsg('Please enter city.');
        return;
      }
      if (!address.siteContactNumber.trim()) {
        setAddress({
          ...address,
          siteContactPerson: address.siteContactPerson || customer.name,
          siteContactNumber: address.siteContactNumber || customer.phone,
        });
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    }
  };

  // Submit Order to Database
  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const newOrder = await createOrder({
        customer,
        items: cart,
        subtotal,
        deliveryCharge,
        total: grandTotal,
        paymentMethod,
        deliveryType,
        deliveryAddress: address,
        notes,
        status: 'Pending',
      });

      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);
    } catch (err) {
      console.error('Failed to create order', err);
      setErrorMsg('Failed to process order. Please call our sales desk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendWhatsAppConfirmation = () => {
    if (completedOrder) {
      const msg = buildOrderWhatsAppMessage(completedOrder);
      openWhatsApp(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
              Direct Site Supply Order
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              {completedOrder ? 'Order Confirmed' : 'Checkout & Site Delivery Request'}
            </h2>
          </div>
          {!completedOrder && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Tracker (If not yet completed) */}
        {!completedOrder && (
          <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className={step === 1 ? 'text-amber-600 font-bold' : ''}>1. Customer</span>
            <span>→</span>
            <span className={step === 2 ? 'text-amber-600 font-bold' : ''}>2. Site Address</span>
            <span>→</span>
            <span className={step === 3 ? 'text-amber-600 font-bold' : ''}>3. Order Type</span>
            <span>→</span>
            <span className={step === 4 ? 'text-amber-600 font-bold' : ''}>4. Payment</span>
            <span>→</span>
            <span className={step === 5 ? 'text-amber-600 font-bold' : ''}>5. Review</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          {/* ================= COMPLETED ORDER SCREEN ================= */}
          {completedOrder ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 font-serif">
                  Order Successfully Registered!
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Our dispatch logistics team has received your requisition and is preparing verification.
                </p>
              </div>

              {/* Order Card Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Order Reference ID:</span>
                  <span className="text-base font-extrabold text-amber-600 font-mono">
                    {completedOrder.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer Name:</span>
                  <span className="font-bold text-slate-900">{completedOrder.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Site Address:</span>
                  <span className="font-bold text-slate-900 text-right max-w-xs">
                    {completedOrder.deliveryAddress.address}, {completedOrder.deliveryAddress.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Billable Amount:</span>
                  <span className="font-extrabold text-slate-900 tabular-nums text-sm">
                    ₹{completedOrder.total.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-slate-500">
                  <span>Payment Term:</span>
                  <span className="font-bold text-slate-800">{completedOrder.paymentMethod}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSendWhatsAppConfirmation}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Order to WhatsApp (+91 8227021000)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={BUSINESS_PHONE_TEL}
                    className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call Store Desk</span>
                  </a>

                  <button
                    onClick={() => window.print()}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Print Order Slip</span>
                  </button>
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                Return to Storefront
              </button>
            </div>
          ) : (
            <>
              {/* STEP 1: CUSTOMER DETAILS */}
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Step 1: Contact Information</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Full Name / Firm Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rajesh Sharma / Sharma Builders"
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 text-slate-900"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Primary Mobile Number *
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 9876543210"
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          placeholder="Same as phone or alternate"
                          value={customer.whatsapp}
                          onChange={(e) => setCustomer({ ...customer, whatsapp: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 text-slate-900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Email Address (Optional for Invoice)
                      </label>
                      <input
                        type="email"
                        placeholder="rajesh@example.com"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: DELIVERY ADDRESS */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Step 2: Construction Site / Delivery Address</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        House No. / Plot No. / Site Landmark *
                      </label>
                      <input
                        type="text"
                        placeholder="Plot 42, Near Ring Road Flyover Pillar 14"
                        value={address.address}
                        onChange={(e) => setAddress({ ...address, address: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 text-slate-900"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Area / Locality
                        </label>
                        <input
                          type="text"
                          placeholder="Industrial Zone / South Enclave"
                          value={address.area}
                          onChange={(e) => setAddress({ ...address, area: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          placeholder="Ranchi"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 text-slate-900"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          placeholder="Jharkhand"
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          placeholder="834001"
                          value={address.pinCode}
                          onChange={(e) => setAddress({ ...address, pinCode: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 text-slate-900"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Site Contact Person (Supervisor)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Anil Kumar"
                          value={address.siteContactPerson}
                          onChange={(e) => setAddress({ ...address, siteContactPerson: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Site Contact Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 9431100000"
                          value={address.siteContactNumber}
                          onChange={(e) => setAddress({ ...address, siteContactNumber: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: ORDER TYPE */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Step 3: Select Order Type</h4>
                  <div className="space-y-3">
                    {(['Site Delivery', 'Bulk Order', 'Regular Order'] as OrderType[]).map((type) => (
                      <label
                        key={type}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          deliveryType === type
                            ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryType"
                          checked={deliveryType === type}
                          onChange={() => setDeliveryType(type)}
                          className="mt-1 text-slate-900 focus:ring-slate-900"
                        />
                        <div>
                          <span className="font-bold text-sm text-slate-900 block">{type}</span>
                          <span className="text-xs text-slate-500">
                            {type === 'Site Delivery'
                              ? 'Dedicated tipper truck / trailer delivery straight to your construction plot.'
                              : type === 'Bulk Order'
                              ? 'Contractor wholesale rate with staggered lot dispatches.'
                              : 'Standard retail delivery or yard pickup.'}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: PAYMENT / ORDER METHOD */}
              {step === 4 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Step 4: Payment Terms</h4>
                  
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                    <p className="font-bold mb-0.5">Transparent Wholesale Billing</p>
                    <p>
                      Payment will be confirmed by the store upon weighbridge slip verification or driver dispatch. No fake payment gateway required.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {(['Pay on Delivery', 'Cash on Delivery', 'Site Delivery Request'] as PaymentMethod[]).map(
                      (method) => (
                        <label
                          key={method}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === method
                              ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === method}
                            onChange={() => setPaymentMethod(method)}
                            className="mt-1 text-slate-900 focus:ring-slate-900"
                          />
                          <div>
                            <span className="font-bold text-sm text-slate-900 block">{method}</span>
                            <span className="text-xs text-slate-500">
                              {method === 'Pay on Delivery'
                                ? 'Verify materials and weighbridge receipt at site before UPI/NEFT or Cheque release.'
                                : method === 'Cash on Delivery'
                                ? 'Cash handed to authorized logistics driver on site delivery.'
                                : 'Site requisition order with payment terms confirmed prior to truck departure.'}
                            </span>
                          </div>
                        </label>
                      )
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Special Site Instructions / Unloading Requirements
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Unload next to pillar 3, crane assistance needed, vehicle timing before 10 AM..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-slate-900 text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & CONFIRM */}
              {step === 5 && (
                <div className="space-y-4 text-xs">
                  <h4 className="text-sm font-bold text-slate-900">Step 5: Order Review &amp; Verification</h4>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                    <div className="flex justify-between font-bold text-slate-900 pb-2 border-b border-slate-200">
                      <span>Customer &amp; Site</span>
                      <span className="text-amber-600">{customer.name} ({customer.phone})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Site Delivery Location:</span>
                      <span className="text-slate-800 font-medium">
                        {address.address}, {address.area}, {address.city} - {address.pinCode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Order &amp; Payment Mode:</span>
                      <span className="text-slate-800 font-semibold">{deliveryType} • {paymentMethod}</span>
                    </div>
                  </div>

                  {/* Itemized list */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-3 bg-slate-100 font-bold text-slate-800 text-xs">
                      Items Ordered ({cart.length})
                    </div>
                    <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto p-2">
                      {cart.map((item) => (
                        <div key={item.id} className="py-2 px-2 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-900 block">{item.product.name}</span>
                            <span className="text-[11px] text-slate-500">
                              {item.selectedVariation ? item.selectedVariation.name : ''} • Qty: {item.quantity} {item.unit}
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 tabular-nums">
                            ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between font-extrabold text-slate-900 text-sm">
                      <span>Total Payable</span>
                      <span className="text-amber-600 tabular-nums">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {!completedOrder && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900"
              >
                Back
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            )}

            {step < 5 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition-all shadow-md flex items-center gap-1.5"
              >
                <span>{isSubmitting ? 'Registering Order...' : 'Confirm & Place Order'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
