/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Ticket, ServiceCategory } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, MapPin, Eye, Trash2, CheckCircle, Clock, Check, AlertCircle, Wrench, X, Filter, Sparkles, Navigation 
} from "lucide-react";

interface AdminPanelProps {
  onRefreshTrigger?: number;
}

export default function AdminPanel({ onRefreshTrigger }: AdminPanelProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    fetchTickets();
  }, [onRefreshTrigger]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/reports/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // update locally
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus as any } : t));
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(prev => prev ? { ...prev, status: newStatus as any } : null);
        }
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!window.confirm("আপনি কি নিশ্চিতভাবে এই বুকিং রেকর্ডটি মুছে ফেলতে চান?")) return;

    try {
      const res = await fetch(`/api/reports/${ticketId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setTickets(prev => prev.filter(t => t.id !== ticketId));
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(null);
        }
      }
    } catch (err) {
      console.error("Error deleting ticket:", err);
    }
  };

  // Filters calculation
  const filteredTickets = tickets.filter(t => {
    const catMatch = filterCategory === "all" || t.category === filterCategory;
    const statMatch = filterStatus === "all" || t.status === filterStatus;
    return catMatch && statMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">⏳ অপেক্ষমান</span>;
      case "assigned":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">🛠️ টেকনিশিয়ান পথিমধ্যে</span>;
      case "completed":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">✅ সমাধান সম্পন্ন</span>;
      case "cancelled":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">❌ বাতিল করা হয়েছে</span>;
      default:
        return null;
    }
  };

  const truncateString = (str: string, maxLen: number) => {
    if (str.length <= maxLen) return str;
    return str.slice(0, maxLen) + "...";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" id="admin_panel_container">
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8" id="admin_header_section">
        <div>
          <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="p-2 rounded-xl bg-slate-900 text-white font-mono scale-95">HQ</span> 
            <span>কোঅর্ডিনেটর সার্ভিস প্যানেল</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            গ্রাহকের পাঠানো আবেদন, ফোন নম্বর, সমস্যা বিশ্লেষণ এবং নির্ভুল জিপিএস লোকেশন ট্র্যাকিং সিস্টেম।
          </p>
        </div>
        <button
          onClick={fetchTickets}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-sans shadow-sm transition-all active:scale-95 cursor-pointer"
          id="btn_refresh_tickets"
        >
          🔄 লাইভ ডাটা রিফ্রেশ করুন
        </button>
      </div>

      {/* Stats counter boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" id="stats_boxes_wrapper">
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-sans">মোট সার্ভিস কল</span>
          <span className="text-2xl font-bold text-slate-900 font-mono mt-1">{tickets.length} টি</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs text-amber-500 font-sans">অপেক্ষমান কল (Pending)</span>
          <span className="text-2xl font-bold text-amber-600 font-mono mt-1">
            {tickets.filter(t => t.status === "pending").length} টি
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs text-blue-500 font-indigo">পথিমধ্যে রয়েছে (Assigned)</span>
          <span className="text-2xl font-bold text-blue-600 font-mono mt-1">
            {tickets.filter(t => t.status === "assigned").length} টি
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs text-emerald-500 font-sans">সমাধান কৃত (Completed)</span>
          <span className="text-2xl font-bold text-emerald-600 font-mono mt-1">
            {tickets.filter(t => t.status === "completed").length} টি
          </span>
        </div>
      </div>

      {/* Filter Controllers */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-4 mb-6" id="filters_bar">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" /> ফিল্টার করুণ:
          </span>
          
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">সব ক্যাটাগরি</option>
            <option value="car">🚗 গাড়ি</option>
            <option value="motorcycle">🏍️ মোটরসাইকেল</option>
            <option value="building">🏢 বিল্ডিং ও এসি</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">সব প্রগ্রেস</option>
            <option value="pending">⏳ অপেক্ষমান</option>
            <option value="assigned">🛠️ টিম যাচ্ছে</option>
            <option value="completed">✅ সমাধান সম্পন্ন</option>
            <option value="cancelled">❌ বাতিল</option>
          </select>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          ফিল্টার অনুযায়ী ফলাফল: <strong className="text-slate-900">{filteredTickets.length}</strong> টি বুকিং
        </span>
      </div>

      {/* Main split dashboard (List on left, Detailed Preview on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="admin_interactive_area">
        {/* Left column list */}
        <div className="lg:col-span-7 space-y-4 max-h-[600px] overflow-y-auto pr-1" id="admin_tickets_scroller">
          {loading ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <span className="inline-block animate-spin font-bold text-slate-900 border-2 border-indigo-500 border-t-transparent rounded-full h-8 w-8 mb-4"></span>
              <p className="text-sm font-semibold text-slate-500">ডাটাবেজ লোড হচ্ছে, দয়া করে অপেক্ষা করুন...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">কোনো বুকিং কল পাওয়া যায়নি।</p>
            </div>
          ) : (
            filteredTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTicket?.id === t.id ? "ring-2 ring-indigo-500 border-indigo-300 bg-indigo-50/10" : "border-slate-100"
                }`}
                id={`ticket_summary_card_${t.id}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="font-mono text-[10px] font-extrabold text-indigo-600 tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">ID: {t.id}</span>
                    <h4 className="text-base font-bold text-slate-950 mt-1">{t.customerName}</h4>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(t.status)}
                    <p className="text-[10px] text-slate-400 font-mono mt-1">
                      {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  <strong className="text-slate-800 bg-slate-100 rounded px-1.5 font-bold mr-1">
                    {t.category === "car" ? "গাড়ি" : t.category === "motorcycle" ? "বাইক" : t.subCategory === "ac" ? "এসি (AC)" : "জেনারেটর"}
                  </strong>
                  {t.problemDescription}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                  {/* Phone */}
                  <a 
                    href={`tel:${t.phoneNumber}`} 
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-slate-700 hover:text-indigo-600"
                  >
                    <Phone className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-sans font-bold">{t.phoneNumber}</span>
                  </a>

                  {/* Location Address view */}
                  <div className="flex items-center gap-1.5 max-w-[250px] truncate text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span className="truncate">{t.location?.address || "Location unavailable"}</span>
                  </div>

                  <button
                    onClick={() => setSelectedTicket(t)}
                    className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 text-white text-[10px] font-bold"
                  >
                    <Eye className="w-3 h-3" /> বিস্তারিত ➔
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right column: Ticket details view */}
        <div className="lg:col-span-5" id="admin_preview_sticky_box">
          <AnimatePresence mode="wait">
            {selectedTicket ? (
              <motion.div
                key={selectedTicket.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden sticky top-24"
                id="ticket_detail_preview_panel"
              >
                {/* Preview Panel Title line */}
                <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-850 text-white flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-400">বুকিং ডিটেইলস</span>
                    <h3 className="text-lg font-bold font-sans mt-0.5">{selectedTicket.customerName}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Info List */}
                <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
                  {/* Category Details & timestamps */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">সার্ভিস ক্যাটাগরি</p>
                      <h4 className="text-sm font-bold text-slate-900 mt-1 capitalize">
                        {selectedTicket.category === "car" 
                          ? "🚗 গাড়ি (Car Service)" 
                          : selectedTicket.category === "motorcycle" 
                          ? "🏍️ মোটরসাইকেল (Motorcycle)" 
                          : selectedTicket.subCategory === "ac"
                          ? "❄️ বাসার এসি সার্ভিসিং" 
                          : "⚡ জেনারেটর সার্ভিসিং"}
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">বুকিং টাইম</p>
                      <span className="text-xs text-slate-700 font-bold font-mono block mt-1">
                        {new Date(selectedTicket.createdAt).toLocaleDateString("bn-BD")} - {new Date(selectedTicket.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {/* Problem Description with quote styling */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">গ্রাহকের বর্ণিত সমস্যা:</span>
                    <blockquote className="p-4 rounded-xl bg-slate-50 border-l-4 border-indigo-600 text-slate-800 text-xs sm:text-sm font-sans leading-relaxed">
                      "{selectedTicket.problemDescription}"
                    </blockquote>
                  </div>

                  {/* Voice Transcription if exists */}
                  {selectedTicket.voiceText && (
                    <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 grid gap-1.5">
                      <span className="text-[10px] text-indigo-700 font-bold uppercase flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> উদ্ধারকৃত ভয়েস মেসেজ:
                      </span>
                      <p className="text-xs italic text-indigo-950 leading-relaxed font-sans">
                        "{selectedTicket.voiceText}"
                      </p>
                    </div>
                  )}

                  {/* Phone & Instant Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl border border-slate-200 text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">মোবাইল নম্বর</p>
                      <a
                        href={`tel:${selectedTicket.phoneNumber}`}
                        className="text-base font-extrabold text-slate-900 inline-flex items-center gap-1.5 mt-2 hover:text-indigo-600"
                      >
                        <Phone className="w-4 h-4 text-indigo-500" />
                        <span className="font-sans">{selectedTicket.phoneNumber}</span>
                      </a>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase font-sans">লোকেশন কোঅর্ডিনেটস</p>
                      <span className="text-xs font-bold text-slate-800 font-mono block mt-1.5">
                        {selectedTicket.location?.latitude?.toFixed(4) || "N/A"}, {selectedTicket.location?.longitude?.toFixed(4) || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Live Tracking link (৩,সাবমিটের সাথে সাথে তাদের লোকেশন সংযুক্ত থাকবে যা আমাদের কাছে চলে আসবে) */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> সার্ভিস সাইট মেগা ম্যাপ লিন্ক
                      </p>
                      <p className="text-xs font-semibold text-slate-700 font-sans mt-1.5">
                        {selectedTicket.location?.address || "Address details not provided"}
                      </p>
                    </div>
                    {/* Generates Google Maps Direct Coordinate directions link */}
                    {selectedTicket.location?.latitude && selectedTicket.location?.longitude ? (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedTicket.location.latitude},${selectedTicket.location.longitude}`}
                        target="_blank"
                        rel="referrer"
                        className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                        id="google_maps_directions_href"
                      >
                        <Navigation className="w-4 h-4 text-white" />
                        <span>গুগল ম্যাপে দিকনির্দেশনা (Google Maps Link)</span>
                      </a>
                    ) : (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedTicket.location?.address || "")}`}
                        target="_blank"
                        rel="referrer"
                        className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                        id="google_maps_text_search_href"
                      >
                        <Navigation className="w-4 h-4 text-white" />
                        <span>ঠিকানা দিয়ে ম্যাপে সার্চ করুন ➔</span>
                      </a>
                    )}
                  </div>

                  {/* Gemini AI diagnostic insights if available */}
                  {selectedTicket.aiDiagnosis && (
                    <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                      <div className="flex items-center gap-1 text-xs font-bold text-indigo-900 border-b border-indigo-100 pb-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        <span>জেমিনি অটোমেটিক যান্ত্রিক ডায়াগনোসিস:</span>
                      </div>
                      <div className="space-y-2 text-[11px] font-sans">
                        <div>
                          <span className="text-slate-400 font-bold block">সম্ভাব্য ত্রুটি:</span>
                          <span className="text-slate-800 font-bold text-xs">{selectedTicket.aiDiagnosis.estimatedIssue}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold block">প্রস্তাবিত সমাধান:</span>
                          <span className="text-slate-700 leading-relaxed block">{selectedTicket.aiDiagnosis.suggestedSolution}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div>
                            <span className="text-slate-400 font-bold block">জরুরিতা (Urgency):</span>
                            <span className={`inline-block font-extrabold px-2 py-0.5 mt-0.5 rounded text-[10px] ${
                              selectedTicket.aiDiagnosis.urgency === "high" 
                                ? "bg-red-100 text-red-800" 
                                : selectedTicket.aiDiagnosis.urgency === "medium" 
                                ? "bg-amber-100 text-amber-800" 
                                : "bg-green-100 text-green-800"
                            }`}>
                              {selectedTicket.aiDiagnosis.urgency === "high" ? "🔴 হাই (অবিলম্বে)" : selectedTicket.aiDiagnosis.urgency === "medium" ? "🟡 মিডিয়াম" : "🟢 লো"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block">আনুমানিক মেরামত খরচ:</span>
                            <span className="text-slate-800 font-extrabold text-xs block mt-0.5">{selectedTicket.aiDiagnosis.estimatedCostRange}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status update box in details */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <p className="text-xs font-bold text-slate-800">সার্ভিস বুকিং ট্র্যাকিং কন্ট্রোল:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateStatus(selectedTicket.id, "assigned")}
                        className="py-2.5 px-3 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        🛠️ মেকানিক নিযুক্ত করুন
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedTicket.id, "completed")}
                        className="py-2.5 px-3 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      >
                        ✅ সমাধান সম্পন্ন করুন
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">অন্যান্য অ্যাকশন:</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(selectedTicket.id, "pending")}
                          className="px-2.5 py-1 text-[10px] font-bold text-amber-600 bg-white border border-amber-200 rounded hover:bg-amber-50 cursor-pointer"
                        >
                          অপেক্ষমান করুন
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedTicket.id, "cancelled")}
                          className="px-2.5 py-1 text-[10px] font-bold text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 cursor-pointer"
                        >
                          বাতিল করুন
                        </button>
                        <button
                          onClick={() => handleDeleteTicket(selectedTicket.id)}
                          className="px-2 py-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 cursor-pointer"
                        >
                          মুছুন
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="hidden lg:flex flex-col items-center justify-center p-8 py-24 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-center text-slate-400 sticky top-24">
                <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm font-semibold">বিস্তারিত দেখতে যেকোনো টিকিট বা বুকিং-এ ক্লিক করুন</p>
                <p className="text-xs text-slate-400 mt-1">টিকিটের ওপর ক্লিক করলে তার সম্পূর্ণ জিপিএস লোকেশন ও কাস্টমার ডিটেইলস এখানে ভেসে উঠবে।</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
