import React, { useState } from 'react';
import { X, CheckCircle2, MessageSquare, Phone, Send, FileText } from 'lucide-react';
import { BulkQuote } from '../types';
import { createQuote } from '../services/db';
import { buildBulkQuoteWhatsAppMessage, openWhatsApp, BUSINESS_PHONE_TEL } from '../services/whatsapp';

interface BulkQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMaterial?: string;
  onQuoteCreated?: (quote: BulkQuote) => void;
}

export const BulkQuoteModal: React.FC<BulkQuoteModalProps> = ({
  isOpen,
  onClose,
  initialMaterial = '',
  onQuoteCreated,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [material, setMaterial] = useState(initialMaterial || 'Tata Tiscon TMT & UltraTech Cement');
  const [requiredQuantity, setRequiredQuantity] = useState('20');
  const [unit, setUnit] = useState('Tons / Bags');
  const [requiredDeliveryDate, setRequiredDeliveryDate] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedQuote, setSubmittedQuote] = useState<BulkQuote | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Please provide your name or contractor contact.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!projectLocation.trim()) {
      setErrorMsg('Please provide the project delivery location.');
      return;
    }
    if (!material.trim()) {
      setErrorMsg('Please specify the required construction material.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newQuote = await createQuote({
        customerName,
        companyName,
        phone,
        whatsappNumber: whatsappNumber.trim() || phone,
        email,
        projectName,
        projectLocation,
        material,
        requiredQuantity,
        unit,
        requiredDeliveryDate,
        specialRequirements,
        status: 'Pending',
      });

      setSubmittedQuote(newQuote);
      if (onQuoteCreated) {
        onQuoteCreated(newQuote);
      }
    } catch (err) {
      console.error('Failed to create quote', err);
      setErrorMsg('Error submitting quote request. Please try calling directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendViaWhatsApp = () => {
    if (submittedQuote) {
      const msg = buildBulkQuoteWhatsAppMessage(submittedQuote);
      openWhatsApp(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
              Wholesale &amp; Institutional Supply
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              {submittedQuote ? 'Quote Request Generated' : 'Request Bulk / Wholesale Quote'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {submittedQuote ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 font-serif">
                  Quotation Request #{submittedQuote.quoteNumber}
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Your bulk inquiry is saved in our database. Our commercial team will prepare a formal project estimate with test certificates.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Contractor / Firm:</span>
                  <span className="font-bold text-slate-900">{submittedQuote.customerName} ({submittedQuote.companyName || 'Contractor'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Materials:</span>
                  <span className="font-bold text-slate-900">{submittedQuote.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Required Quantity:</span>
                  <span className="font-bold text-amber-700">{submittedQuote.requiredQuantity} {submittedQuote.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Site Location:</span>
                  <span className="font-bold text-slate-900">{submittedQuote.projectLocation}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSendViaWhatsApp}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Quote Directly to WhatsApp (+91 8227021000)</span>
                </button>

                <a
                  href={BUSINESS_PHONE_TEL}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call Commercial Sales Desk</span>
                </a>
              </div>

              <button
                onClick={onClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Name / Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singh"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Company / Contractor Firm Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Singh Infrastructure Ltd."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Same as phone"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="procurement@firm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Project Name / Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Residential G+8 / Highway Flyover"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Project Location / Site Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ring Road Bypass, Sector 4"
                    value={projectLocation}
                    onChange={(e) => setProjectLocation(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Required Material / Specification *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tata Tiscon 550D (12mm, 16mm, 20mm) & UltraTech OPC 53"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estimated Quantity &amp; Unit *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. 50"
                      value={requiredQuantity}
                      onChange={(e) => setRequiredQuantity(e.target.value)}
                      className="w-20 p-2.5 border border-slate-300 rounded-lg text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Tons / Bags"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="flex-1 p-2.5 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Required Delivery Date
                </label>
                <input
                  type="date"
                  value={requiredDeliveryDate}
                  onChange={(e) => setRequiredDeliveryDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Special Requirements (Test certs, staggered delivery, payment schedule)
                </label>
                <textarea
                  rows={2}
                  placeholder="Need test certificates with every dispatch batch, crane unloading assistance, 30 days credit..."
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Quote Request'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
