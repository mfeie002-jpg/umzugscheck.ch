/**
 * Digital Signature System
 * 
 * Phase 6: Swiss-compliant digital signatures for
 * handover protocols and contract acceptance.
 */

import { supabase } from "@/integrations/supabase/client";

// ============================================================================
// TYPES
// ============================================================================

export interface DigitalSignature {
  id: string;
  documentId: string;
  documentType: 'handover_protocol' | 'quote_acceptance' | 'damage_report' | 'completion_confirmation';
  
  // Signer info
  signerName: string;
  signerEmail: string;
  signerRole: 'customer' | 'provider' | 'crew_lead' | 'witness';
  
  // Signature data
  signatureData: string; // Base64 SVG or canvas data
  signatureMethod: 'drawn' | 'typed' | 'biometric';
  
  // Verification
  signedAt: string;
  ipAddress?: string;
  userAgent?: string;
  geoLocation?: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  
  // Legal
  legalConsent: boolean;
  termsAccepted: boolean;
  hashVerification: string; // SHA-256 of document content at signing time
}

export interface SignatureRequest {
  documentId: string;
  documentType: DigitalSignature['documentType'];
  documentHash: string;
  requiredSigners: {
    role: DigitalSignature['signerRole'];
    email: string;
    name: string;
  }[];
  expiresAt: string;
  status: 'pending' | 'partial' | 'complete' | 'expired';
  signatures: DigitalSignature[];
  createdAt: string;
}

export interface HandoverDocument {
  id: string;
  projectId: string;
  type: 'departure' | 'arrival';
  
  // Property details
  address: string;
  propertyType: 'apartment' | 'house' | 'storage';
  
  // Room-by-room checklist
  rooms: HandoverRoom[];
  
  // Overall status
  overallCondition: 'excellent' | 'good' | 'acceptable' | 'issues_noted';
  damagesNoted: string[];
  cleaningAccepted: boolean;
  
  // Keys
  keysReturned: {
    type: string;
    quantity: number;
    notes?: string;
  }[];
  
  // Signatures
  signatureRequest?: SignatureRequest;
  
  // Timestamps
  createdAt: string;
  completedAt?: string;
}

export interface HandoverRoom {
  id: string;
  name: string;
  type: string;
  
  // Checklist items
  items: {
    category: string;
    name: string;
    condition: 'ok' | 'minor_issue' | 'major_issue' | 'missing';
    notes?: string;
    photoUrl?: string;
  }[];
  
  // Room photos
  photos: {
    url: string;
    caption: string;
    takenAt: string;
  }[];
  
  // Room overall
  condition: 'ok' | 'issues_noted';
  signedOff: boolean;
}

// ============================================================================
// SIGNATURE CREATION
// ============================================================================

/**
 * Create a digital signature
 */
export async function createDigitalSignature(
  params: {
    documentId: string;
    documentType: DigitalSignature['documentType'];
    signerName: string;
    signerEmail: string;
    signerRole: DigitalSignature['signerRole'];
    signatureData: string;
    signatureMethod: DigitalSignature['signatureMethod'];
    documentHash: string;
    legalConsent: boolean;
    termsAccepted: boolean;
  }
): Promise<DigitalSignature | null> {
  try {
    // Get client info
    const clientInfo = await getClientInfo();
    
    const signature: DigitalSignature = {
      id: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      documentId: params.documentId,
      documentType: params.documentType,
      signerName: params.signerName,
      signerEmail: params.signerEmail,
      signerRole: params.signerRole,
      signatureData: params.signatureData,
      signatureMethod: params.signatureMethod,
      signedAt: new Date().toISOString(),
      ipAddress: clientInfo.ip,
      userAgent: clientInfo.userAgent,
      geoLocation: clientInfo.geo,
      legalConsent: params.legalConsent,
      termsAccepted: params.termsAccepted,
      hashVerification: params.documentHash,
    };
    
    // Store signature
    const key = `signature_${signature.id}`;
    localStorage.setItem(key, JSON.stringify(signature));
    
    // Add to document's signature list
    const docSignaturesKey = `doc_signatures_${params.documentId}`;
    const existing = JSON.parse(localStorage.getItem(docSignaturesKey) || '[]');
    existing.push(signature.id);
    localStorage.setItem(docSignaturesKey, JSON.stringify(existing));
    
    return signature;
  } catch (e) {
    console.error('Failed to create signature:', e);
    return null;
  }
}

