import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import BottomSheet from './BottomSheet';
import { toast } from 'sonner';

interface MobileContactSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileContactSheet({ isOpen, onClose }: MobileContactSheetProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Nachricht gesendet! Wir melden uns bald bei Ihnen.');
    setFormData({ name: '', email: '', phone: '', message: '' });
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Kontaktieren Sie uns">
      <div className="px-4 py-4 space-y-5">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <a href="tel:+41765681302" className="block">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2">
              <Phone className="h-5 w-5 text-alpine" />
              <span className="text-xs text-center">Anrufen</span>
            </Button>
          </a>
          <a href="https://wa.me/41765681302" target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2">
              <MessageCircle className="h-5 w-5 text-forest" />
              <span className="text-xs text-center">WhatsApp</span>
            </Button>
          </a>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-left">Mo-Fr 07:00-20:00, Sa 08:00-17:00</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-left">Schweizweit tätig</span>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-sm font-medium text-foreground">Oder schreiben Sie uns:</div>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ihr Name"
                className="mt-1.5"
                required
              />
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">E-Mail</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ihre@email.ch"
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Telefon</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+41..."
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Nachricht</Label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Wie können wir Ihnen helfen?"
                className="mt-1.5 min-h-[80px] resize-none"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full gap-2 min-h-[48px]">
            <Send className="h-4 w-4" />
            Nachricht senden
          </Button>
        </form>
      </div>
    </BottomSheet>
  );
}
