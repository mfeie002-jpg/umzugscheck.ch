import { useState, useCallback, useEffect } from 'react';

interface USBDeviceInfo {
  vendorId: number;
  productId: number;
  productName?: string;
  manufacturerName?: string;
  serialNumber?: string;
  device: any;
}

interface UseUSBReturn {
  isSupported: boolean;
  devices: USBDeviceInfo[];
  error: string | null;
  requestDevice: (filters?: any[]) => Promise<USBDeviceInfo | null>;
  getDevices: () => Promise<void>;
  openDevice: (device: USBDeviceInfo) => Promise<boolean>;
  closeDevice: (device: USBDeviceInfo) => Promise<void>;
  transferOut: (device: USBDeviceInfo, endpointNumber: number, data: BufferSource) => Promise<any>;
  transferIn: (device: USBDeviceInfo, endpointNumber: number, length: number) => Promise<any>;
}

export function useUSB(): UseUSBReturn {
  const [devices, setDevices] = useState<USBDeviceInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isSupported = typeof navigator !== 'undefined' && 'usb' in navigator;

  const mapDevice = (device: any): USBDeviceInfo => ({
    vendorId: device.vendorId,
    productId: device.productId,
    productName: device.productName,
    manufacturerName: device.manufacturerName,
    serialNumber: device.serialNumber,
    device
  });

  const getDevices = useCallback(async () => {
    if (!isSupported) return;

    try {
      const usb = (navigator as any).usb;
      const usbDevices = await usb.getDevices();
      setDevices(usbDevices.map(mapDevice));
    } catch (err: any) {
      setError(err.message || 'Failed to get USB devices');
    }
  }, [isSupported]);

  const requestDevice = useCallback(async (filters?: any[]): Promise<USBDeviceInfo | null> => {
    if (!isSupported) {
      setError('USB not supported');
      return null;
    }

    try {
      const usb = (navigator as any).usb;
      const device = await usb.requestDevice({
        filters: filters || []
      });
      
      const deviceInfo = mapDevice(device);
      setDevices(prev => [...prev.filter(d => d.device !== device), deviceInfo]);
      return deviceInfo;
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        setError(err.message || 'Failed to request USB device');
      }
      return null;
    }
  }, [isSupported]);

  const openDevice = useCallback(async (deviceInfo: USBDeviceInfo): Promise<boolean> => {
    try {
      await deviceInfo.device.open();
      if (deviceInfo.device.configuration === null) {
        await deviceInfo.device.selectConfiguration(1);
      }
      await deviceInfo.device.claimInterface(0);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to open USB device');
      return false;
    }
  }, []);

  const closeDevice = useCallback(async (deviceInfo: USBDeviceInfo) => {
    try {
      await deviceInfo.device.close();
    } catch (err: any) {
      setError(err.message || 'Failed to close USB device');
    }
  }, []);

  const transferOut = useCallback(async (
    deviceInfo: USBDeviceInfo,
    endpointNumber: number,
    data: BufferSource
  ): Promise<any> => {
    try {
      return await deviceInfo.device.transferOut(endpointNumber, data);
    } catch (err: any) {
      setError(err.message || 'Transfer out failed');
      return null;
    }
  }, []);

  const transferIn = useCallback(async (
    deviceInfo: USBDeviceInfo,
    endpointNumber: number,
    length: number
  ): Promise<any> => {
    try {
      return await deviceInfo.device.transferIn(endpointNumber, length);
    } catch (err: any) {
      setError(err.message || 'Transfer in failed');
      return null;
    }
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    const usb = (navigator as any).usb;

    const handleConnect = (event: any) => {
      setDevices(prev => [...prev, mapDevice(event.device)]);
    };

    const handleDisconnect = (event: any) => {
      setDevices(prev => prev.filter(d => d.device !== event.device));
    };

    usb.addEventListener('connect', handleConnect);
    usb.addEventListener('disconnect', handleDisconnect);

    getDevices();

    return () => {
      usb.removeEventListener('connect', handleConnect);
      usb.removeEventListener('disconnect', handleDisconnect);
    };
  }, [isSupported, getDevices]);

  return {
    isSupported,
    devices,
    error,
    requestDevice,
    getDevices,
    openDevice,
    closeDevice,
    transferOut,
    transferIn
  };
}
