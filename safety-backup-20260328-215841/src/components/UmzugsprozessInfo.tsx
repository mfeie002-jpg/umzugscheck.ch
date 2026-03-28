import React from "react";

export default function UmzugsprozessInfo() {
  return (
    <section className="bg-slate-50 border-t border-b border-slate-200 py-10 px-2 md:px-0">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Umzugsprozess in der Schweiz</h2>
        <div className="prose prose-sm md:prose lg:prose-lg max-w-none">
          <p>
            Der Umzugsprozess ("Zügeln") in der Schweiz ist gut geregelt und umfasst administrative, praktische und rechtliche Schritte. Je nachdem, ob du innerhalb der Schweiz umziehst oder aus dem Ausland in die Schweiz kommst, unterscheiden sich die Anforderungen. Die Prozesse sind effizient, oft digital (z. B. via <a href="https://www.eumzug.swiss/" target="_blank" rel="noopener noreferrer">eUmzugCH</a>), und zielen auf eine reibungslose Integration ab. In der Schweiz hast du in der Regel Anspruch auf einen freien Umzugstag bei deinem Arbeitgeber.
          </p>
          <h3>1. Umzug innerhalb der Schweiz</h3>
          <ul>
            <li><b>Vor dem Umzug (2–4 Wochen im Voraus):</b> Freien Tag beim Arbeitgeber beantragen, Ab-/Anmeldung bei Gemeinden (oft online via eUmzugCH), Versorger & Telekom informieren, Adressänderungen (Bank, Versicherungen, Post-Nachsendeauftrag), Parkplatz organisieren, Fahrzeug ummelden, Schule/Hund/Militär/AHV beachten, entrümpeln.</li>
            <li><b>Am Umzugstag:</b> Zählerstände ablesen, Umzugsfirma koordinieren, Kartons packen, Möbel schützen.</li>
            <li><b>Nach dem Umzug:</b> Einzugs-/Rückgabeprotokoll, Versicherungen anpassen, ggf. neue Krankenkasse, eUmzugCH nutzen.</li>
          </ul>
          <h3>2. Umzug in die Schweiz aus dem Ausland</h3>
          <ul>
            <li><b>Vorbereitung:</b> Aufenthaltserlaubnis beantragen, Wohnsitzverlegung nachweisen, Umzugsgut inventarisieren, Dokumente (Pass, Abmeldebescheinigung, Zollformular, Fahrzeugpapiere) zusammenstellen, ggf. Umzugsfirma beauftragen, Zollvorausmeldung.</li>
            <li><b>Bei der Einreise:</b> Zollabfertigung am Grenzübergang, Umzugsgut zollfrei bei Erfüllung der Bedingungen.</li>
            <li><b>Nach der Einreise:</b> Anmeldung bei der Gemeinde (innerhalb 14 Tagen), Krankenversicherung abschließen, Bankkonto eröffnen, Steuern/Führerschein/Auto ummelden, Schule/Haustiere anmelden.</li>
          </ul>
          <p className="mt-4 text-sm text-gray-500">Tipp: Nutze <a href="https://www.eumzug.swiss/" target="_blank" rel="noopener noreferrer">eUmzugCH</a> für digitale Ab- und Anmeldungen – das spart Zeit und ist in den meisten Kantonen verfügbar.</p>
        </div>
      </div>
    </section>
  );
}
