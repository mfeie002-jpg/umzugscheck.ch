import { useState, useEffect } from "react";
import { MapPin, Truck, Clock, Phone, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface TrackingData {
  orderId: string;
  status: "preparing" | "in_transit" | "near_destination" | "arrived";
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  currentLocation: string;
  estimatedArrival: string;
  progress: number;
  lastUpdate: string;
}

const Tracking = () => {
  const [trackingId, setTrackingId] = useState("");
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Demo data
  const mockTrackingData: TrackingData = {
    orderId: "FEU-2024-001234",
    status: "in_transit",
    driverName: "Thomas Müller",
    driverPhone: "+41 76 568 13 02",
    vehicleNumber: "ZH-1234",
    currentLocation: "Zürich HB, Bahnhofplatz",
    estimatedArrival: "14:30 Uhr",
    progress: 65,
    lastUpdate: "Vor 2 Minuten"
  };

  const handleTrack = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTrackingData(mockTrackingData);
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing": return "bg-yellow-500";
      case "in_transit": return "bg-blue-500";
      case "near_destination": return "bg-orange-500";
      case "arrived": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "preparing": return "Wird vorbereitet";
      case "in_transit": return "Unterwegs";
      case "near_destination": return "In der Nähe";
      case "arrived": return "Angekommen";
      default: return "Unbekannt";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Truck className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 text-primary" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Live GPS Tracking
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                Verfolgen Sie Ihren Umzug in Echtzeit
              </p>

              {/* Tracking Input */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Tracking-ID eingeben (z.B. FEU-2024-001234)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button 
                  onClick={handleTrack} 
                  disabled={isLoading || !trackingId}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {isLoading ? "Lädt..." : "Verfolgen"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tracking Results */}
        {trackingData && (
          <section className="py-12 sm:py-16 lg:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Status Card */}
                <Card className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold mb-2">
                        Auftrag: {trackingData.orderId}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Letzte Aktualisierung: {trackingData.lastUpdate}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(trackingData.status)} text-white w-fit`}>
                      {getStatusText(trackingData.status)}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Fortschritt</span>
                      <span className="text-sm text-muted-foreground">
                        {trackingData.progress}%
                      </span>
                    </div>
                    <Progress value={trackingData.progress} className="h-2" />
                  </div>

                  {/* Location Info */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">Aktueller Standort</p>
                        <p className="text-sm text-muted-foreground">
                          {trackingData.currentLocation}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">Voraussichtliche Ankunft</p>
                        <p className="text-sm text-muted-foreground">
                          {trackingData.estimatedArrival}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Driver Info */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Fahrer-Information</h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Name</p>
                        <p className="font-medium">{trackingData.driverName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Fahrzeug</p>
                        <p className="font-medium">{trackingData.vehicleNumber}</p>
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(`tel:${trackingData.driverPhone}`)}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Anrufen
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Map Placeholder */}
                <Card className="p-6 sm:p-8">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Navigation className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Karten-Integration (Google Maps / Mapbox)
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Zeigt die Route und den aktuellen Standort in Echtzeit an
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Timeline */}
                <Card className="p-6 sm:p-8">
                  <h3 className="font-semibold mb-6">Verlauf</h3>
                  <div className="space-y-4">
                    {[
                      { time: "13:45", status: "In Zürich HB angekommen", active: true },
                      { time: "12:30", status: "Fahrt von Basel nach Zürich", active: false },
                      { time: "10:15", status: "Beladung in Basel abgeschlossen", active: false },
                      { time: "08:00", status: "Umzug gestartet", active: false }
                    ].map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${event.active ? 'bg-primary' : 'bg-muted'}`} />
                          {index < 3 && <div className="w-0.5 h-8 bg-muted mt-2" />}
                        </div>
                        <div className="pb-4">
                          <p className={`text-sm font-medium ${event.active ? 'text-primary' : ''}`}>
                            {event.status}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{event.time} Uhr</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Tracking;
