/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import HomeView from "./components/HomeView";
import ServiceForm from "./components/ServiceForm";
import AdminPanel from "./components/AdminPanel";
import PublishGuide from "./components/PublishGuide";
import { ServiceCategory, Ticket } from "./types";
import { CheckCircle, ShieldCheck, Sparkles, MapPin, Phone, MessageSquare, BookOpen } from "lucide-react";
import { useAppContext } from "./context/AppContext";

export default function App() {
  const { user, isAdmin, language } = useAppContext();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<ServiceCategory | null>(null);
  const [initialSubCategory, setInitialSubCategory] = useState<string>("");
  const [lastSubmittedTicket, setLastSubmittedTicket] = useState<Ticket | null>(null);
  const [refreshAdminTrigger, setRefreshAdminTrigger] = useState(0);
  const [publishGuideOpen, setPublishGuideOpen] = useState(false);

  // Auto switch admin view if not admin
  useEffect(() => {
    if (isAdminMode && !isAdmin) {
      setIsAdminMode(false);
    }
  }, [isAdmin, isAdminMode]);

  const handleSelectCategory = (category: ServiceCategory, subCategoryDetail?: string) => {
    setCurrentCategory(category);
    if (subCategoryDetail) {
      setInitialSubCategory(subCategoryDetail);
    } else {
      setInitialSubCategory("");
    }
  };

  const handleBookingSubmitSuccess = (newTicket: Ticket) => {
    setLastSubmittedTicket(newTicket);
    setRefreshAdminTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-black transition-colors duration-300 flex flex-col font-sans text-slate-800 dark:text-slate-200" id="main_app_wrapper">
      <Header 
        isAdminMode={isAdminMode} 
        onToggleAdmin={(admin) => {
          setIsAdminMode(admin);
          if (admin) {
            setCurrentCategory(null);
            setLastSubmittedTicket(null);
          }
        }} 
      />

      <main className="flex-1 w-full" id="main_layout_body">
        <AnimatePresence mode="wait">
          {isAdminMode && isAdmin ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPanel onRefreshTrigger={refreshAdminTrigger} />
            </motion.div>
          ) : currentCategory ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ServiceForm 
                category={currentCategory} 
                initialSubCategory={initialSubCategory}
                onBack={() => setCurrentCategory(null)} 
                onSubmitSuccess={handleBookingSubmitSuccess}
              />
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <HomeView 
                onSelectCategory={handleSelectCategory} 
                onEnterAdmin={() => setIsAdminMode(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Dynamic Footer with Publish instructions */}
      <footer className="footer bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-6 text-center text-xs text-slate-400 dark:text-slate-500 mt-12 transition-colors" id="jantrik_footer">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} JantrikGhuri (যান্ত্রিকঘুড়ি). {language === "bn" ? "সর্বস্বত্ব সংরক্ষিত।" : "All rights reserved."}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 font-medium text-slate-500 dark:text-slate-400">
            <button onClick={() => setPublishGuideOpen(true)} className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
              <BookOpen className="w-3.5 h-3.5" />
              {language === "bn" ? "পাবলিশ ও ইন্সটল গাইড" : "Publishing Guide"}
            </button>
            <span className="hidden sm:inline-block">•</span>
            <button onClick={() => setIsAdminMode(false)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {language === "bn" ? "কাস্টমার পোর্টাল" : "Customer Portal"}
            </button>
            {isAdmin && (
              <>
                <span className="hidden sm:inline-block">•</span>
                <button onClick={() => setIsAdminMode(true)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {language === "bn" ? "কোঅর্ডিনেটর" : "Coordinator"}
                </button>
              </>
            )}
            <span className="hidden sm:inline-block">•</span>
            <a href="tel:09612" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {language === "bn" ? "হেল্পলাইন সাপোর্ট" : "Helpline"}
            </a>
          </div>
        </div>
      </footer>

      {/* Publish Guide Modal */}
      <PublishGuide isOpen={publishGuideOpen} onClose={() => setPublishGuideOpen(false)} />

      {/* BOOKING SUCCESS & DIAGNOSIS MODAL OVERLAY */}
      <AnimatePresence>
        {lastSubmittedTicket && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
            {/* Modal Body */}
            {/* Same success content slightly updated for dark mode */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full border border-slate-100 dark:border-slate-800"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold font-sans">
                  {language === "bn" ? "বুকিং সফলভাবে সম্পন্ন হয়েছে!" : "Booking Successful!"}
                </h3>
                <p className="text-xs text-emerald-100 mt-1">
                  {language === "bn" ? "টিকিট আইডি:" : "Ticket ID:"} <strong className="font-mono bg-emerald-700/30 px-2 py-0.5 rounded text-white">{lastSubmittedTicket.id}</strong>
                </p>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                
                {/* Basic receipt details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                    {language === "bn" ? "আপনার বুকিংয়ের তথ্যাবলী:" : "Booking Details:"}
                  </h4>
                  
                  <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <span className="font-sans font-semibold text-slate-800 dark:text-slate-100">
                          {language === "bn" ? "মোবাইল নম্বর:" : "Phone:"}
                        </span>{" "}
                        <span className="font-semibold">{lastSubmittedTicket.phoneNumber}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <div>
                        <span className="font-sans font-semibold text-slate-800 dark:text-slate-100">
                          {language === "bn" ? "সার্ভিস ঠিকানা:" : "Address:"}
                        </span>{" "}
                        <span>{lastSubmittedTicket.location.address}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-400 mt-0.5" />
                      <div>
                        <span className="font-sans font-semibold text-slate-800 dark:text-slate-100">
                          {language === "bn" ? "ত্রুটির বিবরণ:" : "Problem:"}
                        </span>{" "}
                        <span className="italic">"{lastSubmittedTicket.problemDescription}"</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gemini AI Diagnostic report block */}
                {lastSubmittedTicket.aiDiagnosis && (
                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 space-y-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950 dark:text-indigo-300 border-b border-indigo-100 dark:border-indigo-800/50 pb-2">
                      <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                      <span>{language === "bn" ? "জেমিনি AI তাত্ক্ষণিক রিভিউ রিপোর্ট" : "Gemini AI Instant Diagnosis"}</span>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div>
                        <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px]">{language === "bn" ? "সম্ভাব্য সমস্যার কারণ:" : "Estimated Issue:"}</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{lastSubmittedTicket.aiDiagnosis.estimatedIssue}</p>
                      </div>

                      <div>
                        <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px]">{language === "bn" ? "করণীয় পদক্ষেপ / পরামর্শ:" : "Suggested Solution:"}</p>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">{lastSubmittedTicket.aiDiagnosis.suggestedSolution}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pb-1">
                        <div>
                          <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px]">{language === "bn" ? "জরুরিতা:" : "Urgency:"}</p>
                          <span className={`inline-block font-bold px-2 py-0.5 rounded text-[10px] mt-1 border ${
                            lastSubmittedTicket.aiDiagnosis.urgency === "high" 
                              ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900" 
                              : lastSubmittedTicket.aiDiagnosis.urgency === "medium" 
                              ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900" 
                              : "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900"
                          }`}>
                            {lastSubmittedTicket.aiDiagnosis.urgency === "high" ? "🔴 High" : lastSubmittedTicket.aiDiagnosis.urgency === "medium" ? "🟡 Medium" : "🟢 Low"}
                          </span>
                        </div>

                        <div>
                          <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px]">{language === "bn" ? "সম্ভাব্য সমাধান খরচ:" : "Est. Cost:"}</p>
                          <span className="text-slate-800 dark:text-slate-200 font-extrabold text-xs block mt-1">{lastSubmittedTicket.aiDiagnosis.estimatedCostRange}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Contact / Operator note */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 font-sans text-center leading-relaxed">
                  * {language === "bn" ? "যান্ত্রিকঘুড়ি মেকানিক কোঅর্ডিনেটর প্যানেল থেকে আপনার মোবাইল নম্বরে দ্রুত যোগাযোগ করে নিকটস্থ টেকনিশিয়ান পথিমধ্যে বুকিং করবে।" : "JantrikGhuri coordinator will contact your mobile number shortly."}
                </div>

                {/* Modal close controls */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setLastSubmittedTicket(null);
                      setCurrentCategory(null);
                    }}
                    className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white border border-slate-950 font-bold text-slate-100 dark:text-slate-900 hover:text-white transition-all text-xs sm:text-sm text-center shadow active:scale-95"
                  >
                    {language === "bn" ? "ধন্যবাদ, বন্ধ করুন" : "Close"}
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setLastSubmittedTicket(null);
                        setIsAdminMode(true);
                      }}
                      className="w-full py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-bold text-indigo-600 dark:text-indigo-400 transition-all text-xs sm:text-sm text-center shadow-sm active:scale-95"
                    >
                      {language === "bn" ? "কোঅর্ডিনেটর প্যানেল ➔" : "Coordinator Panel ➔"}
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
