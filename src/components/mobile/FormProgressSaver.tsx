import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormPersistence } from '@/hooks/useFormPersistence';

interface FormProgressSaverProps<T extends Record<string, any>> {
  formKey: string;
  currentValues: T;
  initialValues: T;
  onRestore: (values: T) => void;
  enabled?: boolean;
}

export const FormProgressSaver = <T extends Record<string, any>>({
  formKey,
  currentValues,
  initialValues,
  onRestore,
  enabled = true,
}: FormProgressSaverProps<T>) => {
  const {
    hasSavedData,
    getRestoredValues,
    clearPersistedValues,
    useAutoSave,
  } = useFormPersistence({ key: formKey, initialValues });

  // Auto-save current values
  useAutoSave(currentValues, enabled);

  const handleRestore = () => {
    const restored = getRestoredValues();
    onRestore(restored);
  };

  const handleDiscard = () => {
    clearPersistedValues();
  };

  // Check if there's saved data different from initial
  const hasRestorable = hasSavedData && 
    JSON.stringify(getRestoredValues()) !== JSON.stringify(initialValues);

  return (
    <AnimatePresence>
      {hasRestorable && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-4 right-4 z-50 lg:left-auto lg:right-4 lg:w-80"
        >
          <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Save className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Gespeicherte Daten gefunden</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Möchten Sie Ihre vorherige Eingabe wiederherstellen?
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={handleRestore}
                    className="gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Wiederherstellen
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDiscard}
                    className="gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Verwerfen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
