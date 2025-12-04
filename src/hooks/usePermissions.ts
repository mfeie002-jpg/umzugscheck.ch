import { useState, useEffect, useCallback } from 'react';

type CustomPermissionName = 
  | 'geolocation'
  | 'notifications'
  | 'camera'
  | 'microphone'
  | 'clipboard-read'
  | 'clipboard-write';

interface PermissionState {
  state: 'granted' | 'denied' | 'prompt' | 'unknown';
  isLoading: boolean;
}

export const usePermission = (permissionName: CustomPermissionName) => {
  const [permission, setPermission] = useState<PermissionState>({
    state: 'unknown',
    isLoading: true,
  });

  const checkPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ 
        name: permissionName as PermissionName
      });
      
      setPermission({
        state: result.state as PermissionState['state'],
        isLoading: false,
      });

      result.addEventListener('change', () => {
        setPermission({
          state: result.state as PermissionState['state'],
          isLoading: false,
        });
      });
    } catch {
      setPermission({
        state: 'unknown',
        isLoading: false,
      });
    }
  }, [permissionName]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    ...permission,
    isGranted: permission.state === 'granted',
    isDenied: permission.state === 'denied',
    canRequest: permission.state === 'prompt',
    refresh: checkPermission,
  };
};

export const usePermissions = (permissionNames: CustomPermissionName[]) => {
  const [permissions, setPermissions] = useState<Record<string, PermissionState>>({});

  useEffect(() => {
    const checkAll = async () => {
      const results: Record<string, PermissionState> = {};
      
      for (const name of permissionNames) {
        try {
          const result = await navigator.permissions.query({ name: name as PermissionName });
          results[name] = { state: result.state as PermissionState['state'], isLoading: false };
        } catch {
          results[name] = { state: 'unknown', isLoading: false };
        }
      }
      
      setPermissions(results);
    };

    checkAll();
  }, [permissionNames.join(',')]);

  return permissions;
};
