/**
 * Social Proof Variant X (V24): Mobile-First Tabs
 * 
 * Research-based: Tabs interface to prevent information overload on mobile
 * Based on: NNGroup mobile adaptation guidelines
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Award, Newspaper, Quote, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColoredMediaLogo } from '@/components/trust/media-logos';

interface Props {
  className?: string;
}

export const MediaLogosSectionVariantX = memo(function MediaLogosSectionVariantX({ className }: Props) {
  return (
    <section className={cn("py-8 bg-muted/30", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto md:max-w-2xl">
          <Tabs defaultValue="numbers" className="w-full">
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="numbers" className="text-xs gap-1">
                <TrendingUp className="w-3 h-3" />
                Zahlen
              </TabsTrigger>
              <TabsTrigger value="media" className="text-xs gap-1">
                <Newspaper className="w-3 h-3" />
                Bekannt aus
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs gap-1">
                <Star className="w-3 h-3" />
                Bewertungen
              </TabsTrigger>
            </TabsList>
            
            {/* Numbers Tab */}
            <TabsContent value="numbers" className="mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-3 gap-3"
              >
                {[
                  { value: "15'000+", label: 'Umzüge', icon: TrendingUp },
                  { value: '4.8/5', label: 'Bewertung', icon: Star },
                  { value: '200+', label: 'Partner', icon: Award },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-background rounded-xl border p-4 text-center"
                  >
                    <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </TabsContent>
            
            {/* Media Tab */}
            <TabsContent value="media" className="mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-background rounded-xl border p-4"
              >
                <p className="text-xs text-muted-foreground text-center mb-4">
                  Bekannt aus Schweizer Medien
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {['20min', 'srf', 'blick', 'nzz'].map((logo) => (
                    <div key={logo} className="opacity-60 hover:opacity-100 transition-opacity">
                      <ColoredMediaLogo name={logo} size="sm" />
                    </div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
            
            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-background rounded-xl border p-4"
              >
                <div className="flex items-start gap-3">
                  <Quote className="w-6 h-6 text-primary/30 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">
                      "Super einfach und wir haben CHF 500 gespart!"
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Sandra K., Zürich
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
          
          {/* Trust Footer */}
          <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              <span>Kostenlos</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              <span>Unverbindlich</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              <span>Swiss Made</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantX;
