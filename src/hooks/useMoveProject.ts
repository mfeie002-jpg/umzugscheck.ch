/**
 * React Hook for Move Project Management
 * 
 * Provides access to the current move project with automatic persistence.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  MoveProject,
  MoveProjectStatus,
  AddressDetails,
  DigitalTwin,
  PriceBreakdown,
  createMoveProject,
  getCurrentMoveProject,
  updateMoveProject,
  transitionMoveProject,
  attachDigitalTwin,
  calculatePrice,
  trackMoveEvent,
  getPhaseProgress,
  getStatusLabel
} from '@/lib/move-project';

interface UseMoveProjectReturn {
  // State
  project: MoveProject | null;
  isLoading: boolean;
  error: string | null;
  
  // Computed
  phaseProgress: number;
  statusLabel: string;
  hasDigitalTwin: boolean;
  hasGuaranteedPrice: boolean;
  
  // Actions
  createProject: (source: MoveProject['source']) => Promise<MoveProject | null>;
  updateProject: (updates: Partial<MoveProject>) => MoveProject | null;
  setOrigin: (origin: Partial<AddressDetails>) => void;
  setDestination: (destination: Partial<AddressDetails>) => void;
  setMoveDate: (date: string) => void;
  setServiceTier: (tier: 'essential' | 'comfort' | 'premium') => void;
  addDigitalTwin: (twin: DigitalTwin) => void;
  recalculatePrice: () => PriceBreakdown | null;
  transitionTo: (status: MoveProjectStatus) => boolean;
  trackEvent: (event: string, metadata?: Record<string, unknown>) => void;
  resetProject: () => void;
}

export function useMoveProject(): UseMoveProjectReturn {
  const [project, setProject] = useState<MoveProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load project on mount
  useEffect(() => {
    try {
      const loaded = getCurrentMoveProject();
      setProject(loaded);
    } catch (e) {
      setError('Fehler beim Laden des Projekts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Computed values
  const phaseProgress = project ? getPhaseProgress(project.status) : 0;
  const statusLabel = project ? getStatusLabel(project.status) : '';
  const hasDigitalTwin = Boolean(project?.digitalTwin);
  const hasGuaranteedPrice = project?.priceBreakdown?.guaranteeType === 'fixed';

  // Create new project
  const createProject = useCallback(async (source: MoveProject['source']) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newProject = await createMoveProject({ source });
      if (newProject) {
        setProject(newProject);
        trackMoveEvent(newProject.id, 'project_created', { source });
      }
      return newProject;
    } catch (e) {
      setError('Fehler beim Erstellen des Projekts');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update project
  const updateProject = useCallback((updates: Partial<MoveProject>) => {
    if (!project) return null;
    
    const updated = updateMoveProject(project.id, updates);
    if (updated) {
      setProject(updated);
    }
    return updated;
  }, [project]);

  // Set origin address
  const setOrigin = useCallback((origin: Partial<AddressDetails>) => {
    if (!project) return;
    
    updateProject({
      origin: { ...project.origin, ...origin }
    });
    
    if (origin.postalCode && origin.postalCode.length === 4) {
      trackMoveEvent(project.id, 'address_entered', { type: 'origin' });
    }
  }, [project, updateProject]);

  // Set destination address
  const setDestination = useCallback((destination: Partial<AddressDetails>) => {
    if (!project) return;
    
    updateProject({
      destination: { ...project.destination, ...destination }
    });
    
    if (destination.postalCode && destination.postalCode.length === 4) {
      trackMoveEvent(project.id, 'address_entered', { type: 'destination' });
    }
  }, [project, updateProject]);

  // Set move date
  const setMoveDate = useCallback((date: string) => {
    if (!project) return;
    
    updateProject({ moveDate: date });
    trackMoveEvent(project.id, 'date_selected', { date });
  }, [project, updateProject]);

  // Set service tier
  const setServiceTier = useCallback((tier: 'essential' | 'comfort' | 'premium') => {
    if (!project) return;
    
    updateProject({ serviceTier: tier });
    trackMoveEvent(project.id, 'tier_selected', { tier });
  }, [project, updateProject]);

  // Add digital twin
  const addDigitalTwin = useCallback((twin: DigitalTwin) => {
    if (!project) return;
    
    const updated = attachDigitalTwin(project.id, twin);
    if (updated) {
      setProject(updated);
      trackMoveEvent(project.id, 'digital_twin_created', {
        volume: twin.totalVolume,
        items: twin.totalItems,
        confidence: twin.confidence
      });
    }
  }, [project]);

  // Recalculate price
  const recalculatePrice = useCallback(() => {
    if (!project) return null;
    
    const priceBreakdown = calculatePrice(project);
    updateProject({
      priceBreakdown,
      guaranteedPrice: priceBreakdown.total
    });
    
    trackMoveEvent(project.id, 'quote_generated', {
      total: priceBreakdown.total,
      type: priceBreakdown.guaranteeType
    });
    
    return priceBreakdown;
  }, [project, updateProject]);

  // Transition status
  const transitionTo = useCallback((status: MoveProjectStatus) => {
    if (!project) return false;
    
    const updated = transitionMoveProject(project.id, status);
    if (updated) {
      setProject(updated);
      return true;
    }
    return false;
  }, [project]);

  // Track event
  const trackEvent = useCallback((event: string, metadata?: Record<string, unknown>) => {
    if (!project) return;
    trackMoveEvent(project.id, event as any, metadata);
  }, [project]);

  // Reset project
  const resetProject = useCallback(() => {
    try {
      const currentId = localStorage.getItem('current_move_project');
      if (currentId) {
        localStorage.removeItem(`move_project_${currentId}`);
        localStorage.removeItem('current_move_project');
      }
      setProject(null);
    } catch (e) {
      console.error('Failed to reset project:', e);
    }
  }, []);

  return {
    project,
    isLoading,
    error,
    phaseProgress,
    statusLabel,
    hasDigitalTwin,
    hasGuaranteedPrice,
    createProject,
    updateProject,
    setOrigin,
    setDestination,
    setMoveDate,
    setServiceTier,
    addDigitalTwin,
    recalculatePrice,
    transitionTo,
    trackEvent,
    resetProject
  };
}
