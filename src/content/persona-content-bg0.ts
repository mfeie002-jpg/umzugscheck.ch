/**
 * Persona Content Pack - BG0 (Neutral Bulgarian - minimal professional microcopy)
 * 20-30 neutral improvements only, no jokes
 */

import type { PersonaContentPack } from '@/lib/persona-types';

// ================================
// VISION PAGE - BG0 Neutral
// ================================
export const bg0VisionContent: PersonaContentPack = {
  sectionOpeners: [
    { id: 'bg0-v-so1', sectionId: 'hero', text: 'Добре дошли в бъдещето на преместванията.', emoji: '🏠' },
    { id: 'bg0-v-so2', sectionId: 'features', text: 'Иновативни решения за модерно преместване.', emoji: '✨' },
    { id: 'bg0-v-so3', sectionId: 'revenue', text: 'Устойчив бизнес модел с доказани резултати.', emoji: '📈' },
    { id: 'bg0-v-so4', sectionId: 'team', text: 'Опитен екип от професионалисти.', emoji: '👥' },
    { id: 'bg0-v-so5', sectionId: 'roadmap', text: 'Ясен път към успеха.', emoji: '🗺️' },
  ],
  microTooltips: [
    { id: 'bg0-v-mt1', targetId: 'revenue-kpi', text: 'Средна печалба на клиент.' },
    { id: 'bg0-v-mt2', targetId: 'margin-kpi', text: 'Висок марж благодарение на автоматизацията.' },
    { id: 'bg0-v-mt3', targetId: 'automation', text: '95% от процесите са автоматизирани.' },
    { id: 'bg0-v-mt4', targetId: 'escrow', text: 'Защитени плащания чрез escrow система.' },
    { id: 'bg0-v-mt5', targetId: 'video-scan', text: 'AI видео анализ за точна оценка.' },
  ],
  ctaVariants: [
    { id: 'bg0-v-cta1', label: 'Получи Оферти', sublabel: 'Безплатно и без ангажимент', hoverTease: '5 оферти за минути.' },
    { id: 'bg0-v-cta2', label: 'Научи Повече', sublabel: 'Разгледай нашите услуги', hoverTease: 'Пълна информация.' },
    { id: 'bg0-v-cta3', label: 'Свържи се', sublabel: 'Говори с експерт', hoverTease: 'Бърз отговор.' },
    { id: 'bg0-v-cta4', label: 'Виж Как Работи', sublabel: 'Прост 3-стъпков процес', hoverTease: 'Лесно и бързо.' },
    { id: 'bg0-v-cta5', label: 'Започни Сега', sublabel: 'Твоят нов дом чака', hoverTease: 'Без стрес.' },
  ],
  interruptCards: [
    { id: 'bg0-v-ic1', title: 'Защо Ние?', body: 'Комбинираме технология и човешки подход за перфектно преместване.', emoji: '🎯', truthNugget: 'Над 1000 успешни премествания.', afterSection: 'hero' },
    { id: 'bg0-v-ic2', title: 'Нашата Мисия', body: 'Да направим преместването лесно и достъпно за всеки.', emoji: '🌟', truthNugget: 'Клиентите спестяват средно 40%.', afterSection: 'features' },
    { id: 'bg0-v-ic3', title: 'Качество и Сигурност', body: 'Работим само с проверени и застраховани фирми.', emoji: '✅', truthNugget: 'Всички партньори са сертифицирани.', afterSection: 'revenue' },
    { id: 'bg0-v-ic4', title: 'Поддръжка 24/7', body: 'Винаги сме на разположение за въпроси и помощ.', emoji: '📞', truthNugget: 'Среден отговор под 15 минути.', afterSection: 'team' },
    { id: 'bg0-v-ic5', title: 'Бъдещето е Тук', body: 'AI технологии за по-добро изживяване.', emoji: '🚀', truthNugget: '95% автоматизация на процесите.', afterSection: 'roadmap' },
  ],
  visualPrompts: [],
  narratorLines: [],
};

