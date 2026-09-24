import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { BUSINESS_PHONE, BUSINESS_PHONE_TEL, WHATSAPP_BASE_URL, openWhatsApp } from '../services/whatsapp';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedMsg = `Hello Shree Shyam Sales,

Inquiry from Contact Page:
Name: ${name}
Phone: ${phone}
Message: ${message}

Please get in touch with me.`;

    openWhatsApp(formattedMsg);
    setIsSent(true);
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">
            Direct Commercial Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
            Get in Touch with Shree Shyam Sales
          </h1>
          <p className="text-slate-600 text-sm">
            Whether you need pricing for immediate delivery or scheduled dispatches for upcoming project phases, our team is ready.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details & Yard Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-2xl space-y-6 shadow-xl">
              <div>
                <h3 className="text-xl font-bold font-serif">Head Office &amp; Central Stockyard</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Direct contractor counter and dispatch terminal
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Direct Phone / Orders</span>
                    <a href={BUSINESS_PHONE_TEL} className="text-sm font-bold text-white hover:text-amber-400">
                      {BUSINESS_PHONE}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">WhatsApp Support Desk</span>
                    <a
                      href={WHATSAPP_BASE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-emerald-400 hover:text-emerald-300"
                    >
                      +91 8227021000 (Click to Chat)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Stockyard Address</span>
                    <p className="text-slate-200 mt-0.5 leading-relaxed">
                      Industrial Corridor, Near Transport Nagar Yard 4, Main Highway Link, Ranchi, Jharkhand - 834001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Working Hours</span>
                    <p className="text-slate-200 mt-0.5">
                      Mon – Sat: 7:00 AM – 8:00 PM <br />
                      Sunday: 8:00 AM – 2:00 PM (Emergency Site Dispatch)
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex gap-2">
                <a
                  href={BUSINESS_PHONE_TEL}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold text-center transition-colors"
                >
                  Call Now
                </a>
                <a
                  href={WHATSAPP_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold text-center transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif">
              Send a Quick Inquiry
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the message below and our dispatch coordinator will respond immediately via WhatsApp or phone.
            </p>

            {isSent ? (
              <div className="p-8 text-center space-y-3 bg-white rounded-xl border border-slate-200">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900">Message Forwarded to WhatsApp</h4>
                <p className="text-xs text-slate-500">
                  Our sales manager has opened your inquiry and will confirm rates shortly.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="mt-2 text-xs font-bold text-amber-600"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Message / Material Inquiries *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the project, quantity of cement/TMT steel required, and site location..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Send Inquiry to WhatsApp Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
