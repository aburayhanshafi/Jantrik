/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShieldCheck, User, Wrench, Moon, Sun, Globe, LogOut } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import AuthModal from "./AuthModal";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const logoImg = "/src/assets/images/gantrikghuri_logo_1781015708519.png";

interface HeaderProps {
  isAdminMode: boolean;
  onToggleAdmin: (admin: boolean) => void;
}

export default function Header({ isAdminMode, onToggleAdmin }: HeaderProps) {
  const { theme, toggleTheme, language, toggleLanguage, user, isAdmin } = useAppContext();
  const [authOpen, setAuthOpen] = useState(false);

  const t = {
    brandEng: "JantrikGhuri",
    brandBn: "যান্ত্রিকঘুড়ি",
    tagline: language === "bn" ? "অন-ডিমান্ড মেকানিক্যাল ও টেকনিক্যাল সার্ভিস" : "On-Demand Mechanical & Technical Service",
    bookService: language === "bn" ? "সার্ভিস বুক করুন" : "Book Service",
    adminPanel: language === "bn" ? "কোঅর্ডিনেটর প্যানেল" : "Coordinator Panel",
    login: language === "bn" ? "লগইন" : "Login",
    logout: language === "bn" ? "লগআউট" : "Logout",
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors" id="main_header_nav">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => onToggleAdmin(false)}
        >
          <div className="bg-slate-900 rounded-xl flex items-center justify-center w-10 h-10 border border-slate-800">
            <img src={logoImg} alt="JantrikGhuri Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg md:text-xl tracking-tight text-slate-900 dark:text-white font-sans flex items-center gap-1.5">
              {language === "bn" ? t.brandBn : t.brandEng}
              {isAdminMode && (
                <span className="hidden sm:flex px-1.5 py-0.5 text-[10px] font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-md border border-rose-200 dark:border-rose-900 items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> HQ
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline-block">{language}</span>
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-center"
            title="Toggle Theme"
          >
            {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

          {/* Navigation / User Controls */}
          {isAdminMode ? (
            <button
              onClick={() => onToggleAdmin(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline-block">{t.bookService}</span>
            </button>
          ) : (
            isAdmin && (
              <button
                onClick={() => onToggleAdmin(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline-block">{t.adminPanel}</span>
              </button>
            )
          )}

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase">
                  {user.email?.charAt(0) || "U"}
                </span>
              </div>
              <button
                onClick={() => signOut(auth)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all cursor-pointer"
                title={t.logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-400 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.login}</span>
            </button>
          )}

        </div>
      </div>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
