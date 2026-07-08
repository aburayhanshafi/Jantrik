/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ServiceCategory, Ticket } from "../types";
import { 
  ArrowLeft, Phone, User, MapPin, Mic, MicOff, 
  Sparkles, CheckCircle2, Loader2, RefreshCw,
  Camera, Upload, X, Settings, Wind, Paintbrush, Zap, Droplets
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

import carDiagram from "../assets/images/1783523701981.png";
import bikeDiagram from "../assets/images/1783523679639.png";
import acDiagram from "../assets/images/1783523652215.png";
import electricDiagram from "../assets/images/1783524048668.png";
import plumberDiagram from "../assets/images/1783523926859.png";
import applianceDiagram from "../assets/images/1783524833794.png";
import liftDiagram from "../assets/images/Jantrik_logo.png";

interface ServiceFormProps {
  category: ServiceCategory;
  initialSubCategory?: string;
  onBack: () => void;
  onSubmitSuccess: (ticket: Ticket) => void;
}

interface UploadedFile {
  id: string;
  file: File;
  blobUrl: string;
  type: "image" | "video";
}

export default function ServiceForm({ category, initialSubCategory, onBack, onSubmitSuccess }: ServiceFormProps) {
  const { user, language } = useAppContext();

  // Common states
  // Auto fill name if Google login name is available
  const [customerName, setCustomerName] = useState(user?.displayName || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [subCategory, setSubCategory] = useState<string>(
    category === ServiceCategory.BUILDING 
      ? initialSubCategory || "generator" 
      : ""
  );

  // Address and geolocation states
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [gpsStatus, setGpsStatus] = useState<"idle" | "getting" | "found" | "denied">("idle");

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // File Upload states
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // STT Recognition state
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);

  // API Call states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Audio References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Labels for i18n
  const t = {
    car: language === "bn" ? "গাড়ি মেরামতের আবেদন" : "Car Repair Request",
    bike: language === "bn" ? "মোটরসাইকেল মেরামতের আবেদন" : "Motorcycle Repair Request",
    building: language === "bn" ? "বিল্ডিং ও হোম সল্যুশন" : "Building & Home Solutions",
    subtitle: language === "bn" ? "সঠিক তথ্য প্রদান করুন, মেকানিক্যাল টিম আপনার লোকেশন ট্র্যাক করে রওয়ানা হবে।" : "Provide accurate details, mechanic will dispatch to your location.",
    nameLabel: language === "bn" ? "সম্পূর্ণ নাম" : "Full Name",
    phoneLabel: language === "bn" ? "মোবাইল নম্বর (যোগাযোগের জন্য)" : "Mobile Number (For Contact)",
    problemLabel: language === "bn" ? "ত্রুটি বা বিস্তারিত সমস্যা" : "Problem Description",
    stt: language === "bn" ? "মুখে বলুন" : "Dictate",
    sttListening: language === "bn" ? "শুনছি..." : "Listening...",
    record: language === "bn" ? "রেকর্ড করুন" : "Voice Record",
    stopRecord: language === "bn" ? "বন্ধ করুন" : "Stop",
    location: language === "bn" ? "লাইভ জিপিএস লোকেশন" : "Live GPS Location",
    refreshLoc: language === "bn" ? "রি-ট্র্যাক জিপিএস" : "Refresh Loc",
    addressPlaceholder: language === "bn" ? "হাউস, রোড বা ল্যান্ডমার্ক" : "House, Road, or Landmark",
    uploadLabel: language === "bn" ? "ছবি / ভিডিও আপলোড (ঐচ্ছিক)" : "Photo / Video Upload (Optional)",
    uploadText: language === "bn" ? "ছবি বা ভিডিও আপলোড করুন" : "Upload photos or videos",
    uploadHint: language === "bn" ? "ক্লিক করুন বা ফাইল ড্রপ করুন" : "Click or drop files here",
    submit: language === "bn" ? "সার্ভিস বুক করুন" : "Submit Service Request"
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds(prev => prev + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.blobUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const fetchLocation = () => {
    setGpsStatus("getting");
    if (!navigator.geolocation) {
      setGpsStatus("denied");
      setAddress(language === "bn" ? "ব্রাউজারে জিপিএস নেই" : "GPS not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setGpsStatus("found");
        
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
          .then(res => res.json())
          .then(data => {
            if (data.display_name) setAddress(data.display_name);
            else setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
          })
          .catch(() => setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`));
      },
      (error) => {
        setGpsStatus("denied");
        setAddress("");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Browser STT
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser does not support simple STT.");
      return;
    }
    if (isListeningSpeech) {
      setIsListeningSpeech(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === "bn" ? "bn-BD" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListeningSpeech(true);
    recognition.onresult = (e: any) => {
      setProblemDescription(prev => prev ? prev + " " + e.results[0][0].transcript : e.results[0][0].transcript);
      setIsListeningSpeech(false);
    };
    recognition.onerror = () => setIsListeningSpeech(false);
    recognition.onend = () => setIsListeningSpeech(false);
    recognition.start();
  };

  // MediaRecorder Voice
  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(",")[1];
          setAudioBase64(base64);
          transcribeRecordedAudio(base64);
        };
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert("Microphone denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeRecordedAudio = async (base64Data: string) => {
    setIsTranscribing(true);
    try {
      const res = await fetch("/api/gemini/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioBase64: base64Data, mimeType: "audio/webm" })
      });
      const data = await res.json();
      if (data.transcript) {
        setVoiceTranscript(data.transcript);
        setProblemDescription(prev => prev ? prev + " " + data.transcript : data.transcript);
      }
    } catch {} finally {
      setIsTranscribing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phoneNumber.trim() || !problemDescription.trim()) return;

    // Mobile number format enforcement (basic international or bd)
    const cleanPhone = phoneNumber.replace(/\s+/g, "");
    if (cleanPhone.length < 10) {
      alert("Please provide a valid phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      let aiResult = null;
      try {
        const diagRes = await fetch("/api/gemini/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, subCategory, problemDescription })
        });
        aiResult = await diagRes.json();
      } catch (err) {}

      const payload = {
        category,
        subCategory: subCategory || null,
        problemDescription,
        phoneNumber,
        customerName,
        location: { latitude, longitude, address: address.trim() || "No Address" },
        voiceUrl: audioUrl || null,
        voiceText: voiceTranscript || null,
        mediaUrls: files.map(f => f.blobUrl),
        aiDiagnosis: aiResult
      };

      const submitRes = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const resData = await submitRes.json();
      if (resData.success) {
        onSubmitSuccess(resData.ticket);
      } else {
        alert(resData.error);
      }
    } catch {
      alert("Network Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 font-bold">
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* Dynamic Category Header Image */}
        <div className="w-full h-48 md:h-64 overflow-hidden relative bg-slate-900">
          <img 
            src={
              category === ServiceCategory.CAR ? carDiagram :
              category === ServiceCategory.MOTORCYCLE ? bikeDiagram :
              category === ServiceCategory.AC ? acDiagram :
              category === ServiceCategory.ELECTRIC ? electricDiagram :
              category === ServiceCategory.GENERATOR ? electricDiagram :
              category === ServiceCategory.PLUMBER ? plumberDiagram :
              category === ServiceCategory.HOME_APPLIANCE ? applianceDiagram :
              category === ServiceCategory.LIFT ? liftDiagram :
              electricDiagram // fallback
            } 
            alt="Category Profile Diagram" 
            className="w-full h-full object-cover opacity-80" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-extrabold font-sans text-white mb-1">
              {category === ServiceCategory.CAR ? t.car : category === ServiceCategory.MOTORCYCLE ? t.bike : t.building}
            </h3>
            <p className="text-sm text-blue-100 font-medium max-w-lg">{t.subtitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {category === ServiceCategory.CAR && (
            <div className="mb-6 space-y-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {language === "bn" ? "সার্ভিস টাইপ নির্বাচন করুন" : "Select Service Type"} <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {[
                  { id: "engine", name: "ইঞ্জিন", icon: Settings, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30", shadow: "shadow-blue-500/20" },
                  { id: "ac", name: "এসির কাজ", icon: Wind, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/30", shadow: "shadow-cyan-500/20" },
                  { id: "denting", name: "ডেন্টিং পেন্টিং", icon: Paintbrush, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30", shadow: "shadow-purple-500/20" },
                  { id: "electronics", name: "অটো-ইলেকট্রনিক্স", icon: Zap, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", shadow: "shadow-amber-500/20" },
                  { id: "wash", name: "ওয়াস", icon: Droplets, color: "text-sky-500", bg: "bg-sky-100 dark:bg-sky-900/30", shadow: "shadow-sky-500/20" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSubCategory(item.name)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                      subCategory === item.name 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg scale-105' 
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`p-2.5 rounded-full mb-2 ${item.bg} shadow-lg ${item.shadow}`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className={`text-[11px] sm:text-xs font-bold text-center leading-tight ${subCategory === item.name ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300'}`}>
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5" />{t.nameLabel} <span className="text-rose-500">*</span>
              </label>
              <input required type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />{t.phoneLabel} <span className="text-rose-500">*</span>
              </label>
              <input required type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="01XXX" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.problemLabel} <span className="text-rose-500">*</span></label>
              <button type="button" onClick={toggleSpeechRecognition} className={`px-2 py-1 flex items-center gap-1 text-[10px] sm:text-xs font-bold rounded-md ${isListeningSpeech ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                <Mic className="w-3 h-3" /> {isListeningSpeech ? t.sttListening : t.stt}
              </button>
            </div>
            <textarea required rows={4} value={problemDescription} onChange={e => setProblemDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
             <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2"><Mic className="w-4 h-4 text-indigo-500"/> Audio Recording</div>
                {isRecording && <span className="text-rose-500 text-[10px]">{recordingSeconds}s</span>}
             </div>
             <div className="flex gap-2">
               {!isRecording ? <button type="button" onClick={startRecording} className="px-3 py-1.5 flex items-center gap-1 text-xs font-bold bg-indigo-600 text-white rounded-lg"><Mic className="w-3 h-3"/> {t.record}</button> : <button type="button" onClick={stopRecording} className="px-3 py-1.5 flex items-center gap-1 text-xs font-bold bg-rose-600 text-white rounded-lg animate-pulse"><MicOff className="w-3 h-3"/> {t.stopRecord}</button>}
             </div>
             {isTranscribing && <div className="text-[10px] text-indigo-600 font-bold flex"><Loader2 className="w-3 h-3 animate-spin"/> Transcribing...</div>}
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 space-y-3">
             <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2"><Camera className="w-4 h-4 text-indigo-500"/> {t.uploadLabel}</div>
             </div>
             
             <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/30 px-4 py-6 text-center transition-all hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/30">
                <Upload className="mx-auto h-6 w-6 text-slate-400" />
                <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">{t.uploadText}</p>
                <p className="mt-1 text-[10px] text-slate-400">{t.uploadHint}</p>
             </div>
             <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple onChange={handleFileSelect} className="hidden" />

             {files.length > 0 && (
               <div className="flex flex-wrap gap-2 mt-2">
                 {files.map((f) => (
                   <div key={f.id} className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                     {f.type === "image" ? (
                       <img src={f.blobUrl} alt={f.file.name} className="h-16 w-16 object-cover" />
                     ) : (
                       <div className="flex h-16 w-20 flex-col items-center justify-center px-1">
                         <Camera className="h-4 w-4 text-slate-400" />
                         <p className="mt-1 max-w-full truncate text-[9px] text-slate-500 dark:text-slate-400">{f.file.name}</p>
                       </div>
                     )}
                     <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(f.id); }} className="absolute right-1 top-1 rounded-full bg-rose-500/90 p-0.5 text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                       <X className="h-3 w-3" />
                     </button>
                   </div>
                 ))}
               </div>
             )}
           </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 space-y-3">
             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs">
              <label className="font-bold flex items-center gap-1 text-emerald-900 dark:text-emerald-300"><MapPin className="w-4 h-4 text-rose-500"/> {t.location}</label>
              <button type="button" onClick={fetchLocation} className="text-[10px] font-bold px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300 flex items-center gap-1"><RefreshCw className={`w-3 h-3 ${gpsStatus==='getting'?'animate-spin':''}`}/> {t.refreshLoc}</button>
            </div>
            <input required type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder={t.addressPlaceholder} className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 dark:hover:bg-indigo-400 transition-colors shadow disabled:opacity-50">
            {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> ...</> : <><CheckCircle2 className="w-5 h-5" /> {t.submit}</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
