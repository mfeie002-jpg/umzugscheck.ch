import { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Truck, 
  Heart,
  ChevronRight,
  Star,
  Clock,
  Check,
  X,
  MessageCircle,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  findPotentialMatches,
  calculatePotentialSavings,
  formatSavings,
  getMatchQualityLabel,
  estimateDistance,
  type BuddyProfile,
  type BuddyMatch,
  type BuddyPreferences,
} from '@/lib/buddy-matching';

interface BuddyMatchingProps {
  userProfile?: Partial<BuddyProfile>;
  onMatchSelect?: (match: BuddyMatch) => void;
  className?: string;
}

export const BuddyMatching = memo(function BuddyMatching({
  userProfile,
  onMatchSelect,
  className = '',
}: BuddyMatchingProps) {
  const [profile, setProfile] = useState<BuddyProfile>({
    id: `buddy_${Date.now()}`,
    userId: 'user_demo',
    displayName: 'Mein Profil',
    fromCity: userProfile?.fromCity || '',
    fromPostal: userProfile?.fromPostal || '',
    toCity: userProfile?.toCity || '',
    toPostal: userProfile?.toPostal || '',
    moveDate: userProfile?.moveDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    flexibleDays: 3,
    estimatedVolume: 15,
    maxBuddies: 1,
    preferences: {
      shareContact: true,
      morningPreferred: true,
      afternoonPreferred: false,
      weekendOk: true,
      helpWithLoading: true,
      hasVehicle: false,
    },
    status: 'searching',
    createdAt: new Date(),
  });

  const [matches, setMatches] = useState<BuddyMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(!userProfile?.fromPostal);

  // Simulated other profiles (would come from database)
  const mockProfiles: BuddyProfile[] = [
    {
      id: 'buddy_1',
      userId: 'user_1',
      displayName: 'Marco S.',
      fromCity: 'Zürich',
      fromPostal: '8001',
      toCity: 'Bern',
      toPostal: '3011',
      moveDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      flexibleDays: 5,
      estimatedVolume: 12,
      maxBuddies: 1,
      preferences: { shareContact: true, morningPreferred: true, afternoonPreferred: false, weekendOk: true, helpWithLoading: true, hasVehicle: false },
      status: 'searching',
      createdAt: new Date(),
    },
    {
      id: 'buddy_2',
      userId: 'user_2',
      displayName: 'Anna B.',
      fromCity: 'Winterthur',
      fromPostal: '8400',
      toCity: 'Basel',
      toPostal: '4001',
      moveDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
      flexibleDays: 2,
      estimatedVolume: 8,
      maxBuddies: 2,
      preferences: { shareContact: true, morningPreferred: false, afternoonPreferred: true, weekendOk: false, helpWithLoading: false, hasVehicle: true },
      status: 'searching',
      createdAt: new Date(),
    },
    {
      id: 'buddy_3',
      userId: 'user_3',
      displayName: 'Thomas K.',
      fromCity: 'Zürich',
      fromPostal: '8048',
      toCity: 'Luzern',
      toPostal: '6003',
      moveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      flexibleDays: 7,
      estimatedVolume: 20,
      maxBuddies: 1,
      preferences: { shareContact: true, morningPreferred: true, afternoonPreferred: true, weekendOk: true, helpWithLoading: true, hasVehicle: false },
      status: 'searching',
      createdAt: new Date(),
    },
  ];

  const handleSearch = useCallback(() => {
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      const foundMatches = findPotentialMatches(profile, mockProfiles, 30);
      setMatches(foundMatches);
      setIsSearching(false);
      setShowProfileForm(false);
    }, 1500);
  }, [profile]);

  const updatePreference = (key: keyof BuddyPreferences, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          LKW-Sharing (Buddy Matching)
          <Badge variant="secondary" className="ml-auto text-xs">
            Bis 40% sparen
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Intro */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-3 text-sm">
          <p className="text-muted-foreground">
            Teile einen Umzugstransport mit anderen und spare bares Geld! 
            Wir finden passende Partner mit ähnlicher Route.
          </p>
        </div>

        {/* Profile Form */}
        <AnimatePresence>
          {showProfileForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 border rounded-lg p-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Von PLZ</Label>
                  <Input
                    value={profile.fromPostal}
                    onChange={(e) => setProfile(prev => ({ ...prev, fromPostal: e.target.value }))}
                    placeholder="8001"
                    maxLength={4}
                  />
                </div>
                <div>
                  <Label className="text-xs">Nach PLZ</Label>
                  <Input
                    value={profile.toPostal}
                    onChange={(e) => setProfile(prev => ({ ...prev, toPostal: e.target.value }))}
                    placeholder="3011"
                    maxLength={4}
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Volumen: {profile.estimatedVolume} m³</Label>
                <Slider
                  value={[profile.estimatedVolume]}
                  onValueChange={([v]) => setProfile(prev => ({ ...prev, estimatedVolume: v }))}
                  min={5}
                  max={40}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-xs">Flexibilität: ±{profile.flexibleDays} Tage</Label>
                <Slider
                  value={[profile.flexibleDays]}
                  onValueChange={([v]) => setProfile(prev => ({ ...prev, flexibleDays: v }))}
                  min={0}
                  max={14}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Präferenzen</Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={profile.preferences.morningPreferred}
                      onCheckedChange={(v) => updatePreference('morningPreferred', v)}
                    />
                    <span>Morgens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={profile.preferences.weekendOk}
                      onCheckedChange={(v) => updatePreference('weekendOk', v)}
                    />
                    <span>Wochenende OK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={profile.preferences.helpWithLoading}
                      onCheckedChange={(v) => updatePreference('helpWithLoading', v)}
                    />
                    <span>Helfe beim Laden</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSearch} 
                className="w-full"
                disabled={!profile.fromPostal || !profile.toPostal || isSearching}
              >
                {isSearching ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Users className="h-4 w-4 mr-2" />
                )}
                {isSearching ? 'Suche läuft...' : 'Partner finden'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Form Button */}
        {!showProfileForm && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowProfileForm(true)}
            className="w-full"
          >
            Suchkriterien anpassen
          </Button>
        )}

        {/* Matches */}
        {matches.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              {matches.length} passende Partner gefunden
            </h4>
            
            {matches.map((match) => {
              const otherProfile = match.profiles.find(p => p.id !== profile.id) || match.profiles[1];
              const qualityLabel = getMatchQualityLabel(match.compatibilityScore);
              
              return (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => onMatchSelect?.(match)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {otherProfile.displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{otherProfile.displayName}</h5>
                        <Badge variant="outline" className={`text-xs ${qualityLabel.color}`}>
                          {match.compatibilityScore}% Match
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{otherProfile.fromPostal} → {otherProfile.toPostal}</span>
                        <span>•</span>
                        <Truck className="h-3 w-3" />
                        <span>{otherProfile.estimatedVolume} m³</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={match.dateMatch === 'exact' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {match.dateMatch === 'exact' ? 'Gleiches Datum' : 
                           match.dateMatch === 'flexible' ? 'Flexibles Datum' : 'Verhandelbar'}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-green-600 bg-green-50">
                          Ersparnis: {formatSavings(match.potentialSavings)}
                        </Badge>
                      </div>
                    </div>
                    
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* No Matches */}
        {matches.length === 0 && !showProfileForm && !isSearching && (
          <div className="text-center py-6 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Noch keine Partner gefunden</p>
            <p className="text-xs">Erweitere deine Flexibilität für mehr Matches</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default BuddyMatching;
