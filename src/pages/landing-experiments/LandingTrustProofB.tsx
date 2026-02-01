import React from "react";

// Landing B: Fokus auf Branchen-Qualität, Verbände, Gütesiegel
export default function LandingTrustProofB() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center p-4">
      <section className="w-full max-w-md mt-8">
        <h1 className="text-2xl font-bold mb-2">Umzugscheck – Qualität durch Branchenstandards</h1>
        <p className="mb-4">Vergleichen Sie nur Firmen, die Mitglied bei anerkannten Schweizer Verbänden sind und strenge Qualitätskriterien erfüllen.</p>
        <div className="flex flex-col gap-3 mb-6">
          <div className="bg-green-100 text-green-900 rounded-lg px-4 py-3 flex items-center gap-2">
            <span>🏅</span>
            <span>Swiss Movers Association (SMA)</span>
          </div>
          <div className="bg-green-100 text-green-900 rounded-lg px-4 py-3 flex items-center gap-2">
            <span>🌍</span>
            <span>FIDI Global Alliance</span>
          </div>
          <div className="bg-green-100 text-green-900 rounded-lg px-4 py-3 flex items-center gap-2">
            <span>🛡️</span>
            <span>Swiss Online Garantie</span>
          </div>
        </div>
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-2">Unsere Qualitätsmechanik:</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Mitgliedschaft in Branchenverbänden</li>
            <li>Regelmässige Audits & Zertifikate</li>
            <li>Schweizer Konsumentenschutz</li>
            <li>Transparente Bewertungen & Referenzen</li>
          </ul>
        </div>
        <button className="w-full bg-green-700 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-800 mb-4">Jetzt geprüfte Firmen finden</button>
        <div className="text-xs text-gray-500 text-center">Nur zertifizierte Anbieter. Keine Abzocke, keine Überraschungen.</div>
      </section>
    </main>
  );
}
