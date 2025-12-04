import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, Image, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileSystem } from '@/hooks/useFileSystem';
import { useHaptic } from '@/hooks/use-haptic';

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  accept?: 'images' | 'documents' | 'all';
  className?: string;
  children?: React.ReactNode;
}

export const FileUploadButton = ({
  onFileSelect,
  accept = 'all',
  className = '',
  children,
}: FileUploadButtonProps) => {
  const { isLoading, openFile } = useFileSystem();
  const { trigger } = useHaptic();

  const getFileTypes = useCallback(() => {
    switch (accept) {
      case 'images':
        return [{
          description: 'Bilder',
          accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
        }];
      case 'documents':
        return [{
          description: 'Dokumente',
          accept: { 
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc', '.docx'],
            'text/plain': ['.txt'],
          },
        }];
      default:
        return undefined;
    }
  }, [accept]);

  const handleClick = async () => {
    trigger('light');
    
    const file = await openFile({
      types: getFileTypes(),
      multiple: false,
    });

    if (file && !Array.isArray(file)) {
      onFileSelect(file);
      trigger('success');
    }
  };

  const getIcon = () => {
    switch (accept) {
      case 'images':
        return Image;
      case 'documents':
        return FileText;
      default:
        return File;
    }
  };

  const Icon = getIcon();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={isLoading}
      className={`gap-2 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <motion.div whileTap={{ scale: 0.95 }}>
          <Icon className="w-4 h-4" />
        </motion.div>
      )}
      {children || (
        <span className="hidden sm:inline">
          {accept === 'images' ? 'Bild auswählen' : accept === 'documents' ? 'Dokument auswählen' : 'Datei auswählen'}
        </span>
      )}
    </Button>
  );
};
