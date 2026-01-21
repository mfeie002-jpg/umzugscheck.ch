/**
 * Persona Content Pack - BG2 Fudely (Shopping/Cooking/Dancing)
 * 30 items per page: 5 sectionOpeners, 5 microTooltips, 5 ctaVariants, 5 interruptCards, 5 visualPrompts, 5 narratorLines
 */

import type { PersonaContentPack } from '@/lib/persona-types';

// ================================
// VISION PAGE - BG2 Fudely
// ================================
export const bg2VisionContent: PersonaContentPack = {
  sectionOpeners: [
    { id: 'bg2-v-so1', sectionId: 'hero', text: 'Преместването е като шопинг – трябва да знаеш какво искаш.', emoji: '🛍️' },
    { id: 'bg2-v-so2', sectionId: 'features', text: 'Функции, по-секси от новата колекция на Zara.', emoji: '✨' },
    { id: 'bg2-v-so3', sectionId: 'revenue', text: 'Печалби? Да, моля! Като пазаруване с намаление.', emoji: '💸' },
    { id: 'bg2-v-so4', sectionId: 'team', text: 'Екипът ни е като приятелки – винаги подкрепяме.', emoji: '👯' },
    { id: 'bg2-v-so5', sectionId: 'roadmap', text: 'Пътят напред е като разходка в мола. С цел.', emoji: '🗺️' },
  ],
  microTooltips: [
    { id: 'bg2-v-mt1', targetId: 'revenue-kpi', text: 'Толкова печелим! Стига за два Мерцедеса.' },
    { id: 'bg2-v-mt2', targetId: 'margin-kpi', text: '90% марж = 90% за маникюр.' },
    { id: 'bg2-v-mt3', targetId: 'automation', text: 'AI готви вместо нас. Почти.' },
    { id: 'bg2-v-mt4', targetId: 'escrow', text: 'Парите са защитени. Като гардероба ми.' },
    { id: 'bg2-v-mt5', targetId: 'video-scan', text: 'Сканиране за по-добър интериор дизайн.' },
  ],
  ctaVariants: [
    { id: 'bg2-v-cta1', label: 'Пазарувай Оферти', sublabel: 'Като в любимия ти магазин', hoverTease: 'Безплатна доставка на оферти!' },
    { id: 'bg2-v-cta2', label: 'Виж Колекцията', sublabel: '5 топ фирми за теб', hoverTease: 'Всяка по-добра от другата!' },
    { id: 'bg2-v-cta3', label: 'Започни с Танц', sublabel: 'Лесно като салса', hoverTease: 'Ляво, дясно, преместено!' },
    { id: 'bg2-v-cta4', label: 'Релакс и Оферти', sublabel: 'Докато чакаш масаж', hoverTease: 'Морис ще се погрижи.' },
    { id: 'bg2-v-cta5', label: 'Опитай Безплатно', sublabel: 'Като мострите в Sephora', hoverTease: 'Без ангажимент!' },
  ],
  interruptCards: [
    { id: 'bg2-v-ic1', title: 'Fudely Съвет', body: 'Преместването е като готвене – нужни са добри съставки и търпение.', emoji: '👩‍🍳', truthNugget: 'Рецептата ни включва 10 проверени стъпки.', afterSection: 'hero' },
    { id: 'bg2-v-ic2', title: 'Танцова Пауза', body: 'Между пакетирането, малко танц не пречи!', emoji: '💃', truthNugget: 'Стресът спада с 40% при движение.', afterSection: 'features' },
    { id: 'bg2-v-ic3', title: 'Mercedes Момент', body: 'Преместването трябва да е гладко. Като возене в S-Class.', emoji: '🚗', truthNugget: 'Premium фирми с най-високи оценки.', afterSection: 'revenue' },
    { id: 'bg2-v-ic4', title: 'Зайче Мъдрост', body: 'Моите зайчета знаят – домът е там, където е сърцето.', emoji: '🐰', truthNugget: '98% клиенти препоръчват услугата.', afterSection: 'team' },
    { id: 'bg2-v-ic5', title: 'Нощна Философия', body: 'Обичам да стоя до късно и да планирам. И преместванията.', emoji: '🌙', truthNugget: '24/7 поддръжка за нощни птици.', afterSection: 'roadmap' },
  ],
  visualPrompts: [
    { id: 'bg2-v-vp1', imagePrompt: 'Елегантна жена с торби за пазаруване, пълни с кашони', styleNotes: 'Модерен, шик стил', altText: 'Шопинг кашони', whereToUse: 'hero' },
    { id: 'bg2-v-vp2', imagePrompt: 'Кухня мечта с летящи прибори', styleNotes: 'Магически реализъм', altText: 'Магическа кухня', whereToUse: 'features' },
    { id: 'bg2-v-vp3', imagePrompt: 'Танцуваща жена сред кашони', styleNotes: 'Динамичен, весел', altText: 'Танц между кашоните', whereToUse: 'revenue' },
    { id: 'bg2-v-vp4', imagePrompt: 'Зайче в луксозен нов дом', styleNotes: 'Сладък, уютен', altText: 'Щастливо зайче в нов дом', whereToUse: 'team' },
    { id: 'bg2-v-vp5', imagePrompt: 'Мерцедес, натоварен с розови кашони', styleNotes: 'Луксозен хумор', altText: 'Розов Mercedes', whereToUse: 'roadmap' },
  ],
  narratorLines: [
    { id: 'bg2-v-nl1', text: '🛍️ Шопингът е терапия. Преместването – също!' },
    { id: 'bg2-v-nl2', text: '💃 Време за танц! После пакетираме.' },
    { id: 'bg2-v-nl3', text: '🐰 Зайчетата одобряват този избор.' },
    { id: 'bg2-v-nl4', text: '🍳 Готвя нещо специално за теб!' },
    { id: 'bg2-v-nl5', text: '✨ Всичко ще е перфектно. Обещавам.' },
  ],
};

