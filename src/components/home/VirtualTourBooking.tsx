import { useState } from "react";
import { motion } from "framer-motion";
import { Video, Calendar, Clock, CheckCircle, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const timeSlots = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

const benefits = [
  {
    icon: Video,
    title: "Präzise Schätzung",
    description: "Experten begutachten Ihr Hab und Gut live per Video",
  },
  {
    icon: Clock,
    title: "Nur 15 Minuten",
    description: "Kurzes, effizientes Beratungsgespräch",
  },
  {
    icon: Award,
    title: "Sofort-Offerte",
    description: "Verbindliches Angebot noch während des Calls",
  },
];

export const VirtualTourBooking = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Bitte wählen Sie Datum und Uhrzeit",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Video-Termin gebucht! 🎉",
      description: `Wir sehen uns am ${selectedDate} um ${selectedTime}`,
    });

    // Reset form
    setSelectedDate("");
    setSelectedTime("");
    setEmail("");
    setPhone("");
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Virtuelle Besichtigung buchen
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Zeigen Sie uns Ihre Wohnung per Video-Call und erhalten Sie eine präzise Offerte
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center h-full border-2 border-primary/20">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-2xl border-2 border-primary/30">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label className="flex items-center gap-2 font-semibold text-foreground mb-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      Wählen Sie ein Datum
                    </label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="flex items-center gap-2 font-semibold text-foreground mb-3">
                      <Clock className="w-5 h-5 text-primary" />
                      Wählen Sie eine Uhrzeit
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedTime === slot
                              ? "border-primary bg-primary/10 font-semibold"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        E-Mail
                      </label>
                      <Input
                        type="email"
                        placeholder="ihre.email@beispiel.ch"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Telefon
                      </label>
                      <Input
                        type="tel"
                        placeholder="+41 79 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Termin verbindlich buchen
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Sie erhalten eine Bestätigung per E-Mail mit dem Video-Call-Link
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 p-6 bg-card border-2 border-primary/20 rounded-2xl"
          >
            <h4 className="font-bold text-foreground mb-3">
              So funktioniert's:
            </h4>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>Wählen Sie einen freien Termin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>Führen Sie den Experten per Video durch Ihre Wohnung</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span>Erhalten Sie eine verbindliche Offerte noch im Call</span>
              </li>
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
