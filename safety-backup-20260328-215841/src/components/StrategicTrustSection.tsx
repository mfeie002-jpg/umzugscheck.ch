import React from "react";

// Logo-Asset-Pfade (ggf. anpassen, falls Logos anders benannt/abgelegt sind)
const logos = {
  trustedShops: "/logos/trusted-shops-logo.svg",
  swissLabel: "/logos/Swiss_Label_Logo.svg",
  diePost: "/logos/post-logo.svg",
  astag: "/logos/ASTAG-Logo.png",
  eumzug: "/logos/eumzugch.png",
  mieterverband: "/logos/mieterverband-logo.svg",
  mobiliar: "/logos/die-mobiliar.svg",
  raiffeisen: "/logos/raiffeisen.svg",
  zkb: "/logos/zkb.svg",
  twint: "/logos/twint-logo.svg",
  swissHosting: "/logos/swiss-hosting.png",
};


// Psychologisch optimale Reihenfolge (horizontal, ggf. auf 2 Reihen umbrechen)
const trustLogos = [
  {
    logo: logos.trustedShops,
    label: "Trusted Shops",
    text: "Geld-zurück-Garantie",
    link: "https://www.trustedshops.ch/"
  },
  {
    logo: logos.swissLabel,
    label: "Swiss Label",
    text: "Schweizer Qualität (Mitglied)",
    link: "https://swisslabel.ch/"
  },
  {
    logo: logos.diePost,
    label: "Die Post",
    text: "Nachsendeauftrag einfach einrichten",
    link: "https://www.post.ch/de/empfangen/nachsenden-umleiten/nachsendeauftrag"
  },
  {
    logo: logos.astag,
    label: "ASTAG Schweiz",
    text: "Branchenverband für Transport",
    link: "https://www.astag.ch/"
  },
  {
    logo: logos.eumzug,
    label: "eUmzugCH",
    text: "Offizielle Umzugsmeldung digital",
    link: "https://www.eumzug.swiss/"
  },
  {
    logo: logos.mieterverband,
    label: "Mieterverband Schweiz",
    text: "Mieter-Schutz & Ressourcen",
    link: "https://www.mieterverband.ch/"
  },
  {
    logo: logos.mobiliar,
    label: "Die Mobiliar",
    text: "Versichert durch Mobiliar",
    link: "https://www.mobiliar.ch/"
  },
  {
    logo: logos.raiffeisen,
    label: "Raiffeisen",
    text: "Bankenpartner (MemberPlus)",
    link: "https://www.raiffeisen.ch/"
  },
  {
    logo: logos.zkb,
    label: "Zürcher Kantonalbank",
    text: "Lokale Bank Zürich",
    link: "https://www.zkb.ch/"
  },
  {
    logo: logos.twint,
    label: "TWINT",
    text: "Sichere Schweizer Zahlung",
    link: "https://www.twint.ch/"
  },
  {
    logo: logos.swissHosting,
    label: "Swiss Hosting",
    text: "Daten bleiben in der Schweiz",
    link: "https://swiss-hosting.com/"
  },
];


function TrustLogoGrid({ items }: { items: { logo: string; label: string; text: string; link: string }[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-10 gap-y-8 py-4">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center w-44 group"
        >
          <img
            src={item.logo}
            alt={item.label}
            width={240}
            height={80}
            className="h-20 w-auto mb-2 grayscale group-hover:grayscale-0 transition object-contain"
            loading="lazy"
          />
          <span className="font-semibold text-sm text-center">{item.label}</span>
          <span className="text-xs text-center text-gray-500">{item.text}</span>
        </a>
      ))}
    </div>
  );
}

export default function StrategicTrustSection() {
  return (
    <section className="bg-white border-t border-b border-gray-200 py-8 px-2 md:px-0">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Vertrauen durch starke Schweizer Partner</h2>
        <TrustLogoGrid items={trustLogos} />
      </div>
    </section>
  );
}
