"use client";

import React, { useState } from "react";
import {
  FaPinterestP,
  FaLinkedinIn,
  FaFacebookF,
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";
import { QrCode, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  name: string;
  email: string;
  serviceType: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function ContactSection() {
  const qrData = "https://wa.me/8801700000000";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}&color=000000&bgcolor=ffffff`;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    serviceType: "Bespoke Bridal Wear",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const triggerToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Project details are required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Please provide a bit more detail (min 10 chars)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      triggerToast(
        "Inquiry submitted successfully! Mustafijur's atelier will reach out shortly.",
        "success",
      );
      setFormData({
        name: "",
        email: "",
        serviceType: "Bespoke Bridal Wear",
        phone: "",
        message: "",
      });
      setErrors({});
    } catch {
      triggerToast(
        "Failed to send inquiry. Please try again or WhatsApp directly.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#09090a] text-[#e5e5e5] py-16 px-4 sm:px-8 lg:px-16 overflow-hidden flex items-center justify-center">
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-6 right-4 sm:right-8 z-50 max-w-md w-full"
          >
            <div
              className={`p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 ${
                toast.type === "success"
                  ? "bg-neutral-900/90 border-amber-500/40 text-amber-200"
                  : "bg-neutral-900/90 border-red-500/40 text-red-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {toast.type === "success" ? (
                  <FaCheckCircle className="text-[#8DB355] text-xl shrink-0" />
                ) : (
                  <FaExclamationCircle className="text-red-400 text-xl shrink-0" />
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white">
                    {toast.type === "success"
                      ? "Message Sent"
                      : "Submission Error"}
                  </p>
                  <p className="text-xs text-stone-300 mt-0.5 leading-snug">
                    {toast.message}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                className="text-stone-400 hover:text-white p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8DB355]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8DB355]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8DB355]/10 border border-[#8DB355]/20 text-[#8DB355] text-xs tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fashion Designer & Stylist</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light tracking-wide text-white">
              Mustafijur <br />
              <span className="italic font-normal text-[#8DB355]/90">
                Rahman
              </span>
            </h1>

            <p className="text-stone-400 text-sm sm:text-base leading-relaxed max-w-md">
              Available for bespoke couture designs, luxury bridal consultation,
              and global fashion collaborations. Let&apos;s create timeless
              elegance together.
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="mailto:contact@mustafijur.com"
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#8DB355]/30 transition-all duration-300 group"
            >
              <div className="p-3 rounded-lg bg-[#8DB355]/10 text-[#8DB355] group-hover:scale-110 transition-transform">
                <FaEnvelope className="text-lg" />
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider">
                  Email Inquiry
                </p>
                <p className="text-sm font-medium text-stone-200">
                  contact@mustafijur.com
                </p>
              </div>
            </a>

            <a
              href="tel:+8801700000000"
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#8DB355]/30 transition-all duration-300 group"
            >
              <div className="p-3 rounded-lg bg-[#8DB355]/10 text-[#8DB355] group-hover:scale-110 transition-transform">
                <FaPhoneAlt className="text-lg" />
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider">
                  Direct Line
                </p>
                <p className="text-sm font-medium text-stone-200">
                  +880 1700-000000
                </p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="p-3 rounded-lg bg-[#8DB355]/10 text-[#8DB355]">
                <FaMapMarkerAlt className="text-lg" />
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider">
                  Atelier Location
                </p>
                <p className="text-sm font-medium text-stone-200">
                  Dhaka, Bangladesh / Paris, France
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-stone-400 font-medium">
              Follow & Connect
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 hover:text-white hover:bg-[#E60023] hover:border-[#E60023] transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaPinterestP className="text-lg" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaLinkedinIn className="text-lg" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaFacebookF className="text-lg" />
              </a>

              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaWhatsapp className="text-xl" />
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#8DB355]/10 via-white/[0.02] to-transparent border border-[#8DB355]/20 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8DB355] tracking-wider uppercase">
                <QrCode className="w-4 h-4" />
                <span>Quick Scan</span>
              </div>
              <p className="text-xs text-stone-400 max-w-[200px] leading-tight">
                Scan to instantly save contact & connect on WhatsApp
              </p>
            </div>

            <div className="relative p-1.5 bg-white rounded-xl shadow-lg group">
              <div className="absolute -top-2 -right-2 bg-black text-[#8DB355] border border-[#8DB355]/40 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-serif font-bold shadow-md">
                MR
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="Scan Contact QR Code"
                className="w-20 h-20 rounded-lg object-contain"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-md relative">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
            <div>
              <h3 className="text-xl font-serif text-white tracking-wide">
                Design Inquiry
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Book an appointment or request a custom quote
              </p>
            </div>

            <div className="w-10 h-10 rounded-full border border-[#8DB355]/30 flex items-center justify-center text-[#8DB355] font-serif text-sm font-bold bg-[#8DB355]/5">
              MR
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-stone-300 uppercase tracking-wider">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 focus:outline-none transition-colors ${
                    errors.name
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-white/10 focus:border-[#8DB355]/50"
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] text-red-400">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-stone-300 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 focus:outline-none transition-colors ${
                    errors.email
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-white/10 focus:border-[#8DB355]/50"
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-400">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-stone-300 uppercase tracking-wider">
                  Service Type
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-300 focus:outline-none focus:border-amber-500/50 transition-colors"
                >
                  <option value="Bespoke Bridal Wear">
                    Bespoke Bridal Wear
                  </option>
                  <option value="Haute Couture Outfit">
                    Haute Couture Outfit
                  </option>
                  <option value="Fashion Styling Consultation">
                    Fashion Styling Consultation
                  </option>
                  <option value="Brand Collaboration">
                    Brand Collaboration
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-stone-300 uppercase tracking-wider">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 1700-000000"
                  className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 focus:outline-none transition-colors ${
                    errors.phone
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-white/10 focus:border-[#8DB355]/50"
                  }`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-red-400">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-stone-300 uppercase tracking-wider">
                Project Details / Vision *
              </label>
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your event, style preferences, or custom outfit vision..."
                className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 focus:outline-none resize-none transition-colors ${
                  errors.message
                    ? "border-red-500/60 focus:border-red-500"
                    : "border-white/10 focus:border-[#8DB355]/50"
                }`}
              />
              {errors.message && (
                <p className="text-[11px] text-red-400">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#8DB355] to-[#8DB355] text-black font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-[#8DB355]/10 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Send Request</span>
                  <FaPaperPlane className="text-xs" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
