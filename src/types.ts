/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ServiceCategory {
  CAR = "car",
  MOTORCYCLE = "motorcycle",
  BUILDING = "building"
}

export enum BuildingSubCategory {
  GENERATOR = "generator",
  AC = "ac"
}

export interface LocationCoordinates {
  latitude: number | null;
  longitude: number | null;
  address: string;
}

export interface Ticket {
  id: string;
  category: ServiceCategory;
  subCategory?: string; // e.g., 'generator', 'ac' for buildings, or specific car/bike type
  problemDescription: string;
  voiceUrl?: string; // base64 or mock file path
  voiceText?: string; // Gemini transcript if voice submitted
  mediaUrls?: string[]; // Blob URLs for uploaded photos/videos
  status: "pending" | "assigned" | "completed" | "cancelled";
  createdAt: string;
  phoneNumber: string;
  customerName: string;
  location: LocationCoordinates;
  aiDiagnosis?: {
    estimatedIssue: string;
    suggestedSolution: string;
    urgency: "low" | "medium" | "high";
    estimatedCostRange: string;
  };
}

export interface ServiceDiagnoseRequest {
  category: ServiceCategory;
  subCategory?: string;
  problemDescription: string;
  isVoiceText?: boolean;
}
