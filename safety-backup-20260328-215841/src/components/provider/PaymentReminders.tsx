import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Mail, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Send,
  Calendar,
  DollarSign
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'overdue' | 'paid';
  remindersSent: number;
  lastReminderAt?: Date;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customerName: 'Max Müller',
    customerEmail: 'max@example.com',
    amount: 1450,
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    status: 'overdue',
    remindersSent: 1,
    lastReminderAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customerName: 'Anna Schmidt',
    customerEmail: 'anna@example.com',
    amount: 980,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    status: 'pending',
    remindersSent: 0,
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    customerName: 'Peter Weber',
    customerEmail: 'peter@example.com',
    amount: 2100,
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    status: 'overdue',
    remindersSent: 3,
    lastReminderAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

export const PaymentReminders = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);

  const sendReminder = async (invoice: Invoice) => {
    setSendingReminder(invoice.id);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === invoice.id
          ? {
              ...inv,
              remindersSent: inv.remindersSent + 1,
              lastReminderAt: new Date(),
            }
          : inv
      )
    );

    toast({
      title: 'Erinnerung gesendet',
      description: `Zahlungserinnerung wurde an ${invoice.customerEmail} gesendet.`,
    });

    setSendingReminder(null);
  };

  const markAsPaid = (invoiceId: string) => {
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === invoiceId ? { ...inv, status: 'paid' as const } : inv
      )
    );

    toast({
      title: 'Als bezahlt markiert',
      description: 'Die Rechnung wurde als bezahlt markiert.',
    });
  };

  const getStatusBadge = (invoice: Invoice) => {
    const daysOverdue = differenceInDays(new Date(), invoice.dueDate);
    
    if (invoice.status === 'paid') {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Bezahlt</Badge>;
    }
    
    if (daysOverdue > 0) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {daysOverdue} Tage überfällig
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary">
        <Clock className="h-3 w-3 mr-1" />
        Fällig in {Math.abs(daysOverdue)} Tagen
      </Badge>
    );
  };

  const pendingInvoices = invoices.filter(inv => inv.status !== 'paid');
  const totalOverdue = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">Offene Rechnungen</span>
            </div>
            <p className="text-2xl font-bold mt-2">{pendingInvoices.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-sm text-muted-foreground">Überfällig</span>
            </div>
            <p className="text-2xl font-bold mt-2 text-red-600">
              CHF {totalOverdue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-muted-foreground">Erinnerungen gesendet</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {invoices.reduce((sum, inv) => sum + inv.remindersSent, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Zahlungserinnerungen</span>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Alle erinnern
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map(invoice => (
              <div
                key={invoice.id}
                className={`p-4 border rounded-lg ${
                  invoice.status === 'paid' ? 'bg-muted/50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{invoice.invoiceNumber}</span>
                      {getStatusBadge(invoice)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {invoice.customerName} • {invoice.customerEmail}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        CHF {invoice.amount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Fällig: {format(invoice.dueDate, 'dd.MM.yyyy', { locale: de })}
                      </span>
                    </div>
                    {invoice.lastReminderAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Letzte Erinnerung: {format(invoice.lastReminderAt, 'dd.MM.yyyy HH:mm', { locale: de })}
                        ({invoice.remindersSent}x gesendet)
                      </p>
                    )}
                  </div>
                  
                  {invoice.status !== 'paid' && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsPaid(invoice.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Bezahlt
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => sendReminder(invoice)}
                        disabled={sendingReminder === invoice.id}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        {sendingReminder === invoice.id ? 'Senden...' : 'Erinnern'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-Reminder Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Automatische Erinnerungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-4">
              Automatische Zahlungserinnerungen werden gesendet:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Badge variant="secondary">3 Tage vor Fälligkeit</Badge>
                <span>Freundliche Erinnerung</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="secondary">Am Fälligkeitstag</Badge>
                <span>Zahlungsaufforderung</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="destructive">7 Tage überfällig</Badge>
                <span>Erste Mahnung</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="destructive">14 Tage überfällig</Badge>
                <span>Zweite Mahnung</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
