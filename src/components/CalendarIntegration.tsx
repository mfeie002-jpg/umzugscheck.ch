import { useMemo } from "react";
import { format, addHours } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarPlus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface CalendarIntegrationProps {
  selectedDate?: Date;
  rooms: number;
  distance: number;
  moveType: string;
  price: number;
  estimatedHours: number;
}

const CalendarIntegration = ({
  selectedDate,
  rooms,
  distance,
  moveType,
  price,
  estimatedHours,
}: CalendarIntegrationProps) => {
  const getMoveTypeName = () => {
    switch (moveType) {
      case 'express': return 'Express';
      case 'premium': return 'Premium VIP';
      default: return 'Standard';
    }
  };

  // Generate calendar event URLs
  const calendarLinks = useMemo(() => {
    if (!selectedDate) return null;

    const startDate = new Date(selectedDate);
    startDate.setHours(8, 0, 0, 0); // Default start time 8:00 AM
    
    const endDate = addHours(startDate, estimatedHours);

    const title = `Umzug - Feierabend Umzüge (${getMoveTypeName()})`;
    const description = `Umzugsdetails:
- ${rooms} Zimmer Wohnung
- Distanz: ${distance} km
- Servicepaket: ${getMoveTypeName()}
- Geschätzte Kosten: CHF ${price.toLocaleString('de-CH')}
- Geschätzte Dauer: ${estimatedHours} Stunden

Kontakt: Feierabend Umzüge
Tel: 044 XXX XX XX
Web: www.feierabend-umzuege.ch`;

    const location = 'Ihre Adresse (bitte ergänzen)';

    // Format dates for different calendar services
    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, -1);
    };

    const formatOutlookDate = (date: Date) => {
      return date.toISOString();
    };

    // Google Calendar
    const googleParams = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: description,
      location: location,
    });
    const googleUrl = `https://calendar.google.com/calendar/render?${googleParams.toString()}`;

    // Outlook Calendar
    const outlookParams = new URLSearchParams({
      subject: title,
      body: description,
      startdt: formatOutlookDate(startDate),
      enddt: formatOutlookDate(endDate),
      location: location,
      path: '/calendar/action/compose',
      rru: 'addevent',
    });
    const outlookUrl = `https://outlook.live.com/calendar/0/action/compose?${outlookParams.toString()}`;

    // ICS file content for Apple Calendar and others
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Feierabend Umzüge//Moving Calculator//DE
BEGIN:VEVENT
DTSTART:${formatGoogleDate(startDate)}Z
DTEND:${formatGoogleDate(endDate)}Z
SUMMARY:${title}
DESCRIPTION:${description.replace(/\n/g, '\\n')}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

    return {
      google: googleUrl,
      outlook: outlookUrl,
      ics: icsContent,
    };
  }, [selectedDate, rooms, distance, moveType, price, estimatedHours]);

  const handleDownloadICS = () => {
    if (!calendarLinks) return;

    const blob = new Blob([calendarLinks.ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `umzug-${format(selectedDate!, 'yyyy-MM-dd')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Kalenderdatei heruntergeladen",
      description: "Öffnen Sie die .ics Datei um den Termin hinzuzufügen.",
    });
  };

  if (!selectedDate) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <CalendarPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Wählen Sie zuerst ein Umzugsdatum aus</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selected date display */}
      <div className="text-center p-3 bg-alpine/10 rounded-lg">
        <p className="text-sm text-muted-foreground">Gewähltes Datum</p>
        <p className="text-lg font-semibold text-alpine">
          {format(selectedDate, 'EEEE, dd. MMMM yyyy', { locale: de })}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Startzeit: 08:00 Uhr • Dauer: ca. {estimatedHours} Stunden
        </p>
      </div>

      {/* Calendar buttons */}
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-11"
          onClick={() => window.open(calendarLinks?.google, '_blank')}
        >
          <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <span className="flex-1 text-left">Google Kalender</span>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-11"
          onClick={() => window.open(calendarLinks?.outlook, '_blank')}
        >
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">O</span>
          </div>
          <span className="flex-1 text-left">Outlook Kalender</span>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-11"
          onClick={handleDownloadICS}
        >
          <div className="w-5 h-5 rounded bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
            <CalendarPlus className="h-3 w-3 text-white" />
          </div>
          <span className="flex-1 text-left">Apple / Andere (.ics)</span>
          <span className="text-xs text-muted-foreground">Download</span>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Der Termin wird mit allen Umzugsdetails zu Ihrem Kalender hinzugefügt
      </p>
    </div>
  );
};

export default CalendarIntegration;
