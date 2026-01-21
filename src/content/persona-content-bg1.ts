/**
 * Persona Content Pack - BG1 Dimitar (Boxing/Detective/Paranoia)
 * 30 items per page: 5 sectionOpeners, 5 microTooltips, 5 ctaVariants, 5 interruptCards, 5 visualPrompts, 5 narratorLines
 */

import type { PersonaContentPack } from '@/lib/persona-types';

// ================================
// VISION PAGE - BG1 Dimitar
// ================================
export const bg1VisionContent: PersonaContentPack = {
  sectionOpeners: [
    { id: 'bg1-v-so1', sectionId: 'hero', text: 'Добре дошли в ринга на преместванията. Тук няма бягане.', emoji: '🥊' },
    { id: 'bg1-v-so2', sectionId: 'features', text: 'Докато другите се крият, ние атакуваме директно.', emoji: '👊' },
    { id: 'bg1-v-so3', sectionId: 'revenue', text: 'Парите се броят след удара. А ние удряме здраво.', emoji: '💰' },
    { id: 'bg1-v-so4', sectionId: 'team', text: 'Отборът ни е като боксов клуб – всеки знае ролята си.', emoji: '🏆' },
    { id: 'bg1-v-so5', sectionId: 'roadmap', text: 'Пътят към победата минава през много рундове.', emoji: '🛤️' },
  ],
  microTooltips: [
    { id: 'bg1-v-mt1', targetId: 'revenue-kpi', text: 'Толкова печелим на мач... искам да кажа, на преместване.' },
    { id: 'bg1-v-mt2', targetId: 'margin-kpi', text: 'Чиста печалба. Като чиста победа с нокаут.' },
    { id: 'bg1-v-mt3', targetId: 'automation', text: 'Роботите не ходят на разпити. Просто работят.' },
    { id: 'bg1-v-mt4', targetId: 'escrow', text: 'Парите са на сигурно. Никой не ги пипа без разрешение.' },
    { id: 'bg1-v-mt5', targetId: 'video-scan', text: 'Сканираме за скрити камери... и мебели.' },
  ],
  ctaVariants: [
    { id: 'bg1-v-cta1', label: 'Влез в Ринга', sublabel: 'Първият рунд е безплатен', hoverTease: 'Не се притеснявай, няма да боли... много.' },
    { id: 'bg1-v-cta2', label: 'Започни Битката', sublabel: 'Преместването е бой – ние печелим', hoverTease: 'Хванах те да се колебаеш!' },
    { id: 'bg1-v-cta3', label: 'Провери Тила Си', sublabel: 'Никой не те следи... освен ние', hoverTease: 'Само шегувам се. Или не?' },
    { id: 'bg1-v-cta4', label: 'Удари Първи', sublabel: 'Получи 5 оферти за секунди', hoverTease: 'Бързо като джеб!' },
    { id: 'bg1-v-cta5', label: 'Нокаутирай Конкуренцията', sublabel: 'Сравни и победи', hoverTease: 'Те дори няма да разберат какво ги удари.' },
  ],
  interruptCards: [
    { id: 'bg1-v-ic1', title: 'Тренировка за Преместване', body: 'Всяко преместване е като подготовка за мач. Трябва план, издръжливост и добър ъгъл.', emoji: '🏋️', truthNugget: 'Добрата подготовка спестява 40% стрес.', afterSection: 'hero' },
    { id: 'bg1-v-ic2', title: 'Защо Скоростта е Важна', body: 'В ринга бавният губи. При преместване – плаща повече.', emoji: '⚡', truthNugget: 'Нашият AI анализира за 2 минути.', afterSection: 'features' },
    { id: 'bg1-v-ic3', title: 'Димитър Казва:', body: 'Винаги карам точно на ограничението. И при преместване – без изненади.', emoji: '🚗', truthNugget: 'Прозрачни цени без скрити такси.', afterSection: 'revenue' },
    { id: 'bg1-v-ic4', title: 'Паста и Планиране', body: 'Ям веднъж-два пъти на ден. Планирам преместването – веднъж завинаги.', emoji: '🍝', truthNugget: 'Едно добро планиране = нула главоболия.', afterSection: 'team' },
    { id: 'bg1-v-ic5', title: 'Лотото на Преместването', body: 'Понякога играя лото. Но при избор на фирма – не разчитам на късмет.', emoji: '🎰', truthNugget: 'Само проверени фирми с рейтинг 4.5+.', afterSection: 'roadmap' },
  ],
  visualPrompts: [
    { id: 'bg1-v-vp1', imagePrompt: 'Боксьор с ръкавици, който държи кашони за преместване', styleNotes: 'Комичен стил, динамична поза', altText: 'Боксьор пренася кашони', whereToUse: 'hero' },
    { id: 'bg1-v-vp2', imagePrompt: 'Детектив с лупа, разглеждащ мебели', styleNotes: 'Noir стил, драматично осветление', altText: 'Детектив проверява обзавеждане', whereToUse: 'features' },
    { id: 'bg1-v-vp3', imagePrompt: 'Камион за преместване, маскиран като полицейска кола', styleNotes: 'Хумористичен, карикатурен', altText: 'Камион-полиция', whereToUse: 'trust' },
    { id: 'bg1-v-vp4', imagePrompt: 'Човек, който се оглежда подозрително докато пакетира', styleNotes: 'Параноичен хумор', altText: 'Подозрителен пакетиращ', whereToUse: 'process' },
    { id: 'bg1-v-vp5', imagePrompt: 'Боксов ринг с кашони вместо хора', styleNotes: 'Сюрреалистичен хумор', altText: 'Ринг с кашони', whereToUse: 'comparison' },
  ],
  narratorLines: [
    { id: 'bg1-v-nl1', text: '🥊 Внимавай, някой може да гледа...' },
    { id: 'bg1-v-nl2', text: '👀 Провери зад гърба си. Шегувам се.' },
    { id: 'bg1-v-nl3', text: '🏃 Бягането не е опция. Преместването е.' },
    { id: 'bg1-v-nl4', text: '💪 Тренирам всеки ден. Ти кога се местиш?' },
    { id: 'bg1-v-nl5', text: '🍝 Време е за паста... след като приключим.' },
  ],
};

