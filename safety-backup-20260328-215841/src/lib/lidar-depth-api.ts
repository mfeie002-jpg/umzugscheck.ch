/**
 * LiDAR Depth API Integration
 * 
 * Provides integration with device LiDAR sensors for precise 3D room scanning.
 * Supports iOS ARKit LiDAR (iPhone 12 Pro+, iPad Pro) and ARCore depth sensing.
 * 
 * Falls back to photogrammetry-based depth estimation on non-LiDAR devices.
 */

export interface LiDARCapabilities {
  hasLiDAR: boolean;
  hasDepthSensing: boolean;
  deviceType: 'ios_lidar' | 'android_depth' | 'desktop' | 'unknown';
  maxResolution: number;
  accuracyMm: number;
  maxRange: number; // meters
}

export interface DepthPoint {
  x: number;
  y: number;
  z: number;
  confidence: number;
}

export interface DepthFrame {
  timestamp: number;
  width: number;
  height: number;
  points: DepthPoint[];
  cameraPosition: { x: number; y: number; z: number };
  cameraRotation: { pitch: number; yaw: number; roll: number };
}

export interface ScanResult3D {
  id: string;
  frames: DepthFrame[];
  pointCloud: DepthPoint[];
  meshData?: MeshData;
  boundingBox: BoundingBox3D;
  detectedPlanes: DetectedPlane[];
  detectedObjects: Detected3DObject[];
  scanDuration: number;
  accuracy: number;
  deviceCapabilities: LiDARCapabilities;
}

export interface MeshData {
  vertices: Float32Array;
  indices: Uint32Array;
  normals: Float32Array;
  textureCoords?: Float32Array;
}

export interface BoundingBox3D {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  volume: number;
}

export interface DetectedPlane {
  id: string;
  type: 'floor' | 'wall' | 'ceiling' | 'table' | 'unknown';
  center: { x: number; y: number; z: number };
  normal: { x: number; y: number; z: number };
  width: number;
  height: number;
  confidence: number;
}

export interface Detected3DObject {
  id: string;
  type: string;
  category: ObjectCategory;
  boundingBox: BoundingBox3D;
  position: { x: number; y: number; z: number };
  dimensions: { width: number; height: number; depth: number };
  volume: number;
  confidence: number;
  labelDe: string;
}

export type ObjectCategory = 
  | 'furniture_seating'   // Sofas, chairs, armchairs
  | 'furniture_storage'   // Wardrobes, shelves, cabinets
  | 'furniture_surface'   // Tables, desks, counters
  | 'furniture_bed'       // Beds, mattresses
  | 'appliance_large'     // Refrigerator, washing machine
  | 'appliance_small'     // Microwave, coffee maker
  | 'electronics'         // TV, computer, monitor
  | 'decoration'          // Plants, art, mirrors
  | 'box_container';      // Boxes, suitcases

// Object detection labels for AI
export const OBJECT_LABELS: Record<ObjectCategory, { en: string; de: string; icon: string; avgVolume: number }> = {
  furniture_seating: { en: 'Seating', de: 'Sitzmöbel', icon: '🛋️', avgVolume: 0.8 },
  furniture_storage: { en: 'Storage', de: 'Schränke', icon: '🗄️', avgVolume: 1.5 },
  furniture_surface: { en: 'Tables', de: 'Tische', icon: '🪑', avgVolume: 0.4 },
  furniture_bed: { en: 'Beds', de: 'Betten', icon: '🛏️', avgVolume: 2.0 },
  appliance_large: { en: 'Large Appliances', de: 'Grossgeräte', icon: '🧊', avgVolume: 0.6 },
  appliance_small: { en: 'Small Appliances', de: 'Kleingeräte', icon: '☕', avgVolume: 0.05 },
  electronics: { en: 'Electronics', de: 'Elektronik', icon: '📺', avgVolume: 0.1 },
  decoration: { en: 'Decoration', de: 'Dekoration', icon: '🪴', avgVolume: 0.05 },
  box_container: { en: 'Boxes', de: 'Kartons', icon: '📦', avgVolume: 0.06 },
};

