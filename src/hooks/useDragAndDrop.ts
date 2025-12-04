import { useState, useCallback, useRef, DragEvent } from 'react';

interface FileWithPreview extends File {
  preview?: string;
}

interface UseDragAndDropOptions {
  accept?: string[];
  maxFiles?: number;
  maxSize?: number; // in bytes
  onDrop?: (files: FileWithPreview[]) => void;
  onError?: (error: string) => void;
}

interface UseDragAndDropReturn {
  isDragging: boolean;
  files: FileWithPreview[];
  dragProps: {
    onDragEnter: (e: DragEvent) => void;
    onDragLeave: (e: DragEvent) => void;
    onDragOver: (e: DragEvent) => void;
    onDrop: (e: DragEvent) => void;
  };
  removeFile: (index: number) => void;
  clearFiles: () => void;
  openFileDialog: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function useDragAndDrop(options: UseDragAndDropOptions = {}): UseDragAndDropReturn {
  const {
    accept = ['image/*', 'application/pdf'],
    maxFiles = 10,
    maxSize = 10 * 1024 * 1024, // 10MB default
    onDrop,
    onError
  } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const dragCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): boolean => {
    // Check file size
    if (file.size > maxSize) {
      onError?.(`File ${file.name} is too large. Max size is ${maxSize / 1024 / 1024}MB`);
      return false;
    }

    // Check file type
    const isValidType = accept.some(type => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return file.type.startsWith(category + '/');
      }
      return file.type === type;
    });

    if (!isValidType) {
      onError?.(`File ${file.name} has invalid type`);
      return false;
    }

    return true;
  }, [accept, maxSize, onError]);

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles: FileWithPreview[] = [];
    const filesArray = Array.from(fileList);

    for (const file of filesArray) {
      if (files.length + newFiles.length >= maxFiles) {
        onError?.(`Maximum ${maxFiles} files allowed`);
        break;
      }

      if (validateFile(file)) {
        const fileWithPreview = file as FileWithPreview;
        
        // Create preview for images
        if (file.type.startsWith('image/')) {
          fileWithPreview.preview = URL.createObjectURL(file);
        }
        
        newFiles.push(fileWithPreview);
      }
    }

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      onDrop?.(newFiles);
    }
  }, [files.length, maxFiles, validateFile, onDrop, onError]);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      const removed = newFiles.splice(index, 1)[0];
      if (removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return newFiles;
    });
  }, []);

  const clearFiles = useCallback(() => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
  }, [files]);

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return {
    isDragging,
    files,
    dragProps: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop
    },
    removeFile,
    clearFiles,
    openFileDialog,
    inputRef
  };
}
