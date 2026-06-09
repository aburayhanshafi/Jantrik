/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Set up server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("Waring: GEMINI_API_KEY environment variable is missing.");
}

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Path for saving tickets/reports
const DATA_DIR = path.join(process.cwd(), "data");
const REPORTS_PATH = path.join(DATA_DIR, "reports.json");

// Ensure data folder and file exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial mock tickets seed
const initialMockTickets = [
  {
    id: "tk-101",
    category: "car",
    problemDescription: "গাড়ির ইঞ্জিন থেকে অদ্ভুত কিচ-কিচ আওয়াজ হচ্ছে এবং এসি কাজ করছে না।",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    phoneNumber: "01712345678",
    customerName: "আব্দুর রহমান",
    location: {
      latitude: 23.8103,
      longitude: 90.4125,
      address: "গুলশান-১, ঢাকা"
    },
    aiDiagnosis: {
      estimatedIssue: "ফ্যান বেল্ট ঢিলে বা নষ্ট হওয়া এবং রেফ্রিজারেন্ট লিক।",
      suggestedSolution: "ইঞ্জিন ফ্যান বেল্ট টাইট দেয়া বা পরিবর্তন এবং এসি গ্যাসের প্রেশার চেক করা প্রয়োজন।",
      urgency: "medium",
      estimatedCostRange: "৳১,৫০০ - ৳৩,৫০০"
    }
  },
  {
    id: "tk-102",
    category: "motorcycle",
    problemDescription: "মোটরসাইকেলের স্টার্ট নিতে সমস্যা হচ্ছে, কিক মারলে স্টার্ট হচ্ছে কিন্তু আইডলিং ধরে রাখছে না।",
    status: "assigned",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    phoneNumber: "01987654321",
    customerName: "তানভীর হাসান",
    location: {
      latitude: 23.7561,
      longitude: 90.3872,
      address: "ধানমন্ডি ২৭, ঢাকা"
    },
    aiDiagnosis: {
      estimatedIssue: "কার্বুরেটর নোংরা হওয়া বা স্পার্ক প্লাগ কার্বন জমে নষ্ট হওয়া।",
      suggestedSolution: "স্পার্ক প্লাগ পরিষ্কার বা পরিবর্তন করুন এবং কার্বুরেটর টিউনিং করা দরকার।",
      urgency: "high",
      estimatedCostRange: "৳৩০০ - ৳৮০০"
    }
  },
  {
    id: "tk-103",
    category: "building",
    subCategory: "ac",
    problemDescription: "বাসার এসি দিয়ে ঠান্ডা বাতাস আসছে না, এবং ইনডোর ইউনিট থেকে পানি ঝরছে।",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    phoneNumber: "01822334455",
    customerName: "ফারহানা আক্তার",
    location: {
      latitude: 23.8223,
      longitude: 90.3654,
      address: "সেক্টর ৪, উত্তরা, ঢাকা"
    },
    aiDiagnosis: {
      estimatedIssue: "এসি ফিল্টার অতিরিক্ত ময়লা হওয়া ও ড্রেন পাইপ ব্লক হয়ে যাওয়া।",
      suggestedSolution: "এসি মাস্টার সার্ভিসিং এবং ড্রেন লাইন পরিষ্কার করা প্রয়োজন।",
      urgency: "medium",
      estimatedCostRange: "৳১,২০০ - ৳২,০০০"
    }
  }
];

if (!fs.existsSync(REPORTS_PATH)) {
  fs.writeFileSync(REPORTS_PATH, JSON.stringify(initialMockTickets, null, 2), "utf-8");
}

