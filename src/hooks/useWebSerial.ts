import { useState, useCallback, useRef } from 'react';

interface UseWebSerialReturn {
  isSupported: boolean;
  isConnected: boolean;
  port: any;
  error: string | null;
  requestPort: (filters?: any[]) => Promise<boolean>;
  open: (options?: { baudRate?: number }) => Promise<boolean>;
  close: () => Promise<void>;
  write: (data: string | Uint8Array) => Promise<boolean>;
  read: () => Promise<string | null>;
  startReading: (callback: (data: string) => void) => void;
  stopReading: () => void;
}

export function useWebSerial(): UseWebSerialReturn {
  const [port, setPort] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const readerRef = useRef<any>(null);
  const readingRef = useRef(false);

  const isSupported = typeof navigator !== 'undefined' && 'serial' in navigator;

  const requestPort = useCallback(async (filters?: any[]): Promise<boolean> => {
    if (!isSupported) {
      setError('Web Serial API not supported');
      return false;
    }

    try {
      const serial = (navigator as any).serial;
      const serialPort = await serial.requestPort({ filters });
      setPort(serialPort);
      setError(null);
      return true;
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        setError(err.message || 'Failed to request serial port');
      }
      return false;
    }
  }, [isSupported]);

  const open = useCallback(async (options?: { baudRate?: number }): Promise<boolean> => {
    if (!port) {
      setError('No port selected');
      return false;
    }

    try {
      await port.open(options || { baudRate: 9600 });
      setIsConnected(true);
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to open port');
      return false;
    }
  }, [port]);

  const close = useCallback(async () => {
    stopReading();
    
    if (port) {
      try {
        await port.close();
        setIsConnected(false);
      } catch (err: any) {
        setError(err.message || 'Failed to close port');
      }
    }
  }, [port]);

  const write = useCallback(async (data: string | Uint8Array): Promise<boolean> => {
    if (!port || !isConnected) {
      setError('Port not connected');
      return false;
    }

    try {
      const writer = port.writable?.getWriter();
      if (!writer) {
        setError('Cannot get writer');
        return false;
      }

      const encoder = new TextEncoder();
      const encoded = typeof data === 'string' ? encoder.encode(data) : data;
      await writer.write(encoded);
      writer.releaseLock();
      return true;
    } catch (err: any) {
      setError(err.message || 'Write failed');
      return false;
    }
  }, [port, isConnected]);

  const read = useCallback(async (): Promise<string | null> => {
    if (!port || !isConnected) {
      setError('Port not connected');
      return null;
    }

    try {
      const reader = port.readable?.getReader();
      if (!reader) {
        setError('Cannot get reader');
        return null;
      }

      const { value, done } = await reader.read();
      reader.releaseLock();

      if (done || !value) return null;

      const decoder = new TextDecoder();
      return decoder.decode(value);
    } catch (err: any) {
      setError(err.message || 'Read failed');
      return null;
    }
  }, [port, isConnected]);

  const startReading = useCallback((callback: (data: string) => void) => {
    if (!port || !isConnected || readingRef.current) return;

    readingRef.current = true;
    const decoder = new TextDecoder();

    const readLoop = async () => {
      try {
        readerRef.current = port.readable?.getReader() || null;
        if (!readerRef.current) return;

        while (readingRef.current) {
          const { value, done } = await readerRef.current.read();
          if (done) break;
          if (value) {
            callback(decoder.decode(value));
          }
        }
      } catch (err) {
        if (readingRef.current) {
          console.error('Read error:', err);
        }
      } finally {
        readerRef.current?.releaseLock();
        readerRef.current = null;
      }
    };

    readLoop();
  }, [port, isConnected]);

  const stopReading = useCallback(() => {
    readingRef.current = false;
    if (readerRef.current) {
      readerRef.current.cancel();
    }
  }, []);

  return {
    isSupported,
    isConnected,
    port,
    error,
    requestPort,
    open,
    close,
    write,
    read,
    startReading,
    stopReading
  };
}
