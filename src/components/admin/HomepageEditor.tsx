import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getHomepageContent } from "@/lib/content";
import type { HomepageContent } from "@/content/types";

export const HomepageEditor = () => {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      // Load existing content
      const existingContent = getHomepageContent();
      setContent(existingContent);
    } catch (error) {
      console.error("Error loading homepage content:", error);
      toast.error("Fehler beim Laden der Inhalte");
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // In production, this would save to Supabase or an API
      // For now, we'll just show success and update localStorage
      localStorage.setItem("homepage_content", JSON.stringify(content));
      toast.success("Änderungen gespeichert!");
    } catch (error) {
      toast.error("Fehler beim Speichern");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (!content) {
    return <div>Lädt...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Bereich</CardTitle>
          <CardDescription>Hauptbereich der Startseite</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero-headline">Überschrift</Label>
            <Input
              id="hero-headline"
              value={content.hero.headline}
              onChange={(e) => setContent({
                ...content,
                hero: { ...content.hero, headline: e.target.value }
              })}
            />
          </div>

          <div>
            <Label htmlFor="hero-highlighted">Hervorgehobener Text</Label>
            <Input
              id="hero-highlighted"
              value={content.hero.highlightedText}
              onChange={(e) => setContent({
                ...content,
                hero: { ...content.hero, highlightedText: e.target.value }
              })}
            />
          </div>

          <div>
            <Label htmlFor="hero-subheadline">Unterüberschrift</Label>
            <Textarea
              id="hero-subheadline"
              value={content.hero.subheadline}
              onChange={(e) => setContent({
                ...content,
                hero: { ...content.hero, subheadline: e.target.value }
              })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hero-primary-cta">Primärer Button</Label>
              <Input
                id="hero-primary-cta"
                value={content.hero.primaryCTA}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, primaryCTA: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="hero-secondary-cta">Sekundärer Button</Label>
              <Input
                id="hero-secondary-cta"
                value={content.hero.secondaryCTA}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, secondaryCTA: e.target.value }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Vertrauensindikatoren</CardTitle>
          <CardDescription>Bewertung, Umzüge, etc.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="trust-rating">Bewertung</Label>
            <Input
              id="trust-rating"
              value={content.hero.trustIndicators.rating}
              onChange={(e) => setContent({
                ...content,
                hero: {
                  ...content.hero,
                  trustIndicators: {
                    ...content.hero.trustIndicators,
                    rating: e.target.value
                  }
                }
              })}
            />
          </div>

          <div>
            <Label htmlFor="trust-moves">Anzahl Umzüge</Label>
            <Input
              id="trust-moves"
              value={content.hero.trustIndicators.movesCount}
              onChange={(e) => setContent({
                ...content,
                hero: {
                  ...content.hero,
                  trustIndicators: {
                    ...content.hero.trustIndicators,
                    movesCount: e.target.value
                  }
                }
              })}
            />
          </div>

          <div>
            <Label htmlFor="trust-verified">Verifiziert Text</Label>
            <Input
              id="trust-verified"
              value={content.hero.trustIndicators.verifiedText}
              onChange={(e) => setContent({
                ...content,
                hero: {
                  ...content.hero,
                  trustIndicators: {
                    ...content.hero.trustIndicators,
                    verifiedText: e.target.value
                  }
                }
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>So funktioniert's</CardTitle>
          <CardDescription>3-Schritte-Prozess</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="how-title">Titel</Label>
            <Input
              id="how-title"
              value={content.howItWorks.title}
              onChange={(e) => setContent({
                ...content,
                howItWorks: { ...content.howItWorks, title: e.target.value }
              })}
            />
          </div>

          <div>
            <Label htmlFor="how-subtitle">Untertitel</Label>
            <Input
              id="how-subtitle"
              value={content.howItWorks.subtitle}
              onChange={(e) => setContent({
                ...content,
                howItWorks: { ...content.howItWorks, subtitle: e.target.value }
              })}
            />
          </div>

          {content.howItWorks.steps.map((step, index) => (
            <div key={index} className="border-t pt-4">
              <h4 className="font-semibold mb-3">Schritt {step.number}</h4>
              <div className="space-y-2">
                <div>
                  <Label>Titel</Label>
                  <Input
                    value={step.title}
                    onChange={(e) => {
                      const newSteps = [...content.howItWorks.steps];
                      newSteps[index] = { ...step, title: e.target.value };
                      setContent({
                        ...content,
                        howItWorks: { ...content.howItWorks, steps: newSteps }
                      });
                    }}
                  />
                </div>
                <div>
                  <Label>Beschreibung</Label>
                  <Textarea
                    value={step.description}
                    onChange={(e) => {
                      const newSteps = [...content.howItWorks.steps];
                      newSteps[index] = { ...step, description: e.target.value };
                      setContent({
                        ...content,
                        howItWorks: { ...content.howItWorks, steps: newSteps }
                      });
                    }}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => setContent(getHomepageContent())}>
          Zurücksetzen
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Speichert..." : "Änderungen speichern"}
        </Button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Hinweis:</strong> In der aktuellen Version werden Änderungen im Browser-Speicher gespeichert. 
          Für Production sollte ein Backend (Supabase) verwendet werden.
        </p>
      </div>
    </div>
  );
};