/**
 * Detect device LiDAR capabilities
 */
export async function detectLiDARCapabilities(): Promise<LiDARCapabilities> {
  const ua = navigator.userAgent.toLowerCase();
  
  // Check for iOS LiDAR devices (iPhone 12 Pro+, iPad Pro 2020+)
  const isIOS = /iphone|ipad/.test(ua);
  const isIPadPro = /ipad/.test(ua) && window.screen.width >= 1024;
  const isIPhonePro = /iphone/.test(ua) && window.devicePixelRatio >= 3;
  
  // Check for Android depth sensing (ARCore)
  const isAndroid = /android/.test(ua);
  
  // Attempt to check for WebXR depth sensing support
  let hasWebXRDepth = false;
  if ('xr' in navigator) {
    try {
      hasWebXRDepth = await (navigator as any).xr?.isSessionSupported?.('immersive-ar') || false;
    } catch {
      hasWebXRDepth = false;
    }
  }
  
  // iOS with LiDAR
  if (isIOS && (isIPadPro || isIPhonePro)) {
    return {
      hasLiDAR: true,
      hasDepthSensing: true,
      deviceType: 'ios_lidar',
      maxResolution: 256, // 256x192 depth map
      accuracyMm: 10, // ~1cm accuracy
      maxRange: 5, // 5 meters
    };
  }
  
  // Android with depth sensing
  if (isAndroid && hasWebXRDepth) {
    return {
      hasLiDAR: false,
      hasDepthSensing: true,
      deviceType: 'android_depth',
      maxResolution: 160, // Typical ARCore depth
      accuracyMm: 30, // ~3cm accuracy
      maxRange: 4,
    };
  }
  
  // Desktop/other - use photogrammetry fallback
  return {
    hasLiDAR: false,
    hasDepthSensing: false,
    deviceType: 'desktop',
    maxResolution: 0,
    accuracyMm: 100, // ~10cm via photogrammetry
    maxRange: 10,
  };
}

/**
 * Automatic room type detection based on detected objects
 */
export function detectRoomType(objects: Detected3DObject[]): {
  type: string;
  typeDe: string;
  confidence: number;
} {
  const categories = objects.map(o => o.category);
  
  // Count object types
  const counts: Record<ObjectCategory, number> = {
    furniture_seating: 0,
    furniture_storage: 0,
    furniture_surface: 0,
    furniture_bed: 0,
    appliance_large: 0,
    appliance_small: 0,
    electronics: 0,
    decoration: 0,
    box_container: 0,
  };
  
  categories.forEach(cat => {
    counts[cat] = (counts[cat] || 0) + 1;
  });
  
  // Room detection logic
  if (counts.furniture_bed > 0) {
    return { type: 'bedroom', typeDe: 'Schlafzimmer', confidence: 0.9 };
  }
  
  if (counts.appliance_large >= 2 || (counts.appliance_small >= 3 && counts.furniture_surface > 0)) {
    return { type: 'kitchen', typeDe: 'Küche', confidence: 0.85 };
  }
  
  if (counts.furniture_seating >= 2 && counts.electronics > 0) {
    return { type: 'living_room', typeDe: 'Wohnzimmer', confidence: 0.85 };
  }
  
  if (counts.furniture_surface >= 2 && counts.furniture_seating >= 4) {
    return { type: 'dining_room', typeDe: 'Esszimmer', confidence: 0.8 };
  }
  
  if (counts.electronics >= 2 && counts.furniture_surface > 0) {
    return { type: 'office', typeDe: 'Büro', confidence: 0.75 };
  }
  
  if (counts.box_container >= 3) {
    return { type: 'storage', typeDe: 'Abstellraum', confidence: 0.7 };
  }
  
  return { type: 'other', typeDe: 'Sonstiger Raum', confidence: 0.5 };
}

/**
 * Calculate precise volume from 3D scan data
 */
