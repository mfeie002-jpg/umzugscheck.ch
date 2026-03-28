import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Wifi, Droplets, Flame, Phone, Mail, CheckCircle2, Circle, AlertTriangle, ExternalLink, Calendar, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, subDays } from 'date-fns';
import { de, enUS, fr, it } from 'date-fns/locale';

interface UtilityTransferHelperProps {
  movingDate?: Date;
  fromCity?: string;
  toCity?: string;
}

interface UtilityItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'essential' | 'communication' | 'other';
  daysBeforeMove: number;
  provider?: string;
  phone?: string;
  website?: string;
  notes?: string;
}

const UtilityTransferHelper = ({
  movingDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  fromCity = 'Zürich',
  toCity = 'Basel'
}: UtilityTransferHelperProps) => {
  const { language } = useLanguage();
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('essential');

  const locales = { de, en: enUS, fr, it };
  const dateLocale = locales[language as keyof typeof locales] || de;

  const translations = {
    de: {
      title: 'Versorger-Wechsel',
      subtitle: 'Checkliste für Strom, Internet & mehr',
      progress: 'Fortschritt',
      dueDate: 'Fällig bis',
      callNow: 'Anrufen',
      visitWebsite: 'Website',
      categories: {
        essential: 'Grundversorgung',
        communication: 'Kommunikation',
        other: 'Weitere Dienste'
      },
      utilities: {
        electricity: 'Strom',
        gas: 'Gas',
        water: 'Wasser',
        internet: 'Internet & TV',
        phone: 'Telefon',
        insurance: 'Hausratversicherung',
        mail: 'Post-Nachsendung',
        registration: 'Einwohnermeldeamt',
        bank: 'Bank & Kreditkarten'
      },
      providers: {
        electricity: 'EWZ / Swisspower',
        gas: 'Energie 360°',
        water: 'Wasserversorgung',
        internet: 'Swisscom / Salt / Sunrise',
        phone: 'Swisscom',
        insurance: 'Mobiliar / AXA / Zurich',
        mail: 'Die Post',
        registration: 'Kreisbüro',
        bank: 'Ihre Bank'
      },
      tips: {
        electricity: 'Zählerstände am Umzugstag notieren',
        gas: 'Zählerstände dokumentieren, Sicherheit prüfen',
        water: 'Wasseruhr ablesen am letzten Tag',
        internet: 'Router zurückgeben oder mitnehmen klären',
        phone: 'Rufnummernmitnahme beantragen',
        insurance: 'Neue Adresse und Wohnungsgrösse melden',
        mail: 'Nachsendeauftrag online möglich',
        registration: 'Innerhalb 14 Tagen nach Umzug',
        bank: 'Online-Banking Adresse ändern'
      },
      status: {
        pending: 'Ausstehend',
        completed: 'Erledigt',
        overdue: 'Überfällig'
      }
    },
    en: {
      title: 'Utility Transfer',
      subtitle: 'Checklist for electricity, internet & more',
      progress: 'Progress',
      dueDate: 'Due by',
      callNow: 'Call',
      visitWebsite: 'Website',
      categories: {
        essential: 'Essential Services',
        communication: 'Communication',
        other: 'Other Services'
      },
      utilities: {
        electricity: 'Electricity',
        gas: 'Gas',
        water: 'Water',
        internet: 'Internet & TV',
        phone: 'Phone',
        insurance: 'Home Insurance',
        mail: 'Mail Forwarding',
        registration: 'Resident Registration',
        bank: 'Bank & Credit Cards'
      },
      providers: {
        electricity: 'EWZ / Swisspower',
        gas: 'Energie 360°',
        water: 'Water Utility',
        internet: 'Swisscom / Salt / Sunrise',
        phone: 'Swisscom',
        insurance: 'Mobiliar / AXA / Zurich',
        mail: 'Swiss Post',
        registration: 'Registration Office',
        bank: 'Your Bank'
      },
      tips: {
        electricity: 'Note meter readings on moving day',
        gas: 'Document meter readings, check safety',
        water: 'Read water meter on last day',
        internet: 'Clarify router return or transfer',
        phone: 'Request number portability',
        insurance: 'Report new address and apartment size',
        mail: 'Mail forwarding available online',
        registration: 'Within 14 days after moving',
        bank: 'Update address in online banking'
      },
      status: {
        pending: 'Pending',
        completed: 'Completed',
        overdue: 'Overdue'
      }
    },
    fr: {
      title: 'Transfert de services',
      subtitle: 'Liste pour électricité, internet & plus',
      progress: 'Progression',
      dueDate: 'Échéance',
      callNow: 'Appeler',
      visitWebsite: 'Site web',
      categories: {
        essential: 'Services essentiels',
        communication: 'Communication',
        other: 'Autres services'
      },
      utilities: {
        electricity: 'Électricité',
        gas: 'Gaz',
        water: 'Eau',
        internet: 'Internet & TV',
        phone: 'Téléphone',
        insurance: 'Assurance ménage',
        mail: 'Réexpédition du courrier',
        registration: 'Enregistrement',
        bank: 'Banque'
      },
      providers: {
        electricity: 'EWZ / Swisspower',
        gas: 'Energie 360°',
        water: 'Service des eaux',
        internet: 'Swisscom / Salt / Sunrise',
        phone: 'Swisscom',
        insurance: 'Mobilière / AXA / Zurich',
        mail: 'La Poste',
        registration: 'Bureau d\'enregistrement',
        bank: 'Votre banque'
      },
      tips: {
        electricity: 'Noter les relevés le jour du déménagement',
        gas: 'Documenter les relevés, vérifier la sécurité',
        water: 'Relever le compteur d\'eau',
        internet: 'Clarifier le retour du routeur',
        phone: 'Demander la portabilité du numéro',
        insurance: 'Signaler nouvelle adresse',
        mail: 'Réexpédition disponible en ligne',
        registration: 'Dans les 14 jours après le déménagement',
        bank: 'Changer l\'adresse en ligne'
      },
      status: {
        pending: 'En attente',
        completed: 'Terminé',
        overdue: 'En retard'
      }
    },
    it: {
      title: 'Trasferimento utenze',
      subtitle: 'Checklist per elettricità, internet & altro',
      progress: 'Progresso',
      dueDate: 'Scadenza',
      callNow: 'Chiama',
      visitWebsite: 'Sito web',
      categories: {
        essential: 'Servizi essenziali',
        communication: 'Comunicazione',
        other: 'Altri servizi'
      },
      utilities: {
        electricity: 'Elettricità',
        gas: 'Gas',
        water: 'Acqua',
        internet: 'Internet & TV',
        phone: 'Telefono',
        insurance: 'Assicurazione casa',
        mail: 'Reindirizzamento posta',
        registration: 'Registrazione residenza',
        bank: 'Banca'
      },
      providers: {
        electricity: 'EWZ / Swisspower',
        gas: 'Energie 360°',
        water: 'Servizio idrico',
        internet: 'Swisscom / Salt / Sunrise',
        phone: 'Swisscom',
        insurance: 'Mobiliar / AXA / Zurich',
        mail: 'La Posta',
        registration: 'Ufficio anagrafe',
        bank: 'La tua banca'
      },
      tips: {
        electricity: 'Annotare le letture il giorno del trasloco',
        gas: 'Documentare le letture, controllare sicurezza',
        water: 'Leggere il contatore dell\'acqua',
        internet: 'Chiarire la restituzione del router',
        phone: 'Richiedere la portabilità del numero',
        insurance: 'Comunicare nuovo indirizzo',
        mail: 'Reindirizzamento disponibile online',
        registration: 'Entro 14 giorni dal trasloco',
        bank: 'Aggiornare indirizzo online'
      },
      status: {
        pending: 'In attesa',
        completed: 'Completato',
        overdue: 'In ritardo'
      }
    }
  };

  const t = translations[language] || translations.de;

  const utilities: UtilityItem[] = useMemo(() => [
    {
      id: 'electricity',
      name: t.utilities.electricity,
      icon: <Zap className="h-4 w-4 text-yellow-500" />,
      category: 'essential',
      daysBeforeMove: 14,
      provider: t.providers.electricity,
      phone: '0800 800 800',
      website: 'https://www.ewz.ch',
      notes: t.tips.electricity
    },
    {
      id: 'gas',
      name: t.utilities.gas,
      icon: <Flame className="h-4 w-4 text-orange-500" />,
      category: 'essential',
      daysBeforeMove: 14,
      provider: t.providers.gas,
      phone: '0800 800 800',
      website: 'https://www.energie360.ch',
      notes: t.tips.gas
    },
    {
      id: 'water',
      name: t.utilities.water,
      icon: <Droplets className="h-4 w-4 text-blue-500" />,
      category: 'essential',
      daysBeforeMove: 7,
      provider: t.providers.water,
      notes: t.tips.water
    },
    {
      id: 'internet',
      name: t.utilities.internet,
      icon: <Wifi className="h-4 w-4 text-purple-500" />,
      category: 'communication',
      daysBeforeMove: 21,
      provider: t.providers.internet,
      phone: '0800 800 800',
      website: 'https://www.swisscom.ch',
      notes: t.tips.internet
    },
    {
      id: 'phone',
      name: t.utilities.phone,
      icon: <Phone className="h-4 w-4 text-green-500" />,
      category: 'communication',
      daysBeforeMove: 14,
      provider: t.providers.phone,
      notes: t.tips.phone
    },
    {
      id: 'mail',
      name: t.utilities.mail,
      icon: <Mail className="h-4 w-4 text-red-500" />,
      category: 'other',
      daysBeforeMove: 7,
      provider: t.providers.mail,
      website: 'https://www.post.ch',
      notes: t.tips.mail
    },
    {
      id: 'registration',
      name: t.utilities.registration,
      icon: <Building className="h-4 w-4 text-gray-500" />,
      category: 'other',
      daysBeforeMove: -14, // After move
      provider: t.providers.registration,
      notes: t.tips.registration
    },
    {
      id: 'insurance',
      name: t.utilities.insurance,
      icon: <Building className="h-4 w-4 text-teal-500" />,
      category: 'other',
      daysBeforeMove: 7,
      provider: t.providers.insurance,
      notes: t.tips.insurance
    },
    {
      id: 'bank',
      name: t.utilities.bank,
      icon: <Building className="h-4 w-4 text-indigo-500" />,
      category: 'other',
      daysBeforeMove: 7,
      provider: t.providers.bank,
      notes: t.tips.bank
    }
  ], [t]);

  const groupedUtilities = useMemo(() => {
    const groups: Record<string, UtilityItem[]> = {
      essential: [],
      communication: [],
      other: []
    };
    utilities.forEach(item => {
      groups[item.category].push(item);
    });
    return groups;
  }, [utilities]);

  const progressPercent = Math.round((completedItems.length / utilities.length) * 100);

  const toggleItem = (id: string) => {
    setCompletedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getDueDate = (daysBeforeMove: number) => {
    return subDays(movingDate, daysBeforeMove);
  };

  const isOverdue = (daysBeforeMove: number) => {
    const dueDate = getDueDate(daysBeforeMove);
    return dueDate < new Date() && daysBeforeMove > 0;
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-primary" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span>{fromCity}</span>
          <span>→</span>
          <span>{toCity}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t.progress}</span>
            <span className="text-sm font-bold text-primary">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Utility Categories */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {Object.entries(groupedUtilities).map(([category, items]) => {
            const categoryCompleted = items.filter(item => completedItems.includes(item.id)).length;
            const isExpanded = expandedCategory === category;

            return (
              <Collapsible
                key={category}
                open={isExpanded}
                onOpenChange={() => setExpandedCategory(isExpanded ? null : category)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between h-auto py-2 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {t.categories[category as keyof typeof t.categories]}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {categoryCompleted}/{items.length}
                      </Badge>
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <AnimatePresence>
                    <div className="space-y-2 py-2 pl-2">
                      {items.map((item, index) => {
                        const isCompleted = completedItems.includes(item.id);
                        const overdue = isOverdue(item.daysBeforeMove) && !isCompleted;

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`rounded-lg border p-3 transition-colors ${
                              isCompleted
                                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                : overdue
                                ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                                : 'bg-background hover:bg-muted/50'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={isCompleted}
                                onCheckedChange={() => toggleItem(item.id)}
                                className="mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  {item.icon}
                                  <span className={`font-medium text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                                    {item.name}
                                  </span>
                                  {overdue && (
                                    <AlertTriangle className="h-3 w-3 text-red-500" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{item.provider}</p>
                                {item.notes && (
                                  <p className="text-xs text-muted-foreground mt-1 italic">{item.notes}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-[10px]">
                                    <Calendar className="h-2.5 w-2.5 mr-0.5" />
                                    {t.dueDate}: {format(getDueDate(item.daysBeforeMove), 'dd.MM', { locale: dateLocale })}
                                  </Badge>
                                  {item.phone && (
                                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" asChild>
                                      <a href={`tel:${item.phone}`}>
                                        <Phone className="h-2.5 w-2.5 mr-0.5" />
                                        {t.callNow}
                                      </a>
                                    </Button>
                                  )}
                                  {item.website && (
                                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" asChild>
                                      <a href={item.website} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-2.5 w-2.5 mr-0.5" />
                                        {t.visitWebsite}
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>
                              {isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </AnimatePresence>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default UtilityTransferHelper;
