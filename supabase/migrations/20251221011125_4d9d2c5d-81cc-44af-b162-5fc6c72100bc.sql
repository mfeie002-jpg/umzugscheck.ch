-- Drop the broken policy that queries auth.users directly
DROP POLICY IF EXISTS "Providers view assigned leads authenticated" ON leads;

-- Recreate with fixed query using auth.jwt() instead of auth.users
CREATE POLICY "Providers view assigned leads authenticated"
ON leads FOR SELECT
TO authenticated
USING (
  assigned_provider_ids @> ARRAY[(
    SELECT service_providers.id
    FROM service_providers
    WHERE service_providers.email = (auth.jwt() ->> 'email')
  )]
);