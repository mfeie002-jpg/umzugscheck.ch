
# Admin Login Fix: Passwort-Reset + Account-Bestätigung

## Problem-Diagnose

Die Datenbank zeigt **3 existierende Accounts**, alle korrekt mit der `admin`-Rolle verknüpft:
- `mfeie002@gmail.com` (ID: ad0e4c55)
- `mfeie002+admin2@gmail.com` (ID: b87e399e)
- `mfeie001@gmail.com` (ID: 55a823f7)

Der Login-Code in `AuthContext.tsx` und `src/pages/admin/Login.tsx` ist technisch korrekt. Das Problem ist eines der folgenden:

1. **Passwörter unbekannt** – die Accounts wurden seinerzeit mit unbekannten Passwörtern angelegt
2. **E-Mail nicht bestätigt** – in Lovable Cloud ist standardmässig E-Mail-Bestätigung aktiv; ohne Bestätigung schlägt `signInWithPassword` mit "Email not confirmed" fehl
3. **Beides kombiniert**

## Lösung

### Schritt A: E-Mail-Bestätigung via SQL-Migration erzwingen

Mit einer SQL-Migration werden alle 3 Admin-Accounts direkt als "email confirmed" markiert (ohne dass eine E-Mail angeklickt werden muss):

```sql
-- Alle 3 Admin-Accounts als bestätigt markieren
UPDATE auth.users
SET email_confirmed_at = now(),
    updated_at = now()
WHERE email IN (
  'mfeie002@gmail.com',
  'mfeie002+admin2@gmail.com',
  'mfeie001@gmail.com'
)
AND email_confirmed_at IS NULL;
```

### Schritt B: Passwort für Haupt-Admin setzen

Via SQL (bcrypt-kompatibler Hash oder direkt über Supabase Admin API in einer Edge Function) wird ein bekanntes Passwort gesetzt.

Da wir keine direkte Admin-API vom Frontend haben, erstellen wir eine **einmalige Reset-Edge-Function** (`admin-set-password`), die:
- Nur mit dem `SUPABASE_SERVICE_ROLE_KEY` läuft
- Das Passwort für `mfeie002@gmail.com` auf einen definierten Wert setzt
- Nach dem ersten Aufruf sich selbst deaktiviert (einmaliger Use)

**Alternativ (sauberer):** SQL direkt auf `auth.users` – Supabase speichert Passwörter in `encrypted_password` als bcrypt. Wir generieren via SQL-Funktion einen validen bcrypt-Hash.

### Schritt C: Login-Seite verbessern

Auf `src/pages/admin/Login.tsx` werden Debug-Informationen hinzugefügt:
- Anzeige von konkreten Fehlermeldungen ("E-Mail nicht bestätigt" vs. "Falsches Passwort")
- Direkte Hinweise welche E-Mail-Adresse zu verwenden ist
- "Passwort vergessen" Link / Reset-Flow

## Konkrete Umsetzung

### 1. SQL-Migration: E-Mail-Bestätigung

Alle 3 existierenden Admin-Accounts werden als `email_confirmed_at = now()` markiert. Das behebt den "Email not confirmed"-Fehler sofort.

### 2. Edge Function `reset-admin-password`

Eine temporäre Edge Function die:
- `SUPABASE_SERVICE_ROLE_KEY` verwendet (Server-only)
- `supabase.auth.admin.updateUserById(userId, { password: newPassword })` aufruft
- Passwort für `mfeie002@gmail.com` auf einen sicheren, bekannten Wert setzt

Das neue Passwort wird in der Antwort der Edge Function zurückgegeben (einmalig, dann im Admin-Dashboard änderbar).

### 3. Login-Seite: Bessere Fehlermeldungen

Bestehende Error-Handling-Logik in `admin/Login.tsx` wird erweitert:
- "Email not confirmed" → Klare deutsche Meldung mit Erklärung
- "Invalid login credentials" → Klare Meldung
- Tipp-Text: Welche E-Mail-Adresse ist die primäre Admin-E-Mail

## Dateiänderungen

```text
NEU:
- supabase/functions/reset-admin-password/index.ts   (temporäre One-Shot Funktion)

DB-MIGRATION:
- auth.users: email_confirmed_at für 3 Admin-Accounts setzen

GEÄNDERT:
- src/pages/admin/Login.tsx    (bessere Fehlermeldungen + Hinweistext)
```

## Nach der Implementierung

1. Die 3 Admin-Accounts sind sofort bestätigt (kein E-Mail-Klick nötig)
2. Die Edge Function `reset-admin-password` kann einmalig aufgerufen werden um das Passwort zu setzen
3. Login mit `mfeie002@gmail.com` + neuem Passwort funktioniert
4. Nach erfolgreichem Login: Passwort im Profil auf ein permanentes Wunsch-Passwort ändern
5. Die temporäre Reset-Funktion kann danach gelöscht werden

## Testen

1. Geh zu `/admin/login`
2. E-Mail: `mfeie002@gmail.com`
3. Passwort: wird nach Implementierung bekannt sein
4. Sollte direkt zum Admin-Dashboard weiterleiten
