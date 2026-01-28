import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, CheckCircle, Upload, FileText, MapPin, Phone, Mail, Truck, Bell } from "lucide-react";
import CustomerReviewSystem from "@/components/CustomerReviewSystem";
import ReferralProgram from "@/components/ReferralProgram";
import OnboardingProgress from "@/components/OnboardingProgress";
import GamificationBadges from "@/components/GamificationBadges";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { requestNotificationPermission, getNotificationPermission, sendNotification } from "@/utils/notifications";
import { toast } from "sonner";

const CustomerPortal = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(getNotificationPermission() === 'granted');

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const permission = await requestNotificationPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        toast.success("Benachrichtigungen aktiviert");
        await sendNotification({
          title: "Benachrichtigungen aktiviert",
          body: "Sie erhalten nun Updates zu Ihrem Umzug",
        });
      } else {
        toast.error("Benachrichtigungen wurden abgelehnt");
        setNotificationsEnabled(false);
      }
    } else {
      setNotificationsEnabled(false);
      toast.success("Benachrichtigungen deaktiviert");
    }
  };

  // Demo tracking data
  const moveData = {
    trackingNumber: "FU-2024-001234",
    status: "in-progress",
    progress: 60,
    customer: {
      name: "Familie Müller",
      email: "mueller@example.com",
      phone: "+41 76 123 45 67"
    },
    from: "Bahnhofstrasse 10, 8001 Zürich",
    to: "Hauptstrasse 25, 3011 Bern",
    date: "15. Dezember 2024",
    estimatedArrival: "14:00 Uhr",
    timeline: [
      { status: "Offerte erstellt", completed: true, date: "20.11.2024" },
      { status: "Besichtigung durchgeführt", completed: true, date: "25.11.2024" },
      { status: "Auftrag bestätigt", completed: true, date: "28.11.2024" },
      { status: "Verpackung", completed: true, date: "14.12.2024" },
      { status: "Transport", completed: false, current: true, date: "15.12.2024" },
      { status: "Abschluss", completed: false, date: "15.12.2024" }
    ],
    documents: [
      { name: "Offerte_FU-2024-001234.pdf", type: "PDF", size: "245 KB" },
      { name: "Umzugs-Checkliste.pdf", type: "PDF", size: "128 KB" },
      { name: "Versicherungsnachweis.pdf", type: "PDF", size: "89 KB" }
    ],
    team: {
      leader: "Thomas Meier",
      phone: "+41 79 234 56 78",
      vehicle: "Feierabend Umzüge LKW 03"
    }
  };

  const handleTracking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Package className="h-16 w-16 text-alpine mx-auto" />
            <h1 className="text-balance">Kunden-Portal</h1>
            <p className="text-xl text-muted-foreground">
              Verfolgen Sie Ihren Umzug in Echtzeit und verwalten Sie alle wichtigen Dokumente an einem Ort.
            </p>
          </div>
        </div>
      </section>

      {!isTracking ? (
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-12 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-center">Umzug verfolgen</h2>
              <p className="text-muted-foreground text-center mb-8">
                Geben Sie Ihre Tracking-Nummer ein, um den Status Ihres Umzugs zu verfolgen.
              </p>
              <form onSubmit={handleTracking} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tracking">Tracking-Nummer</Label>
                  <Input 
                    id="tracking"
                    placeholder="z.B. FU-2024-001234"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Sie finden Ihre Tracking-Nummer in der Auftragsbestätigung per E-Mail.
                  </p>
                </div>
                <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground">
                  Umzug verfolgen
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground text-center mb-4">Demo-Zugang für Test:</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsTracking(true)}
                >
                  Demo-Umzug anzeigen
                </Button>
              </div>
            </Card>
          </div>
        </section>
      ) : (
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Status Banner */}
              <Card className="p-8 mb-8 bg-gradient-subtle border-2 border-alpine/20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className="bg-blue-500">In Progress</Badge>
                      <span className="text-sm text-muted-foreground">#{moveData.trackingNumber}</span>
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">{moveData.customer.name}</h2>
                    <p className="text-muted-foreground">
                      Umzug am {moveData.date} • Voraussichtliche Ankunft: {moveData.estimatedArrival}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-alpine mb-2">{moveData.progress}%</div>
                    <p className="text-sm text-muted-foreground">Fortschritt</p>
                  </div>
                </div>
                <Progress value={moveData.progress} className="mt-6 h-3" />
              </Card>

              <Tabs defaultValue="timeline" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="timeline">Zeitlinie</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="documents">Dokumente</TabsTrigger>
                  <TabsTrigger value="contact">Kontakt</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="space-y-4">
                  <Card className="p-8">
                    <h3 className="text-xl font-semibold mb-6">Umzugs-Fortschritt</h3>
                    <div className="space-y-6">
                      {moveData.timeline.map((step, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed ? 'bg-green-500' : step.current ? 'bg-blue-500' : 'bg-muted'
                          }`}>
                            {step.completed ? (
                              <CheckCircle className="h-6 w-6 text-white" />
                            ) : step.current ? (
                              <Clock className="h-6 w-6 text-white" />
                            ) : (
                              <div className="w-3 h-3 rounded-full bg-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-semibold ${step.current ? 'text-alpine' : ''}`}>
                                {step.status}
                              </h4>
                              <span className="text-sm text-muted-foreground">{step.date}</span>
                            </div>
                            {step.current && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Aktuell in Bearbeitung...
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                    <div className="flex items-start space-x-3">
                      <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Live-Update</h4>
                        <p className="text-sm text-muted-foreground">
                          Unser Team ist unterwegs von Zürich nach Bern. Geschätzte Ankunft um 14:00 Uhr.
                        </p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center">
                        <MapPin className="h-5 w-5 text-alpine mr-2" />
                        Auszugsadresse
                      </h3>
                      <p className="text-muted-foreground">{moveData.from}</p>
                    </Card>

                    <Card className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center">
                        <MapPin className="h-5 w-5 text-alpine mr-2" />
                        Einzugsadresse
                      </h3>
                      <p className="text-muted-foreground">{moveData.to}</p>
                    </Card>
                  </div>

                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Team-Information</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Teamleiter</p>
                        <p className="font-medium">{moveData.team.leader}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Telefon</p>
                        <a href={`tel:${moveData.team.phone}`} className="font-medium text-alpine hover:underline">
                          {moveData.team.phone}
                        </a>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Fahrzeug</p>
                        <p className="font-medium">{moveData.team.vehicle}</p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <Card className="p-8">
                    <h3 className="text-xl font-semibold mb-6">Ihre Dokumente</h3>
                    <div className="space-y-3">
                      {moveData.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-10 w-10 text-alpine" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">{doc.type} • {doc.size}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-8">
                    <h3 className="text-xl font-semibold mb-4">Dokument hochladen</h3>
                    <p className="text-muted-foreground mb-6">
                      Sie können hier zusätzliche Dokumente wie Inventarlisten oder besondere Anweisungen hochladen.
                    </p>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="font-medium mb-2">Datei hier ablegen</p>
                      <p className="text-sm text-muted-foreground mb-4">oder klicken zum Auswählen</p>
                      <Button variant="outline">Datei auswählen</Button>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <Card className="p-8">
                    <h3 className="text-xl font-semibold mb-6">Ihr Team kontaktieren</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="p-6 bg-muted/30">
                        <Phone className="h-10 w-10 text-alpine mb-4" />
                        <h4 className="font-semibold mb-2">Telefon</h4>
                        <a href={`tel:${moveData.team.phone}`} className="text-alpine hover:underline">
                          {moveData.team.phone}
                        </a>
                        <p className="text-sm text-muted-foreground mt-2">
                          Teamleiter {moveData.team.leader}
                        </p>
                      </Card>

                      <Card className="p-6 bg-muted/30">
                        <Mail className="h-10 w-10 text-alpine mb-4" />
                        <h4 className="font-semibold mb-2">E-Mail</h4>
                        <a href={`mailto:${moveData.customer.email}`} className="text-alpine hover:underline break-all">
                          {moveData.customer.email}
                        </a>
                        <p className="text-sm text-muted-foreground mt-2">
                          Antwort innerhalb von 2 Stunden
                        </p>
                      </Card>
                    </div>
                  </Card>

                  <Card className="p-6 bg-gradient-hero text-primary-foreground">
                    <h4 className="font-semibold mb-2">Notfall-Hotline</h4>
                    <p className="opacity-90 mb-4">
                      Bei dringenden Angelegenheiten während Ihres Umzugs
                    </p>
                    <a href="tel:+41765681302" className="text-2xl font-bold">
                      +41 76 568 13 02
                    </a>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Notification Settings */}
              <Card className="mt-6">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <Label htmlFor="notifications" className="font-semibold">Push-Benachrichtigungen</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Erhalten Sie Updates zu Ihrem Umzug in Echtzeit
                      </p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={notificationsEnabled}
                      onCheckedChange={handleNotificationToggle}
                    />
                  </div>
                </div>
              </Card>

              {/* Gamification Badges */}
              <div className="mt-6">
                <GamificationBadges />
              </div>

              {/* Onboarding Progress */}
              <div className="mt-6">
                <OnboardingProgress />
              </div>

              {/* Referral Program */}
              <div className="mt-6">
                <ReferralProgram />
              </div>

              {/* Customer Review System */}
              <div className="mt-6">
                <CustomerReviewSystem />
              </div>

              <div className="mt-8 text-center">
                <Button variant="outline" onClick={() => setIsTracking(false)}>
                  Neue Tracking-Nummer eingeben
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default CustomerPortal;