export function calculateVolumeFromScan(scanResult: ScanResult3D): {
  roomVolume: number;
  usableVolume: number;
  objectsVolume: number;
  freeSpace: number;
  breakdown: { category: string; volume: number; count: number }[];
} {
  // Room dimensions from bounding box
  const { boundingBox, detectedObjects } = scanResult;
  
  const roomWidth = boundingBox.maxX - boundingBox.minX;
  const roomLength = boundingBox.maxY - boundingBox.minY;
  const roomHeight = boundingBox.maxZ - boundingBox.minZ;
  const roomVolume = roomWidth * roomLength * roomHeight;
  
  // Sum object volumes
  const objectsVolume = detectedObjects.reduce((sum, obj) => sum + obj.volume, 0);
  
  // Usable volume = what needs to be moved (objects + estimated box volume)
  const estimatedBoxVolume = objectsVolume * 0.2; // 20% additional for packing
  const usableVolume = objectsVolume + estimatedBoxVolume;
  
  // Free space in room
  const freeSpace = roomVolume - objectsVolume;
  
  // Breakdown by category
  const categoryMap = new Map<string, { volume: number; count: number }>();
  detectedObjects.forEach(obj => {
    const existing = categoryMap.get(obj.category) || { volume: 0, count: 0 };
    categoryMap.set(obj.category, {
      volume: existing.volume + obj.volume,
      count: existing.count + 1,
    });
  });
  
  const breakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    volume: Math.round(data.volume * 100) / 100,
    count: data.count,
  }));
  
  return {
    roomVolume: Math.round(roomVolume * 100) / 100,
    usableVolume: Math.round(usableVolume * 100) / 100,
    objectsVolume: Math.round(objectsVolume * 100) / 100,
    freeSpace: Math.round(freeSpace * 100) / 100,
    breakdown,
  };
}

/**
 * Merge multiple room scans into a complete home Digital Twin
 */
export function mergeRoomScans(scans: ScanResult3D[]): {
  totalVolume: number;
  totalObjectsVolume: number;
  totalItems: number;
  roomBreakdown: { name: string; volume: number; items: number }[];
  allObjects: Detected3DObject[];
  overallConfidence: number;
} {
  let totalVolume = 0;
  let totalObjectsVolume = 0;
  let totalItems = 0;
  const allObjects: Detected3DObject[] = [];
  let confidenceSum = 0;
  
  const roomBreakdown = scans.map(scan => {
    const volumeData = calculateVolumeFromScan(scan);
    const roomType = detectRoomType(scan.detectedObjects);
    
    totalVolume += volumeData.usableVolume;
    totalObjectsVolume += volumeData.objectsVolume;
    totalItems += scan.detectedObjects.length;
    allObjects.push(...scan.detectedObjects);
    confidenceSum += scan.accuracy;
    
    return {
      name: roomType.typeDe,
      volume: volumeData.usableVolume,
      items: scan.detectedObjects.length,
    };
  });
  
  return {
    totalVolume: Math.round(totalVolume * 100) / 100,
    totalObjectsVolume: Math.round(totalObjectsVolume * 100) / 100,
    totalItems,
    roomBreakdown,
    allObjects,
    overallConfidence: scans.length > 0 ? confidenceSum / scans.length : 0,
  };
}

/**
 * Simulate LiDAR scan for demo/testing
 * In production, this would use actual device APIs
 */