// ================================
// FAMILY PAGE - BG0 Neutral
// ================================
export const bg0FamilyContent: PersonaContentPack = {
  sectionOpeners: [
    { id: 'bg0-f-so1', sectionId: 'hero', text: 'Преместване без стрес за цялото семейство.', emoji: '👨‍👩‍👧‍👦' },
    { id: 'bg0-f-so2', sectionId: 'benefits', text: 'Ползи, които правят разликата.', emoji: '✨' },
    { id: 'bg0-f-so3', sectionId: 'how-it-works', text: 'Лесен процес в три стъпки.', emoji: '📋' },
    { id: 'bg0-f-so4', sectionId: 'security', text: 'Сигурност на първо място.', emoji: '🔒' },
    { id: 'bg0-f-so5', sectionId: 'support', text: 'Подкрепа на всяка стъпка.', emoji: '🤝' },
  ],
  microTooltips: [
    { id: 'bg0-f-mt1', targetId: 'simple', text: 'Интуитивен интерфейс за всеки.' },
    { id: 'bg0-f-mt2', targetId: 'safe', text: 'Застрахователна защита включена.' },
    { id: 'bg0-f-mt3', targetId: 'fast', text: '5 оферти за под 2 минути.' },
    { id: 'bg0-f-mt4', targetId: 'support', text: 'Екип на разположение 24/7.' },
    { id: 'bg0-f-mt5', targetId: 'price', text: 'Прозрачни цени без скрити такси.' },
  ],
  ctaVariants: [
    { id: 'bg0-f-cta1', label: 'Започни', sublabel: 'Безплатна оценка', hoverTease: 'Без ангажимент.' },
    { id: 'bg0-f-cta2', label: 'Научи Повече', sublabel: 'Пълна информация', hoverTease: 'Всички детайли.' },
    { id: 'bg0-f-cta3', label: 'Свържи се', sublabel: 'Говори с нас', hoverTease: 'Бързо и лесно.' },
    { id: 'bg0-f-cta4', label: 'Виж Оферти', sublabel: 'Сравни цени', hoverTease: 'Спести време.' },
    { id: 'bg0-f-cta5', label: 'Обади се', sublabel: 'Директна линия', hoverTease: 'Винаги на разположение.' },
  ],
  interruptCards: [
    { id: 'bg0-f-ic1', title: 'За Семейството', body: 'Разбираме колко е важен спокойният преход към нов дом.', emoji: '❤️', truthNugget: '98% от семействата ни препоръчват.', afterSection: 'hero' },
    { id: 'bg0-f-ic2', title: 'Прозрачност', body: 'Никакви скрити такси или изненади.', emoji: '💎', truthNugget: 'Всичко е ясно от началото.', afterSection: 'benefits' },
    { id: 'bg0-f-ic3', title: 'Професионализъм', body: 'Работим само с проверени партньори.', emoji: '✅', truthNugget: 'Всички фирми са сертифицирани.', afterSection: 'how-it-works' },
    { id: 'bg0-f-ic4', title: 'Защита', body: 'Пълна застраховка на всички вещи.', emoji: '🛡️', truthNugget: 'Включена в цената.', afterSection: 'security' },
    { id: 'bg0-f-ic5', title: 'Подкрепа', body: 'Нашият екип е до вас на всяка стъпка.', emoji: '🤝', truthNugget: 'Отговаряме за под 15 минути.', afterSection: 'support' },
  ],
  visualPrompts: [],
  narratorLines: [],
};

// ================================
// INVESTOREN PAGE - BG0 Neutral
// ================================
export const bg0InvestorenContent: PersonaContentPack = {
  sectionOpeners: [
    { id: 'bg0-i-so1', sectionId: 'hero', text: 'Инвестиционна възможност в растящ пазар.', emoji: '📈' },
    { id: 'bg0-i-so2', sectionId: 'market', text: 'Швейцарският пазар за преместване.', emoji: '🇨🇭' },
    { id: 'bg0-i-so3', sectionId: 'numbers', text: 'Финансови резултати и прогнози.', emoji: '📊' },
    { id: 'bg0-i-so4', sectionId: 'team', text: 'Опитен управленски екип.', emoji: '👥' },
    { id: 'bg0-i-so5', sectionId: 'exit', text: 'Ясна изходна стратегия.', emoji: '🎯' },
  ],
  microTooltips: [
    { id: 'bg0-i-mt1', targetId: 'roi', text: 'Очаквана възвръщаемост на инвестицията.' },
    { id: 'bg0-i-mt2', targetId: 'market-size', text: 'Общ размер на адресируемия пазар.' },
    { id: 'bg0-i-mt3', targetId: 'growth', text: 'Прогнозиран темп на растеж.' },
    { id: 'bg0-i-mt4', targetId: 'risk', text: 'Оценка на рисковите фактори.' },
    { id: 'bg0-i-mt5', targetId: 'team', text: 'Опит на управленския екип.' },
  ],
  ctaVariants: [
    { id: 'bg0-i-cta1', label: 'Инвестирай', sublabel: 'Разгледай възможностите', hoverTease: 'Детайлна информация.' },
    { id: 'bg0-i-cta2', label: 'Изтегли Deck', sublabel: 'Пълна презентация', hoverTease: 'PDF формат.' },
    { id: 'bg0-i-cta3', label: 'Запази Среща', sublabel: 'Говори с основателите', hoverTease: 'Директен разговор.' },
    { id: 'bg0-i-cta4', label: 'Виж Числата', sublabel: 'Финансови данни', hoverTease: 'Прозрачност.' },
    { id: 'bg0-i-cta5', label: 'Свържи се', sublabel: 'Задай въпрос', hoverTease: 'Бърз отговор.' },
  ],
  interruptCards: [
    { id: 'bg0-i-ic1', title: 'Пазарна Възможност', body: 'Швейцарският пазар за преместване е на стойност CHF 420M.', emoji: '💰', truthNugget: 'Растящ с 5% годишно.', afterSection: 'hero' },
    { id: 'bg0-i-ic2', title: 'Конкурентно Предимство', body: '10 различни потока на приходи за стабилност.', emoji: '🎯', truthNugget: 'Диверсифициран бизнес модел.', afterSection: 'market' },
    { id: 'bg0-i-ic3', title: 'Високи Маржове', body: '90% бруто марж благодарение на автоматизацията.', emoji: '📈', truthNugget: 'Мащабируем модел.', afterSection: 'numbers' },
    { id: 'bg0-i-ic4', title: 'Опитен Екип', body: 'Професионалисти от водещи технологични компании.', emoji: '👥', truthNugget: 'Доказан track record.', afterSection: 'team' },
    { id: 'bg0-i-ic5', title: 'Exit Стратегия', body: 'IPO или придобиване са реалистични опции.', emoji: '🚀', truthNugget: 'Времева рамка: 3-5 години.', afterSection: 'exit' },
  ],
  visualPrompts: [],
  narratorLines: [],
};
