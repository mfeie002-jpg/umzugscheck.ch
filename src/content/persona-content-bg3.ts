/**
 * Persona Content Pack - BG3 Martin (Gambling/Repair/E-bike/Beer/Dinosaurs)
 * 30 items per page: 5 sectionOpeners, 5 microTooltips, 5 ctaVariants, 5 interruptCards, 5 visualPrompts, 5 narratorLines
 */

import type { PersonaContentPack } from '@/lib/persona-types';

// ================================
// VISION PAGE - BG3 Martin
// ================================
export const bg3VisionContent: PersonaContentPack = {
  sectionOpeners: [
    { id: 'bg3-v-so1', sectionId: 'hero', text: 'Преместването е като хазарт – ние печелим винаги.', emoji: '🎰' },
    { id: 'bg3-v-so2', sectionId: 'features', text: 'Функции, здрави като ел. колело на баща ти.', emoji: '🚴' },
    { id: 'bg3-v-so3', sectionId: 'revenue', text: 'Приходите текат като бира 8.8%.', emoji: '🍺' },
    { id: 'bg3-v-so4', sectionId: 'team', text: 'Екипът е като синът ми – обича динозаври и победи.', emoji: '🦖' },
    { id: 'bg3-v-so5', sectionId: 'roadmap', text: 'Пътят е като ремонт – стъпка по стъпка.', emoji: '🔧' },
  ],
  microTooltips: [
    { id: 'bg3-v-mt1', targetId: 'revenue-kpi', text: 'Толкова печелим! Джакпот на всяко преместване.' },
    { id: 'bg3-v-mt2', targetId: 'margin-kpi', text: '90% марж. По-добре от всяко казино.' },
    { id: 'bg3-v-mt3', targetId: 'automation', text: 'AI работи. Аз пия бира.' },
    { id: 'bg3-v-mt4', targetId: 'escrow', text: 'Парите са като в сейф. Моят сейф.' },
    { id: 'bg3-v-mt5', targetId: 'video-scan', text: 'Сканираме всичко. Като добър механик.' },
  ],
  ctaVariants: [
    { id: 'bg3-v-cta1', label: 'Завърти Барабана', sublabel: '5 оферти = 5 шанса', hoverTease: 'Няма как да загубиш!' },
    { id: 'bg3-v-cta2', label: 'All In!', sublabel: 'Цялото преместване на нас', hoverTease: 'Покер лице не е нужно.' },
    { id: 'bg3-v-cta3', label: 'Ремонтирай Живота', sublabel: 'Нов дом, нов старт', hoverTease: 'Имам инструментите.' },
    { id: 'bg3-v-cta4', label: 'Яхни E-Bike', sublabel: 'Бързо като ток', hoverTease: 'До новия дом за минути!' },
    { id: 'bg3-v-cta5', label: 'Отвори Бира', sublabel: 'И виж офертите', hoverTease: '8.8% щастие гарантирано.' },
  ],
  interruptCards: [
    { id: 'bg3-v-ic1', title: 'Мартин Казва:', body: 'Преместването е като слот машина – натисни и чакай награда.', emoji: '🎰', truthNugget: '5 оферти за 2 минути. Джакпот!', afterSection: 'hero' },
    { id: 'bg3-v-ic2', title: 'E-Bike Философия', body: 'Защо да ходиш, като можеш да караш електрически?', emoji: '⚡', truthNugget: 'Автоматизацията спестява 95% от работата.', afterSection: 'features' },
    { id: 'bg3-v-ic3', title: 'Бира Мъдрост', body: 'Добрата бира е 8.8%. Добрият марж е 90%.', emoji: '🍺', truthNugget: 'И двете имаме.', afterSection: 'revenue' },
    { id: 'bg3-v-ic4', title: 'Динозаври!', body: 'Синът ми казва: "Татко, ти си като T-Rex в бизнеса!"', emoji: '🦖', truthNugget: 'Доминираме пазара като динозаври.', afterSection: 'team' },
    { id: 'bg3-v-ic5', title: 'Ремонтна Истина', body: 'Всичко може да се оправи. С правилните инструменти.', emoji: '🔧', truthNugget: 'Платформата ни решава всеки проблем.', afterSection: 'roadmap' },
  ],
  visualPrompts: [
    { id: 'bg3-v-vp1', imagePrompt: 'Слот машина с иконки на камиони и кашони', styleNotes: 'Казино стил, ярки цветове', altText: 'Слот машина за преместване', whereToUse: 'hero' },
    { id: 'bg3-v-vp2', imagePrompt: 'Електрическо колело, натоварено с кашони', styleNotes: 'Футуристичен хумор', altText: 'E-bike с кашони', whereToUse: 'features' },
    { id: 'bg3-v-vp3', imagePrompt: 'Кен бира до финансова графика', styleNotes: 'Релаксиран успех', altText: 'Бира и печалби', whereToUse: 'revenue' },
    { id: 'bg3-v-vp4', imagePrompt: 'Малко момче с динозавър играчка до кашони', styleNotes: 'Сладък семеен момент', altText: 'Динозавър и преместване', whereToUse: 'team' },
    { id: 'bg3-v-vp5', imagePrompt: 'Мъж с инструменти, ремонтиращ камион за преместване', styleNotes: 'Практичен хумор', altText: 'Ремонтен майстор', whereToUse: 'roadmap' },
  ],
  narratorLines: [
    { id: 'bg3-v-nl1', text: '🎰 Всяко преместване е джакпот!' },
    { id: 'bg3-v-nl2', text: '🍺 Време за бира. И оферти.' },
    { id: 'bg3-v-nl3', text: '🦖 Синът ми казва: "RAAAWR!"' },
    { id: 'bg3-v-nl4', text: '🔧 Мога да оправя всичко. Дори преместването ти.' },
    { id: 'bg3-v-nl5', text: '⚡ E-bike е бъдещето. И настоящето.' },
  ],
};

