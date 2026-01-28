import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrintButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const PrintButton = ({ variant = 'outline', size = 'default', className = '' }: PrintButtonProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handlePrint}
      className={`no-print ${className}`}
    >
      <Printer className="w-4 h-4 mr-2" />
      Drucken
    </Button>
  );
};

export default PrintButton;