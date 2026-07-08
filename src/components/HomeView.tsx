/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ServiceCategory } from "../types";
import {
  Car, ShieldAlert, Zap, ThermometerSnowflake,
  Phone, MoonStar, MapPin, Compass,
  ChevronDown, ChevronUp, Star, Quote,
  ArrowRight, Clock, Users, CheckCircle,
  Wrench, Shield, DollarSign, Headphones,
  Plug, Droplets, MessageCircle,
  TrendingUp, BadgeCheck, HeartHandshake
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import ContactFormModal from "./ContactFormModal";

import carBanner from "../assets/images/1783523701981.png";
import bikeBanner from "../assets/images/1783523679639.png";
import acBanner from "../assets/images/1783523652215.png";
import generatorBanner from "../assets/images/1783524048668.png";
import plumberBanner from "../assets/images/1783523926859.png";
import electricianBanner from "../assets/images/1783524833794.png";
import otherBanner from "../assets/images/Jantrik_logo.png";

const HELPLINE = "+8801581881805";
const WHATSAPP_URL = `https://wa.me/8801581881805`;

interface HomeViewProps {
  onSelectCategory: (category: ServiceCategory, initialDetail?: string) => void;
  onEnterAdmin: () => void;
}

/* ─── Animated Counter Hook ──────────────────────────────────── */
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ─── FAQ Accordion Item ─────────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
      >
        <span className="font-bold text-sm text-slate-800 dark:text-white pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-indigo-500 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
        >
          {a}
        </motion.div>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function HomeView({ onSelectCategory, onEnterAdmin }: HomeViewProps) {
  const { language } = useAppContext();
  const [contactOpen, setContactOpen] = useState(false);
  const bn = language === "bn";

  /* ── Stats counters ── */
  const stat1 = useCountUp(500);
  const stat2 = useCountUp(50);
  const stat3 = useCountUp(64);
  const stat4 = useCountUp(24);

  return (
    <div className="w-full" id="home_view_container">

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        {/* Decorative circles */}
        <div className="absolute top-[-120px] right-[-80px] w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute bottom-[-100px] left-[-60px] w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {bn ? "২৪/৭ ইমার্জেন্সি সাপোর্ট চালু আছে" : "24/7 Emergency Support Active"}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]"
            >
              {bn ? (
                <>মাঝরাতে গাড়ি নষ্ট? <br className="hidden md:block" /><span className="text-indigo-400">রিমোট এলাকায় এসি বিকল?</span><br className="hidden md:block" /> মেকানিক আসবে আপনার কাছে।</>
              ) : (
                <>Car Broke Down at Midnight? <br className="hidden md:block" /><span className="text-indigo-400">AC Dead in Remote Area?</span><br className="hidden md:block" /> We Bring the Mechanic to You.</>
              )}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              {bn
                ? "যান্ত্রিকঘুড়ি — বাংলাদেশের প্রথম অন-ডিমান্ড মেকানিক ও টেকনিশিয়ান ডিসপ্যাচ প্ল্যাটফর্ম। গাড়ি, বাইক, ফ্রিজ, এসি, জেনারেটর, ইলেকট্রিশিয়ান — যেকোনো সমস্যায় কল করুন, আমরা আসছি।"
                : "JantrikGhuri — Bangladesh's first on-demand mechanic & technician dispatch platform. Car, Bike, Fridge, AC, Generator, Electrician — any problem, just call us."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              {/* Call Now */}
              <a
                href={`tel:${HELPLINE}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all active:scale-95 border border-emerald-400/50"
              >
                <Phone className="w-5 h-5" />
                {bn ? "📞 এখনই কল করুন" : "📞 Call Us Now"}
              </a>

              {/* WhatsApp */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-lg shadow-[#25D366]/30 transition-all active:scale-95 border border-[#25D366]/50"
              >
                <MessageCircle className="w-5 h-5" />
                {bn ? "💬 WhatsApp করুন" : "💬 WhatsApp Us"}
              </a>

              {/* Contact Form */}
              <button
                onClick={() => setContactOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-sm transition-all active:scale-95 border border-white/20 cursor-pointer"
              >
                <ArrowRight className="w-5 h-5" />
                {bn ? "📋 সার্ভিস রিকোয়েস্ট" : "📋 Request Service"}
              </button>
            </motion.div>

            {/* Helpline display */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-slate-400 pt-2"
            >
              {bn ? "হেল্পলাইন:" : "Helpline:"} <a href={`tel:${HELPLINE}`} className="text-indigo-400 hover:text-indigo-300 font-bold">+880 1581-881805</a>
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: STATS / TRUST COUNTER
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { ref: stat1.ref, count: stat1.count, suffix: "+", label: bn ? "সার্ভিস সম্পন্ন" : "Services Done", icon: <CheckCircle className="w-6 h-6 text-emerald-500" /> },
              { ref: stat2.ref, count: stat2.count, suffix: "+", label: bn ? "ভেরিফাইড টেকনিশিয়ান" : "Verified Technicians", icon: <Users className="w-6 h-6 text-blue-500" /> },
              { ref: stat3.ref, count: stat3.count, suffix: "", label: bn ? "জেলায় কভারেজ" : "Districts Covered", icon: <MapPin className="w-6 h-6 text-rose-500" /> },
              { ref: stat4.ref, count: stat4.count, suffix: "/7", label: bn ? "ঘণ্টা সাপোর্ট" : "Hours Support", icon: <Clock className="w-6 h-6 text-amber-500" /> },
            ].map((s, i) => (
              <motion.div
                key={i}
                ref={s.ref}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50"
              >
                <div className="mx-auto w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3 shadow-sm">
                  {s.icon}
                </div>
                <p className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                  {s.count}{s.suffix}
                </p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: SERVICE CATEGORIES GRID
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50/50 dark:bg-black">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white"
            >
              {bn ? "আমাদের সার্ভিস সমূহ" : "Our Services"}
            </motion.h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
              {bn ? "গাড়ি থেকে শুরু করে ঘরের এসি পর্যন্ত — সব ধরনের ইমার্জেন্সি মেকানিক্যাল সার্ভিস এক প্ল্যাটফর্মে।" : "From roadside car recovery to home AC repair — all emergency mechanical services on one platform."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="service_cards_grid">

            {/* CAR CARD */}
            <motion.button
              whileHover={{ y: -5, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(ServiceCategory.CAR)}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-xl hover:shadow-2xl transition-all h-72 text-left cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-10" />
              <img src={carBanner} alt="Car breakdown remote service" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/30">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{bn ? "গাড়ি রিকভারি" : "Car Recovery"}</h3>
                <p className="text-blue-100 text-sm opacity-90 line-clamp-2">
                  {bn ? "মাঝরাতে বা দূরে গাড়ি বিকল? ইঞ্জিন, ব্যাটারি, টায়ার — সব সমস্যায় দ্রুত মেকানিক পাঠাই।" : "Car broke down late at night? Engine, battery, tire — we dispatch mechanics fast."}
                </p>
              </div>
            </motion.button>

            {/* BIKE CARD */}
            <motion.button
              whileHover={{ y: -5, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(ServiceCategory.MOTORCYCLE)}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-xl hover:shadow-2xl transition-all h-72 text-left cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-10" />
              <img src={bikeBanner} alt="Motorcycle breakdown service" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-amber-500/30">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{bn ? "বাইক ইমার্জেন্সি" : "Bike Emergency"}</h3>
                <p className="text-amber-100 text-sm opacity-90 line-clamp-2">
                  {bn ? "চেইন ছিঁড়ে গেছে? পাংচার? ইঞ্জিন বন্ধ? যেকোনো রাস্তায় মেকানিক পৌঁছে যাবে।" : "Chain snapped? Flat tire? Engine stalled? Mechanic will reach you anywhere."}
                </p>
              </div>
            </motion.button>

            {/* AC CARD */}
            <motion.button
              whileHover={{ y: -5, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(ServiceCategory.BUILDING, "ac")}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500 shadow-xl hover:shadow-2xl transition-all h-72 text-left cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-10" />
              <img src={acBanner} alt="AC Servicing" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-cyan-500/30">
                  <ThermometerSnowflake className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{bn ? "এসি / ফ্রিজ সার্ভিসিং" : "AC / Fridge Servicing"}</h3>
                <p className="text-cyan-100 text-sm opacity-90 line-clamp-2">
                  {bn ? "গ্যাস রিফিল, কম্প্রেসর মেরামত, ক্লিনিং — সব করা হয়।" : "Gas refill, compressor repair, deep cleaning."}
                </p>
              </div>
            </motion.button>

            {/* GENERATOR CARD */}
            <motion.button
              whileHover={{ y: -5, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(ServiceCategory.BUILDING, "generator")}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 shadow-xl hover:shadow-2xl transition-all h-72 text-left cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-10" />
              <img src={generatorBanner} alt="Generator Repair" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-rose-500/30">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{bn ? "জেনারেটর মেরামত" : "Generator Repair"}</h3>
                <p className="text-rose-100 text-sm opacity-90 line-clamp-2">
                  {bn ? "লোডশেডিংয়ে জেনারেটর চালু না হলে কল করুন।" : "Generator won't start during power cuts? Call us."}
                </p>
              </div>
            </motion.button>

            {/* ELECTRICIAN CARD */}
            <motion.button
              whileHover={{ y: -5, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setContactOpen(true)}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-500 shadow-xl hover:shadow-2xl transition-all h-72 text-left cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-10" />
              <img src={electricianBanner} alt="Electrician Service" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-violet-500/30">
                  <Plug className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{bn ? "ইলেকট্রিশিয়ান" : "Electrician"}</h3>
                <p className="text-violet-100 text-sm opacity-90 line-clamp-2">
                  {bn ? "ওয়্যারিং, সুইচবোর্ড, ফ্যান-লাইট ফিটিং — ঘরের সব ইলেকট্রিক্যাল সমস্যায়।" : "Wiring, switchboards, fan-light fitting — all home electrical issues."}
                </p>
              </div>
            </motion.button>

            {/* PLUMBING CARD */}
            <motion.button
              whileHover={{ y: -5, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setContactOpen(true)}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 shadow-xl hover:shadow-2xl transition-all h-72 text-left cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-10" />
              <img src={plumberBanner} alt="Plumbing Service" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-teal-500/30">
                  <Droplets className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{bn ? "প্লাম্বিং সার্ভিস" : "Plumbing Service"}</h3>
                <p className="text-teal-100 text-sm opacity-90 line-clamp-2">
                  {bn ? "পানির লাইন লিক, ট্যাপ-কমোড সমস্যা, পাইপ ফিটিং — দ্রুত সমাধান।" : "Water line leaks, tap & commode issues, pipe fitting — quick solutions."}
                </p>
              </div>
            </motion.button>

            {/* GENERAL HELP CTA CARD */}
            <motion.button
              whileHover={{ y: -5, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setContactOpen(true)}
              className="group relative md:col-span-2 lg:col-span-3 overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xl hover:shadow-2xl transition-all h-48 text-left cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-transparent z-10" />
              <img src={otherBanner} alt="Other Issues" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-y-0 left-0 p-6 md:p-8 flex items-center z-20 w-full max-w-2xl">
                <div className="flex gap-6 items-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 flex-shrink-0">
                    <HeartHandshake className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{bn ? "অন্যান্য সমস্যা?" : "Other Issues?"}</h3>
                    <p className="text-indigo-100 text-sm md:text-base opacity-90">
                      {bn ? "উপরের ক্যাটাগরিতে আপনার সমস্যা না থাকলে সরাসরি আমাদের জানান।" : "Don't see your problem listed? Contact us directly."}
                    </p>
                  </div>
                </div>
              </div>
            </motion.button>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: HOW IT WORKS
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white"
            >
              {bn ? "কিভাবে কাজ করে?" : "How It Works"}
            </motion.h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
              {bn ? "মাত্র ৪টি সহজ ধাপে আপনার সমস্যার সমাধান।" : "Get your problem solved in just 4 simple steps."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "১", icon: <Phone className="w-7 h-7 text-emerald-500" />,
                title: bn ? "কল বা WhatsApp করুন" : "Call or WhatsApp",
                desc: bn ? "+880 1581-881805 নম্বরে কল বা WhatsApp করুন, অথবা অনলাইনে ফর্ম পূরণ করুন।" : "Call or WhatsApp +880 1581-881805, or fill out the online form.",
                color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50"
              },
              {
                step: "২", icon: <MessageCircle className="w-7 h-7 text-blue-500" />,
                title: bn ? "সমস্যা জানান" : "Describe Your Problem",
                desc: bn ? "গাড়ি, বাইক, এসি, জেনারেটর — যেকোনো সমস্যার বিবরণ দিন, ছবি বা ভিডিও পাঠান।" : "Car, bike, AC, generator — describe the issue, send photos or videos.",
                color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50"
              },
              {
                step: "৩", icon: <Compass className="w-7 h-7 text-indigo-500" />,
                title: bn ? "টেকনিশিয়ান ডিসপ্যাচ" : "Technician Dispatched",
                desc: bn ? "আপনার GPS লোকেশনে নিকটতম ভেরিফাইড টেকনিশিয়ান পাঠানো হবে।" : "Nearest verified technician dispatched to your GPS location.",
                color: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50"
              },
              {
                step: "৪", icon: <CheckCircle className="w-7 h-7 text-rose-500" />,
                title: bn ? "সমস্যা সমাধান!" : "Problem Solved!",
                desc: bn ? "টেকনিশিয়ান এসে সমস্যা ঠিক করবে। কাজ শেষে পেমেন্ট করুন।" : "Technician fixes the issue on-site. Pay after service completion.",
                color: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-3xl border ${item.color} relative`}
              >
                <span className="absolute top-4 right-4 text-4xl font-extrabold text-slate-200 dark:text-slate-800 select-none">{item.step}</span>
                <div className="mb-4">{item.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: WHY CHOOSE US
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50/50 dark:bg-black">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white"
            >
              {bn ? "কেন যান্ত্রিকঘুড়ি বেছে নেবেন?" : "Why Choose JantrikGhuri?"}
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <MoonStar className="w-6 h-6 text-indigo-500" />, title: bn ? "মাঝরাতেও সার্ভিস" : "Late Night Service", desc: bn ? "রাত ২টায়ও আমাদের টেকনিশিয়ান আপনার পাশে থাকবে।" : "Our technicians are available even at 2 AM." },
              { icon: <MapPin className="w-6 h-6 text-rose-500" />, title: bn ? "GPS লাইভ ট্র্যাকিং" : "Live GPS Tracking", desc: bn ? "আপনার সঠিক লোকেশনে মেকানিক পৌঁছে যাবে।" : "Mechanic reaches your exact GPS location." },
              { icon: <BadgeCheck className="w-6 h-6 text-emerald-500" />, title: bn ? "ভেরিফাইড টেকনিশিয়ান" : "Verified Technicians", desc: bn ? "প্রতিটি টেকনিশিয়ান যাচাই করা ও প্রশিক্ষিত।" : "Every technician is verified and trained." },
              { icon: <DollarSign className="w-6 h-6 text-amber-500" />, title: bn ? "ন্যায্য মূল্য" : "Fair Pricing", desc: bn ? "কোনো লুকানো চার্জ নেই। কাজের আগেই খরচ জানতে পারবেন।" : "No hidden charges. Know the cost upfront." },
              { icon: <Shield className="w-6 h-6 text-blue-500" />, title: bn ? "সার্ভিস গ্যারান্টি" : "Service Guarantee", desc: bn ? "কাজের মান নিশ্চিত করতে আমরা গ্যারান্টি দিই।" : "We guarantee the quality of every service." },
              { icon: <Headphones className="w-6 h-6 text-violet-500" />, title: bn ? "২৪/৭ হেল্পলাইন" : "24/7 Helpline", desc: bn ? "যেকোনো সময়ে কল করুন — আমরা সবসময় প্রস্তুত।" : "Call anytime — we're always ready." },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6: TESTIMONIALS
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white"
            >
              {bn ? "গ্রাহকদের মতামত" : "What Our Customers Say"}
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: bn ? "রাসেল আহমেদ" : "Rassel Ahmed",
                loc: bn ? "ঢাকা, মিরপুর" : "Dhaka, Mirpur",
                stars: 5,
                text: bn ? "রাত ১টায় গাড়ির ব্যাটারি মারা গেলো সাভারের রাস্তায়। যান্ত্রিকঘুড়িতে কল করার ৪০ মিনিটের মধ্যে মেকানিক এসে ব্যাটারি চেঞ্জ করে দিলো। অসাধারণ সার্ভিস!" : "Car battery died at 1 AM on Savar road. Called JantrikGhuri, mechanic arrived in 40 mins and replaced the battery. Amazing service!"
              },
              {
                name: bn ? "ফারজানা আক্তার" : "Farzana Akter",
                loc: bn ? "চট্টগ্রাম, নাসিরাবাদ" : "Chittagong, Nasirabad",
                stars: 5,
                text: bn ? "এসি হঠাৎ বন্ধ হয়ে গেলো গরমের মধ্যে। ফোন করার ২ ঘণ্টার মধ্যে টেকনিশিয়ান এসে গ্যাস চার্জ করে দিলো। দাম অনেক ফেয়ার ছিল।" : "AC suddenly stopped in the heat. Technician came within 2 hours and recharged the gas. Very fair pricing."
              },
              {
                name: bn ? "তানভীর হাসান" : "Tanvir Hasan",
                loc: bn ? "সিলেট, জিন্দাবাজার" : "Sylhet, Zindabazar",
                stars: 4,
                text: bn ? "বাইকের চেইন ছিঁড়ে গেলো হাইওয়েতে। WhatsApp-এ ছবি পাঠালাম, ১ ঘণ্টায় মেকানিক এসে ঠিক করে দিলো। ধন্যবাদ যান্ত্রিকঘুড়ি!" : "Bike chain snapped on the highway. Sent photos on WhatsApp, mechanic came in 1 hour and fixed it. Thanks JantrikGhuri!"
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 relative"
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-200 dark:text-slate-700" />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} className={`w-4 h-4 ${si < t.stars ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"}`} />
                  ))}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm border border-indigo-200 dark:border-indigo-800">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.loc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7: COVERAGE AREA
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-4xl font-extrabold"
            >
              {bn ? "আমাদের সার্ভিস কভারেজ এলাকা" : "Our Service Coverage Area"}
            </motion.h2>
            <p className="text-sm text-indigo-200 leading-relaxed">
              {bn
                ? "যান্ত্রিকঘুড়ি বাংলাদেশের প্রধান শহরগুলোতে সার্ভিস দিচ্ছে এবং দ্রুত সারাদেশে সম্প্রসারণ করছে।"
                : "JantrikGhuri is currently serving major cities across Bangladesh and rapidly expanding nationwide."}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              bn ? "ঢাকা" : "Dhaka",
              bn ? "চট্টগ্রাম" : "Chittagong",
              bn ? "সিলেট" : "Sylhet",
              bn ? "রাজশাহী" : "Rajshahi",
              bn ? "খুলনা" : "Khulna",
              bn ? "বরিশাল" : "Barishal",
              bn ? "রংপুর" : "Rangpur",
              bn ? "ময়মনসিংহ" : "Mymensingh",
              bn ? "গাজীপুর" : "Gazipur",
              bn ? "নারায়ণগঞ্জ" : "Narayanganj",
              bn ? "কুমিল্লা" : "Comilla",
              bn ? "সাভার" : "Savar",
            ].map((city, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-5 py-2.5 rounded-full bg-white/15 border border-white/25 text-sm font-bold backdrop-blur-sm hover:bg-white/25 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />{city}
              </motion.span>
            ))}
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-indigo-200 italic">
              {bn ? "* আপনার এলাকায় সার্ভিস পেতে কল করে জানুন" : "* Call us to check service availability in your area"}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8: FAQ
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 py-16 md:py-24 space-y-10">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white"
            >
              {bn ? "সাধারণ জিজ্ঞাসা" : "Frequently Asked Questions"}
            </motion.h2>
          </div>

          <div className="space-y-3">
            {(bn ? [
              { q: "যান্ত্রিকঘুড়ি কি সার্ভিস দেয়?", a: "আমরা গাড়ি, বাইক, এসি, ফ্রিজ, জেনারেটর, ইলেকট্রিক্যাল এবং প্লাম্বিং সার্ভিস প্রদান করি। যেকোনো মেকানিক্যাল বা টেকনিক্যাল সমস্যায় আমাদের কল করুন।" },
              { q: "সার্ভিস চার্জ কত?", a: "সমস্যার ধরন ও অবস্থানের উপর নির্ভর করে চার্জ নির্ধারিত হয়। কোনো লুকানো চার্জ নেই — কাজ শুরুর আগেই আপনাকে আনুমানিক খরচ জানানো হবে।" },
              { q: "রাতের বেলায় কি সার্ভিস পাওয়া যায়?", a: "হ্যাঁ! আমরা ২৪ ঘণ্টা, ৭ দিন সার্ভিস দিই। মাঝরাতেও কল করতে পারেন।" },
              { q: "মেকানিক কতক্ষণে আসবে?", a: "সাধারণত আপনার লোকেশন ও ট্রাফিকের উপর নির্ভর করে ৩০ মিনিট থেকে ২ ঘণ্টার মধ্যে পৌঁছে যায়।" },
              { q: "পেমেন্ট কিভাবে করবো?", a: "ক্যাশ, বিকাশ, নগদ এবং রকেটের মাধ্যমে পেমেন্ট করতে পারবেন। কাজ সম্পূর্ণ হওয়ার পরেই পেমেন্ট নেওয়া হয়।" },
              { q: "টেকনিশিয়ানরা কি ভেরিফাইড?", a: "হ্যাঁ, প্রতিটি টেকনিশিয়ানের NID ভেরিফিকেশন, দক্ষতা পরীক্ষা এবং ব্যাকগ্রাউন্ড চেক করা হয়।" },
            ] : [
              { q: "What services does JantrikGhuri offer?", a: "We provide car, bike, AC, fridge, generator, electrical, and plumbing services. Call us for any mechanical or technical problem." },
              { q: "How much does a service cost?", a: "Charges depend on the type of problem and your location. No hidden charges — you'll be told the estimated cost before work begins." },
              { q: "Is service available at night?", a: "Yes! We provide 24/7 service. You can call us even at midnight." },
              { q: "How long does it take for a mechanic to arrive?", a: "Typically 30 minutes to 2 hours, depending on your location and traffic." },
              { q: "How do I pay?", a: "You can pay via cash, bKash, Nagad, or Rocket. Payment is taken only after service completion." },
              { q: "Are the technicians verified?", a: "Yes, every technician undergoes NID verification, skill testing, and background checks." },
            ]).map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION: BOTTOM CTA BANNER
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-slate-900 dark:bg-black border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-20 text-center space-y-8">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white">
            {bn ? "এখনই সাহায্য দরকার?" : "Need Help Right Now?"}
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            {bn ? "ফোন করুন বা WhatsApp করুন। আমাদের টিম আপনাকে সাহায্য করতে সবসময় প্রস্তুত।" : "Call or WhatsApp us. Our team is always ready to help you."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${HELPLINE}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
            >
              <Phone className="w-5 h-5" /> {bn ? "📞 কল করুন" : "📞 Call Now"}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-lg shadow-[#25D366]/30 transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5" /> {bn ? "💬 WhatsApp" : "💬 WhatsApp"}
            </a>
            <button
              onClick={() => setContactOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all active:scale-95 border border-white/20 cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" /> {bn ? "📋 ফর্ম পূরণ করুন" : "📋 Fill Form"}
            </button>
          </div>
          <p className="text-xs text-slate-500">
            {bn ? "হেল্পলাইন:" : "Helpline:"} <a href={`tel:${HELPLINE}`} className="text-indigo-400 font-bold hover:text-indigo-300">+880 1581-881805</a>
          </p>
        </div>
      </section>

      {/* ═══ Contact Form Modal ═══ */}
      <ContactFormModal isOpen={contactOpen} onClose={() => setContactOpen(false)} language={language as "bn" | "en"} />
    </div>
  );
}
