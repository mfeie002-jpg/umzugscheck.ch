/**
 * Move Project Persistence Hook
 * Connects MoveProject state machine to Supabase database
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  MoveProject, 
  MoveProjectStatus, 
  createMoveProject,
  updateMoveProject,
  transitionMoveProject,
  canTransition,
  AddressDetails
} from '@/lib/move-project';
import { logger } from '@/lib/logger';

interface UseMoveProjectPersistenceOptions {
  projectId?: string;
  autoCreate?: boolean;
  source?: MoveProject['source'];
}

// Map DB status to MoveProject status
const DB_STATUS_MAP: Record<string, MoveProjectStatus> = {
  'route': 'draft',
  'inventory': 'inventory_scan',
  'quote': 'quote_ready',
  'booking': 'booking_pending',
  'moving': 'in_transit',
  'complete': 'completed',
};

const PROJECT_STATUS_TO_DB: Record<MoveProjectStatus, string> = {
  'draft': 'route',
  'inventory_scan': 'inventory',
  'quote_ready': 'quote',
  'booking_pending': 'booking',
  'booked': 'booking',
  'scheduled': 'moving',
  'in_transit': 'moving',
  'completed': 'complete',
  'closed': 'complete',
};

export function useMoveProjectPersistence(options: UseMoveProjectPersistenceOptions = {}) {
  const [project, setProject] = useState<MoveProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load project from Supabase
  const loadProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('move_projects')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        // Map DB row to MoveProject
        const loadedProject: MoveProject = mapDbToProject(data);
        setProject(loadedProject);
        return loadedProject;
      }
      return null;
    } catch (err) {
      logger.error('Failed to load project', err);
      setError('Projekt konnte nicht geladen werden');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new project in Supabase
  const createNewProject = useCallback(async (params?: {
    origin?: Partial<AddressDetails>;
    destination?: Partial<AddressDetails>;
    moveDate?: string;
  }) => {
    try {
      setSaving(true);
      
      // Create local project first
      const newProject = await createMoveProject({
        source: options.source || 'homepage',
        ...params
      });

      if (!newProject) {
        throw new Error('Failed to create project locally');
      }

      // Persist to Supabase
      const dbStatus = PROJECT_STATUS_TO_DB[newProject.status] as 'route' | 'inventory' | 'quote' | 'booking' | 'moving' | 'complete';
      
      const { data, error: insertError } = await supabase
        .from('move_projects')
        .insert({
          status: dbStatus,
          progress_percentage: 0,
          from_address: newProject.origin.street,
          from_postal: newProject.origin.postalCode,
          from_city: newProject.origin.city,
          from_floor: newProject.origin.floor,
          from_has_elevator: newProject.origin.hasElevator,
          to_address: newProject.destination.street,
          to_postal: newProject.destination.postalCode,
          to_city: newProject.destination.city,
          to_floor: newProject.destination.floor,
          to_has_elevator: newProject.destination.hasElevator,
          preferred_date: newProject.moveDate || null,
          total_volume_m3: newProject.totalVolume,
          total_items: 0,
          events: [],
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (data) {
        const createdProject = { ...newProject, id: data.id };
        setProject(createdProject);
        return createdProject;
      }
      return null;
    } catch (err) {
      logger.error('Failed to create project', err);
      setError('Projekt konnte nicht erstellt werden');
      return null;
    } finally {
      setSaving(false);
    }
  }, [options.source]);

  // Save project to Supabase
  const saveProject = useCallback(async (updatedProject: MoveProject) => {
    try {
      setSaving(true);
      
      const dbStatus = PROJECT_STATUS_TO_DB[updatedProject.status] as 'route' | 'inventory' | 'quote' | 'booking' | 'moving' | 'complete';
      
      const { error: updateError } = await supabase
        .from('move_projects')
        .update({
          status: dbStatus,
          from_address: updatedProject.origin.street,
          from_postal: updatedProject.origin.postalCode,
          from_city: updatedProject.origin.city,
          from_floor: updatedProject.origin.floor,
          from_has_elevator: updatedProject.origin.hasElevator,
          to_address: updatedProject.destination.street,
          to_postal: updatedProject.destination.postalCode,
          to_city: updatedProject.destination.city,
          to_floor: updatedProject.destination.floor,
          to_has_elevator: updatedProject.destination.hasElevator,
          distance_km: null,
          preferred_date: updatedProject.moveDate || null,
          total_volume_m3: updatedProject.totalVolume,
          total_items: updatedProject.digitalTwin?.totalItems || 0,
          estimated_price_min: updatedProject.guaranteedPrice * 0.9,
          estimated_price_max: updatedProject.guaranteedPrice * 1.1,
          final_price: updatedProject.guaranteedPrice || null,
          assigned_provider_id: updatedProject.providerId || null,
        })
        .eq('id', updatedProject.id);

      if (updateError) throw updateError;
      
      setProject(updatedProject);
      return true;
    } catch (err) {
      logger.error('Failed to save project', err);
      setError('Änderungen konnten nicht gespeichert werden');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  // Transition project status
  const transition = useCallback(async (toStatus: MoveProjectStatus) => {
    if (!project) return false;

    if (!canTransition(project.status, toStatus)) {
      setError('Status-Übergang nicht möglich');
      return false;
    }

    const transitionedProject = transitionMoveProject(project.id, toStatus);
    if (!transitionedProject) {
      setError('Status-Übergang fehlgeschlagen');
      return false;
    }

    return saveProject(transitionedProject);
  }, [project, saveProject]);

  // Update route information
  const updateRoute = useCallback(async (updates: {
    origin?: Partial<AddressDetails>;
    destination?: Partial<AddressDetails>;
    moveDate?: string;
  }) => {
    if (!project) return false;

    const updatedProject = updateMoveProject(project.id, {
      origin: updates.origin ? { ...project.origin, ...updates.origin } : project.origin,
      destination: updates.destination ? { ...project.destination, ...updates.destination } : project.destination,
      moveDate: updates.moveDate ?? project.moveDate,
    });

    if (!updatedProject) return false;
    return saveProject(updatedProject);
  }, [project, saveProject]);

  // Initial load
  useEffect(() => {
    if (options.projectId) {
      loadProject(options.projectId);
    } else if (options.autoCreate) {
      createNewProject();
    } else {
      setLoading(false);
    }
  }, [options.projectId, options.autoCreate, loadProject, createNewProject]);

  return {
    project,
    loading,
    saving,
    error,
    createNewProject,
    saveProject,
    transition,
    updateRoute,
    reload: () => project?.id && loadProject(project.id),
  };
}

// Helper function to map DB row to MoveProject
function mapDbToProject(data: any): MoveProject {
  const defaultAddress: AddressDetails = {
    street: '',
    postalCode: '',
    city: '',
    canton: ''
  };

  return {
    id: data.id,
    status: DB_STATUS_MAP[data.status] || 'draft',
    source: 'homepage',
    origin: {
      ...defaultAddress,
      street: data.from_address || '',
      postalCode: data.from_postal || '',
      city: data.from_city || '',
      floor: data.from_floor || 0,
      hasElevator: data.from_has_elevator || false,
    },
    destination: {
      ...defaultAddress,
      street: data.to_address || '',
      postalCode: data.to_postal || '',
      city: data.to_city || '',
      floor: data.to_floor || 0,
      hasElevator: data.to_has_elevator || false,
    },
    moveDate: data.preferred_date || '',
    flexibility: 'exact',
    totalVolume: data.total_volume_m3 || 0,
    totalWeight: 0,
    serviceTier: 'comfort',
    guaranteedPrice: data.final_price || 0,
    priceBreakdown: {
      basePrice: 0,
      distanceSurcharge: 0,
      floorSurcharge: 0,
      fragileSurcharge: 0,
      seasonalAdjustment: 0,
      serviceFees: {},
      platformFee: 49,
      total: data.final_price || 0,
      currency: 'CHF',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      guaranteeType: 'estimate'
    },
    additionalServices: [],
    providerId: data.assigned_provider_id,
    movingDayChecklist: [],
    cleaningAccepted: false,
    depositReleased: false,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
