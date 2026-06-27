/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Phone,
  MessageCircle,
  MapPin,
  User,
  MessageSquare,
  Camera,
  Upload,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: "bn" | "en";
}

interface UploadedFile {
  id: string;
  file: File;
  blobUrl: string;
  type: "image" | "video";
}

const labels = {
  bn: {
    title: "সার্ভিস রিকোয়েস্ট ফর্ম",
    helpline: "হেল্পলাইন / Helpline: +880 1581-881805",
    call: "কল করুন",
    whatsapp: "হোয়াটসঅ্যাপ",
    nameLabel: "আপনার নাম",
    namePlaceholder: "পূর্ণ নাম লিখুন",
    phoneLabel: "ফোন নম্বর",
    phonePlaceholder: "01XXXXXXXXX",
    phoneError: "সঠিক ফোন নম্বর দিন (01 দিয়ে শুরু, ১১ সংখ্যা)",
    locationLabel: "গুগল ম্যাপ লোকেশন লিংক",
    locationPlaceholder: "Google Maps লিংক পেস্ট করুন",
    problemLabel: "সমস্যার বিবরণ",
    problemPlaceholder: "আপনার সমস্যার বিস্তারিত লিখুন...",
    uploadLabel: "ছবি / ভিডিও আপলোড",
    uploadText: "ছবি বা ভিডিও আপলোড করুন",
    uploadHint: "ক্লিক করুন বা ফাইল ড্রপ করুন",
    submit: "সার্ভিস রিকোয়েস্ট পাঠান",
    successTitle: "ধন্যবাদ!",
    successMessage:
      "আপনার রিকোয়েস্ট পাঠানো হয়েছে! আমাদের টিম শীঘ্রই যোগাযোগ করবে।",
    required: "আবশ্যক",
    optional: "ঐচ্ছিক",
  },
  en: {
    title: "Service Request Form",
    helpline: "Helpline: +880 1581-881805",
    call: "Call",
    whatsapp: "WhatsApp",
    nameLabel: "Your Name",
    namePlaceholder: "Enter your full name",
    phoneLabel: "Phone Number",
    phonePlaceholder: "01XXXXXXXXX",
    phoneError: "Enter a valid phone number (starts with 01, 11 digits)",
    locationLabel: "Google Maps Location Link",
    locationPlaceholder: "Paste your Google Maps link",
    problemLabel: "Problem Details",
    problemPlaceholder: "Describe your problem in detail...",
    uploadLabel: "Photo / Video Upload",
    uploadText: "Upload photos or videos",
    uploadHint: "Click or drop files here",
    submit: "Submit Service Request",
    successTitle: "Thank You!",
    successMessage:
      "Your request has been submitted! Our team will contact you shortly.",
    required: "Required",
    optional: "Optional",
  },
};

export default function ContactFormModal({
  isOpen,
  onClose,
  language,
}: ContactFormModalProps) {
  const t = labels[language];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [location, setLocation] = useState("");
  const [problem, setProblem] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validatePhone = (value: string) => {
    if (value.length === 0) {
      setPhoneError("");
      return;
    }
    if (value.length !== 11 || !value.startsWith("01")) {
      setPhoneError(t.phoneError);
    } else {
      setPhoneError("");
    }
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    validatePhone(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
    if (phoneTouched) {
      validatePhone(value);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      id: crypto.randomUUID(),
      file,
      blobUrl: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.blobUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setPhoneError("");
    setPhoneTouched(false);
    setLocation("");
    setProblem("");
    files.forEach((f) => URL.revokeObjectURL(f.blobUrl));
    setFiles([]);
    setIsSubmitting(false);
    setIsSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (phone.length !== 11 || !phone.startsWith("01")) {
      setPhoneTouched(true);
      setPhoneError(t.phoneError);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        resetForm();
        onClose();
      }, 3000);
    }, 800);
  };

  const handleClose = () => {
    if (!isSuccess) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
          >
            {/* Success State */}
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center px-8 py-20 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    damping: 12,
                    stiffness: 200,
                    delay: 0.1,
                  }}
                >
                  <CheckCircle className="mx-auto h-20 w-20 text-emerald-500" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 text-2xl font-bold text-slate-900 dark:text-white"
                >
                  {t.successTitle}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="mt-3 max-w-md text-lg text-slate-600 dark:text-slate-300"
                >
                  {t.successMessage}
                </motion.p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="relative rounded-t-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5">
                  <h2 className="text-xl font-bold text-white">{t.title}</h2>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="absolute right-4 top-4 rounded-xl p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Helpline Banner */}
                <div className="mx-6 mt-5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3.5 dark:border-indigo-800 dark:bg-indigo-950/50">
                  <p className="text-center text-sm font-semibold text-indigo-800 dark:text-indigo-200">
                    {t.helpline}
                  </p>
                  <div className="mt-2.5 flex items-center justify-center gap-3">
                    <a
                      href="tel:+8801581881805"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {t.call}
                    </a>
                    <a
                      href="https://wa.me/8801581881805"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      {t.whatsapp}
                    </a>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                  {/* Name */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t.nameLabel}
                      <span className="text-xs text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.namePlaceholder}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/40"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t.phoneLabel}
                      <span className="text-xs text-red-500">*</span>
                    </label>
                    <div className="relative flex">
                      <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 px-3.5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        +880
                      </span>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={handlePhoneChange}
                          onBlur={handlePhoneBlur}
                          placeholder={t.phonePlaceholder}
                          maxLength={11}
                          className={`w-full rounded-r-xl border bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:ring-2 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 ${
                            phoneError
                              ? "border-red-400 focus:border-red-400 focus:ring-red-100 dark:border-red-500 dark:focus:ring-red-900/40"
                              : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 dark:border-slate-700 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/40"
                          }`}
                        />
                      </div>
                    </div>
                    {phoneError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1.5 text-xs text-red-500"
                      >
                        {phoneError}
                      </motion.p>
                    )}
                  </div>

                  {/* Google Maps Location */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t.locationLabel}
                      <span className="text-xs text-slate-400">
                        ({t.optional})
                      </span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="url"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder={t.locationPlaceholder}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/40"
                      />
                    </div>
                  </div>

                  {/* Problem Details */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t.problemLabel}
                      <span className="text-xs text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <textarea
                        required
                        rows={4}
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder={t.problemPlaceholder}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/40"
                      />
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Camera className="h-4 w-4" />
                      {t.uploadLabel}
                      <span className="text-xs text-slate-400">
                        ({t.optional})
                      </span>
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-6 py-8 text-center transition-all hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/20"
                    >
                      <Upload className="mx-auto h-8 w-8 text-slate-400" />
                      <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        {t.uploadText}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {t.uploadHint}
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {/* File Previews */}
                    {files.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {files.map((f) => (
                          <div
                            key={f.id}
                            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
                          >
                            {f.type === "image" ? (
                              <img
                                src={f.blobUrl}
                                alt={f.file.name}
                                className="h-20 w-20 object-cover"
                              />
                            ) : (
                              <div className="flex h-20 w-28 flex-col items-center justify-center px-2">
                                <Camera className="h-5 w-5 text-slate-400" />
                                <p className="mt-1 max-w-full truncate text-[10px] text-slate-500 dark:text-slate-400">
                                  {f.file.name}
                                </p>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(f.id);
                              }}
                              className="absolute right-1 top-1 rounded-full bg-red-500/90 p-0.5 text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>...</span>
                      </>
                    ) : (
                      t.submit
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
