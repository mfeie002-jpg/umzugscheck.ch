import { useState } from "react";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, Download, CheckCircle, AlertTriangle, ArrowRight,
  Calendar, Copy, Printer
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const importantPoints = [
  {
    title: "Kündigungsfrist beachten",
    description: "In der Schweiz gilt meist eine 3-monatige Kündigungsfrist. Prüfen Sie Ihren Mietvertrag!",
    icon: Calendar,
    critical: true,
  },
  {
    title: "Kündigungstermine",
    description: "Kündigung muss bis zum Monatsende beim Vermieter eingehen, nicht nur abgeschickt werden.",
    icon: AlertTriangle,
    critical: true,
  },
  {
    title: "Einschreiben empfohlen",
    description: "Senden Sie die Kündigung immer per Einschreiben, um den Zugang beweisen zu können.",
    icon: FileText,
    critical: false,
  },
  {
    title: "Alle Mieter unterschreiben",
    description: "Bei mehreren Mietern müssen alle Hauptmieter die Kündigung unterzeichnen.",
    icon: CheckCircle,
    critical: false,
  },
];

export default function Kuendigung() {
  const [formData, setFormData] = useState({
    mieterName: "",
    mieterAdresse: "",
    mieterPlzOrt: "",
    vermieterName: "",
    vermieterAdresse: "",
    vermieterPlzOrt: "",
    wohnungsAdresse: "",
    kuendigungsDatum: "",
    auszugsDatum: "",
  });

  const generateLetter = () => {
    const today = new Date().toLocaleDateString('de-CH', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });

    return `${formData.mieterName}
${formData.mieterAdresse}
${formData.mieterPlzOrt}

${formData.vermieterName}
${formData.vermieterAdresse}
${formData.vermieterPlzOrt}

${formData.mieterPlzOrt ? formData.mieterPlzOrt.split(' ').pop() : '[Ort]'}, ${today}

Betreff: Kündigung des Mietverhältnisses

Sehr geehrte Damen und Herren,

hiermit kündige ich das Mietverhältnis für die Wohnung an der Adresse:

${formData.wohnungsAdresse || '[Wohnungsadresse]'}

ordentlich und fristgerecht per ${formData.auszugsDatum || '[Datum]'}.

Ich bitte Sie, mir den Erhalt dieser Kündigung schriftlich zu bestätigen und einen Termin für die Wohnungsabnahme zu vereinbaren.

Bitte überweisen Sie die Mietkaution nach erfolgter Wohnungsabnahme und Ablauf der gesetzlichen Frist auf mein Bankkonto. Die Kontodaten werde ich Ihnen rechtzeitig mitteilen.

Mit freundlichen Grüssen


${formData.mieterName || '[Unterschrift]'}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateLetter());
    toast.success("Kündigungsschreiben kopiert!");
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kündigungsschreiben</title>
        <style>
          body { 
            font-family: 'Times New Roman', serif; 
            padding: 40px; 
            max-width: 800px; 
            margin: 0 auto;
            line-height: 1.6;
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>${generateLetter()}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const blob = new Blob([generateLetter()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kuendigungsschreiben.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Kündigungsschreiben heruntergeladen!");
  };

  return (
    <>
      <OptimizedSEO
        title="Kündigungsvorlage Mietwohnung Schweiz | Kostenlos | Umzugscheck.ch"
        description="Kostenlose Kündigungsvorlage für Ihre Mietwohnung in der Schweiz. Einfach ausfüllen, herunterladen und per Einschreiben versenden."
        canonicalUrl="https://www.umzugscheck.ch/ratgeber/kuendigung"
        keywords="kündigung mietwohnung schweiz, kündigungsschreiben vorlage, mietvertrag kündigen, kündigungsfrist"
      />
      
      <div className="min-h-screen bg-gradient-elegant">
        {/* Hero */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-95" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                <FileText className="w-3 h-3 mr-1" />
                Kostenlose Vorlage
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Kündigungsvorlage Mietwohnung
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Erstellen Sie Ihr rechtssicheres Kündigungsschreiben in wenigen Minuten. 
                Einfach ausfüllen und per Einschreiben versenden.
              </p>
            </div>
          </div>
        </section>

        {/* Important Points */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-xl font-bold mb-6 text-center">Wichtige Hinweise</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {importantPoints.map((point, idx) => (
                  <Card key={idx} className={point.critical ? "border-amber-300 bg-amber-50/50 dark:bg-amber-950/20" : ""}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          point.critical ? "bg-amber-100 dark:bg-amber-900/50" : "bg-primary/10"
                        }`}>
                          <point.icon className={`w-4 h-4 ${
                            point.critical ? "text-amber-600" : "text-primary"
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{point.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{point.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Form & Preview */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Form */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Ihre Angaben</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-sm mb-3 text-primary">Mieter (Sie)</h3>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="mieterName">Name</Label>
                            <Input 
                              id="mieterName"
                              placeholder="Max Mustermann"
                              value={formData.mieterName}
                              onChange={(e) => setFormData({...formData, mieterName: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="mieterAdresse">Strasse & Nr.</Label>
                            <Input 
                              id="mieterAdresse"
                              placeholder="Musterstrasse 123"
                              value={formData.mieterAdresse}
                              onChange={(e) => setFormData({...formData, mieterAdresse: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="mieterPlzOrt">PLZ & Ort</Label>
                            <Input 
                              id="mieterPlzOrt"
                              placeholder="8000 Zürich"
                              value={formData.mieterPlzOrt}
                              onChange={(e) => setFormData({...formData, mieterPlzOrt: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm mb-3 text-primary">Vermieter / Verwaltung</h3>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="vermieterName">Name / Firma</Label>
                            <Input 
                              id="vermieterName"
                              placeholder="Immobilien AG"
                              value={formData.vermieterName}
                              onChange={(e) => setFormData({...formData, vermieterName: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="vermieterAdresse">Strasse & Nr.</Label>
                            <Input 
                              id="vermieterAdresse"
                              placeholder="Verwaltungsweg 1"
                              value={formData.vermieterAdresse}
                              onChange={(e) => setFormData({...formData, vermieterAdresse: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="vermieterPlzOrt">PLZ & Ort</Label>
                            <Input 
                              id="vermieterPlzOrt"
                              placeholder="8001 Zürich"
                              value={formData.vermieterPlzOrt}
                              onChange={(e) => setFormData({...formData, vermieterPlzOrt: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm mb-3 text-primary">Mietobjekt</h3>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="wohnungsAdresse">Adresse der Wohnung</Label>
                            <Input 
                              id="wohnungsAdresse"
                              placeholder="Musterstrasse 123, 8000 Zürich"
                              value={formData.wohnungsAdresse}
                              onChange={(e) => setFormData({...formData, wohnungsAdresse: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="auszugsDatum">Gewünschtes Auszugsdatum</Label>
                            <Input 
                              id="auszugsDatum"
                              type="date"
                              value={formData.auszugsDatum}
                              onChange={(e) => setFormData({...formData, auszugsDatum: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Preview */}
                <div>
                  <Card className="sticky top-24">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Vorschau</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          <Copy className="w-4 h-4 mr-1" />
                          Kopieren
                        </Button>
                        <Button variant="outline" size="sm" onClick={handlePrint}>
                          <Printer className="w-4 h-4 mr-1" />
                          Drucken
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white dark:bg-gray-900 border rounded-lg p-6 font-serif text-sm whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                        {generateLetter()}
                      </div>
                      
                      <div className="mt-6 flex gap-3">
                        <Button onClick={handleDownload} className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Herunterladen
                        </Button>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-4 text-center">
                        ⚠️ Denken Sie daran, das Schreiben per Einschreiben zu versenden!
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Wohnung gekündigt? Jetzt Umzug planen!
              </h2>
              <p className="text-muted-foreground mb-6">
                Vergleichen Sie kostenlos Offerten von geprüften Umzugsfirmen in Ihrer Region.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/umzugsofferten">
                  <Button size="lg">
                    Umzugsofferten erhalten
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/ratgeber/zeitplan">
                  <Button size="lg" variant="outline">
                    Umzugs-Zeitplan ansehen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