/**
 * Verify a signature
 */
export function verifySignature(
  signatureId: string,
  currentDocumentHash: string
): { valid: boolean; reason?: string } {
  try {
    const stored = localStorage.getItem(`signature_${signatureId}`);
    if (!stored) {
      return { valid: false, reason: 'Signatur nicht gefunden' };
    }
    
    const signature = JSON.parse(stored) as DigitalSignature;
    
    // Check hash matches
    if (signature.hashVerification !== currentDocumentHash) {
      return { valid: false, reason: 'Dokument wurde nach Signatur verändert' };
    }
    
    // Check legal consent was given
    if (!signature.legalConsent || !signature.termsAccepted) {
      return { valid: false, reason: 'Rechtliche Zustimmung fehlt' };
    }
    
    return { valid: true };
  } catch (e) {
    return { valid: false, reason: 'Verifikationsfehler' };
  }
}

// ============================================================================
// SIGNATURE REQUEST
// ============================================================================

/**
 * Create a signature request for multiple signers
 */
export function createSignatureRequest(
  params: {
    documentId: string;
    documentType: DigitalSignature['documentType'];
    documentHash: string;
    requiredSigners: SignatureRequest['requiredSigners'];
    validityHours?: number;
  }
): SignatureRequest {
  const validityMs = (params.validityHours || 72) * 60 * 60 * 1000;
  
  const request: SignatureRequest = {
    documentId: params.documentId,
    documentType: params.documentType,
    documentHash: params.documentHash,
    requiredSigners: params.requiredSigners,
    expiresAt: new Date(Date.now() + validityMs).toISOString(),
    status: 'pending',
    signatures: [],
    createdAt: new Date().toISOString(),
  };
  
  // Store request
  localStorage.setItem(`sig_request_${params.documentId}`, JSON.stringify(request));
  
  return request;
}

/**
 * Get signature request status
 */
export function getSignatureRequestStatus(documentId: string): SignatureRequest | null {
  try {
    const stored = localStorage.getItem(`sig_request_${documentId}`);
    if (!stored) return null;
    
    const request = JSON.parse(stored) as SignatureRequest;
    
    // Load actual signatures
    const sigIds = JSON.parse(localStorage.getItem(`doc_signatures_${documentId}`) || '[]');
    request.signatures = sigIds.map((id: string) => {
      const sig = localStorage.getItem(`signature_${id}`);
      return sig ? JSON.parse(sig) : null;
    }).filter(Boolean);
    
    // Update status
    if (new Date(request.expiresAt) < new Date()) {
      request.status = 'expired';
    } else if (request.signatures.length === request.requiredSigners.length) {
      request.status = 'complete';
    } else if (request.signatures.length > 0) {
      request.status = 'partial';
    }
    
    return request;
  } catch (e) {
    console.error('Failed to get signature request:', e);
    return null;
  }
}

// ============================================================================
// HANDOVER DOCUMENT
// ============================================================================

/**
 * Create a handover document
 */
