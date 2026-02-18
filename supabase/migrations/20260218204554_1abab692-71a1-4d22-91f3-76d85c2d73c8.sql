-- Schritt A: Alle 3 Admin-Accounts als E-Mail-bestätigt markieren
UPDATE auth.users
SET email_confirmed_at = now(),
    updated_at = now()
WHERE email IN (
  'mfeie002@gmail.com',
  'mfeie002+admin2@gmail.com',
  'mfeie001@gmail.com'
)
AND email_confirmed_at IS NULL;

-- Sicherheitshalber auch alle bereits bestätigten nochmals aktualisieren
UPDATE auth.users
SET updated_at = now()
WHERE email IN (
  'mfeie002@gmail.com',
  'mfeie002+admin2@gmail.com',
  'mfeie001@gmail.com'
);