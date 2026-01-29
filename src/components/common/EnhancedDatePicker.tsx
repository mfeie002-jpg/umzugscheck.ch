import { useState, useMemo } from 'react';
import { format, addDays, addWeeks, addMonths, startOfMonth, isWeekend, isBefore, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronDown, Zap, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EnhancedDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  minDate?: Date;
  showQuickOptions?: boolean;
  showFlexibleOption?: boolean;
  flexible?: boolean;
  onFlexibleChange?: (flexible: boolean) => void;
  className?: string;
}

export const EnhancedDatePicker = ({
  value,
  onChange,
  label = 'Umzugsdatum',
  placeholder = 'Datum wählen',
  minDate = new Date(),
  showQuickOptions = true,
  showFlexibleOption = true,
  flexible = false,
  onFlexibleChange,
  className,
}: EnhancedDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [inputMode, setInputMode] = useState<'calendar' | 'manual'>('calendar');

  // Parse value to Date
  const selectedDate = useMemo(() => {
    if (!value) return undefined;
    try {
      return parseISO(value);
    } catch {
      return undefined;
    }
  }, [value]);

  // Quick date options
  const quickOptions = useMemo(() => {
    const today = new Date();
    return [
      { label: 'Nächste Woche', date: addWeeks(today, 1), icon: Zap },
      { label: 'In 2 Wochen', date: addWeeks(today, 2), icon: Clock },
      { label: 'Nächster Monat', date: startOfMonth(addMonths(today, 1)), icon: CalendarIcon },
      { label: 'In 3 Monaten', date: startOfMonth(addMonths(today, 3)), icon: CalendarIcon },
    ];
  }, []);

  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'));
      setIsOpen(false);
    }
  };

  // Handle quick option click
  const handleQuickSelect = (date: Date) => {
    onChange(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  // Handle manual input
  const handleManualInput = (input: string) => {
    setManualInput(input);
    
    // Try to parse various formats
    const patterns = [
      /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/, // DD.MM.YYYY
      /^(\d{1,2})\.(\d{1,2})\.(\d{2})$/,  // DD.MM.YY
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY
      /^(\d{4})-(\d{2})-(\d{2})$/,       // YYYY-MM-DD
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) {
        let day: number, month: number, year: number;
        
        if (pattern === patterns[3]) {
          // YYYY-MM-DD
          year = parseInt(match[1]);
          month = parseInt(match[2]);
          day = parseInt(match[3]);
        } else {
          day = parseInt(match[1]);
          month = parseInt(match[2]);
          year = parseInt(match[3]);
          if (year < 100) year += 2000;
        }

        if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 2024) {
          const date = new Date(year, month - 1, day);
          if (!isBefore(date, minDate)) {
            onChange(format(date, 'yyyy-MM-dd'));
          }
        }
        break;
      }
    }
  };

  // Format display value
  const displayValue = useMemo(() => {
    if (flexible) return 'Flexibel';
    if (!value) return '';
    try {
      return format(parseISO(value), 'EEEE, d. MMMM yyyy', { locale: de });
    } catch {
      return value;
    }
  }, [value, flexible]);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          {label}
        </label>
      )}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full h-12 justify-between text-left font-normal',
              !value && !flexible && 'text-muted-foreground'
            )}
          >
            <span className="truncate">
              {displayValue || placeholder}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
          <div className="p-3 border-b">
            {/* Toggle between calendar and manual input */}
            <div className="flex gap-2 mb-3">
              <Button
                variant={inputMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('calendar')}
                className="flex-1"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Kalender
              </Button>
              <Button
                variant={inputMode === 'manual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('manual')}
                className="flex-1"
              >
                Eingeben
              </Button>
            </div>

            {inputMode === 'manual' && (
              <div className="space-y-2">
                <Input
                  placeholder="z.B. 15.03.2026"
                  value={manualInput}
                  onChange={(e) => handleManualInput(e.target.value)}
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">
                  Formate: TT.MM.JJJJ oder TT/MM/JJJJ
                </p>
              </div>
            )}
          </div>

          {inputMode === 'calendar' && (
            <>
              {/* Quick Options */}
              {showQuickOptions && (
                <div className="p-3 border-b space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Schnellauswahl</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickOptions.map((option) => (
                      <Button
                        key={option.label}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickSelect(option.date)}
                        className="justify-start text-xs"
                      >
                        <option.icon className="h-3 w-3 mr-1" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Calendar */}
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelect}
                disabled={(date) => isBefore(date, addDays(minDate, -1)) || isWeekend(date)}
                locale={de}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </>
          )}

          {/* Flexible Option */}
          {showFlexibleOption && onFlexibleChange && (
            <div className="p-3 border-t">
              <Button
                variant={flexible ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  onFlexibleChange(!flexible);
                  if (!flexible) {
                    onChange('');
                  }
                  setIsOpen(false);
                }}
                className="w-full"
              >
                {flexible && <Check className="h-4 w-4 mr-2" />}
                Bin zeitlich flexibel
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Selected date badge */}
      {value && !flexible && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {format(parseISO(value), 'EEEE', { locale: de })}
          </Badge>
          {isWeekend(parseISO(value)) && (
            <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
              Wochenende (+15% Zuschlag)
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedDatePicker;