export function simulateLiDARScan(roomType: string): Promise<ScanResult3D> {
  return new Promise((resolve) => {
    // Simulate scan duration
    const scanDuration = 4000 + Math.random() * 2000;
    
    setTimeout(() => {
      // Generate realistic room dimensions based on type
      const roomDimensions = getRoomDimensions(roomType);
      
      // Generate detected objects
      const objects = generateDetectedObjects(roomType);
      
      // Calculate bounding box
      const boundingBox: BoundingBox3D = {
        minX: 0,
        maxX: roomDimensions.width,
        minY: 0,
        maxY: roomDimensions.length,
        minZ: 0,
        maxZ: roomDimensions.height,
        volume: roomDimensions.width * roomDimensions.length * roomDimensions.height,
      };
      
      // Generate detected planes
      const detectedPlanes: DetectedPlane[] = [
        {
          id: 'floor_1',
          type: 'floor',
          center: { x: roomDimensions.width / 2, y: roomDimensions.length / 2, z: 0 },
          normal: { x: 0, y: 0, z: 1 },
          width: roomDimensions.width,
          height: roomDimensions.length,
          confidence: 0.95,
        },
        {
          id: 'ceiling_1',
          type: 'ceiling',
          center: { x: roomDimensions.width / 2, y: roomDimensions.length / 2, z: roomDimensions.height },
          normal: { x: 0, y: 0, z: -1 },
          width: roomDimensions.width,
          height: roomDimensions.length,
          confidence: 0.9,
        },
      ];
      
      // Generate point cloud data (simplified)
      const pointCount = 50000 + Math.floor(Math.random() * 50000);
      const pointCloud: DepthPoint[] = [];
      for (let i = 0; i < Math.min(100, pointCount); i++) {
        pointCloud.push({
          x: Math.random() * roomDimensions.width,
          y: Math.random() * roomDimensions.length,
          z: Math.random() * roomDimensions.height,
          confidence: 0.7 + Math.random() * 0.3,
        });
      }
      
      resolve({
        id: `scan_${Date.now()}`,
        frames: [],
        pointCloud,
        boundingBox,
        detectedPlanes,
        detectedObjects: objects,
        scanDuration: scanDuration / 1000,
        accuracy: 0.85 + Math.random() * 0.12,
        deviceCapabilities: {
          hasLiDAR: true,
          hasDepthSensing: true,
          deviceType: 'ios_lidar',
          maxResolution: 256,
          accuracyMm: 10,
          maxRange: 5,
        },
      });
    }, scanDuration);
  });
}

function getRoomDimensions(roomType: string): { width: number; length: number; height: number } {
  const dimensions: Record<string, { width: number; length: number; height: number }> = {
    living_room: { width: 4.5 + Math.random() * 2, length: 5 + Math.random() * 2, height: 2.5 },
    bedroom: { width: 3.5 + Math.random() * 1.5, length: 4 + Math.random() * 1.5, height: 2.5 },
    kitchen: { width: 3 + Math.random() * 2, length: 3.5 + Math.random() * 1.5, height: 2.5 },
    bathroom: { width: 2 + Math.random(), length: 2.5 + Math.random(), height: 2.4 },
    office: { width: 3 + Math.random() * 1.5, length: 3.5 + Math.random() * 1.5, height: 2.5 },
    dining_room: { width: 3.5 + Math.random() * 1.5, length: 4 + Math.random() * 1.5, height: 2.5 },
    storage: { width: 2 + Math.random(), length: 2 + Math.random(), height: 2.4 },
  };
  
  return dimensions[roomType] || dimensions.living_room;
}

