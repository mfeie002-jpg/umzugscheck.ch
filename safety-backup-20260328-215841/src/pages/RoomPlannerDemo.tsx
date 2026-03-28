import React from 'react';
import { InteractiveRoomPlanner } from '@/components/room-planner';

const RoomPlannerDemo = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            🏠 Interaktiver Raumplaner
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visualisieren Sie Ihren Umzug: Sehen Sie alle Räume, Produkte und Phasen auf einen Blick. 
            Klicken Sie auf ein Produkt um Details zu sehen, ziehen Sie es um die Position zu ändern.
          </p>
        </div>

        <InteractiveRoomPlanner />

        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-card rounded-xl border">
            <span className="text-4xl mb-3 block">📋</span>
            <h3 className="font-semibold mb-2">Inventar erfassen</h3>
            <p className="text-sm text-muted-foreground">
              Alle Ihre Möbel und Gegenstände übersichtlich in Räumen organisiert
            </p>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border">
            <span className="text-4xl mb-3 block">📦</span>
            <h3 className="font-semibold mb-2">Phasen visualisieren</h3>
            <p className="text-sm text-muted-foreground">
              Sehen Sie wie Ihr Umzug in jeder Phase aussieht – vom Einpacken bis zum Einrichten
            </p>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border">
            <span className="text-4xl mb-3 block">🎯</span>
            <h3 className="font-semibold mb-2">Smart planen</h3>
            <p className="text-sm text-muted-foreground">
              Verschieben Sie Produkte zwischen Räumen und planen Sie die optimale Aufstellung
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoomPlannerDemo;