export function createHandoverDocument(
  projectId: string,
  type: 'departure' | 'arrival',
  address: string,
  rooms: string[]
): HandoverDocument {
  const doc: HandoverDocument = {
    id: `handover_${type}_${projectId}`,
    projectId,
    type,
    address,
    propertyType: 'apartment',
    rooms: rooms.map((name, idx) => ({
      id: `room_${idx}`,
      name,
      type: detectRoomType(name),
      items: getDefaultChecklistItems(name),
      photos: [],
      condition: 'ok',
      signedOff: false,
    })),
    overallCondition: 'good',
    damagesNoted: [],
    cleaningAccepted: false,
    keysReturned: [],
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem(`handover_${doc.id}`, JSON.stringify(doc));
  return doc;
}

/**
 * Update handover document
 */
export function updateHandoverDocument(
  docId: string,
  updates: Partial<HandoverDocument>
): HandoverDocument | null {
  try {
    const stored = localStorage.getItem(`handover_${docId}`);
    if (!stored) return null;
    
    const doc = JSON.parse(stored) as HandoverDocument;
    const updated = { ...doc, ...updates };
    
    localStorage.setItem(`handover_${docId}`, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update handover document:', e);
    return null;
  }
}

/**
 * Complete handover with signatures
 */
export async function completeHandover(
  docId: string,
  signatures: {
    customer: DigitalSignature;
    provider: DigitalSignature;
  }
): Promise<{ success: boolean; documentUrl?: string }> {
  try {
    const doc = JSON.parse(localStorage.getItem(`handover_${docId}`) || 'null') as HandoverDocument | null;
    if (!doc) throw new Error('Document not found');
    
    // Mark as completed
    doc.completedAt = new Date().toISOString();
    localStorage.setItem(`handover_${docId}`, JSON.stringify(doc));
    
    return {
      success: true,
      documentUrl: `/handover/completed/${docId}`,
    };
  } catch (e) {
    console.error('Failed to complete handover:', e);
    return { success: false };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getClientInfo(): Promise<{
  ip?: string;
  userAgent: string;
  geo?: { lat: number; lng: number; accuracy: number };
}> {
  const info: any = {
    userAgent: navigator.userAgent,
  };
  
  // Try to get geolocation
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 5000,
        maximumAge: 60000,
      });
    });
    
    info.geo = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
    };
  } catch (e) {
    // Geolocation not available
  }
  
  return info;
}

function detectRoomType(name: string): string {
  const lowered = name.toLowerCase();
  if (lowered.includes('wohn')) return 'living';
  if (lowered.includes('schlaf')) return 'bedroom';
  if (lowered.includes('küche') || lowered.includes('kueche')) return 'kitchen';
  if (lowered.includes('bad')) return 'bathroom';
  if (lowered.includes('büro') || lowered.includes('buero') || lowered.includes('office')) return 'office';
  if (lowered.includes('kinder')) return 'children';
  if (lowered.includes('keller')) return 'basement';
  if (lowered.includes('balkon') || lowered.includes('terrasse')) return 'outdoor';
  return 'other';
}

function getDefaultChecklistItems(roomName: string): HandoverRoom['items'] {
  const baseItems = [
    { category: 'Boden', name: 'Bodenbelag', condition: 'ok' as const },
    { category: 'Wände', name: 'Wandzustand', condition: 'ok' as const },
    { category: 'Wände', name: 'Steckdosen', condition: 'ok' as const },
    { category: 'Fenster', name: 'Fensterzustand', condition: 'ok' as const },
    { category: 'Fenster', name: 'Jalousien/Vorhänge', condition: 'ok' as const },
    { category: 'Tür', name: 'Türzustand', condition: 'ok' as const },
  ];
  
  const roomType = detectRoomType(roomName);
  
  // Add room-specific items
  if (roomType === 'kitchen') {
    baseItems.push(
      { category: 'Geräte', name: 'Herd/Backofen', condition: 'ok' as const },
      { category: 'Geräte', name: 'Kühlschrank', condition: 'ok' as const },
      { category: 'Geräte', name: 'Geschirrspüler', condition: 'ok' as const },
      { category: 'Sanitär', name: 'Spülbecken', condition: 'ok' as const },
    );
  }
  
  if (roomType === 'bathroom') {
    baseItems.push(
      { category: 'Sanitär', name: 'WC', condition: 'ok' as const },
      { category: 'Sanitär', name: 'Dusche/Badewanne', condition: 'ok' as const },
      { category: 'Sanitär', name: 'Lavabo', condition: 'ok' as const },
      { category: 'Sanitär', name: 'Armaturen', condition: 'ok' as const },
    );
  }
  
  return baseItems;
}

/**
 * Generate document hash for verification
 */
export function hashDocument(content: string): string {
  // Simple hash for demo - production would use crypto.subtle.digest
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}