// ================================
// FAMILY PAGE - BG3 Martin
// ================================
export const bg3FamilyContent: PersonaContentPack = {
  sectionOpeners: [
    { id: 'bg3-f-so1', sectionId: 'hero', text: 'Семейството е като добра ръка на покер – пазиш я.', emoji: '🃏' },
    { id: 'bg3-f-so2', sectionId: 'benefits', text: 'Ползите са като бонус на слот – изненадващи!', emoji: '🎁' },
    { id: 'bg3-f-so3', sectionId: 'how-it-works', text: 'Работи като e-bike – натисни и карай.', emoji: '🚴' },
    { id: 'bg3-f-so4', sectionId: 'security', text: 'Сигурността е като здрава ключалка – аз я монтирам.', emoji: '🔐' },
    { id: 'bg3-f-so5', sectionId: 'support', text: 'Подкрепата е като добра бира – винаги е нужна.', emoji: '🍻' },
  ],
  microTooltips: [
    { id: 'bg3-f-mt1', targetId: 'simple', text: 'По-лесно от сглобяване на IKEA мебел.' },
    { id: 'bg3-f-mt2', targetId: 'safe', text: 'Сигурно като сейф. Мой сейф.' },
    { id: 'bg3-f-mt3', targetId: 'fast', text: 'По-бързо от e-bike на макс скорост.' },
    { id: 'bg3-f-mt4', targetId: 'support', text: 'Подкрепа 24/7. Като мен за семейството.' },
    { id: 'bg3-f-mt5', targetId: 'price', text: 'Честна цена. Без блъф.' },
  ],
  ctaVariants: [
    { id: 'bg3-f-cta1', label: 'Залагай на Семейството', sublabel: 'Най-сигурната инвестиция', hoverTease: 'Този залог печели винаги.' },
    { id: 'bg3-f-cta2', label: 'Карай Напред', sublabel: 'С e-bike скорост', hoverTease: 'Батерията е заредена!' },
    { id: 'bg3-f-cta3', label: 'Ремонтирай Бъдещето', sublabel: 'Нов дом за семейството', hoverTease: 'Имам всички инструменти.' },
    { id: 'bg3-f-cta4', label: 'Отвори Бира', sublabel: 'И виж офертите', hoverTease: '8.8% от щастието.' },
    { id: 'bg3-f-cta5', label: 'Динозавърско Преместване', sublabel: 'Синът ми одобрява', hoverTease: 'RAAAWR!' },
  ],
  interruptCards: [
    { id: 'bg3-f-ic1', title: 'Татко Мартин', body: 'За семейството не се блъфира. Залагам на сигурното.', emoji: '👨‍👦', truthNugget: 'Застраховка включена във всяка оферта.', afterSection: 'hero' },
    { id: 'bg3-f-ic2', title: 'E-Bike за Всички', body: 'Целото семейство кара електрически. Бъдещето е сега.', emoji: '⚡', truthNugget: 'Екологично преместване с ниски емисии.', afterSection: 'benefits' },
    { id: 'bg3-f-ic3', title: 'Ремонтна Философия', body: 'Ако е счупено – оправям го. Ако не е – подобрявам го.', emoji: '🔧', truthNugget: 'Постоянно подобряваме услугата.', afterSection: 'how-it-works' },
    { id: 'bg3-f-ic4', title: 'Бира Пауза', body: 'След преместване – заслужена бира с 8.8%.', emoji: '🍺', truthNugget: 'Празнувай успешното преместване!', afterSection: 'security' },
    { id: 'bg3-f-ic5', title: 'Динозавърски Съвет', body: 'Синът ми казва: "T-Rex не се страхува от преместване!"', emoji: '🦕', truthNugget: 'Децата се адаптират бързо към нов дом.', afterSection: 'support' },
  ],
  visualPrompts: [
    { id: 'bg3-f-vp1', imagePrompt: 'Баща и син на e-bike, влачат ремарке с кашони', styleNotes: 'Весел семеен момент', altText: 'E-bike семейство', whereToUse: 'hero' },
    { id: 'bg3-f-vp2', imagePrompt: 'Момче с динозавър играчка, разопакова кашон', styleNotes: 'Сладък детски момент', altText: 'Дете с динозавър', whereToUse: 'benefits' },
    { id: 'bg3-f-vp3', imagePrompt: 'Мъж ремонтира мебели в нов дом', styleNotes: 'Практичен татко', altText: 'Ремонт в новия дом', whereToUse: 'how-it-works' },
    { id: 'bg3-f-vp4', imagePrompt: 'Семейство с бира и лимонада празнува', styleNotes: 'Топъл семеен момент', altText: 'Семейно празнуване', whereToUse: 'security' },
    { id: 'bg3-f-vp5', imagePrompt: 'Детска стая с динозаври в новия дом', styleNotes: 'Уютен детски свят', altText: 'Динозавърска стая', whereToUse: 'support' },
  ],
  narratorLines: [
    { id: 'bg3-f-nl1', text: '👨‍👦 За семейството – всичко.' },
    { id: 'bg3-f-nl2', text: '🦖 Синът ми казва: "Татко е най-добрият!"' },
    { id: 'bg3-f-nl3', text: '🔧 Мога да оправя всичко. Наистина.' },
    { id: 'bg3-f-nl4', text: '🍺 Време за заслужена бира!' },
    { id: 'bg3-f-nl5', text: '⚡ E-bike е животът!' },
  ],
};

