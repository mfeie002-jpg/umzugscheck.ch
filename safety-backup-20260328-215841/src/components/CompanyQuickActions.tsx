import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, Mail, Calendar, MessageSquare, Share2, 
  Heart, Bell, Download, ExternalLink, Copy 
} from "lucide-react";
import { toast } from "sonner";

interface CompanyQuickActionsProps {
  companyId: string;
  companyName: string;
  phone?: string;
  email?: string;
  website?: string;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export const CompanyQuickActions = ({
  companyId,
  companyName,
  phone,
  email,
  website,
  onFavorite,
  isFavorite = false
}: CompanyQuickActionsProps) => {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleCall = () => {
    if (phone) {
      window.location.href = `tel:${phone}`;
      toast.success("Anruf wird gestartet...");
    }
  };

  const handleEmail = () => {
    if (email) {
      window.location.href = `mailto:${email}?subject=Anfrage über Umzugscheck.ch`;
      toast.success("E-Mail wird geöffnet...");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: companyName,
      text: `Schauen Sie sich ${companyName} auf Umzugscheck.ch an`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link in die Zwischenablage kopiert!");
  };

  const handleDownloadInfo = () => {
    const info = `
${companyName}
==================
Telefon: ${phone || 'N/A'}
E-Mail: ${email || 'N/A'}
Website: ${website || 'N/A'}

Gefunden auf Umzugscheck.ch
    `.trim();

    const blob = new Blob([info], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyName.replace(/\s+/g, '-')}-kontakt.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Kontaktdaten heruntergeladen!");
  };

  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {phone && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCall}
              className="gap-2"
            >
              <Phone className="h-4 w-4" />
              Anrufen
            </Button>
          )}
          
          {email && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEmail}
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              E-Mail
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onFavorite}
            className={`gap-2 ${isFavorite ? 'text-red-500 border-red-200' : ''}`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Gespeichert' : 'Merken'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Teilen
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadInfo}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Speichern
          </Button>
          
          {website && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open(website, '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Website
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyQuickActions;
