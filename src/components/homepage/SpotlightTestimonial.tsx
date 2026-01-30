/**
 * SpotlightTestimonial - Single hero story + proof block
 * Mobile-first, static (keine Slider), direkt nach Trust-Bar.
 */

import { memo } from "react";
import { Star, Play, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";

export const SpotlightTestimonial = memo(function SpotlightTestimonial() {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-3 md:px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Zürcher Qualität, die man spürt</h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Über 15'000 Zürcher vertrauen uns ihr Zuhause an. Hier ist einer davon:
          </p>
        </div>

        <div className="grid md:grid-cols-[1.2fr,1fr] gap-5 md:gap-6 items-stretch">
          {/* Spotlight card */}
          <motion.div
            className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 md:p-6 flex flex-col gap-4"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm font-semibold text-foreground">Absolut empfehlenswert</span>
            </div>

            <p className="text-base md:text-lg leading-relaxed text-foreground">
              „Als Arzt habe ich <strong>wenig Zeit</strong>. Feierabend Umzüge hat <strong>alles übernommen</strong> – vom
              Einpacken bis zum Aufhängen der Bilder. Absolut empfehlenswert.“
            </p>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold grid place-items-center">
                DK
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Dr. med. Keller</p>
                <p className="text-xs text-muted-foreground">Umzug in Zürich · Oktober 2024</p>
              </div>
            </div>
          </motion.div>

          {/* Proof block: video + stats */}
          <motion.div
            className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5 flex flex-col gap-4"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col gap-3">
              {/* Video thumb */}
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 aspect-[16/9]">
                <img
                  src="/placeholder.svg"
                  alt="Team beim Umzug"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <button className="absolute left-4 bottom-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-sm font-semibold shadow-md">
                  <Play className="w-4 h-4 fill-current" />
                  Video ansehen (45 Sek)
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Schauen Sie unserem Team bei der Arbeit zu.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 bg-white text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">15'000+</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Umzüge seit 1980</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-foreground">98%</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Weiterempfehlung</p>
              </div>
            </div>

            <div>
              <a
                href="https://www.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Mehr als 250 Google-Bewertungen lesen &gt;
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});
