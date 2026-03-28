import React from "react";

export default function ZuerichUmzugsdetails() {
  return (
    <section className="bg-white border-t border-b border-slate-200 py-10 px-2 md:px-0">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Zürcher Umzugsdetails</h2>
        <div className="prose prose-sm md:prose lg:prose-lg max-w-none">
          <p>
            Der Umzugsprozess ("Zügeln") in Zürich folgt den schweizerischen Vorgaben, ist aber durch kantonale und städtische Regelungen spezifiziert. Die Anmeldung muss innerhalb von 14 Tagen nach Einzug erfolgen, und es gibt Online-Optionen via <a href="https://www.eumzug.swiss/" target="_blank" rel="noopener noreferrer">eUmzugCH</a>. Für persönliche Fälle empfiehlt sich das Bevölkerungsamt der Stadt Zürich (+41 44 412 15 15).
          </p>
          <h3>1. Umzug innerhalb der Schweiz</h3>
          <ul>
            <li><b>Vor dem Umzug:</b> Abmeldung bei alter Gemeinde (persönlich oder online), Dokumente sammeln (Pass/ID, Ausländerausweis, Mietvertrag, Krankenversicherung, Zivilstandsdokumente), Parkplatz beantragen, Versorger/Telekom/Post informieren.</li>
            <li><b>Am Umzugstag:</b> Zählerstände ablesen, Parkgenehmigung organisieren.</li>
            <li><b>Nach dem Umzug:</b> Anmeldung online (eUmzugCH) oder persönlich (Personenmeldeamt), Gebühren zahlen (40 CHF/Erw.), Krankenversicherung nachweisen, Schule/Führerschein/Auto ummelden, Einzugsprotokoll erstellen.</li>
          </ul>
          <h3>2. Umzug aus dem Ausland nach Zürich</h3>
          <ul>
            <li><b>Vor dem Umzug:</b> Aufenthaltserlaubnis beantragen (Migrationsamt), Dokumente vorbereiten (Pass, Mietvertrag, Arbeitsvertrag, Visum, Zivilstandsdokumente, Krankenversicherung), Umzugsgut inventarisieren, Zollformular 18.44.</li>
            <li><b>Bei der Einreise:</b> Zollabfertigung am Grenzübergang.</li>
            <li><b>Nach dem Umzug:</b> Anmeldung beim Personenmeldeamt Süd (mit Termin), Gebühren zahlen, Krankenversicherung nachweisen, Bankkonto/Steuern/Haustiere anmelden, Integrationsangebote nutzen.</li>
          </ul>
          <p className="mt-4 text-sm text-gray-500">Tipp: Nutze <a href="https://www.eumzug.swiss/" target="_blank" rel="noopener noreferrer">eUmzugCH</a> für effiziente Online-Abwicklung. Für Integration: Welcome Desk oder ZüRAS nutzen. Bei Fragen: Bevölkerungsamt Zürich kontaktieren.</p>
        </div>
      </div>
    </section>
  );
}
