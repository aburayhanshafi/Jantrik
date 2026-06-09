/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { ServiceCategory } from "../types";
import { Car, Keyboard, ShieldAlert, Zap, ThermometerSnowflake, Compass, Phone, MoonStar, MapPin } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const carBanner = "/src/assets/images/car_service_banner_1781015724259.png";
const bikeBanner = "/src/assets/images/bike_service_banner_1781015738289.png";
const buildingBanner = "/src/assets/images/building_service_banner_1781015754784.png";

interface HomeViewProps {
  onSelectCategory: (category: ServiceCategory, initialDetail?: string) => void;
  onEnterAdmin: () => void;
}

export default function HomeView({ onSelectCategory, onEnterAdmin }: HomeViewProps) {
  const { language } = useAppContext();

  const labels = {
    heroTitle: language === "bn" ? "মাঝরাস্তায় গাড়ি নষ্ট? রিমোট এলাকায় এসি বা জেনারেটর বিকল?" : "Stuck on the road? Remote location? Late night?",
    heroSubtitle: language === "bn" 
      ? "যেকোনো অদ্ভুত সময়ে, অনেক দূরের গন্তব্যে - মেকানিক যাবে আপনার কাছে। জিপিএস লাইভ ট্র্যাকিংয়ের মাধ্যমে নিখুঁত লোকেশনে।"
      : "We bring the service station to your exact GPS location. Day or late night, we are here.",
    car: language === "bn" ? "গাড়ি রিকভারি" : "Car Recovery",
    bike: language === "bn" ? "বাইক ইমার্জেন্সি" : "Bike Emergency",
    home: language === "bn" ? "বিল্ডিং সাপোর্ট" : "Building Support",
    ac: language === "bn" ? "এসি সার্ভিসিং" : "AC Servicing",
    gen: language === "bn" ? "জেনারেটর মেরামত" : "Generator Repair",
    feature1: language === "bn" ? "মাঝরাতে সার্ভিস" : "Late Night Support",
    feature2: language === "bn" ? "রিমোট ডেসপ্যাচ" : "Remote Dispatch",
    feature3: language === "bn" ? "জিপিএস ট্র্যাকিং" : "Live GPS Tracking"
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-16 space-y-16" id="home_view_container">
      
      {/* Hero Marketing Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 dark:bg-indigo-500/20 text-white dark:text-indigo-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 border border-slate-800 dark:border-indigo-400/30"
        >
          <MoonStar className="w-4 h-4 text-amber-400" />
          <span>{language === "bn" ? "২৪/৭ ইমার্জেন্সি সাপোর্ট" : "24/7 Emergency Support"}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse hidden sm:inline-block"></span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight font-sans"
        >
          {labels.heroTitle}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          {labels.heroSubtitle}
        </motion.p>

        {/* Feature Badges Marketing focus */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 pt-4"
        >
          <span className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-indigo-100 dark:border-indigo-800 shadow-sm">
            <MoonStar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> {labels.feature1}
          </span>
          <span className="px-4 py-2 bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-rose-100 dark:border-rose-800 shadow-sm">
            <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-400" /> {labels.feature2}
          </span>
          <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-800 shadow-sm">
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> {labels.feature3}
          </span>
        </motion.div>
      </section>

      {/* Main Categories */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="service_cards_grid">
        
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
            <h3 className="text-2xl font-bold text-white mb-1 font-sans">{labels.car}</h3>
            <p className="text-blue-100 text-sm opacity-90 line-clamp-2">
              {language === "bn" ? "খুব দূরে অথবা রাতে গাড়ি স্টার্ট না নিলে দ্রুত ডাকুন।" : "Car won't start in remote area? Call us immediately."}
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
            <h3 className="text-2xl font-bold text-white mb-1 font-sans">{labels.bike}</h3>
            <p className="text-amber-100 text-sm opacity-90 line-clamp-2">
              {language === "bn" ? "মাঝরাতে দূরে কোথাও বাইকের চেইন ছিঁড়ে গেলে আমরা আসছি।" : "Late night bike issues far from home? We are coming."}
            </p>
          </div>
        </motion.button>

        {/* BUILDING SPLIT CARD */}
        <div className="h-72 flex flex-col gap-4">
          <button
            onClick={() => onSelectCategory(ServiceCategory.BUILDING, "ac")}
            className="group flex-1 relative overflow-hidden rounded-3xl bg-cyan-600 dark:bg-cyan-800 border border-cyan-500 dark:border-cyan-700 hover:brightness-110 shadow-lg text-left cursor-pointer p-5 flex items-center gap-4 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500 dark:bg-cyan-700 flex items-center justify-center text-white shadow-inner flex-shrink-0 shadow-cyan-500/50">
              <ThermometerSnowflake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-sans">{labels.ac}</h3>
              <p className="text-cyan-100 text-[10px] mt-0.5">
                {language === "bn" ? "রাতের বেলায় টেকনিশিয়ান হাজির।" : "AC dead at night? Technician on the way."}
              </p>
            </div>
          </button>

          <button
            onClick={() => onSelectCategory(ServiceCategory.BUILDING, "generator")}
            className="group flex-1 relative overflow-hidden rounded-3xl bg-slate-800 dark:bg-slate-900 border border-slate-700 hover:bg-slate-700 dark:hover:bg-slate-800 shadow-lg text-left cursor-pointer p-5 flex items-center gap-4 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-inner flex-shrink-0 shadow-rose-500/30">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-sans">{labels.gen}</h3>
              <p className="text-slate-300 text-[10px] mt-0.5">
                {language === "bn" ? "লোডশেডিংয়ে জেনারেটর সাপোর্ট。" : "Generator support during power cuts."}
              </p>
            </div>
          </button>
        </div>

      </section>

    </div>
  );
}
