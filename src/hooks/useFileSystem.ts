import { useState, useCallback } from 'react';

interface FileSystemOptions {
  types?: {
    description: string;
    accept: Record<string, string[]>;
  }[];
  excludeAcceptAllOption?: boolean;
  multiple?: boolean;
}

interface UseFileSystemReturn {
  isSupported: boolean;
  isLoading: boolean;
  error: string | null;
  openFile: (options?: FileSystemOptions) => Promise<File | File[] | null>;
  saveFile: (content: string | Blob, suggestedName?: string, options?: FileSystemOptions) => Promise<boolean>;
  openDirectory: () => Promise<FileSystemDirectoryHandle | null>;
}

export const useFileSystem = (): UseFileSystemReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported = 'showOpenFilePicker' in window && 'showSaveFilePicker' in window;

  const openFile = useCallback(async (options?: FileSystemOptions): Promise<File | File[] | null> => {
    if (!isSupported) {
      // Fallback to input element
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = options?.multiple || false;
        
        input.onchange = () => {
          const files = input.files;
          if (!files || files.length === 0) {
            resolve(null);
            return;
          }
          resolve(options?.multiple ? Array.from(files) : files[0]);
        };
        
        input.click();
      });
    }

    setIsLoading(true);
    setError(null);

    try {
      const handles = await (window as any).showOpenFilePicker({
        types: options?.types,
        excludeAcceptAllOption: options?.excludeAcceptAllOption,
        multiple: options?.multiple,
      });

      const files = await Promise.all(
        handles.map((handle: any) => handle.getFile())
      );

      return options?.multiple ? files : files[0];
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError(err instanceof Error ? err.message : 'Failed to open file');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const saveFile = useCallback(async (
    content: string | Blob,
    suggestedName: string = 'download.txt',
    options?: FileSystemOptions
  ): Promise<boolean> => {
    if (!isSupported) {
      // Fallback to download link
      const blob = content instanceof Blob ? content : new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = suggestedName;
      a.click();
      URL.revokeObjectURL(url);
      return true;
    }

    setIsLoading(true);
    setError(null);

    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName,
        types: options?.types,
      });

      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();

      return true;
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError(err instanceof Error ? err.message : 'Failed to save file');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const openDirectory = useCallback(async (): Promise<FileSystemDirectoryHandle | null> => {
    if (!('showDirectoryPicker' in window)) {
      setError('Directory picker not supported');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const handle = await (window as any).showDirectoryPicker();
      return handle;
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError(err instanceof Error ? err.message : 'Failed to open directory');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSupported,
    isLoading,
    error,
    openFile,
    saveFile,
    openDirectory,
  };
};
