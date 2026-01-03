/**
 * Interactive Room Planner Types
 * For visualizing products in rooms across moving phases
 */

export interface Product {
  id: string;
  name: string;
  icon: string; // emoji or icon name
  category: 'furniture' | 'electronics' | 'boxes' | 'fragile' | 'plants' | 'other';
  position: { x: number; y: number }; // percentage position 0-100
  size: 'small' | 'medium' | 'large';
  color?: string;
}

export interface Room {
  id: string;
  name: string;
  icon: string;
  products: Product[];
  backgroundImage?: string;
  backgroundColor: string;
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export interface RoomState {
  roomId: string;
  phaseId: string;
  products: Product[];
}

// Default phases for a move
export const DEFAULT_PHASES: Phase[] = [
  { id: 'inventory', name: 'Inventar', description: 'Alles erfassen', icon: '📋', order: 1 },
  { id: 'packing', name: 'Einpacken', description: 'Kartons packen', icon: '📦', order: 2 },
  { id: 'transport', name: 'Transport', description: 'Unterwegs', icon: '🚚', order: 3 },
  { id: 'unpacking', name: 'Auspacken', description: 'Am neuen Ort', icon: '🏠', order: 4 },
  { id: 'done', name: 'Fertig', description: 'Eingerichtet', icon: '✨', order: 5 },
];

// Default rooms
export const DEFAULT_ROOMS: Room[] = [
  { 
    id: 'living', 
    name: 'Wohnzimmer', 
    icon: '🛋️',
    backgroundColor: 'hsl(var(--muted))',
    products: [
      { id: 'sofa-1', name: 'Sofa', icon: '🛋️', category: 'furniture', position: { x: 20, y: 60 }, size: 'large' },
      { id: 'tv-1', name: 'Fernseher', icon: '📺', category: 'electronics', position: { x: 70, y: 40 }, size: 'medium' },
      { id: 'table-1', name: 'Couchtisch', icon: '🪑', category: 'furniture', position: { x: 40, y: 70 }, size: 'medium' },
      { id: 'plant-1', name: 'Pflanze', icon: '🪴', category: 'plants', position: { x: 85, y: 75 }, size: 'small' },
      { id: 'lamp-1', name: 'Stehlampe', icon: '🪔', category: 'electronics', position: { x: 10, y: 45 }, size: 'small' },
    ]
  },
  { 
    id: 'bedroom', 
    name: 'Schlafzimmer', 
    icon: '🛏️',
    backgroundColor: 'hsl(var(--muted))',
    products: [
      { id: 'bed-1', name: 'Bett', icon: '🛏️', category: 'furniture', position: { x: 50, y: 55 }, size: 'large' },
      { id: 'wardrobe-1', name: 'Kleiderschrank', icon: '🚪', category: 'furniture', position: { x: 15, y: 40 }, size: 'large' },
      { id: 'nightstand-1', name: 'Nachttisch', icon: '🪑', category: 'furniture', position: { x: 80, y: 60 }, size: 'small' },
      { id: 'mirror-1', name: 'Spiegel', icon: '🪞', category: 'fragile', position: { x: 90, y: 35 }, size: 'medium' },
    ]
  },
  { 
    id: 'kitchen', 
    name: 'Küche', 
    icon: '🍳',
    backgroundColor: 'hsl(var(--muted))',
    products: [
      { id: 'fridge-1', name: 'Kühlschrank', icon: '🧊', category: 'electronics', position: { x: 15, y: 50 }, size: 'large' },
      { id: 'stove-1', name: 'Herd', icon: '🍳', category: 'electronics', position: { x: 45, y: 45 }, size: 'medium' },
      { id: 'table-k1', name: 'Esstisch', icon: '🪑', category: 'furniture', position: { x: 70, y: 65 }, size: 'large' },
      { id: 'microwave-1', name: 'Mikrowelle', icon: '📦', category: 'electronics', position: { x: 30, y: 35 }, size: 'small' },
    ]
  },
  { 
    id: 'bathroom', 
    name: 'Badezimmer', 
    icon: '🚿',
    backgroundColor: 'hsl(var(--muted))',
    products: [
      { id: 'washer-1', name: 'Waschmaschine', icon: '🧺', category: 'electronics', position: { x: 20, y: 55 }, size: 'medium' },
      { id: 'cabinet-1', name: 'Badschrank', icon: '🪞', category: 'furniture', position: { x: 70, y: 40 }, size: 'medium' },
    ]
  },
  { 
    id: 'office', 
    name: 'Büro', 
    icon: '💼',
    backgroundColor: 'hsl(var(--muted))',
    products: [
      { id: 'desk-1', name: 'Schreibtisch', icon: '🖥️', category: 'furniture', position: { x: 50, y: 50 }, size: 'large' },
      { id: 'chair-1', name: 'Bürostuhl', icon: '🪑', category: 'furniture', position: { x: 50, y: 70 }, size: 'medium' },
      { id: 'shelf-1', name: 'Regal', icon: '📚', category: 'furniture', position: { x: 15, y: 45 }, size: 'large' },
      { id: 'computer-1', name: 'Computer', icon: '💻', category: 'electronics', position: { x: 55, y: 45 }, size: 'small' },
    ]
  },
];

// Phase-specific visual transforms
export const PHASE_TRANSFORMS: Record<string, { 
  opacity: number; 
  showBoxes: boolean;
  boxPositions?: { x: number; y: number }[];
  blur?: boolean;
}> = {
  inventory: { opacity: 1, showBoxes: false },
  packing: { opacity: 0.7, showBoxes: true, boxPositions: [{ x: 30, y: 80 }, { x: 50, y: 80 }, { x: 70, y: 80 }] },
  transport: { opacity: 0.3, showBoxes: true, blur: true },
  unpacking: { opacity: 0.7, showBoxes: true, boxPositions: [{ x: 20, y: 75 }, { x: 40, y: 75 }] },
  done: { opacity: 1, showBoxes: false },
};
