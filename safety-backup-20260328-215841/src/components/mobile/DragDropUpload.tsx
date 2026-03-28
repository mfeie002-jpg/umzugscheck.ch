import React from 'react';
import { Upload, X, File, Image } from 'lucide-react';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { cn } from '@/lib/utils';

interface DragDropUploadProps {
  onFilesChange?: (files: File[]) => void;
  accept?: string[];
  maxFiles?: number;
  maxSize?: number;
  className?: string;
}

export function DragDropUpload({
  onFilesChange,
  accept = ['image/*', 'application/pdf'],
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024,
  className
}: DragDropUploadProps) {
  const {
    isDragging,
    files,
    dragProps,
    removeFile,
    clearFiles,
    openFileDialog,
    inputRef
  } = useDragAndDrop({
    accept,
    maxFiles,
    maxSize,
    onDrop: (newFiles) => {
      onFilesChange?.(newFiles);
    },
    onError: (error) => {
      console.warn('Upload error:', error);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      onFilesChange?.(filesArray);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Drop Zone */}
      <div
        {...dragProps}
        onClick={openFileDialog}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />
        
        <Upload className={cn(
          'w-12 h-12 mx-auto mb-4 transition-colors',
          isDragging ? 'text-primary' : 'text-muted-foreground'
        )} />
        
        <p className="text-lg font-medium text-foreground mb-2">
          {isDragging ? 'Dateien hier ablegen' : 'Dateien hierher ziehen'}
        </p>
        <p className="text-sm text-muted-foreground">
          oder <span className="text-primary underline">durchsuchen</span>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Max. {maxFiles} Dateien, je {maxSize / 1024 / 1024}MB
        </p>
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{files.length} Datei(en) ausgewählt</span>
            <button
              onClick={clearFiles}
              className="text-sm text-destructive hover:underline"
            >
              Alle entfernen
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="relative group rounded-lg overflow-hidden border bg-card"
              >
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-24 object-cover"
                  />
                ) : (
                  <div className="w-full h-24 flex items-center justify-center bg-muted">
                    {file.type.includes('pdf') ? (
                      <File className="w-8 h-8 text-muted-foreground" />
                    ) : (
                      <Image className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                )}
                
                {/* File name */}
                <div className="p-2">
                  <p className="text-xs truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
