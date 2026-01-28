import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  CreditCard, Building2, Banknote, CheckCircle2, Shield, 
  Lock, Calendar, Receipt, ArrowRight
} from "lucide-react";

interface PaymentSimulatorProps {
  amount: number;
  description: string;
  onSuccess?: (paymentId: string) => void;
}

const PaymentSimulator = ({ amount, description, onSuccess }: PaymentSimulatorProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "invoice">("card");
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const deposit = amount * 0.2; // 20% deposit

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    setProcessing(false);
    setCompleted(true);
    toast.success("Zahlung erfolgreich!");
    onSuccess?.(paymentId);
  };

  if (completed) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </motion.div>
          <h3 className="text-2xl font-display font-bold mb-2">Zahlung erfolgreich!</h3>
          <p className="text-muted-foreground mb-4">
            Vielen Dank für Ihre Anzahlung von CHF {deposit.toLocaleString()}
          </p>
          <div className="bg-muted/50 p-4 rounded-lg text-left">
            <div className="flex justify-between text-sm mb-2">
              <span>Referenz:</span>
              <span className="font-mono">PAY-{Date.now().toString().slice(-8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Betrag:</span>
              <span className="font-bold">CHF {deposit.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Eine Bestätigung wurde an Ihre E-Mail-Adresse gesendet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-alpine/10 to-warm/10">
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Anzahlung leisten
        </CardTitle>
        <CardDescription>
          Sichern Sie Ihren Umzugstermin mit einer Anzahlung
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Amount Summary */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Gesamtbetrag:</span>
            <span>CHF {amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Anzahlung (20%):</span>
            <span className="font-bold text-lg">CHF {deposit.toLocaleString()}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Restbetrag am Umzugstag:</span>
            <span>CHF {(amount - deposit).toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <Label>Zahlungsmethode</Label>
          <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as typeof paymentMethod)}>
            <div 
              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === "card" ? "border-alpine bg-alpine/5" : "hover:bg-muted/30"
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                <CreditCard className="h-5 w-5" />
                <div>
                  <p className="font-medium">Kreditkarte</p>
                  <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
                </div>
              </Label>
              <div className="flex gap-1">
                <Badge variant="outline" className="text-xs">Visa</Badge>
                <Badge variant="outline" className="text-xs">MC</Badge>
              </div>
            </div>
            
            <div 
              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === "bank" ? "border-alpine bg-alpine/5" : "hover:bg-muted/30"
              }`}
              onClick={() => setPaymentMethod("bank")}
            >
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer flex-1">
                <Building2 className="h-5 w-5" />
                <div>
                  <p className="font-medium">E-Banking / TWINT</p>
                  <p className="text-xs text-muted-foreground">Direkte Banküberweisung</p>
                </div>
              </Label>
              <Badge variant="outline" className="text-xs">TWINT</Badge>
            </div>
            
            <div 
              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === "invoice" ? "border-alpine bg-alpine/5" : "hover:bg-muted/30"
              }`}
              onClick={() => setPaymentMethod("invoice")}
            >
              <RadioGroupItem value="invoice" id="invoice" />
              <Label htmlFor="invoice" className="flex items-center gap-2 cursor-pointer flex-1">
                <Banknote className="h-5 w-5" />
                <div>
                  <p className="font-medium">Rechnung</p>
                  <p className="text-xs text-muted-foreground">Zahlung innert 10 Tagen</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Card Details */}
        {paymentMethod === "card" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Kartennummer</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="pl-10"
                />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Gültig bis</Label>
                <div className="relative">
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <div className="relative">
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength={4}
                    className="pl-10"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {paymentMethod === "bank" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm"
          >
            <p className="font-medium">Bankverbindung:</p>
            <p>Feierabend Umzüge AG</p>
            <p>IBAN: CH93 0076 2011 6238 5295 7</p>
            <p>BIC: POFICHBEXXX</p>
            <p className="text-xs text-muted-foreground mt-2">
              Oder scannen Sie den TWINT QR-Code in Ihrer Banking-App
            </p>
          </motion.div>
        )}

        {paymentMethod === "invoice" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-muted/30 p-4 rounded-lg text-sm"
          >
            <p>Die Rechnung wird an Ihre E-Mail-Adresse gesendet.</p>
            <p className="text-muted-foreground mt-1">Zahlungsfrist: 10 Tage</p>
          </motion.div>
        )}

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Sichere Zahlung mit SSL-Verschlüsselung</span>
        </div>

        {/* Submit */}
        <Button 
          onClick={handlePayment} 
          className="w-full" 
          size="lg"
          disabled={processing}
        >
          {processing ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Wird verarbeitet...
            </>
          ) : (
            <>
              CHF {deposit.toLocaleString()} bezahlen
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentSimulator;
