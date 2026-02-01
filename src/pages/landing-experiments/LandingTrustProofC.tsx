import React from "react";

// Landing C: Fokus auf Security, Datenschutz, Tech-Trust
export default function LandingTrustProofC() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center p-4">
      <section className="w-full max-w-md mt-8">
        <h1 className="text-2xl font-bold mb-2">Umzugscheck – Sicher & Schweizerisch</h1>
        <p className="mb-4">Ihre Daten sind bei uns sicher. Schweizer Hosting, verschlüsselte Übertragung und geprüfte Anbieter.</p>
        <div className="flex flex-col gap-3 mb-6">
          <div className="bg-yellow-100 text-yellow-900 rounded-lg px-4 py-3 flex items-center gap-2">
            <span>🔒</span>
            <span>SwissSign Trust Service</span>
          </div>
          <div className="bg-yellow-100 text-yellow-900 rounded-lg px-4 py-3 flex items-center gap-2">
            <span>🇨🇭</span>
            <span>swiss made software</span>
          </div>
          <div className="bg-yellow-100 text-yellow-900 rounded-lg px-4 py-3 flex items-center gap-2">
            <span>🛡️</span>
            <span>CyberSeal (IT Security)</span>
          </div>
        </div>
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-2">Ihre Sicherheit bei uns:</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Schweizer Hosting & Datenschutz</li>
            <li>Verschlüsselte Datenübertragung</li>
            <li>Keine Weitergabe an Dritte</li>
            <li>Transparente Aufbewahrungsfristen</li>
          </ul>
        </div>
        <button className="w-full bg-yellow-700 text-white py-3 rounded-lg font-bold text-lg hover:bg-yellow-800 mb-4">Jetzt sicher vergleichen</button>
        <div className="text-xs text-gray-500 text-center">Ihre Daten bleiben in der Schweiz. Sicherheit garantiert.</div>
      </section>
    </main>
  );
}
