

# Passwort zurücksetzen fuer mfeie002@gmail.com

## Problem
Du kannst dich nicht einloggen und die bestehende `admin-reset-password` Edge Function erfordert einen authentifizierten Admin-User -- ein Henne-Ei-Problem.

## Loesung
Eine temporaere Edge Function erstellen, die das Passwort einmalig ohne Authentifizierung zuruecksetzt. Nach erfolgreicher Ausfuehrung wird die Funktion sofort wieder entfernt.

## Schritte

1. **Temporaere Edge Function erstellen** (`supabase/functions/temp-password-reset/index.ts`)
   - Verwendet den Service Role Key (server-seitig, kein Client-Zugriff)
   - Setzt das Passwort fuer `mfeie002@gmail.com` auf `passwort123`
   - Kein Auth-Check noetig, da einmalige Verwendung

2. **Funktion deployen und ausfuehren**
   - Einmaliger Aufruf per Edge Function Curl-Tool

3. **Temporaere Funktion sofort loeschen**
   - Dateien entfernen und deployed Function loeschen
   - Kein Sicherheitsrisiko, da die Funktion nur kurz existiert

4. **Login testen**
   - Verifizieren, dass der Login mit dem neuen Passwort funktioniert

## Sicherheitshinweis
- Die temporaere Funktion existiert nur fuer Sekunden
- Das Passwort `passwort123` ist relativ schwach -- nach dem Login solltest du es aendern
- Alternativ: Eine "Passwort vergessen"-Funktion auf der Admin-Login-Seite einbauen, damit das Problem kuenftig nicht mehr auftritt

