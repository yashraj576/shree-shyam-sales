import { Product, ProductVariation, CartItem, Order, BulkQuote } from '../types';

export const BUSINESS_PHONE = '+91 8227021000';
export const BUSINESS_PHONE_TEL = 'tel:+918227021000';
export const WHATSAPP_BASE_URL = 'https://wa.me/918227021000';

/**
 * Open WhatsApp with a pre-encoded message
 */
export function openWhatsApp(message: string) {
  const url = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message.trim())}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Open phone dialer
 */
export function callStore() {
  window.location.href = BUSINESS_PHONE_TEL;
}

/**
 * Construct message for single product or variation order inquiry
 */
export function buildProductWhatsAppMessage(
  product: Product,
  variation?: ProductVariation,
  quantity: number = 1,
  customerName?: string,
  location?: string
): string {
  const productName = variation ? `${product.name} - ${variation.name}` : product.name;
  const unit = variation?.unit || product.unit;
  const price = variation ? variation.price : product.basePrice;
  const priceDisplay = price > 0 ? `₹${price.toLocaleString('en-IN')} / ${unit}` : 'Request Custom Quote';

  return `Hello Shree Shyam Sales,

I want to order:

Product:
${productName}

Quantity:
${quantity} ${unit}${quantity > 1 ? 's' : ''}

Price:
${priceDisplay}

Delivery Location:
${location || '________________________'}

Customer Name:
${customerName || '________________________'}

Phone:
________________________

Please confirm stock availability and site delivery schedule.`;
}

/**
 * Construct message for Cart / Checkout order
 */
export function buildOrderWhatsAppMessage(order: Order): string {
  const itemsText = order.items
    .map((item, idx) => {
      const varName = item.selectedVariation ? ` (${item.selectedVariation.name})` : '';
      return `${idx + 1}. ${item.product.name}${varName}
   Qty: ${item.quantity} ${item.unit} × ₹${item.unitPrice.toLocaleString('en-IN')} = ₹${(item.quantity * item.unitPrice).toLocaleString('en-IN')}`;
    })
    .join('\n\n');

  return `Hello Shree Shyam Sales,

I have placed an order on your website:

Order ID:
${order.orderNumber}

Customer:
${order.customer.name} (Phone: ${order.customer.phone})

Delivery Type:
${order.deliveryType}

Site Delivery Address:
${order.deliveryAddress.address}, ${order.deliveryAddress.area}, ${order.deliveryAddress.city} - ${order.deliveryAddress.pinCode}
Site Contact: ${order.deliveryAddress.siteContactPerson} (${order.deliveryAddress.siteContactNumber})

Order Items:
${itemsText}

Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}
Delivery Charges: ₹${order.deliveryCharge.toLocaleString('en-IN')}
Total Amount: ₹${order.total.toLocaleString('en-IN')}

Payment Mode:
${order.paymentMethod}

Notes:
${order.notes || 'None'}

Please confirm my order and dispatch schedule.`;
}

/**
 * Construct message for Bulk Quote Inquiry
 */
export function buildBulkQuoteWhatsAppMessage(quote: BulkQuote): string {
  return `Hello Shree Shyam Sales,

I would like to request a Bulk Wholesale Quote:

Quote ID:
${quote.quoteNumber}

Customer Name:
${quote.customerName}

Company / Contractor:
${quote.companyName || 'Individual / Builder'}

Phone:
${quote.phone}

Project Name:
${quote.projectName || 'Construction Site'}

Project Location:
${quote.projectLocation}

Required Material:
${quote.material}

Quantity Required:
${quote.requiredQuantity} ${quote.unit}

Required Delivery Date:
${quote.requiredDeliveryDate || 'Immediate / As per schedule'}

Special Requirements:
${quote.specialRequirements || 'Best wholesale bulk pricing required.'}

Please send your competitive rates and payment terms.`;
}
