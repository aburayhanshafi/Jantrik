/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { X, Smartphone, Globe, Code2, AlertTriangle, Cloud, PlayCircle } from "lucide-react";

interface PublishGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PublishGuide({ isOpen, onClose }: PublishGuideProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm dark:bg-black/80">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800"
      >
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-100 dark:border-slate-800 p-5 flex items-center justify-between z-10">
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
            <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            পাবলিশ ও ডিপ্লয়মেন্ট গাইডলাইন
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-8 text-sm text-slate-700 dark:text-slate-300">
          
          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> 
              Google AI Studio থেকে পাবলিশ করার ট্রাবলশুটিং
            </h3>
            <p className="leading-relaxed">
              আপনি যদি AI Studio থেকে সরাসরি শেয়ার বা পাবলিশ করতে সমস্যা অনুভব করেন, এর প্রধান কারণ হতে পারে <strong>Firebase Authentication এবং API Keys</strong>। 
              এই অ্যাপটি ফুল-স্ট্যাক এবং Firebase Auth ব্যবহার করে। AI Studio শেয়ারিং লিঙ্ক সাধারণত ক্লায়েন্ট-সাইড অনলি অ্যাপের জন্য ভালো কাজ করে।
            </p>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
              <strong className="block text-amber-900 dark:text-amber-500 mb-1">সমাধান:</strong>
              <ul className="list-disc pl-5 space-y-1 text-amber-800 dark:text-amber-400">
                <li>স্ক্রিনের উপরে Settings (গিয়ার আইকন) এ ক্লিক করুন।</li>
                <li>"Export to GitHub" অথবা "Download ZIP" নির্বাচন করে কোডটি আপনার কাছে সেভ করুন।</li>
                <li>কোডটি ডাউনলোড করে Vercel বা Google Cloud Run-এ নিজে ডিপ্লয় করা সবচেয়ে প্রফেশনাল পদ্ধতি।</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Smartphone className="w-4 h-4 text-indigo-500" /> 
              অ্যান্ড্রয়েডে ডেমো ভার্সন ফ্রি ইন্সটল করা (PWA Method)
            </h3>
            <p className="leading-relaxed">
              অ্যাপটি একটি <strong>Progressive Web App (PWA)</strong> হিসাবে তৈরি করা হয়েছে। তাই কোনো Play Store ছাড়াই এটি ইন্সটল করা যাবে। 
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>AI Studio-এর ডানপাশের <strong>Preview URL</strong> (Open in new tab আইকনে ক্লিক করে) আপনার অ্যান্ড্রয়েড ফোনের Chrome ব্রাউজারে ওপেন করুন।</li>
              <li>Chrome ব্রাউজারের ডানদিকের উপরে <strong>থ্রি-ডট (⋮)</strong> মেনুতে ক্লিক করুন।</li>
              <li>সেখান থেকে <strong>"Add to Home Screen"</strong> বা <strong>"Install App"</strong> অপশনে চাপ দিন।</li>
              <li>কিছুক্ষণ পর এটি সাধারণ অ্যাপের মত আপনার ফোনের হোম স্ক্রিনে যান্ত্রিকঘুড়ি লোগো সহ চলে আসবে।</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Cloud className="w-4 h-4 text-blue-500" /> 
              প্রফেশনালি পাবলিশ করার পদ্ধতি (Production Deployment)
            </h3>
            <p className="leading-relaxed">
              JantrikGhuri-কে একটি বাস্তব ব্যবসার জন্য লাইভ করতে নিচের পদ্ধতি অনুসরণ করুন:
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 font-mono text-xs flex items-center justify-center">১</span>
                  ফায়ারবেস (Firebase) সেটআপ সম্পূর্ণ করা
                </h4>
                <p className="text-xs">
                  <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Firebase Console</a>-এ গিয়ে নতুন প্রজেক্ট খুলুন। Authentication (Email ও Google) চালু করুন। Database তৈরি করুন এবং Project Settings থেকে Config Keys কপি করে প্রজেক্টের <code>.env</code> ফাইলে বসান।
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 font-mono text-xs flex items-center justify-center">২</span>
                  Vercel বা Cloud Run এ হোস্টিং
                </h4>
                <p className="text-xs">
                  আপনার কোডটি GitHub-এ পুশ করুন। এরপর Vercel.com-এ একাউন্ট খুলে সরাসরি GitHub রিপোজিটরি ইম্পোর্ট করুন। Framework Preset হিসেবে "Vite" সিলেক্ট করে Deploy-এ ক্লিক করুন।
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 font-mono text-xs flex items-center justify-center">৩</span>
                  কাস্টম ডোমেইন (Custom Domain) যুক্ত করা
                </h4>
                <p className="text-xs">
                  নেমচিপ বা লোকাল প্রোভাইডার থেকে <code>jantrikghuri.com</code> বা <code>jantrikghuri.com.bd</code> ডোমেইন কিনে Vercel-এর Domain সেটিংসে যুক্ত করুন।
                </p>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 font-mono text-xs flex items-center justify-center">৪</span>
                  Play Store এ দেওয়া (TWA পদ্ধতি)
                </h4>
                <p className="text-xs">
                  ওয়েব অ্যাপটিকে Android App বানাতে <strong>Trusted Web Activity (TWA)</strong> বা <strong>Capacitor</strong> ব্যবহার করে APK/AAB এ রূপান্তর করুন। এরপর ২৫ ডলার দিয়ে Google Play Console একাউন্ট খুলে আপলোড করুন।
                </p>
              </div>
            </div>
          </section>

        </div>
      </motion.div>
    </div>
  );
}