// ================================
// FAMILY PAGE - BG1 Dimitar
// ================================
export const bg1FamilyContent: PersonaContentPack = {
  sectionOpeners: [
    { id: 'bg1-f-so1', sectionId: 'hero', text: 'Семейството е като боксов отбор – пазим се взаимно.', emoji: '👨‍👩‍👧' },
    { id: 'bg1-f-so2', sectionId: 'benefits', text: 'Ползите са ясни като удар в челюстта.', emoji: '✨' },
    { id: 'bg1-f-so3', sectionId: 'how-it-works', text: 'Работим тихо, но ефективно. Като добър детектив.', emoji: '🔍' },
    { id: 'bg1-f-so4', sectionId: 'security', text: 'Сигурността е приоритет. Никой не влиза без покана.', emoji: '🔒' },
    { id: 'bg1-f-so5', sectionId: 'support', text: 'Винаги съм готов да помогна. Дори в 3 сутринта.', emoji: '🌙' },
  ],
  microTooltips: [
    { id: 'bg1-f-mt1', targetId: 'simple', text: 'Толкова просто, че дори мама ще разбере.' },
    { id: 'bg1-f-mt2', targetId: 'safe', text: 'По-сигурно от сейф в швейцарска банка.' },
    { id: 'bg1-f-mt3', targetId: 'fast', text: 'По-бързо от моя джогинг.' },
    { id: 'bg1-f-mt4', targetId: 'support', text: 'Обадете се, дори ако просто искате да поговорите.' },
    { id: 'bg1-f-mt5', targetId: 'price', text: 'Честна цена. Без скрити удари под кръста.' },
  ],
  ctaVariants: [
    { id: 'bg1-f-cta1', label: 'Защити Семейството', sublabel: 'Преместване без стрес', hoverTease: 'Димитър одобрява.' },
    { id: 'bg1-f-cta2', label: 'Започни Сега', sublabel: 'Бързо и безопасно', hoverTease: 'Проверих – чисто е.' },
    { id: 'bg1-f-cta3', label: 'Поискай Оферта', sublabel: '5 оферти за минути', hoverTease: 'Без разпити, обещавам.' },
    { id: 'bg1-f-cta4', label: 'Обади се', sublabel: 'Говорим на всякакви теми', hoverTease: 'Ще отговоря... ако не джогвам.' },
    { id: 'bg1-f-cta5', label: 'Виж Как Работи', sublabel: 'Прозрачен процес', hoverTease: 'Нищо скрито. Наистина.' },
  ],
  interruptCards: [
    { id: 'bg1-f-ic1', title: 'Димитър за Семейството', body: 'Семейството е най-важното. Затова пазя всички... и техните вещи.', emoji: '❤️', truthNugget: 'Застраховка включена във всяка оферта.', afterSection: 'hero' },
    { id: 'bg1-f-ic2', title: 'Джогинг Съвет', body: 'Тичам всеки ден. Добра практика за бягане от проблеми.', emoji: '🏃', truthNugget: 'Спортът помага при стрес от преместване.', afterSection: 'benefits' },
    { id: 'bg1-f-ic3', title: 'Охрана 24/7', body: 'Аз не спя много. Вашите вещи са под наблюдение.', emoji: '👁️', truthNugget: 'Проследяване в реално време на всеки камион.', afterSection: 'security' },
    { id: 'bg1-f-ic4', title: 'Паста Рецепта', body: 'След преместване – паста. Единственото ми правило.', emoji: '🍝', truthNugget: 'Успешно преместване заслужава празнуване.', afterSection: 'how-it-works' },
    { id: 'bg1-f-ic5', title: 'Лото Мъдрост', body: 'Лотото е шанс. Преместването не трябва да е.', emoji: '🎲', truthNugget: '98% успешни премествания без проблеми.', afterSection: 'support' },
  ],
  visualPrompts: [
    { id: 'bg1-f-vp1', imagePrompt: 'Баща боксьор, който учи децата да пакетират', styleNotes: 'Топъл семеен момент', altText: 'Татко учи децата да пакетират', whereToUse: 'hero' },
    { id: 'bg1-f-vp2', imagePrompt: 'Семейство в камион, всички с боксови ръкавици', styleNotes: 'Забавен, карикатурен', altText: 'Семейство боксьори в камион', whereToUse: 'benefits' },
    { id: 'bg1-f-vp3', imagePrompt: 'Детектив дава цветя на съпругата си', styleNotes: 'Романтичен хумор', altText: 'Детектив с цветя', whereToUse: 'security' },
    { id: 'bg1-f-vp4', imagePrompt: 'Баба и дядо в боксов ринг с кашони', styleNotes: 'Сладък абсурд', altText: 'Възрастни хора в ринг', whereToUse: 'support' },
    { id: 'bg1-f-vp5', imagePrompt: 'Куче охранител с шапка детектив', styleNotes: 'Мило и смешно', altText: 'Куче детектив', whereToUse: 'how-it-works' },
  ],
  narratorLines: [
    { id: 'bg1-f-nl1', text: '👨‍👩‍👧 Семейството е всичко. Останалото е шум.' },
    { id: 'bg1-f-nl2', text: '🏃 Тичах 5 км тази сутрин. А ти?' },
    { id: 'bg1-f-nl3', text: '🍝 Гладен съм. Но първо – преместването.' },
    { id: 'bg1-f-nl4', text: '👀 Всичко е под контрол. Вярвай ми.' },
    { id: 'bg1-f-nl5', text: '🛡️ Пазя семейството. Твоето също.' },
  ],
};

