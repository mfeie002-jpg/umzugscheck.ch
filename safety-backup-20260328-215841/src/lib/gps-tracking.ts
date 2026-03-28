/**
 * GPS Tracking System for Moving Day
 * 
 * Phase 5: Real-time location tracking and ETA updates
 * for the moving truck and crew.
 */

import { supabase } from "@/integrations/supabase/client";

// ===========================================================================
// TYPES
// ===========================================================================

export interface GPSPosition {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: string;
  speed?: number; // km/h
  heading?: number; // degrees
}

export interface TrackingSession {
  id: string;
  projectId: string;
  providerId: string;
  
  // Status
  status: 'scheduled' | 'en_route_pickup' | 'loading' | 'in_transit' | 'unloading' | 'completed';
  startedAt?: string;
  completedAt?: string;
  
  // Current position
  currentPosition?: GPSPosition;
  positionHistory: GPSPosition[];
  
  // Route info
  originAddress: string;
  destinationAddress: string;
  estimatedArrival: string;
  distanceRemaining: number; // km
  
  // Crew
  crewLeadName: string;
  crewLeadPhone: string;
  crewSize: number;
  vehicleId: string;
  vehiclePlate: string;
  
  // Live updates
  lastUpdate: string;
  customerNotified: boolean;
}

export interface ETAUpdate {
  estimatedArrival: string;
  distanceRemaining: number;
  trafficConditions: 'normal' | 'moderate' | 'heavy';
  delayMinutes: number;
  updatedAt: string;
}

export interface CrewUpdate {
  type: 'status' | 'photo' | 'message' | 'checkpoint';
  timestamp: string;
  message?: string;
  photoUrl?: string;
  metadata?: Record<string, unknown>;
}

// ===========================================================================
// TRACKING SESSION MANAGEMENT
// ===========================================================================

/**
 * Create a new tracking session for a booked move
 */
