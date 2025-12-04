import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContactPicker } from '@/hooks/useContactPicker';
import { useHaptic } from '@/hooks/use-haptic';

interface ContactPickerButtonProps {
  onContactSelect: (contact: { name?: string; email?: string; phone?: string }) => void;
  className?: string;
}

export const ContactPickerButton = ({ onContactSelect, className = '' }: ContactPickerButtonProps) => {
  const { isSupported, isLoading, error, selectContacts } = useContactPicker();
  const { trigger } = useHaptic();
  const [showError, setShowError] = useState(false);

  const handleClick = async () => {
    trigger('light');
    
    if (!isSupported) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const contacts = await selectContacts(['name', 'email', 'tel'], false);
    
    if (contacts.length > 0) {
      const contact = contacts[0];
      onContactSelect({
        name: contact.name?.[0],
        email: contact.email?.[0],
        phone: contact.tel?.[0],
      });
      trigger('success');
    }
  };

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
        className="gap-2"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">Aus Kontakten</span>
      </Button>

      {(showError || error) && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-1 text-xs text-amber-600 mt-1"
        >
          <AlertCircle className="w-3 h-3" />
          {error || 'Kontakte-Zugriff nicht unterstützt'}
        </motion.p>
      )}
    </div>
  );
};