// ================================
// INVESTOREN PAGE - BG3 Martin
// ================================
export const bg3InvestorenContent: PersonaContentPack = {
  sectionOpeners: [
    { id: 'bg3-i-so1', sectionId: 'hero', text: 'Инвестицията е като покер – блъфът не работи тук.', emoji: '♠️' },
    { id: 'bg3-i-so2', sectionId: 'market', text: 'Пазарът е като казино – ние сме къщата.', emoji: '🏠' },
    { id: 'bg3-i-so3', sectionId: 'numbers', text: 'Числата не лъжат. Като одометъра на e-bike.', emoji: '📊' },
    { id: 'bg3-i-so4', sectionId: 'team', text: 'Екипът е солиден. Като мой ремонт.', emoji: '💪' },
    { id: 'bg3-i-so5', sectionId: 'exit', text: 'Изходът е джакпот. Планираме го.', emoji: '🎰' },
  ],
  microTooltips: [
    { id: 'bg3-i-mt1', targetId: 'roi', text: 'Възвръщаемост, по-добра от слот машина.' },
    { id: 'bg3-i-mt2', targetId: 'market-size', text: 'Голям пот. Печелим го.' },
    { id: 'bg3-i-mt3', targetId: 'growth', text: 'Растем като батерия на e-bike – стабилно.' },
    { id: 'bg3-i-mt4', targetId: 'risk', text: 'Рискът е изчислен. Не блъфирам.' },
    { id: 'bg3-i-mt5', targetId: 'team', text: 'Екип от ремонтни майстори на бизнеса.' },
  ],
  ctaVariants: [
    { id: 'bg3-i-cta1', label: 'All In!', sublabel: 'Влез в играта', hoverTease: 'Картите са ти.' },
    { id: 'bg3-i-cta2', label: 'Завърти за Успех', sublabel: 'Джакпот очаква', hoverTease: '🎰🎰🎰' },
    { id: 'bg3-i-cta3', label: 'Ремонтирай Портфолиото', sublabel: 'С нашата инвестиция', hoverTease: 'Имам инструментите.' },
    { id: 'bg3-i-cta4', label: 'Електрифицирай', sublabel: 'Бъдещето е електрическо', hoverTease: '⚡ Зареди портфолиото!' },
    { id: 'bg3-i-cta5', label: 'Бира Среща', sublabel: 'Обсъждаме при 8.8%', hoverTease: 'Най-добрите сделки са при бира.' },
  ],
  interruptCards: [
    { id: 'bg3-i-ic1', title: 'Покер Лице на Бизнеса', body: 'Не блъфирам. Числата говорят.', emoji: '🃏', truthNugget: 'CHF 553 на клиент. Реални пари.', afterSection: 'hero' },
    { id: 'bg3-i-ic2', title: 'Къщата Винаги Печели', body: 'Но ние сме къщата. Ти печелиш с нас.', emoji: '🏠', truthNugget: 'Доминираме 12% от пазара.', afterSection: 'market' },
    { id: 'bg3-i-ic3', title: 'E-Bike Икономика', body: 'Като електрическо колело – ефективно и бързо.', emoji: '🚴', truthNugget: '95% автоматизация = ниски разходи.', afterSection: 'numbers' },
    { id: 'bg3-i-ic4', title: 'Ремонт на Пазара', body: 'Пазарът беше счупен. Ние го оправихме.', emoji: '🔧', truthNugget: 'Революционна платформа с 10 потока.', afterSection: 'team' },
    { id: 'bg3-i-ic5', title: 'Джакпот Exit', body: 'Изходната стратегия е като джакпот – планирана.', emoji: '💰', truthNugget: 'IPO или M&A – готови сме.', afterSection: 'exit' },
  ],
  visualPrompts: [
    { id: 'bg3-i-vp1', imagePrompt: 'Покер маса с графики вместо карти', styleNotes: 'Бизнес казино стил', altText: 'Бизнес покер', whereToUse: 'hero' },
    { id: 'bg3-i-vp2', imagePrompt: 'Казино рулетка с иконки на недвижими имоти', styleNotes: 'Инвестиционен хумор', altText: 'Инвестиционна рулетка', whereToUse: 'market' },
    { id: 'bg3-i-vp3', imagePrompt: 'E-bike с кош, пълен с пари', styleNotes: 'Успешен инвеститор', altText: 'E-bike с пари', whereToUse: 'numbers' },
    { id: 'bg3-i-vp4', imagePrompt: 'Механик в костюм ремонтира графика', styleNotes: 'Бизнес ремонтник', altText: 'Бизнес механик', whereToUse: 'team' },
    { id: 'bg3-i-vp5', imagePrompt: 'Слот машина с "777" и надпис EXIT', styleNotes: 'Триумфален джакпот', altText: 'Exit джакпот', whereToUse: 'exit' },
  ],
  narratorLines: [
    { id: 'bg3-i-nl1', text: '🃏 Не блъфирам. Никога.' },
    { id: 'bg3-i-nl2', text: '🎰 Джакпот е близо!' },
    { id: 'bg3-i-nl3', text: '🔧 Мога да оправя всеки бизнес проблем.' },
    { id: 'bg3-i-nl4', text: '⚡ Електрическото бъдеще е тук.' },
    { id: 'bg3-i-nl5', text: '🍺 Една бира и обсъждаме инвестицията.' },
  ],
};
