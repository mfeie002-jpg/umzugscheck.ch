/**
 * After Move Care Section
 * 
 * Integration wrapper for AfterMoveCareMap and PostMoveSurvey
 * Provides neighborhood discovery and feedback collection.
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, MessageSquare, Heart, Sparkles, ExternalLink } from 'lucide-react';

export interface AfterMoveCareSectionProps {
  newAddress: {
    postalCode: string;
    city: string;
    street?: string;
  };
  onSurveyComplete?: (rating: number, feedback: string) => void;
}

// Local services data for the neighborhood discovery
const localServicesCategories = [
  {
    id: 'essentials',
    name: 'Grundversorgung',
    icon: '🛒',
    services: [
      { name: 'Migros', type: 'Supermarkt', distance: '350m' },
      { name: 'Coop', type: 'Supermarkt', distance: '500m' },
      { name: 'Post', type: 'Postfiliale', distance: '280m' },
      { name: 'Apotheke', type: 'Apotheke', distance: '200m' },
    ],
  },
  {
    id: 'health',
    name: 'Gesundheit',
    icon: '🏥',
    services: [
      { name: 'Hausarztpraxis', type: 'Arzt', distance: '450m' },
      { name: 'Zahnarzt', type: 'Zahnarzt', distance: '300m' },
      { name: 'Spital', type: 'Krankenhaus', distance: '1.2km' },
    ],
  },
  {
    id: 'transport',
    name: 'Verkehr',
    icon: '🚌',
    services: [
      { name: 'Bus/Tram', type: 'Haltestelle', distance: '150m' },
      { name: 'Bahnhof', type: 'Bahnhof', distance: '800m' },
      { name: 'Parkhaus', type: 'Parken', distance: '400m' },
    ],
  },
  {
    id: 'leisure',
    name: 'Freizeit',
    icon: '🎭',
    services: [
      { name: 'Park', type: 'Grünfläche', distance: '250m' },
      { name: 'Fitnesscenter', type: 'Sport', distance: '600m' },
      { name: 'Restaurant', type: 'Gastronomie', distance: '180m' },
    ],
  },
];

export const AfterMoveCareSection = ({
  newAddress,
  onSurveyComplete,
}: AfterMoveCareSectionProps) => {
  const [activeTab, setActiveTab] = useState('neighborhood');
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSurveySubmit = () => {
    if (rating > 0) {
      setSurveySubmitted(true);
      onSurveyComplete?.(rating, feedback);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg">
            <Heart className="h-5 w-5 text-pink-600" />
          </div>
          <div>
            <CardTitle className="text-xl">After Move Care</CardTitle>
            <CardDescription>
              Entdecken Sie Ihre neue Nachbarschaft
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger 
              value="neighborhood" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Nachbarschaft
            </TabsTrigger>
            <TabsTrigger 
              value="feedback" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="neighborhood" className="p-4 space-y-6">
            {/* Location Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Ihre neue Adresse</p>
                <p className="font-semibold text-lg">
                  {newAddress.postalCode} {newAddress.city}
                </p>
                {newAddress.street && (
                  <p className="text-sm text-muted-foreground">{newAddress.street}</p>
                )}
              </div>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Auf Karte
              </Button>
            </div>

            {/* Local Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localServicesCategories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{category.icon}</span>
                    <h3 className="font-medium">{category.name}</h3>
                  </div>
                  <div className="space-y-2">
                    {category.services.map((service, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded"
                      >
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-xs text-muted-foreground">{service.type}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {service.distance}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Welcome Tips */}
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Tipps für Ihren Start</p>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                    <li>• Stellen Sie sich bei den Nachbarn vor</li>
                    <li>• Erkunden Sie die Umgebung zu Fuss</li>
                    <li>• Finden Sie den nächsten Recyclinghof</li>
                    <li>• Lernen Sie die öV-Verbindungen kennen</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="p-4 space-y-6">
            {!surveySubmitted ? (
              <>
                {/* Rating Section */}
                <div className="text-center space-y-4">
                  <p className="text-lg font-medium">
                    Wie war Ihr Umzugserlebnis?
                  </p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-3xl transition-transform hover:scale-110 ${
                          star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {rating === 5 && 'Ausgezeichnet! 🎉'}
                      {rating === 4 && 'Sehr gut! 👍'}
                      {rating === 3 && 'Okay 🙂'}
                      {rating === 2 && 'Verbesserungswürdig 🤔'}
                      {rating === 1 && 'Nicht zufrieden 😔'}
                    </p>
                  )}
                </div>

                {/* Feedback Text */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Möchten Sie uns mehr erzählen? (optional)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Was hat gut geklappt? Was können wir verbessern?"
                    className="w-full p-3 border rounded-lg min-h-[100px] text-sm resize-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleSurveySubmit}
                  disabled={rating === 0}
                  className="w-full min-h-[52px]"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Feedback absenden
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Vielen Dank für Ihr Feedback!
                </h3>
                <p className="text-muted-foreground">
                  Ihre Rückmeldung hilft uns, unseren Service zu verbessern.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
