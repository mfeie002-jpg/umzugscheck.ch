import React from "react";

// Landing D: Ultimative, kombinierte Version – Best of all Feedbacks
export default function LandingTrustUltimate() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center p-4">
      <section className="w-full max-w-md mt-8">
        <h1 className="text-2xl font-bold mb-2">Umzugscheck – Die #1 für Vertrauen & Vergleich</h1>
        <p className="mb-4">Schweizer Umzugsfirmen, geprüft & sicher. Sofort verifizierbar, branchenzertifiziert, mit maximalem Datenschutz.</p>
        {/* Trust Strip */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex gap-2">
            <a href="https://www.zefix.ch" target="_blank" rel="noopener" className="bg-blue-100 text-blue-900 rounded-lg px-3 py-2 flex items-center gap-1 hover:bg-blue-200 text-sm">
              <span>🔎</span>
              <span>HR/UID geprüft</span>
            </a>
            <div className="bg-green-100 text-green-900 rounded-lg px-3 py-2 flex items-center gap-1 text-sm">
              <span>🏅</span>
              <span>SMA Mitglied</span>
            </div>
            <div className="bg-yellow-100 text-yellow-900 rounded-lg px-3 py-2 flex items-center gap-1 text-sm">
              <span>🔒</span>
              <span>DSG-konform</span>
            </div>
          </div>
        </div>
        {/* Collapsible Kontakt & Identität */}
        <details className="mb-4 bg-gray-50 border rounded-lg p-4">
          <summary className="font-semibold cursor-pointer">Kontakt & Identität</summary>
          <div className="mt-2 text-sm">
            <div>Umzugscheck.ch AG</div>
            <div>Beispielstrasse 1, 8000 Zürich</div>
            <div>Tel: 044 123 45 67</div>
            <div>Email: support@umzugscheck.ch</div>
            <div>Mo–Fr 09:00–17:00</div>
          </div>
        </details>
        {/* Trust Hub Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 mb-2">
            <button className="bg-blue-50 text-blue-900 rounded px-3 py-1 text-xs font-semibold">Behörden</button>
            <button className="bg-green-50 text-green-900 rounded px-3 py-1 text-xs font-semibold">Branche</button>
            <button className="bg-yellow-50 text-yellow-900 rounded px-3 py-1 text-xs font-semibold">Datenschutz</button>
          </div>
          <div className="text-xs text-gray-600">Hinweis: Logos zeigen Kompatibilität/Orientierung, keine amtliche Empfehlung.</div>
        </div>
        {/* 4-Step Verification */}
        <div className="bg-white border rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-2">So prüfen wir Umzugsfirmen</h2>
          <ol className="list-decimal pl-5 text-sm space-y-1">
            <li>HR/UID & Existenz geprüft</li>
            <li>Versicherung / Haftpflicht geprüft</li>
            <li>Zertifikate / Standards geprüft (falls vorhanden)</li>
            <li>Bewertungen / Referenzen geprüft</li>
          </ol>
        </div>
        {/* CTA */}
        <button className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-800 mb-4">Jetzt vergleichen & vertrauen</button>
        <div className="text-xs text-gray-500 text-center">Kostenlos, DSG-konform, keine versteckten Kosten. Ihre Daten bleiben in der Schweiz.</div>
      </section>
    </main>
  );
}
