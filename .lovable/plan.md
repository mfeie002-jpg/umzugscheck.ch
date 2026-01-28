
# Admin Relo-OS Phasen-Dashboard & Sidebar-Umbenennung

## Übersicht
Erstellung einer neuen Admin-Übersichtsseite für die 6 technischen Relo-OS Phasen sowie Umbenennung der Sidebar-Sektion.

## Änderungen

### 1. Sidebar umbenennen
**Datei:** `src/components/admin/AdminSidebar.tsx`

Zeile 288-289 ändern:
```typescript
// Alt:
{ type: "divider", title: "🚀 Phase 6: Growth" },

// Neu:
{ type: "divider", title: "🚀 Launch & Growth" },
```

### 2. Neue Admin-Seite erstellen
**Neue Datei:** `src/pages/admin/ReloOSPhases.tsx`

Dashboard mit 6 Karten (eine pro Phase):

```text
┌─────────────────────────────────────────────────────────────────────┐
│  Relo-OS Entwicklungsphasen                                         │
│  "Invisible Move" – Technische Implementierung                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │ 1. Route    │  │ 2. Inventory│  │ 3. Quote    │                  │
│  │ MapPin      │  │ ScanLine    │  │ Calculator  │                  │
│  │ ████████ ✓  │  │ ██████░░    │  │ ████░░░░    │                  │
│  │ 100%        │  │ 75%         │  │ 50%         │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │ 4. Booking  │  │ 5. Moving   │  │ 6. Complete │                  │
│  │ CreditCard  │  │ Truck       │  │ Home        │                  │
│  │ ███░░░░░    │  │ ██░░░░░░    │  │ █░░░░░░░    │                  │
│  │ 35%         │  │ 20%         │  │ 10%         │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ Phase Details (expandierbar pro Phase)                          ││
│  │ - Features implementiert                                         ││
│  │ - Offene Tasks                                                   ││
│  │ - Relevante Dateien                                              ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

**Jede Phase-Karte zeigt:**
- Icon (MapPin, ScanLine, Calculator, CreditCard, Truck, Home)
- Phasenname (Route, Inventory, Quote, Booking, Moving, Complete)
- Fortschrittsbalken
- Status-Badge (Implementiert/In Arbeit/Geplant)
- Beschreibung
- Expandierbare Details mit Features/Tasks

### 3. Route hinzufügen
**Datei:** `src/App.tsx`

Neue Route registrieren:
```typescript
const ReloOSPhases = lazy(() => import("./pages/admin/ReloOSPhases"));
// ...
<Route path="/admin/relo-os-phases" element={<ReloOSPhases />} />
```

### 4. Sidebar-Link hinzufügen
**Datei:** `src/components/admin/AdminSidebar.tsx`

Neuer Eintrag in der Sidebar unter "Launch & Growth":
```typescript
{ 
  title: "Relo-OS Phasen", 
  href: "/admin/relo-os-phases", 
  icon: Layers,
  badge: "DEV",
  highlight: true
},
```

## Technische Details

### Phasen-Datenstruktur
```typescript
interface ReloPhase {
  id: number;
  name: string;
  label: string;
  icon: LucideIcon;
  status: 'completed' | 'in_progress' | 'planned';
  progress: number;
  description: string;
  features: {
    name: string;
    implemented: boolean;
    file?: string;
  }[];
  keyFiles: string[];
}
```

### Datenquelle
Die Phasen-Information wird statisch im Code definiert (basierend auf der existierenden Implementierung in `src/lib/move-project.ts`, `src/components/journey/MoveJourneyProgress.tsx`, und den Memory-Dokumenten).

### Komponenten-Wiederverwendung
- Nutzt existierende `AdminLayout` für konsistentes Layout
- Nutzt existierende UI-Komponenten (Card, Badge, Progress)
- Konsistent mit bestehendem Admin-Design

## Zu erstellende Dateien
1. `src/pages/admin/ReloOSPhases.tsx` – Neue Phasen-Übersichtsseite

## Zu bearbeitende Dateien
1. `src/components/admin/AdminSidebar.tsx` – Umbenennung + neuer Link
2. `src/App.tsx` – Neue Route

## Klarstellung: /invisiblemovedashboard
Diese URL existiert **nicht** als Route! Die `InvisibleMoveDashboard`-Komponente ist ein Endkunden-Widget (in `src/components/dashboard/`), das den Umzugsfortschritt eines einzelnen Benutzers anzeigt – kein Admin-Tool. Die Marketing-Landingpages für "Invisible Move" sind unter `/invisible-1` bis `/invisible-4` erreichbar.
