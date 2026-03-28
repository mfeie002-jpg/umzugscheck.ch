import { FeierabendButton } from './FeierabendButton';
import { FeierabendCard } from './FeierabendCard';
import { TrustBadge } from './TrustBadge';
import { Star, Shield, Building2, Phone, MessageCircle, ArrowRight } from 'lucide-react';

/**
 * Design System Component Library
 * Visual reference for all Feierabend UI components
 */
export const DesignSystem = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-feierabend-blue-900">
            Feierabend Design System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Modern, Swiss-quality UI components for high-converting landing pages
          </p>
        </div>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-feierabend-blue-900">Color Palette</h2>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Feierabend Blue (Trust)</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[
                { name: '50', color: 'bg-feierabend-blue-50', hex: '#E0F2F2' },
                { name: '100', color: 'bg-feierabend-blue-100', hex: '#B3D9D9' },
                { name: '300', color: 'bg-feierabend-blue-300', hex: '#5FB0B0' },
                { name: '500', color: 'bg-feierabend-blue-500', hex: '#008080' },
                { name: '700', color: 'bg-feierabend-blue-700', hex: '#004D4D' },
                { name: '900', color: 'bg-feierabend-blue-900', hex: '#002626' },
              ].map(({ name, color, hex }) => (
                <div key={name} className="space-y-2">
                  <div className={`${color} h-20 rounded-lg border border-gray-200`} />
                  <p className="text-sm font-mono text-gray-600">
                    {name}: {hex}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Feierabend Orange (Action)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: '100', color: 'bg-feierabend-orange-100', hex: '#FFF0EB' },
                { name: '500', color: 'bg-feierabend-orange-500', hex: '#FF7F50' },
                { name: '600', color: 'bg-feierabend-orange-600', hex: '#FF6B35' },
              ].map(({ name, color, hex }) => (
                <div key={name} className="space-y-2">
                  <div className={`${color} h-20 rounded-lg border border-gray-200`} />
                  <p className="text-sm font-mono text-gray-600">
                    {name}: {hex}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-feierabend-blue-900">Typography</h2>
          
          <div className="bg-white p-8 rounded-2xl shadow-soft space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Display (56px / 3.5rem)</p>
              <h1 className="text-5xl font-black text-feierabend-blue-900 font-sans">
                Zürich: Umzug in 5–10 Minuten fix gebucht
              </h1>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">H1 (40px / 2.5rem)</p>
              <h1 className="text-4xl font-bold text-feierabend-blue-900">
                Wir kennen jeden Winkel von Zürich
              </h1>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">H2 (32px / 2rem)</p>
              <h2 className="text-3xl font-semibold text-feierabend-blue-700">
                Premium Umzugsservice seit 1980
              </h2>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Body Large (20px / 1.25rem)</p>
              <p className="text-xl text-gray-700">
                Live Umzugs-Concierge. Du redest, wir erledigen.
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Body (16px / 1rem)</p>
              <p className="text-base text-gray-700">
                Professioneller Umzugsservice mit Schweizer Qualität. Von der Planung bis zur Endreinigung.
              </p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-feierabend-blue-900">Buttons</h2>
          
          <div className="bg-white p-8 rounded-2xl shadow-soft space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Primary (Call-to-Action)</h3>
              <div className="flex flex-wrap gap-4">
                <FeierabendButton variant="primary" size="sm">
                  Small Primary
                </FeierabendButton>
                <FeierabendButton variant="primary" size="md" icon={<Phone className="w-5 h-5" />}>
                  Jetzt anrufen
                </FeierabendButton>
                <FeierabendButton variant="primary" size="lg" icon={<MessageCircle className="w-6 h-6" />}>
                  WhatsApp
                </FeierabendButton>
                <FeierabendButton variant="primary" loading>
                  Loading...
                </FeierabendButton>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Secondary</h3>
              <div className="flex flex-wrap gap-4">
                <FeierabendButton variant="secondary" size="sm">
                  Small Secondary
                </FeierabendButton>
                <FeierabendButton variant="secondary" size="md" icon={<ArrowRight className="w-5 h-5" />}>
                  Offerte anfordern
                </FeierabendButton>
                <FeierabendButton variant="secondary" size="lg">
                  Large Secondary
                </FeierabendButton>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Text Link</h3>
              <div className="flex flex-wrap gap-4">
                <FeierabendButton variant="text">
                  Mehr erfahren
                </FeierabendButton>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Full Width</h3>
              <FeierabendButton variant="primary" fullWidth>
                Full Width Button
              </FeierabendButton>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-feierabend-blue-900">Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeierabendCard variant="default" className="p-6">
              <h3 className="text-xl font-semibold text-feierabend-blue-700 mb-2">
                Default Card
              </h3>
              <p className="text-gray-600">
                Standard card with soft shadow and border. Used for most content.
              </p>
            </FeierabendCard>
            
            <FeierabendCard variant="premium" className="p-6">
              <h3 className="text-xl font-semibold text-feierabend-blue-700 mb-2">
                Premium Card
              </h3>
              <p className="text-gray-600">
                Gradient background with stronger border. For Zug/Baar premium content.
              </p>
            </FeierabendCard>
            
            <FeierabendCard variant="default" hoverable className="p-6">
              <h3 className="text-xl font-semibold text-feierabend-blue-700 mb-2">
                Hoverable Card
              </h3>
              <p className="text-gray-600">
                Lifts on hover. Used for interactive elements like service cards.
              </p>
            </FeierabendCard>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-feierabend-blue-900">Trust Badges</h2>
          
          <div className="bg-white p-8 rounded-2xl shadow-soft">
            <div className="flex flex-wrap gap-4">
              <TrustBadge 
                icon={<Star className="w-4 h-4" />}
                text="Google 5.0 ★★★★★"
                variant="success"
              />
              <TrustBadge 
                icon={<Building2 className="w-4 h-4" />}
                text="Seit 1980"
                variant="default"
              />
              <TrustBadge 
                icon={<Shield className="w-4 h-4" />}
                text="CHF 2 Mio. versichert"
                variant="success"
              />
              <TrustBadge 
                icon={<Phone className="w-4 h-4" />}
                text="Live 08–19 Uhr"
                variant="default"
              />
            </div>
          </div>
        </section>

        {/* Shadows */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-feierabend-blue-900">Shadows</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-soft">
              <h3 className="font-semibold text-gray-700 mb-2">Soft Shadow</h3>
              <p className="text-sm text-gray-600">Default for cards</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-hover">
              <h3 className="font-semibold text-gray-700 mb-2">Hover Shadow</h3>
              <p className="text-sm text-gray-600">On hover states</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-premium">
              <h3 className="font-semibold text-gray-700 mb-2">Premium Shadow</h3>
              <p className="text-sm text-gray-600">Premium content</p>
            </div>
          </div>
        </section>

        {/* Usage Example */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-feierabend-blue-900">Usage Example: Hero Section</h2>
          
          <FeierabendCard variant="flat" className="bg-gradient-to-br from-feierabend-blue-50 via-white to-white p-12">
            <div className="max-w-4xl">
              <h1 className="text-5xl font-black text-feierabend-blue-900 mb-4">
                Zürich: Umzug in 5–10 Minuten am Telefon fix gebucht
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl">
                Live Umzugs-Concierge. Du redest – wir erledigen deinen Umzug mit Schweizer Qualität.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <TrustBadge 
                  icon={<Star className="w-4 h-4" />}
                  text="Google 5.0"
                  variant="success"
                />
                <TrustBadge 
                  icon={<Building2 className="w-4 h-4" />}
                  text="Seit 1980"
                />
                <TrustBadge 
                  icon={<Shield className="w-4 h-4" />}
                  text="CHF 2 Mio. versichert"
                />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <FeierabendButton variant="primary" size="lg" icon={<Phone className="w-5 h-5" />}>
                  Jetzt anrufen
                </FeierabendButton>
                <FeierabendButton variant="secondary" size="lg" icon={<MessageCircle className="w-5 h-5" />}>
                  WhatsApp
                </FeierabendButton>
                <FeierabendButton variant="secondary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Offerte in 60 Sek
                </FeierabendButton>
              </div>
            </div>
          </FeierabendCard>
        </section>

      </div>
    </div>
  );
};

