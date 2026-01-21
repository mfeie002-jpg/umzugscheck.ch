/**
 * Family Page Translations - DE/BG
 * Complete translation support for the Family landing page
 */

export type FamilyLanguage = 'de' | 'bg' | 'it';

export interface FamilyTranslations {
  header: {
    back: string;
    forFamily: string;
    fullVision: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
  };
  stats: {
    since: string;
    components: string;
    pages: string;
    progress: string;
  };
  benefits: {
    title: string;
    subtitle: string;
  };
  footer: {
    moreDetails: string;
    fullVision: string;
    mainPage: string;
  };
}

const de: FamilyTranslations = {
  header: {
    back: "Zurück",
    forFamily: "Für Familie",
    fullVision: "Vision",
  },
  hero: {
    badge: "#1 Umzugsplattform",
    title: "Die Beste",
    titleHighlight: "Lösung",
    subtitle: "Die fortschrittlichste Umzugsplattform der Schweiz. Kein Wettbewerber kommt heran.",
  },
  stats: {
    since: "Seit",
    components: "Komponenten",
    pages: "Seiten",
    progress: "Marktführer",
  },
  benefits: {
    title: "10 Gründe warum wir gewinnen",
    subtitle: "Was unsere Nutzer bekommen – besser als alles andere auf dem Markt.",
  },
  footer: {
    moreDetails: "Die vollständige Dominanz-Strategie:",
    fullVision: "Vollständige Vision ansehen",
    mainPage: "Zur Hauptseite",
  },
};

const bg: FamilyTranslations = {
  header: {
    back: "Назад",
    forFamily: "За семейството",
    fullVision: "Визия",
  },
  hero: {
    badge: "#1 Платформа за преместване",
    title: "Най-доброто",
    titleHighlight: "решение",
    subtitle: "Най-напредналата платформа за преместване в Швейцария. Никой конкурент не може да се приближи.",
  },
  stats: {
    since: "От",
    components: "Компоненти",
    pages: "Страници",
    progress: "Лидер на пазара",
  },
  benefits: {
    title: "10 причини защо печелим",
    subtitle: "Какво получават нашите потребители – по-добро от всичко друго на пазара.",
  },
  footer: {
    moreDetails: "Пълната стратегия за доминация:",
    fullVision: "Вижте пълната визия",
    mainPage: "Към началната страница",
  },
};

const it: FamilyTranslations = {
  header: {
    back: "Indietro",
    forFamily: "Per la Famiglia",
    fullVision: "Visione",
  },
  hero: {
    badge: "#1 Piattaforma Traslochi",
    title: "La Migliore",
    titleHighlight: "Soluzione",
    subtitle: "La piattaforma di trasloco più avanzata della Svizzera. Nessun concorrente può avvicinarsi.",
  },
  stats: {
    since: "Dal",
    components: "Componenti",
    pages: "Pagine",
    progress: "Leader di Mercato",
  },
  benefits: {
    title: "10 motivi per cui vinciamo",
    subtitle: "Cosa ottengono i nostri utenti – meglio di qualsiasi altra cosa sul mercato.",
  },
  footer: {
    moreDetails: "La strategia di dominio completa:",
    fullVision: "Vedi la visione completa",
    mainPage: "Alla pagina principale",
  },
};

export const familyTranslations: Record<FamilyLanguage, FamilyTranslations> = {
  de,
  bg,
  it,
};

export function getFamilyTranslation(lang: FamilyLanguage): FamilyTranslations {
  return familyTranslations[lang] || familyTranslations.de;
}
