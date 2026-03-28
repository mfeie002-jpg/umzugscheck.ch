import { useState, useCallback, useRef } from 'react';

interface NFCMessage {
  records: NFCRecord[];
}

interface NFCRecord {
  recordType: string;
  mediaType?: string;
  data?: string;
}

interface UseNFCReturn {
  isSupported: boolean;
  isReading: boolean;
  isWriting: boolean;
  lastMessage: NFCMessage | null;
  error: string | null;
  startReading: () => Promise<void>;
  stopReading: () => void;
  write: (records: { recordType: string; data: string }[]) => Promise<boolean>;
}

export function useNFC(): UseNFCReturn {
  const [isReading, setIsReading] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [lastMessage, setLastMessage] = useState<NFCMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const readerRef = useRef<any>(null);

  const isSupported = typeof window !== 'undefined' && 'NDEFReader' in window;

  const startReading = useCallback(async () => {
    if (!isSupported) {
      setError('NFC not supported');
      return;
    }

    setError(null);
    setIsReading(true);

    try {
      // @ts-ignore - NDEFReader not in TypeScript types
      const reader = new window.NDEFReader();
      readerRef.current = reader;

      reader.addEventListener('reading', ({ message }: any) => {
        const records: NFCRecord[] = [];
        
        for (const record of message.records) {
          const decoder = new TextDecoder();
          records.push({
            recordType: record.recordType,
            mediaType: record.mediaType,
            data: record.data ? decoder.decode(record.data) : undefined
          });
        }

        setLastMessage({ records });
      });

      reader.addEventListener('readingerror', () => {
        setError('Error reading NFC tag');
      });

      await reader.scan();
    } catch (err: any) {
      setError(err.message || 'Failed to start NFC reading');
      setIsReading(false);
    }
  }, [isSupported]);

  const stopReading = useCallback(() => {
    readerRef.current = null;
    setIsReading(false);
  }, []);

  const write = useCallback(async (records: { recordType: string; data: string }[]): Promise<boolean> => {
    if (!isSupported) {
      setError('NFC not supported');
      return false;
    }

    setError(null);
    setIsWriting(true);

    try {
      // @ts-ignore - NDEFReader not in TypeScript types
      const writer = new window.NDEFReader();
      
      await writer.write({
        records: records.map(r => ({
          recordType: r.recordType,
          data: r.data
        }))
      });

      setIsWriting(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to write NFC tag');
      setIsWriting(false);
      return false;
    }
  }, [isSupported]);

  return {
    isSupported,
    isReading,
    isWriting,
    lastMessage,
    error,
    startReading,
    stopReading,
    write
  };
}
