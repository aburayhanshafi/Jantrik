import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Phone, IdCard, Calendar, CheckCircle2, Loader2, Wrench, Sparkles, AlertCircle } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import serviceDiagram from "../assets/car_diagram.jpg";

export default function TechnicianApp() {
  const { language } = useAppContext();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [voterId, setVoterId] = useState("");
  const [membership, setMembership] = useState("3_months");
  const [customMembership, setCustomMembership] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const t = {
    title: language === "bn" ? "টেকনিশিয়ান অনবোর্ডিং পোর্টাল" : "Technician Onboarding Portal",
    subtitle: language === "bn" ? "যান্ত্রিকঘুড়ি নেটওয়ার্কে যুক্ত হয়ে নিজের আয় বৃদ্ধি করুন!" : "Join JantrikGhuri network and grow your income!",
    nameLabel: language === "bn" ? "পূর্ণ নাম" : "Full Name",
    phoneLabel: language === "bn" ? "মোবাইল নম্বর" : "Phone Number",
    voterIdLabel: language === "bn" ? "ভোটার আইডি কার্ড (NID) নম্বর" : "Voter ID (NID) Number",
    membershipLabel: language === "bn" ? "মেম্বারশিপ মেয়াদ" : "Membership Duration",
    opt3m: language === "bn" ? "৩ মাস" : "3 Months",
    opt6m: language === "bn" ? "৬ মাস" : "6 Months",
    opt2y: language === "bn" ? "২ বছর" : "2 Years",
    optCustom: language === "bn" ? "কাস্টম (মাস)" : "Custom (Months)",
    customPlaceholder: language === "bn" ? "কত মাসের জন্য?" : "How many months?",
    submit: language === "bn" ? "রেজিস্ট্রেশন সম্পূর্ণ করুন" : "Complete Registration",
    successTitle: language === "bn" ? "রেজিস্ট্রেশন সফল হয়েছে!" : "Registration Successful!",
    successMsg: language === "bn" ? "যান্ত্রিকঘুড়ি টেকনিশিয়ান পোর্টালে আপনার আবেদনটি গৃহীত হয়েছে। আমাদের টিম খুব দ্রুত আপনার সাথে যোগাযোগ করে একাউন্ট ভেরিফাই করবে।" : "Your application has been received. Our team will contact you shortly for verification.",
    newReg: language === "bn" ? "নতুন রেজিস্ট্রেশন করুন" : "New Registration"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !voterId) {
      setError(language === "bn" ? "দয়া করে সকল তথ্য সঠিকভাবে দিন।" : "Please fill in all required fields.");
      return;
    }

    if (membership === "custom" && !customMembership) {
      setError(language === "bn" ? "দয়া করে কাস্টম মেয়াদ উল্লেখ করুন।" : "Please specify custom duration.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setVoterId("");
    setMembership("3_months");
    setCustomMembership("");
    setIsSuccess(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 text-white p-8 relative overflow-hidden">
          <Wrench className="absolute right-[-10px] top-[-10px] opacity-10 w-40 h-40 transform rotate-12" />
          <Sparkles className="absolute right-8 top-8 opacity-20 w-8 h-8" />
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-3 border border-white/30 text-amber-50">
              {language === "bn" ? "টেকনিশিয়ান অ্যাপ" : "Technician App"}
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold font-sans mb-1">
              {t.title}
            </h3>
            <p className="text-sm text-amber-100 font-medium">{t.subtitle}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-10 text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">{t.successTitle}</h4>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
                {t.successMsg}
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 w-full max-w-sm mb-8 border border-slate-100 dark:border-slate-700/50">
                <div className="flex justify-between items-center text-xs mb-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">{t.nameLabel}:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{name}</span>
                </div>
                <div className="flex justify-between items-center text-xs mb-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">{t.phoneLabel}:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{phone}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">{t.membershipLabel}:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-500">
                    {membership === "custom" ? `${customMembership} ${language === "bn" ? "মাস" : "Months"}` : membership.replace("_", " ")}
                  </span>
                </div>
              </div>

              <button 
                onClick={resetForm}
                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {t.newReg}
              </button>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit} 
              className="p-6 md:p-8 space-y-6"
            >
              <div className="w-full rounded-2xl overflow-hidden mb-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <img 
                  src={serviceDiagram} 
                  alt="Service Diagram" 
                  className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity" 
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />{t.nameLabel} <span className="text-red-500">*</span>
                  </label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />{t.phoneLabel} <span className="text-red-500">*</span>
                  </label>
                  <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="01XXXXXXXXX" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500 transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <IdCard className="w-3.5 h-3.5 text-slate-400" />{t.voterIdLabel} <span className="text-red-500">*</span>
                  </label>
                  <input required type="text" value={voterId} onChange={e => setVoterId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500 transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />{t.membershipLabel} <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { id: "3_months", label: t.opt3m },
                      { id: "6_months", label: t.opt6m },
                      { id: "2_years", label: t.opt2y },
                      { id: "custom", label: t.optCustom }
                    ].map((opt) => (
                      <div 
                        key={opt.id}
                        onClick={() => setMembership(opt.id)}
                        className={`cursor-pointer text-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                          membership === opt.id 
                            ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700 shadow-sm" 
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:border-amber-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:border-amber-800/50"
                        }`}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {membership === "custom" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <input 
                          type="number" 
                          min="1"
                          placeholder={t.customPlaceholder} 
                          value={customMembership} 
                          onChange={e => setCustomMembership(e.target.value)} 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500 transition-colors" 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full py-4 mt-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> ...</> : <><User className="w-5 h-5" /> {t.submit}</>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
