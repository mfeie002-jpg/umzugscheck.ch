import { useState, useCallback } from 'react';

interface BluetoothDeviceInfo {
  id: string;
  name: string | undefined;
  connected: boolean;
  device: any;
}

interface UseBluetoothReturn {
  isSupported: boolean;
  isConnecting: boolean;
  device: BluetoothDeviceInfo | null;
  error: string | null;
  requestDevice: (options?: any) => Promise<BluetoothDeviceInfo | null>;
  disconnect: () => void;
  readCharacteristic: (serviceUuid: string, characteristicUuid: string) => Promise<DataView | null>;
  writeCharacteristic: (serviceUuid: string, characteristicUuid: string, value: BufferSource) => Promise<boolean>;
}

export function useBluetooth(): UseBluetoothReturn {
  const [device, setDevice] = useState<BluetoothDeviceInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported = typeof navigator !== 'undefined' && 'bluetooth' in navigator;

  const requestDevice = useCallback(async (options?: any): Promise<BluetoothDeviceInfo | null> => {
    if (!isSupported) {
      setError('Bluetooth not supported');
      return null;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const defaultOptions = {
        acceptAllDevices: true,
        optionalServices: []
      };

      const bluetooth = (navigator as any).bluetooth;
      const btDevice = await bluetooth.requestDevice(options || defaultOptions);
      
      const deviceInfo: BluetoothDeviceInfo = {
        id: btDevice.id,
        name: btDevice.name,
        connected: false,
        device: btDevice
      };

      // Connect to GATT server
      if (btDevice.gatt) {
        await btDevice.gatt.connect();
        deviceInfo.connected = true;
      }

      setDevice(deviceInfo);
      return deviceInfo;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to connect to Bluetooth device';
      setError(errorMessage);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [isSupported]);

  const disconnect = useCallback(() => {
    if (device?.device?.gatt?.connected) {
      device.device.gatt.disconnect();
    }
    setDevice(null);
  }, [device]);

  const readCharacteristic = useCallback(async (
    serviceUuid: string,
    characteristicUuid: string
  ): Promise<DataView | null> => {
    if (!device?.device?.gatt?.connected) {
      setError('Device not connected');
      return null;
    }

    try {
      const service = await device.device.gatt.getPrimaryService(serviceUuid);
      const characteristic = await service.getCharacteristic(characteristicUuid);
      return await characteristic.readValue();
    } catch (err: any) {
      setError(err.message || 'Failed to read characteristic');
      return null;
    }
  }, [device]);

  const writeCharacteristic = useCallback(async (
    serviceUuid: string,
    characteristicUuid: string,
    value: BufferSource
  ): Promise<boolean> => {
    if (!device?.device?.gatt?.connected) {
      setError('Device not connected');
      return false;
    }

    try {
      const service = await device.device.gatt.getPrimaryService(serviceUuid);
      const characteristic = await service.getCharacteristic(characteristicUuid);
      await characteristic.writeValue(value);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to write characteristic');
      return false;
    }
  }, [device]);

  return {
    isSupported,
    isConnecting,
    device,
    error,
    requestDevice,
    disconnect,
    readCharacteristic,
    writeCharacteristic
  };
}
