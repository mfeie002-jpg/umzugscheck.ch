import React from "react";

// Landing A: Fokus auf harte Beweise (Zefix, UID, Proof-of-Existence)
export default function LandingTrustProofA() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center p-4">
      <section className="w-full max-w-md mt-8">
        <h1 className="text-2xl font-bold mb-2">Umzugscheck – Verifizierte Schweizer Umzugsfirmen</h1>
        <p className="mb-4">Vergleichen Sie nur Firmen, die im Handelsregister eingetragen und mit UID geprüft sind. 100% Schweizer Plattform.</p>
        <div className="flex flex-col gap-3 mb-6">
          <a href="https://www.zefix.ch" target="_blank" rel="noopener" className="bg-blue-100 text-blue-900 rounded-lg px-4 py-3 flex items-center gap-2 hover:bg-blue-200">
            <span>🔎</span>
            <span>Handelsregister prüfen (Zefix)</span>
          </a>
          <a href="https://www.uid.admin.ch" target="_blank" rel="noopener" className="bg-blue-100 text-blue-900 rounded-lg px-4 py-3 flex items-center gap-2 hover:bg-blue-200">
            <span>🆔</span>
            <span>UID prüfen (Bund)</span>
          </a>
        </div>
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-2">So funktioniert unser Firmen-Check:</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Jede Firma ist im Handelsregister eingetragen</li>
            <li>UID und Adresse öffentlich prüfbar</li>
            <li>Versicherung und Basisdaten werden kontrolliert</li>
            <li>Keine Fake-Profile, keine versteckten Kosten</li>
          </ul>
        </div>
        <button className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-800 mb-4">Jetzt Offerten vergleichen</button>
        <div className="text-xs text-gray-500 text-center">Kostenlos & unverbindlich. Ihre Daten bleiben in der Schweiz.</div>
      </section>
    </main>
  );
}