// Read tickets of the file database
function readTickets() {
  try {
    const data = fs.readFileSync(REPORTS_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading tickets data file:", error);
    return [];
  }
}

// Write tickets of the file database
function writeTickets(tickets: any[]) {
  try {
    fs.writeFileSync(REPORTS_PATH, JSON.stringify(tickets, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing tickets data file:", error);
  }
}

// ---------------------------------------------
// REST API ENDPOINTS
// ---------------------------------------------

// Get all reports
app.get("/api/reports", (req, res) => {
  const tickets = readTickets();
  res.json(tickets);
});

// Create new report
app.post("/api/reports", (req, res) => {
  const {
    category,
    subCategory,
    problemDescription,
    phoneNumber,
    customerName,
    location,
    voiceUrl,
    voiceText,
    aiDiagnosis,
  } = req.body;

  if (!category || !problemDescription || !phoneNumber || !customerName) {
    return res.status(400).json({ error: "Missing required booking details." });
  }

  const tickets = readTickets();
  const newTicket = {
    id: `tk-${Date.now().toString().slice(-5)}`,
    category,
    subCategory: subCategory || null,
    problemDescription,
    phoneNumber,
    customerName,
    location: location || { latitude: null, longitude: null, address: "Not Provided" },
    voiceUrl: voiceUrl || null,
    voiceText: voiceText || null,
    status: "pending",
    createdAt: new Date().toISOString(),
    aiDiagnosis: aiDiagnosis || null,
  };

  tickets.unshift(newTicket);
  writeTickets(tickets);

  res.status(201).json({ success: true, ticket: newTicket });
});

// Update ticket status
app.patch("/api/reports/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "assigned", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  const tickets = readTickets();
  const ticketIndex = tickets.findIndex((t: any) => t.id === id);

  if (ticketIndex === -1) {
    return res.status(404).json({ error: "Ticket not found." });
  }

  tickets[ticketIndex].status = status;
  writeTickets(tickets);

  res.json({ success: true, ticket: tickets[ticketIndex] });
});

// Delete ticket
app.delete("/api/reports/:id", (req, res) => {
  const { id } = req.params;
  const tickets = readTickets();
  const filtered = tickets.filter((t: any) => t.id !== id);

  if (tickets.length === filtered.length) {
    return res.status(404).json({ error: "Ticket not found." });
  }

  writeTickets(filtered);
  res.json({ success: true });
});

// Gemini Diagnostics endpoint
app.post("/api/gemini/diagnose", async (req, res) => {
  const { category, subCategory, problemDescription } = req.body;

  if (!problemDescription) {
    return res.status(400).json({ error: "Problem description is required." });
  }

  if (!ai) {
    // Return mock premium-looking feedback when API key is not ready
    return res.json({
      estimatedIssue: `যান্ত্রিক সমস্যা (${category}${subCategory ? ' - ' + subCategory : ''})`,
      suggestedSolution: "বর্ণনাটি সংরক্ষণ করা হয়েছে। আমাদের টেকনিশিয়ান দ্রুত আপনার সাথে যোগাযোগ করবে এবং সরাসরি সমস্যার সমাধান করবে।",
      urgency: "medium",
      estimatedCostRange: "পরামর্শ ফ্রি (সার্ভিসিং চার্জ দেখার পর নির্ধারণ হবে)"
    });
  }

  try {
    const categoryBangla = category === "car" ? "গাড়ি (Car)" : category === "motorcycle" ? "মোটরসাইকেল (Motorcycle)" : "বিল্ডিং মেকানিক্যাল (Building Mechanical)";
    const subCategoryText = subCategory ? ` (${subCategory === "generator" ? "জেনারেটর (Generator)" : "বাসার এসি (Home AC)"})` : "";

    const userPrompt = `
      You are an expert mechanic and diagnostics coordinator for 'GantrikGhuri' (যান্ত্রিকঘুড়ি), a premium on-demand repair service in Bangladesh.
      
      Client reported the following vehicle/mechanical issue:
      - Category: ${categoryBangla}${subCategoryText}
      - Problem Message: "${problemDescription}"
      
      Diagnose the user's issue and respond ONLY with a JSON object containing details in high-quality Bengali.
      Ensure the format fits this exact JSON schema:
      {
        "estimatedIssue": "Provide a brief description of the most likely root cause in Bengali (1 sentence)",
        "suggestedSolution": "Provide immediate troubleshooting guidance or professional advice in Bengali (1-2 sentences)",
        "urgency": "one of 'low', 'medium', or 'high'",
        "estimatedCostRange": "An estimated cost range in BDT (e.g., '৳১,৫০০ - ৳২,৫০০' or similar realistic range in Bangla numerals)"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedIssue: { type: Type.STRING },
            suggestedSolution: { type: Type.STRING },
            urgency: { type: Type.STRING, enum: ["low", "medium", "high"] },
            estimatedCostRange: { type: Type.STRING }
          },
          required: ["estimatedIssue", "suggestedSolution", "urgency", "estimatedCostRange"]
        }
      }
    });

    const cleanText = response.text || "{}";
    const diagnosis = JSON.parse(cleanText.trim());

    res.json(diagnosis);
  } catch (err: any) {
    console.error("Gemini Diagnosis Error:", err);
    res.status(500).json({
      error: "Failed to connect to AI server",
      estimatedIssue: "যান্ত্রিক সমস্যা বিশ্লেষণ করা হচ্ছে",
      suggestedSolution: "আমাদের সার্ভিস টিম আপনার যান্ত্রিক সমস্যার সরাসরি টেকনিক্যাল রিভিউ দেবে।",
      urgency: "medium",
      estimatedCostRange: "৳৫০০ - ৳২,০০০"
    });
  }
});

// Gemini Transcribe Voice/Audio endpoint
app.post("/api/gemini/transcribe", async (req, res) => {
  const { audioBase64, mimeType } = req.body;

  if (!audioBase64) {
    return res.status(400).json({ error: "No audio data provided." });
  }

  if (!ai) {
    return res.json({
      transcript: "গাড়ির এসি অন হচ্ছে না, বাতাস ঠান্ডা হয় না। (AI transcription simulated)"
    });
  }

  try {
    const audioPart = {
      inlineData: {
        mimeType: mimeType || "audio/webm",
        data: audioBase64
      }
    };
    const textPart = {
      text: "আপনি একজন দক্ষ বাঙ্গালী যান্ত্রিক সহকারী। ব্যবহারকারীর এই অডিও বার্তাটি শুনুন এবং সঠিক বাংলা টেক্সটে চমৎকারভাবে রূপান্তর (Transcribe) করুন। শুধুমাত্র বাংলা কথাটি টেক্সট হিসেবে ফেরত দিন।"
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [audioPart, textPart] }
    });

    const transcript = response.text?.trim() || "কথা অনুধাবনে সমস্যা হয়েছে, দয়া করে টাইপ করুন।";
    res.json({ transcript });
  } catch (err: any) {
    console.error("Gemini Transcription Error:", err);
    res.status(500).json({ error: "Sound translation error", transcript: "" });
  }
});

// Mounting Vite dev server or static distribution build
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[GantrikGhuri Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