// ================================
// FAMILY PAGE - BG2 Fudely
// ================================
export const bg2FamilyContent: PersonaContentPack = {
  sectionOpeners: [
    { id: 'bg2-f-so1', sectionId: 'hero', text: 'Семейството е като рецепта – всеки е важен съставка.', emoji: '👨‍👩‍👧‍👦' },
    { id: 'bg2-f-so2', sectionId: 'benefits', text: 'Ползите са като намаления – не можеш да ги пропуснеш!', emoji: '🏷️' },
    { id: 'bg2-f-so3', sectionId: 'how-it-works', text: 'Лесно като танцови стъпки. 1-2-3!', emoji: '👣' },
    { id: 'bg2-f-so4', sectionId: 'security', text: 'Сигурността е като хубавата чанта – инвестираш веднъж.', emoji: '👜' },
    { id: 'bg2-f-so5', sectionId: 'support', text: 'Подкрепата е като масаж – винаги е добре дошла.', emoji: '💆' },
  ],
  microTooltips: [
    { id: 'bg2-f-mt1', targetId: 'simple', text: 'По-лесно от рецепта за палачинки.' },
    { id: 'bg2-f-mt2', targetId: 'safe', text: 'Сигурно като зайците ми вкъщи.' },
    { id: 'bg2-f-mt3', targetId: 'fast', text: 'Бързо като вечеря при мен!' },
    { id: 'bg2-f-mt4', targetId: 'support', text: 'Подкрепа като от най-добрата приятелка.' },
    { id: 'bg2-f-mt5', targetId: 'price', text: 'Честна цена. Без изненади.' },
  ],
  ctaVariants: [
    { id: 'bg2-f-cta1', label: 'Грижи се за Семейството', sublabel: 'Преместване с любов', hoverTease: 'Ще сготвя нещо за празнуване!' },
    { id: 'bg2-f-cta2', label: 'Танцувай с Нас', sublabel: 'Лесни стъпки', hoverTease: 'Не стъпвам на крака. Обещавам.' },
    { id: 'bg2-f-cta3', label: 'Поглези се', sublabel: 'Оферти без стрес', hoverTease: 'Като спа ден за преместване.' },
    { id: 'bg2-f-cta4', label: 'Виж Магията', sublabel: 'Готвим успех', hoverTease: 'Тайната съставка е любов.' },
    { id: 'bg2-f-cta5', label: 'Обади се', sublabel: 'Обичам да говоря!', hoverTease: 'Особено до късно.' },
  ],
  interruptCards: [
    { id: 'bg2-f-ic1', title: 'Готварска Тайна', body: 'Преместването е като сложно ястие – нужна е подготовка.', emoji: '🍲', truthNugget: 'Планирането спестява 30% време.', afterSection: 'hero' },
    { id: 'bg2-f-ic2', title: 'Танцова Терапия', body: 'Когато стресът расте, танцувай!', emoji: '💃', truthNugget: 'Движението намалява тревожността.', afterSection: 'benefits' },
    { id: 'bg2-f-ic3', title: 'Зайчешка Логика', body: 'Зайците ми казват: "Новият дом ще е страхотен!"', emoji: '🐇', truthNugget: 'Домашните любимци се адаптират за 2 седмици.', afterSection: 'how-it-works' },
    { id: 'bg2-f-ic4', title: 'Масажна Пауза', body: 'Преместването изморява. Масажът помага.', emoji: '💆‍♀️', truthNugget: 'Грижи се за себе си по време на процеса.', afterSection: 'security' },
    { id: 'bg2-f-ic5', title: 'Нощен Разговор', body: 'Обичам да говоря до късно. За планове и мечти.', emoji: '🌙', truthNugget: 'Поддръжка 24/7 – дори в 3 сутринта.', afterSection: 'support' },
  ],
  visualPrompts: [
    { id: 'bg2-f-vp1', imagePrompt: 'Жена готви в нова кухня, семейството помага', styleNotes: 'Топъл, семеен', altText: 'Семейство в нова кухня', whereToUse: 'hero' },
    { id: 'bg2-f-vp2', imagePrompt: 'Зайчета, които разопаковат кашони', styleNotes: 'Сладък, забавен', altText: 'Зайчета разопаковат', whereToUse: 'benefits' },
    { id: 'bg2-f-vp3', imagePrompt: 'Танцуващо семейство в празен апартамент', styleNotes: 'Радостен момент', altText: 'Семеен танц', whereToUse: 'how-it-works' },
    { id: 'bg2-f-vp4', imagePrompt: 'Мерцедес пред нов красив дом', styleNotes: 'Луксозен, стилен', altText: 'Mercedes пред нов дом', whereToUse: 'security' },
    { id: 'bg2-f-vp5', imagePrompt: 'Жена получава масаж сред разопаковани кашони', styleNotes: 'Релаксиращ хумор', altText: 'Масаж при преместване', whereToUse: 'support' },
  ],
  narratorLines: [
    { id: 'bg2-f-nl1', text: '👨‍👩‍👧 Семейството е всичко. Останалото е декор.' },
    { id: 'bg2-f-nl2', text: '🍳 Ще сготвя нещо вкусно за новия дом!' },
    { id: 'bg2-f-nl3', text: '🐰 Зайчетата вече са щастливи!' },
    { id: 'bg2-f-nl4', text: '💃 Един танц и продължаваме!' },
    { id: 'bg2-f-nl5', text: '💆 Обичам те! И преместването ти.' },
  ],
};

