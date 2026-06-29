/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, Phone, Wrench, AlertCircle, ArrowLeft } from "lucide-react";
import { useAppContext } from "../context/AppContext";

interface TechnicianFormData {
  fullName: string;
  phoneNumber: string;
  nidNumber: string;
  membershipDuration: string;
}

interface TechnicianRegistration extends TechnicianFormData {
  id: string;
  registeredAt: string;
}

interface TechnicianAppProps {
  onBack: () => void;
}

export default function TechnicianApp({ onBack }: TechnicianAppProps) {
  const { language } = useAppContext();
  const [formData, setFormData] = useState<TechnicianFormData>({
    fullName: "",
    phoneNumber: "",
    nidNumber: "",
    membershipDuration: "3_months",
  });

  const [registeredTechnician, setRegisteredTechnician] =
    useState<TechnicianRegistration | null>(null);
  const [errors, setErrors] = useState<Partial<TechnicianFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = {
    technicianPortal:
      language === "bn" ? "টেকনিশিয়ান পোর্টাল" : "Technician Portal",
    technicianRegistration:
      language === "bn"
        ? "টেকনিশিয়ান নিবন্ধন ফর্ম"
        : "Technician Registration",
    subtitle:
      language === "bn"
        ? "যান্ত্রিকঘুড়ি নেটওয়ার্কে যোগ দিন এবং আপনার সেবা প্রদান করুন"
        : "Join JantrikGhuri Network and Provide Services",
    fullName: language === "bn" ? "সম্পূর্ণ নাম" : "Full Name",
    fullNamePlaceholder:
      language === "bn" ? "আপনার সম্পূর্ণ নাম প্রবেশ করুন" : "Enter your full name",
    phoneNumber: language === "bn" ? "মোবাইল নম্বর" : "Phone Number",
    phoneNumberPlaceholder:
      language === "bn"
        ? "+880 1XXX-XXXXXX"
        : "+880 1XXX-XXXXXX",
    nidNumber:
      language === "bn"
        ? "জাতীয় পরিচয় পত্র / ভোটার আইডি"
        : "National ID / Voter ID",
    nidPlaceholder:
      language === "bn"
        ? "আপনার আইডি নম্বর প্রবেশ করুন"
        : "Enter your ID number",
    membershipDuration:
      language === "bn"
        ? "সদস্যপদ সময়কাল"
        : "Membership Duration",
    threeMonths: language === "bn" ? "৩ মাস" : "3 Months",
    sixMonths: language === "bn" ? "৬ মাস" : "6 Months",
    twoYears: language === "bn" ? "২ বছর" : "2 Years",
    custom: language === "bn" ? "কাস্টম সময়কাল" : "Custom Period",
    register:
      language === "bn" ? "টেকনিশিয়ান হিসেবে নিবন্ধন করুন" : "Register as Technician",
    backToCustomer:
      language === "bn" ? "কাস্টমার পোর্টালে ফিরুন" : "Back to Customer Portal",
    successTitle:
      language === "bn"
        ? "নিবন্ধন সফলভাবে সম্পন্ন হয়েছে!"
        : "Registration Successful!",
    registrationId:
      language === "bn" ? "নিবন্ধন আইডি:" : "Registration ID:",
    registeredAt:
      language === "bn" ? "নিবন্ধিত সময়:" : "Registered At:",
    successMessage:
      language === "bn"
        ? "আপনার তথ্য যান্ত্রিকঘুড়ি সিস্টেমে সফলভাবে রেকর্ড করা হয়েছে। আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।"
        : "Your information has been successfully recorded in JantrikGhuri system. Our team will contact you soon.",
    close: language === "bn" ? "বন্ধ করুন" : "Close",
    required:
      language === "bn" ? "এটি একটি প্রয়োজনীয় ক্ষেত্র" : "This field is required",
    invalidPhone:
      language === "bn"
        ? "অনুগ্রহ করে একটি বৈধ ফোন নম্বর প্রবেশ করুন"
        : "Please enter a valid phone number",
    invalidNID:
      language === "bn"
        ? "অনুগ্রহ করে একটি বৈধ আইডি নম্বর প্রবেশ করুন"
        : "Please enter a valid ID number",
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TechnicianFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t.required;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t.required;
    } else if (!/^(\+880|88|0)?1[3-9]\d{8}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = t.invalidPhone;
    }

    if (!formData.nidNumber.trim()) {
      newErrors.nidNumber = t.required;
    } else if (formData.nidNumber.trim().length < 10) {
      newErrors.nidNumber = t.invalidNID;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call with delay (prototype behavior)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const registration: TechnicianRegistration = {
      ...formData,
      id: `TECH-${Date.now()}`,
      registeredAt: new Date().toLocaleString(
        language === "bn" ? "bn-BD" : "en-US"
      ),
    };

    // Store in local state (prototype mode)
    setRegisteredTechnician(registration);
    setIsSubmitting(false);

    // Reset form
    setFormData({
      fullName: "",
      phoneNumber: "",
      nidNumber: "",
      membershipDuration: "3_months",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof TechnicianFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-6 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-semibold mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToCustomer}
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                {t.technicianPortal}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1">
                {t.subtitle}
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {registeredTechnician ? (
            // Success Screen
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              {/* Success Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  {t.successTitle}
                </h2>
                <p className="text-emerald-100 text-sm mt-2 font-mono">
                  {t.registrationId}{" "}
                  <strong className="bg-emerald-700/30 px-2.5 py-1 rounded text-white ml-2">
                    {registeredTechnician.id}
                  </strong>
                </p>
              </div>

              {/* Success Content */}
              <div className="p-8 space-y-6">
                {/* Registration Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {language === "bn"
                      ? "আপনার নিবন্ধন তথ্যাবলী:"
                      : "Your Registration Details:"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">
                        {t.fullName}
                      </p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {registeredTechnician.fullName}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">
                        {t.phoneNumber}
                      </p>
                      <a
                        href={`tel:${registeredTechnician.phoneNumber}`}
                        className="text-lg font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {registeredTechnician.phoneNumber}
                      </a>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">
                        {t.membershipDuration}
                      </p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {registeredTechnician.membershipDuration === "3_months"
                          ? t.threeMonths
                          : registeredTechnician.membershipDuration === "6_months"
                            ? t.sixMonths
                            : registeredTechnician.membershipDuration === "2_years"
                              ? t.twoYears
                              : t.custom}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">
                        {t.registeredAt}
                      </p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {registeredTechnician.registeredAt}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Success Message Box */}
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-900 dark:text-emerald-300 leading-relaxed">
                      {t.successMessage}
                    </p>
                  </div>
                </div>

                {/* Info Box - Prototype Notice */}
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
                      {language === "bn"
                        ? "⚠️ প্রোটোটাইপ মোডে: এই ডেটা স্থানীয়ভাবে সংরক্ষিত হয়েছে। ব্যাকএন্ড একীভূত হলে স্থায়ী সংরক্ষণ শুরু হবে।"
                        : "⚠️ Prototype Mode: This data is stored locally. Permanent storage will begin once backend is integrated."}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setRegisteredTechnician(null);
                      onBack();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                  >
                    {t.backToCustomer}
                  </button>
                  <button
                    onClick={() => setRegisteredTechnician(null)}
                    className="w-full py-3 px-4 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    {language === "bn"
                      ? "আরেকজন নিবন্ধন করুন"
                      : "Register Another"}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            // Registration Form
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Full Name Input */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {t.fullName}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder={t.fullNamePlaceholder}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:outline-none ${
                      errors.fullName
                        ? "border-red-500 focus:border-red-600"
                        : "border-slate-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Phone Number Input */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {t.phoneNumber}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder={t.phoneNumberPlaceholder}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:outline-none ${
                      errors.phoneNumber
                        ? "border-red-500 focus:border-red-600"
                        : "border-slate-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* NID Input */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {t.nidNumber}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="nidNumber"
                    value={formData.nidNumber}
                    onChange={handleInputChange}
                    placeholder={t.nidPlaceholder}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:outline-none ${
                      errors.nidNumber
                        ? "border-red-500 focus:border-red-600"
                        : "border-slate-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                    }`}
                  />
                  {errors.nidNumber && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.nidNumber}
                    </p>
                  )}
                </div>

                {/* Membership Duration Dropdown */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {t.membershipDuration}
                  </label>
                  <select
                    name="membershipDuration"
                    value={formData.membershipDuration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                  >
                    <option value="3_months">{t.threeMonths}</option>
                    <option value="6_months">{t.sixMonths}</option>
                    <option value="2_years">{t.twoYears}</option>
                    <option value="custom">{t.custom}</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-base"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full h-4 w-4"></span>
                      {language === "bn" ? "প্রক্রিয়াকরণ..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      <Wrench className="w-5 h-5" />
                      {t.register}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
