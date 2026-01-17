import { Helmet } from 'react-helmet';
import { Building2, TrendingUp, BarChart3, Handshake, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { AffiliateApplicationForm } from '@/components/referral/AffiliateApplicationForm';

const partnerBenefits = [
  {
    icon: TrendingUp,
    title: 'Bis zu 10% Provision',
    description: 'Verdienen Sie an jeder erfolgreichen Vermittlung – ohne Aufwand.',
  },
  {
    icon: BarChart3,
    title: 'Echtzeit-Dashboard',
    description: 'Verfolgen Sie Ihre Vermittlungen und Verdienste in Echtzeit.',
  },
  {
    icon: Handshake,
    title: 'Persönlicher Support',
    description: 'Ihr dedizierter Ansprechpartner für alle Fragen.',
  },
  {
    icon: Building2,
    title: 'White-Label Option',
    description: 'Integrieren Sie unser Tool in Ihre eigene Website.',
  },
];

const idealPartners = [
  'Immobilienmakler & -vermittler',
  'Hausverwaltungen',
  'Hypothekar- & Finanzberater',
  'Versicherungsberater',
  'Umzugsberater & Relocation-Services',
  'Möbelhäuser & Einrichtungsberater',
];

export default function PartnerWerden() {
  return (
    <>
      <Helmet>
        <title>Partner werden | Affiliate-Programm | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Werden Sie Affiliate-Partner von Umzugscheck.ch. Verdienen Sie bis zu 10% Provision für jeden vermittelten Kunden. Ideal für Immobilienmakler und Hausverwaltungen." 
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
              >
                <Building2 className="h-4 w-4" />
                <span className="text-sm font-medium">Partner-Programm</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                Werden Sie{' '}
                <span className="text-primary">Affiliate-Partner</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-muted-foreground"
              >
                Verdienen Sie an jeder Vermittlung. Ideal für Immobilienmakler, 
                Hausverwaltungen und alle, die mit Umzügen zu tun haben.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Ihre Vorteile als Partner
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {partnerBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
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

        {/* Who Should Partner */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">
                    Für wen ist das Partner-Programm?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Unser Affiliate-Programm ist ideal für alle Unternehmen, 
                    die regelmässig mit Kunden in Kontakt sind, die umziehen.
                  </p>
                  <ul className="space-y-3">
                    {idealPartners.map((partner) => (
                      <li key={partner} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{partner}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-muted/50 rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-4">Beispielrechnung</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <span>Vermittelte Kunden/Monat</span>
                      <span className="font-semibold">10</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Durchschn. Umzugswert</span>
                      <span className="font-semibold">CHF 2'500</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Ihre Provision (10%)</span>
                      <span className="font-semibold">CHF 250/Kunde</span>
                    </div>
                    <div className="flex justify-between text-lg pt-2">
                      <span className="font-bold">Monatlicher Verdienst</span>
                      <span className="font-bold text-primary">CHF 2'500</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              Jetzt Partner werden
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Füllen Sie das Formular aus und wir melden uns innerhalb von 2 Werktagen bei Ihnen.
            </p>
            <AffiliateApplicationForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