// ================================
// INVESTOREN PAGE - BG2 Fudely
// ================================
export const bg2InvestorenContent: PersonaContentPack = {
  sectionOpeners: [
    { id: 'bg2-i-so1', sectionId: 'hero', text: 'Инвестицията е като шопинг – избираш най-доброто!', emoji: '💎' },
    { id: 'bg2-i-so2', sectionId: 'market', text: 'Пазарът е като мол – пълен с възможности.', emoji: '🏬' },
    { id: 'bg2-i-so3', sectionId: 'numbers', text: 'Числата са красиви. Като нов маникюр.', emoji: '💅' },
    { id: 'bg2-i-so4', sectionId: 'team', text: 'Екипът е като рецепта – всеки има роля.', emoji: '👩‍🍳' },
    { id: 'bg2-i-so5', sectionId: 'exit', text: 'Изходът е като танц – грациозен и планиран.', emoji: '💃' },
  ],
  microTooltips: [
    { id: 'bg2-i-mt1', targetId: 'roi', text: 'Възвръщаемост за още един Мерцедес!' },
    { id: 'bg2-i-mt2', targetId: 'market-size', text: 'Голям пазар = много възможности за пазаруване.' },
    { id: 'bg2-i-mt3', targetId: 'growth', text: 'Растем като косата ми след маска!' },
    { id: 'bg2-i-mt4', targetId: 'risk', text: 'Рискът е изчислен. Като калориите.' },
    { id: 'bg2-i-mt5', targetId: 'team', text: 'Готвачи в бизнеса. Буквално.' },
  ],
  ctaVariants: [
    { id: 'bg2-i-cta1', label: 'Инвестирай с Вкус', sublabel: 'Рецепта за успех', hoverTease: 'Тайната съставка е вътре!' },
    { id: 'bg2-i-cta2', label: 'Пазарувай Бъдеще', sublabel: 'Най-добрата сделка', hoverTease: 'Намаление за ранни инвеститори!' },
    { id: 'bg2-i-cta3', label: 'Танцувай с Числата', sublabel: 'Красива статистика', hoverTease: 'По-секси от очакваното!' },
    { id: 'bg2-i-cta4', label: 'Запази Среща', sublabel: 'Ще донеса десерт', hoverTease: 'Домашна баклава!' },
    { id: 'bg2-i-cta5', label: 'Изтегли Deck', sublabel: 'Цялата рецепта', hoverTease: 'Всички съставки на едно място.' },
  ],
  interruptCards: [
    { id: 'bg2-i-ic1', title: 'Рецепта за ROI', body: 'Смесваме иновации, автоматизация и любов. Резултат: печалба!', emoji: '📈', truthNugget: 'CHF 553 на клиент. Вкусно!', afterSection: 'hero' },
    { id: 'bg2-i-ic2', title: 'Пазарен Танц', body: 'Пазарът се движи. Ние танцуваме с него.', emoji: '💃', truthNugget: '420M CHF пазар само в Швейцария.', afterSection: 'market' },
    { id: 'bg2-i-ic3', title: 'Красива Математика', body: 'Числата са като добра рецепта – всичко е баланс.', emoji: '✨', truthNugget: '90% марж. Перфектен баланс.', afterSection: 'numbers' },
    { id: 'bg2-i-ic4', title: 'Екип с Вкус', body: 'Всеки в екипа добавя нещо специално.', emoji: '👩‍🍳', truthNugget: 'Опитни професионалисти от топ компании.', afterSection: 'team' },
    { id: 'bg2-i-ic5', title: 'Грациозен Exit', body: 'Изходът е като финален танц – впечатляващ!', emoji: '🩰', truthNugget: 'IPO или M&A – и двете са на масата.', afterSection: 'exit' },
  ],
  visualPrompts: [
    { id: 'bg2-i-vp1', imagePrompt: 'Жена с шампанско до графика на растеж', styleNotes: 'Луксозен, празничен', altText: 'Празнуване на успех', whereToUse: 'hero' },
    { id: 'bg2-i-vp2', imagePrompt: 'Мол с магазини, показващи бизнес метрики', styleNotes: 'Креативен, забавен', altText: 'Бизнес мол', whereToUse: 'market' },
    { id: 'bg2-i-vp3', imagePrompt: 'Ръце с маникюр, държащи финансов отчет', styleNotes: 'Елегантен бизнес', altText: 'Стилен финансов анализ', whereToUse: 'numbers' },
    { id: 'bg2-i-vp4', imagePrompt: 'Екип готви в луксозна кухня/офис', styleNotes: 'Креативен startup', altText: 'Екип готвачи бизнесмени', whereToUse: 'team' },
    { id: 'bg2-i-vp5', imagePrompt: 'Балерина на сцена с дъжд от пари', styleNotes: 'Артистичен успех', altText: 'Танц на успеха', whereToUse: 'exit' },
  ],
  narratorLines: [
    { id: 'bg2-i-nl1', text: '💎 Инвестицията е като диамант – трябва правилен избор!' },
    { id: 'bg2-i-nl2', text: '🛍️ Пазаруваме бъдеще. Искаш ли и ти?' },
    { id: 'bg2-i-nl3', text: '💅 Числата са красиви. Като маникюра ми.' },
    { id: 'bg2-i-nl4', text: '🍰 Ще ти изпратя домашен десерт след инвестицията!' },
    { id: 'bg2-i-nl5', text: '💃 ROI, който те кара да танцуваш!' },
  ],
};