export async function createTrackingSession(
  projectId: string,
  providerId: string,
  crewDetails: {
    leadName: string;
    leadPhone: string;
    crewSize: number;
    vehicleId: string;
    vehiclePlate: string;
  },
  addresses: {
    origin: string;
    destination: string;
  }
): Promise<TrackingSession | null> {
  const session: TrackingSession = {
    id: `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    projectId,
    providerId,
    status: 'scheduled',
    positionHistory: [],
    originAddress: addresses.origin,
    destinationAddress: addresses.destination,
    estimatedArrival: '',
    distanceRemaining: 0,
    crewLeadName: crewDetails.leadName,
    crewLeadPhone: crewDetails.leadPhone,
    crewSize: crewDetails.crewSize,
    vehicleId: crewDetails.vehicleId,
    vehiclePlate: crewDetails.vehiclePlate,
    lastUpdate: new Date().toISOString(),
    customerNotified: false,
  };
  
  // Store in localStorage for demo (production: Supabase)
  try {
    localStorage.setItem(`tracking_${session.id}`, JSON.stringify(session));
    localStorage.setItem(`project_tracking_${projectId}`, session.id);
    return session;
  } catch (e) {
    console.error('Failed to create tracking session:', e);
    return null;
  }
}

/**
 * Get tracking session for a project
 */
export function getTrackingSession(projectId: string): TrackingSession | null {
  try {
    const trackingId = localStorage.getItem(`project_tracking_${projectId}`);
    if (!trackingId) return null;
    
    const stored = localStorage.getItem(`tracking_${trackingId}`);
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load tracking session:', e);
    return null;
  }
}

/**
 * Update GPS position
 */
export function updateGPSPosition(
  sessionId: string,
  position: GPSPosition
): TrackingSession | null {
  try {
    const stored = localStorage.getItem(`tracking_${sessionId}`);
    if (!stored) return null;
    
    const session = JSON.parse(stored) as TrackingSession;
    session.currentPosition = position;
    session.positionHistory.push(position);
    session.lastUpdate = new Date().toISOString();
    
    // Keep only last 100 positions
    if (session.positionHistory.length > 100) {
      session.positionHistory = session.positionHistory.slice(-100);
    }
    
    localStorage.setItem(`tracking_${sessionId}`, JSON.stringify(session));
    return session;
  } catch (e) {
    console.error('Failed to update GPS position:', e);
    return null;
  }
}

/**
 * Update tracking status
 */
export function updateTrackingStatus(
  sessionId: string,
  status: TrackingSession['status']
): TrackingSession | null {
  try {
    const stored = localStorage.getItem(`tracking_${sessionId}`);
    if (!stored) return null;
    
    const session = JSON.parse(stored) as TrackingSession;
    session.status = status;
    session.lastUpdate = new Date().toISOString();
    
    if (status === 'completed') {
      session.completedAt = new Date().toISOString();
    } else if (status === 'en_route_pickup' && !session.startedAt) {
      session.startedAt = new Date().toISOString();
    }
    
    localStorage.setItem(`tracking_${sessionId}`, JSON.stringify(session));
    return session;
  } catch (e) {
    console.error('Failed to update status:', e);
    return null;
  }
}

// ===========================================================================
// ETA CALCULATION
// ===========================================================================

/**
 * Calculate ETA based on current position and destination
 */
export function calculateETA(
  currentPosition: GPSPosition,
  destinationLat: number,
  destinationLng: number
): ETAUpdate {
  // Calculate straight-line distance (Haversine)
  const distance = haversineDistance(
    currentPosition.lat,
    currentPosition.lng,
    destinationLat,
    destinationLng
  );
  
  // Estimate travel time (average 40 km/h for moving truck in city)
  const averageSpeed = currentPosition.speed || 40;
  const travelTimeHours = distance / averageSpeed;
  const travelTimeMinutes = Math.round(travelTimeHours * 60);
  
  // Add buffer for traffic
  const trafficBuffer = getTrafficBuffer();
  const totalMinutes = travelTimeMinutes + trafficBuffer.minutes;
  
  const eta = new Date(Date.now() + totalMinutes * 60 * 1000);
  
  return {
    estimatedArrival: eta.toISOString(),
    distanceRemaining: Math.round(distance * 10) / 10,
    trafficConditions: trafficBuffer.conditions,
    delayMinutes: trafficBuffer.minutes,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Haversine formula for distance calculation
 */
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

function getTrafficBuffer(): { conditions: ETAUpdate['trafficConditions']; minutes: number } {
  const hour = new Date().getHours();
  
  // Rush hours: 7-9 and 17-19
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    return { conditions: 'heavy', minutes: 20 };
  }
  
  // Moderate traffic: 11-14
  if (hour >= 11 && hour <= 14) {
    return { conditions: 'moderate', minutes: 10 };
  }
  
  return { conditions: 'normal', minutes: 5 };
}

// ===========================================================================
// CREW UPDATES
// ===========================================================================

/**
 * Add a crew update to the session
 */
export async function addCrewUpdate(
  sessionId: string,
  update: CrewUpdate
): Promise<boolean> {
  try {
    const stored = localStorage.getItem(`tracking_${sessionId}`);
    if (!stored) return false;
    
    const session = JSON.parse(stored) as TrackingSession;
    
    // Store updates separately
    const updatesKey = `tracking_updates_${sessionId}`;
    const existingUpdates = JSON.parse(localStorage.getItem(updatesKey) || '[]');
    existingUpdates.push(update);
    
    localStorage.setItem(updatesKey, JSON.stringify(existingUpdates));
    return true;
  } catch (e) {
    console.error('Failed to add crew update:', e);
    return false;
  }
}

/**
 * Get all crew updates for a session
 */
export function getCrewUpdates(sessionId: string): CrewUpdate[] {
  try {
    const updatesKey = `tracking_updates_${sessionId}`;
    return JSON.parse(localStorage.getItem(updatesKey) || '[]');
  } catch (e) {
    console.error('Failed to get crew updates:', e);
    return [];
  }
}

// ===========================================================================
// NOTIFICATIONS
// ===========================================================================

/**
 * Send ETA notification to customer
 */
export async function notifyCustomerETA(
  projectId: string,
  eta: ETAUpdate,
  customerPhone?: string
): Promise<boolean> {
  try {
    // In production: Call edge function to send SMS/push notification
    console.log(`[Notification] ETA update for ${projectId}:`, eta);
    
    // For demo: just log
    return true;
  } catch (e) {
    console.error('Failed to send notification:', e);
    return false;
  }
}

/**
 * Send status change notification
 */
export async function notifyStatusChange(
  projectId: string,
  status: TrackingSession['status'],
  message: string
): Promise<boolean> {
  try {
    console.log(`[Notification] Status change for ${projectId}: ${status} - ${message}`);
    return true;
  } catch (e) {
    console.error('Failed to send notification:', e);
    return false;
  }
}

// ===========================================================================
// DEMO DATA GENERATOR
// ===========================================================================

/**
 * Generate demo tracking data for testing
 */
export function generateDemoTrackingData(projectId: string): TrackingSession {
  const zurichLat = 47.3769;
  const zurichLng = 8.5417;
  
  return {
    id: `track_demo_${projectId}`,
    projectId,
    providerId: 'demo_provider',
    status: 'in_transit',
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    positionHistory: [],
    currentPosition: {
      lat: zurichLat + (Math.random() - 0.5) * 0.1,
      lng: zurichLng + (Math.random() - 0.5) * 0.1,
      accuracy: 10,
      timestamp: new Date().toISOString(),
      speed: 35,
      heading: 45,
    },
    originAddress: 'Bahnhofstrasse 1, 8001 Zürich',
    destinationAddress: 'Limmatquai 50, 8001 Zürich',
    estimatedArrival: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    distanceRemaining: 3.5,
    crewLeadName: 'Marco Müller',
    crewLeadPhone: '+41 79 123 45 67',
    crewSize: 3,
    vehicleId: 'TRUCK-001',
    vehiclePlate: 'ZH 123 456',
    lastUpdate: new Date().toISOString(),
    customerNotified: true,
  };
}
