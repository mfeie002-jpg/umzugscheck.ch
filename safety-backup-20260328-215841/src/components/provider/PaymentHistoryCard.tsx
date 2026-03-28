import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Wallet,
  Plus
} from "lucide-react";
import { getProviderPaymentHistory, getProviderBalance, topUpCredits } from "@/lib/stripe-service";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { toast } from "sonner";

interface PaymentHistoryCardProps {
  providerId: string;
}

export function PaymentHistoryCard({ providerId }: PaymentHistoryCardProps) {
  const [payments, setPayments] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [providerId]);

  const loadData = async () => {
    setLoading(true);
    const [historyData, balanceData] = await Promise.all([
      getProviderPaymentHistory(providerId),
      getProviderBalance(providerId)
    ]);
    setPayments(historyData);
    setBalance(balanceData);
    setLoading(false);
  };

  const handleTopUp = async (amount: number) => {
    const result = await topUpCredits(providerId, amount);
    if (result.url) {
      window.location.href = result.url;
    } else {
      toast.error("Zahlung konnte nicht gestartet werden");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3 mr-1" />Abgeschlossen</Badge>;
      case "pending":
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Ausstehend</Badge>;
      case "failed":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Fehlgeschlagen</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "credit_topup":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "lead_purchase":
      case "bid_purchase":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <CreditCard className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-pulse">Lädt...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-full">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aktuelles Guthaben</p>
                <p className="text-3xl font-bold">CHF {balance.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleTopUp(50)}>
                <Plus className="w-4 h-4 mr-1" />
                CHF 50
              </Button>
              <Button size="sm" onClick={() => handleTopUp(100)}>
                <Plus className="w-4 h-4 mr-1" />
                CHF 100
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Zahlungsverlauf
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Noch keine Zahlungen vorhanden
            </p>
          ) : (
            <div className="space-y-3">
              {payments.slice(0, 10).map((payment) => (
                <div 
                  key={payment.id} 
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getTypeIcon(payment.payment_type)}
                    <div>
                      <p className="font-medium text-sm">{payment.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(payment.created_at), "dd. MMM yyyy, HH:mm", { locale: de })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(payment.status)}
                    <span className={`font-semibold ${
                      payment.payment_type === "credit_topup" ? "text-green-600" : "text-red-500"
                    }`}>
                      {payment.payment_type === "credit_topup" ? "+" : "-"}CHF {payment.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
