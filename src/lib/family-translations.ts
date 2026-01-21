/**
 * Family Page Translations - DE/BG
 * Complete translation support for the Family landing page
 */

export type FamilyLanguage = 'de' | 'bg';

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
    badge: "Für die Familie",
    title: "Was ich",
    titleHighlight: "baue",
    subtitle: "Eine einfache Erklärung für Mama, Papa und alle, die verstehen wollen, woran ich arbeite.",
  },
  stats: {
    since: "Seit",
    components: "Komponenten",
    pages: "Seiten",
    progress: "Fortschritt",
  },
  benefits: {
    title: "10 Vorteile für Kunden",
    subtitle: "Was unsere Nutzer bekommen – alles aus einer Hand, vollautomatisiert.",
  },
  footer: {
    moreDetails: "Noch Fragen? Hier gibt es mehr Details:",
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
    badge: "За семейството",
    title: "Какво",
    titleHighlight: "изграждам",
    subtitle: "Просто обяснение за мама, татко и всички, които искат да разберат върху какво работя.",
  },
  stats: {
    since: "От",
    components: "Компоненти",
    pages: "Страници",
    progress: "Напредък",
  },
  benefits: {
    title: "10 предимства за клиентите",
    subtitle: "Какво получават нашите потребители – всичко от едно място, напълно автоматизирано.",
  },
  footer: {
    moreDetails: "Още въпроси? Тук има повече подробности:",
    fullVision: "Вижте пълната визия",
    mainPage: "Към началната страница",
  },
};

export const familyTranslations: Record<FamilyLanguage, FamilyTranslations> = {
  de,
  bg,
};

export function getFamilyTranslation(lang: FamilyLanguage): FamilyTranslations {
  return familyTranslations[lang] || familyTranslations.de;
}