function generateDetectedObjects(roomType: string): Detected3DObject[] {
  const objects: Detected3DObject[] = [];
  
  // Define typical objects per room type
  const roomObjects: Record<string, { category: ObjectCategory; labelDe: string; dims: { w: number; h: number; d: number } }[]> = {
    living_room: [
      { category: 'furniture_seating', labelDe: 'Sofa', dims: { w: 2.2, h: 0.9, d: 0.9 } },
      { category: 'furniture_seating', labelDe: 'Sessel', dims: { w: 0.9, h: 1.0, d: 0.9 } },
      { category: 'furniture_surface', labelDe: 'Couchtisch', dims: { w: 1.2, h: 0.45, d: 0.6 } },
      { category: 'electronics', labelDe: 'Fernseher', dims: { w: 1.4, h: 0.08, d: 0.8 } },
      { category: 'furniture_storage', labelDe: 'TV-Möbel', dims: { w: 1.8, h: 0.5, d: 0.45 } },
      { category: 'decoration', labelDe: 'Zimmerpflanze', dims: { w: 0.5, h: 1.2, d: 0.5 } },
    ],
    bedroom: [
      { category: 'furniture_bed', labelDe: 'Doppelbett', dims: { w: 1.8, h: 0.5, d: 2.1 } },
      { category: 'furniture_storage', labelDe: 'Kleiderschrank', dims: { w: 2.5, h: 2.2, d: 0.6 } },
      { category: 'furniture_surface', labelDe: 'Nachttisch', dims: { w: 0.5, h: 0.55, d: 0.4 } },
      { category: 'furniture_surface', labelDe: 'Nachttisch', dims: { w: 0.5, h: 0.55, d: 0.4 } },
      { category: 'furniture_storage', labelDe: 'Kommode', dims: { w: 1.2, h: 0.9, d: 0.5 } },
    ],
    kitchen: [
      { category: 'appliance_large', labelDe: 'Kühlschrank', dims: { w: 0.6, h: 1.8, d: 0.7 } },
      { category: 'appliance_large', labelDe: 'Geschirrspüler', dims: { w: 0.6, h: 0.85, d: 0.6 } },
      { category: 'appliance_small', labelDe: 'Kaffeemaschine', dims: { w: 0.25, h: 0.35, d: 0.4 } },
      { category: 'appliance_small', labelDe: 'Mikrowelle', dims: { w: 0.5, h: 0.3, d: 0.4 } },
      { category: 'furniture_surface', labelDe: 'Esstisch', dims: { w: 1.4, h: 0.75, d: 0.9 } },
      { category: 'furniture_seating', labelDe: 'Stuhl', dims: { w: 0.45, h: 0.9, d: 0.5 } },
      { category: 'furniture_seating', labelDe: 'Stuhl', dims: { w: 0.45, h: 0.9, d: 0.5 } },
    ],
    office: [
      { category: 'furniture_surface', labelDe: 'Schreibtisch', dims: { w: 1.6, h: 0.75, d: 0.8 } },
      { category: 'furniture_seating', labelDe: 'Bürostuhl', dims: { w: 0.65, h: 1.2, d: 0.65 } },
      { category: 'furniture_storage', labelDe: 'Bücherregal', dims: { w: 1.0, h: 2.0, d: 0.35 } },
      { category: 'electronics', labelDe: 'Monitor', dims: { w: 0.6, h: 0.05, d: 0.4 } },
      { category: 'electronics', labelDe: 'Computer', dims: { w: 0.2, h: 0.45, d: 0.45 } },
    ],
    storage: [
      { category: 'box_container', labelDe: 'Umzugskarton', dims: { w: 0.6, h: 0.4, d: 0.4 } },
      { category: 'box_container', labelDe: 'Umzugskarton', dims: { w: 0.6, h: 0.4, d: 0.4 } },
      { category: 'box_container', labelDe: 'Umzugskarton', dims: { w: 0.6, h: 0.4, d: 0.4 } },
      { category: 'furniture_storage', labelDe: 'Regal', dims: { w: 0.8, h: 1.8, d: 0.4 } },
    ],
  };
  
  const typedObjects = roomObjects[roomType] || roomObjects.living_room;
  
  typedObjects.forEach((obj, index) => {
    const volume = obj.dims.w * obj.dims.h * obj.dims.d;
    
    objects.push({
      id: `obj_${Date.now()}_${index}`,
      type: obj.labelDe.toLowerCase().replace(/\s+/g, '_'),
      category: obj.category,
      labelDe: obj.labelDe,
      boundingBox: {
        minX: 0,
        maxX: obj.dims.w,
        minY: 0,
        maxY: obj.dims.d,
        minZ: 0,
        maxZ: obj.dims.h,
        volume,
      },
      position: {
        x: Math.random() * 3,
        y: Math.random() * 3,
        z: obj.dims.h / 2,
      },
      dimensions: {
        width: obj.dims.w,
        height: obj.dims.h,
        depth: obj.dims.d,
      },
      volume,
      confidence: 0.75 + Math.random() * 0.2,
    });
  });
  
  return objects;
}
