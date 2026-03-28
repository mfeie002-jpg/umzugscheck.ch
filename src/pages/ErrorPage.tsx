import React from 'react';
import { FlowErrorDisplay } from '@/components/FlowErrorDisplay';
import { useLocation } from 'react-router-dom';

export default function ErrorPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type') || '404';

  const title = type === '500' ? "Interner Serverfehler" : "Seite nicht gefunden";
  const desc = type === '500' ? "Etwas ist schief gelaufen. Wir arbeiten daran!" : "Die Seite konnte nicht gefunden werden.";

  return (
    <div className="container mx-auto py-16">
      <FlowErrorDisplay title={title} description={desc} errorType={type as any} />
    </div>
  );
}