// ================================
// INVESTOREN PAGE - BG1 Dimitar  
// ================================
export const bg1InvestorenContent: PersonaContentPack = {
  sectionOpeners: [
    { id: 'bg1-i-so1', sectionId: 'hero', text: 'Инвестицията е като бокс – удряш първи или губиш.', emoji: '💰' },
    { id: 'bg1-i-so2', sectionId: 'market', text: 'Пазарът е ринг. Ние сме шампиони.', emoji: '🏆' },
    { id: 'bg1-i-so3', sectionId: 'numbers', text: 'Числата не лъжат. За разлика от някои хора.', emoji: '📊' },
    { id: 'bg1-i-so4', sectionId: 'team', text: 'Отборът е проверен. Лично от мен.', emoji: '🔍' },
    { id: 'bg1-i-so5', sectionId: 'exit', text: 'Изходът е ясен. Като нокаут в 12-ти рунд.', emoji: '🚪' },
  ],
  microTooltips: [
    { id: 'bg1-i-mt1', targetId: 'roi', text: 'Възвръщаемост, по-добра от лотарията.' },
    { id: 'bg1-i-mt2', targetId: 'market-size', text: 'Голям пазар = много противници за победа.' },
    { id: 'bg1-i-mt3', targetId: 'growth', text: 'Растем като мускулите ми. Постоянно.' },
    { id: 'bg1-i-mt4', targetId: 'risk', text: 'Рискът е изчислен. Аз не губя.' },
    { id: 'bg1-i-mt5', targetId: 'team', text: 'Проверени хора. Никой не доноства.' },
  ],
  ctaVariants: [
    { id: 'bg1-i-cta1', label: 'Инвестирай Сега', sublabel: 'Влез в ринга с нас', hoverTease: 'Мястото е ограничено. Побързай.' },
    { id: 'bg1-i-cta2', label: 'Виж Числата', sublabel: 'Прозрачна статистика', hoverTease: 'Нищо скрито. Проверено.' },
    { id: 'bg1-i-cta3', label: 'Говори с Шефа', sublabel: 'Директна линия', hoverTease: 'Не записвам разговори. Обещавам.' },
    { id: 'bg1-i-cta4', label: 'Изтегли Deck', sublabel: 'Всички детайли на едно място', hoverTease: 'Форматирано за четене при джогинг.' },
    { id: 'bg1-i-cta5', label: 'Резервирай Среща', sublabel: 'Лице в лице разговор', hoverTease: 'Ще донеса паста.' },
  ],
  interruptCards: [
    { id: 'bg1-i-ic1', title: 'Димитър за Парите', body: 'Парите са като боксов пояс – трябва да ги спечелиш.', emoji: '🏅', truthNugget: 'CHF 553 средна печалба на клиент.', afterSection: 'hero' },
    { id: 'bg1-i-ic2', title: 'Стратегия за Победа', body: 'В ринга има план. В бизнеса – също.', emoji: '📋', truthNugget: '10 потока приходи за стабилност.', afterSection: 'market' },
    { id: 'bg1-i-ic3', title: 'Охрана на Инвестицията', body: 'Пазя парите ви като собствените си.', emoji: '🔐', truthNugget: 'Escrow система за сигурност.', afterSection: 'numbers' },
    { id: 'bg1-i-ic4', title: 'Лото vs Инвестиция', body: 'Лотото е забавление. Това е сериозно.', emoji: '🎰', truthNugget: '90% марж – не е случайност.', afterSection: 'team' },
    { id: 'bg1-i-ic5', title: 'Exit Стратегия', body: 'Винаги имам план за бягство. Просто да знаеш.', emoji: '🚀', truthNugget: 'IPO или M&A – готови сме и за двете.', afterSection: 'exit' },
  ],
  visualPrompts: [
    { id: 'bg1-i-vp1', imagePrompt: 'Боксьор в костюм, държащ графика на растеж', styleNotes: 'Професионален с хумор', altText: 'Боксьор бизнесмен', whereToUse: 'hero' },
    { id: 'bg1-i-vp2', imagePrompt: 'Ринг с парични банкноти вместо въжета', styleNotes: 'Сюрреалистичен', altText: 'Паричен ринг', whereToUse: 'market' },
    { id: 'bg1-i-vp3', imagePrompt: 'Детектив, анализиращ финансови документи', styleNotes: 'Noir стил', altText: 'Финансов детектив', whereToUse: 'numbers' },
    { id: 'bg1-i-vp4', imagePrompt: 'Шампионски пояс с надпис "Best ROI"', styleNotes: 'Блестящ, триумфален', altText: 'ROI шампионски пояс', whereToUse: 'team' },
    { id: 'bg1-i-vp5', imagePrompt: 'Ракета с боксови ръкавици, излитаща нагоре', styleNotes: 'Динамичен, весел', altText: 'Боксова ракета', whereToUse: 'exit' },
  ],
  narratorLines: [
    { id: 'bg1-i-nl1', text: '💰 Парите обичат тишина. И добри удари.' },
    { id: 'bg1-i-nl2', text: '📊 Числата са чисти. Проверих ги.' },
    { id: 'bg1-i-nl3', text: '🥊 В бизнеса, както в ринга – удряй първи.' },
    { id: 'bg1-i-nl4', text: '🏃 Джогингът помага да мисля. За пари.' },
    { id: 'bg1-i-nl5', text: '🍝 След срещата – паста. Традиция.' },
  ],
};
