/**
 * Dashboard Page - After Booking
 * 
 * Prompt 4: Dashboard & Live-Tracking
 * - Zusammenfassung des Umzugs
 * - Fortschrittsanzeige (Beladen/Transport/Entladen)
 * - Team-Vorstellung
 * - Live-Updates
 */

import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Truck, 
  MapPin, 
  Calendar, 
  Package, 
  Users, 
  Star, 
  CheckCircle2, 
  Clock, 
  Phone,
  MessageCircle,
  ArrowLeft,
  Home,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// Demo move data
const DEMO_MOVE = {
  id: 'MOVE-2024-0142',
  status: 'confirmed',
  date: '15. Februar 2024',
  time: '08:00 - 12:00 Uhr',
  from: {
    address: 'Bahnhofstrasse 42',
    city: '8001 Zürich',
  },
  to: {
    address: 'Seestrasse 15',
    city: '6004 Luzern',
  },
  serviceLevel: 'Premium',
  price: 'CHF 2\'450',
  company: {
    name: 'SwissMove AG',
    rating: 4.9,
    reviews: 234,
    phone: '+41 44 123 45 67',
  },
  team: [
    { name: 'Marco K.', role: 'Teamleiter', experience: '8 Jahre' },
    { name: 'Stefan W.', role: 'Umzugshelfer', experience: '5 Jahre' },
    { name: 'Peter M.', role: 'Fahrer', experience: '12 Jahre' },
  ],
  progress: 33, // 0, 33, 66, 100
  progressStage: 'loading', // 'scheduled' | 'loading' | 'transport' | 'unloading' | 'completed'
  updates: [
    { time: '08:15', message: 'Team ist eingetroffen und beginnt mit dem Beladen', type: 'info' },
    { time: '08:00', message: 'Team ist unterwegs zu Ihrer Adresse', type: 'info' },
    { time: 'Gestern', message: 'Umzug bestätigt - Team wurde zugeteilt', type: 'success' },
  ],
};

const PROGRESS_STAGES = [
  { key: 'scheduled', label: 'Geplant', icon: Calendar, progress: 0 },
  { key: 'loading', label: 'Beladen', icon: Package, progress: 33 },
  { key: 'transport', label: 'Transport', icon: Truck, progress: 66 },
  { key: 'unloading', label: 'Entladen', icon: Home, progress: 100 },
];

export default function Dashboard() {
  const [move] = useState(DEMO_MOVE);

  const currentStageIndex = PROGRESS_STAGES.findIndex(s => s.key === move.progressStage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Helmet>
        <title>Umzugs-Dashboard | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 max-w-4xl">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Zurück zur Startseite</span>
            </Link>
            <Badge variant="outline" className="gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        {/* Move Summary Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Ihr Umzug</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Bestätigt
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Auftragsnummer: {move.id}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Route */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="w-0.5 h-8 bg-border" />
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Home className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <p className="font-medium">{move.from.address}</p>
                  <p className="text-sm text-muted-foreground">{move.from.city}</p>
                </div>
                <div>
                  <p className="font-medium">{move.to.address}</p>
                  <p className="text-sm text-muted-foreground">{move.to.city}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <Calendar className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                <p className="text-sm font-medium">{move.date}</p>
                <p className="text-xs text-muted-foreground">{move.time}</p>
              </div>
              <div>
                <Package className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                <p className="text-sm font-medium">{move.serviceLevel}</p>
                <p className="text-xs text-muted-foreground">Service</p>
              </div>
              <div>
                <Users className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                <p className="text-sm font-medium">{move.team.length} Helfer</p>
                <p className="text-xs text-muted-foreground">Team</p>
              </div>
              <div>
                <Truck className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                <p className="text-sm font-medium">{move.price}</p>
                <p className="text-xs text-muted-foreground">Fixpreis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Tracker */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Umzugs-Fortschritt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Progress Bar */}
              <Progress value={move.progress} className="h-3" />

              {/* Stage Indicators */}
              <div className="flex justify-between">
                {PROGRESS_STAGES.map((stage, index) => {
                  const Icon = stage.icon;
                  const isActive = index <= currentStageIndex;
                  const isCurrent = stage.key === move.progressStage;
                  
                  return (
                    <motion.div
                      key={stage.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isCurrent 
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' 
                          : isActive 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {isActive && !isCurrent ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={`text-xs ${isCurrent ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                        {stage.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team & Company */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Company */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Ihre Umzugsfirma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                  🚚
                </div>
                <div>
                  <p className="font-semibold">{move.company.name}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{move.company.rating}</span>
                    <span className="text-muted-foreground">({move.company.reviews} Bewertungen)</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Phone className="w-4 h-4" />
                  Anrufen
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Ihr Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {move.team.map((member, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role} • {member.experience}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Updates */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Live-Updates</CardTitle>
              <Badge variant="outline" className="gap-1">
                <Clock className="w-3 h-3" />
                Aktuell
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {move.updates.map((update, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    update.type === 'success' ? 'bg-green-500' : 'bg-primary'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{update.message}</p>
                    <p className="text-xs text-muted-foreground">{update.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center pt-4">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Zurück zur Startseite
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
