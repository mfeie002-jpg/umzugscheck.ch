import { Helmet } from 'react-helmet';
import { Gift, Users, Wallet, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ReferralGenerator } from '@/components/referral/ReferralGenerator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const benefits = [
  {
    icon: Gift,
    title: 'CHF 50 pro Empfehlung',
    description: 'Für jede erfolgreiche Vermittlung erhältst du CHF 50 auf dein Konto.',
  },
  {
    icon: Users,
    title: 'Unbegrenzt verdienen',
    description: 'Es gibt kein Limit – je mehr du empfiehlst, desto mehr verdienst du.',
  },
  {
    icon: Wallet,
    title: 'Einfache Auszahlung',
    description: 'Monatliche Auszahlung per Banküberweisung oder Twint.',
  },
  {
    icon: TrendingUp,
    title: 'Transparentes Tracking',
    description: 'Verfolge deine Empfehlungen und Verdienste in Echtzeit.',
  },
];

const steps = [
  { step: 1, title: 'Registrieren', description: 'Gib deine E-Mail ein und erhalte deinen persönlichen Code.' },
  { step: 2, title: 'Teilen', description: 'Teile deinen Link mit Freunden, Familie oder auf Social Media.' },
  { step: 3, title: 'Verdienen', description: 'Erhalte CHF 50 für jede erfolgreiche Offerten-Anfrage.' },
];

export default function Empfehlen() {
  return (
    <>
      <Helmet>
        <title>Empfehlen & Verdienen | CHF 50 pro Empfehlung | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Verdiene CHF 50 für jede erfolgreiche Empfehlung. Teile deinen persönlichen Link und hilf Freunden beim Umzug – wir belohnen dich dafür!" 
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-primary/5 to-background overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
              >
                <Gift className="h-4 w-4" />
                <span className="text-sm font-medium">Empfehlungsprogramm</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                Empfehle uns & verdiene{' '}
                <span className="text-primary">CHF 50</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-muted-foreground mb-8"
              >
                Teile deinen persönlichen Link mit Freunden und Familie. 
                Für jede erfolgreiche Offerten-Anfrage erhältst du CHF 50!
              </motion.p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-background rounded-xl p-6 shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              So einfach funktioniert's
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    className="relative text-center"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                      {item.step}
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="hidden md:block absolute top-7 -right-4 h-6 w-6 text-muted-foreground" />
                    )}
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Generator Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-xl mx-auto">
              <ReferralGenerator variant="full" rewardAmount={50} />
            </div>
          </div>
        </section>

        {/* Partner CTA */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Sind Sie Immobilienmakler oder Hausverwaltung?
              </h2>
              <p className="text-muted-foreground mb-8">
                Werden Sie Affiliate-Partner und verdienen Sie bis zu 10% Provision 
                für jeden vermittelten Kunden. Ideal für Makler, Hausverwaltungen und mehr.
              </p>
              <Button asChild size="lg">
                <Link to="/partner-werden">
                  <Users className="h-4 w-4 mr-2" />
                  Partner-Programm entdecken
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
