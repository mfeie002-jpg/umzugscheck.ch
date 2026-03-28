import { Star } from "lucide-react";

export default function KundenstimmeSpotlight() {
  return (
    <section className="py-8 md:py-14 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="container mx-auto px-4 max-w-2xl flex flex-col items-center">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold mb-2 text-primary">So fühlt sich "Feierabend" an.</h2>
        <p className="text-center text-base md:text-lg text-muted-foreground mb-6">Über 15'000 Zürcher vertrauen uns ihr Zuhause an. Hier ist einer davon:</p>
        <div className="w-full bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-300" />
            ))}
            <span className="font-semibold text-primary ml-2">Absolut empfehlenswert</span>
          </div>
          <blockquote className="text-center text-lg md:text-xl font-medium text-foreground mb-4">
            „Als Arzt habe ich <b>wenig Zeit</b>. Feierabend Umzüge hat <b>alles übernommen</b> – vom Einpacken bis zum Aufhängen der Bilder.“
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">DK</div>
            <div className="text-sm md:text-base text-muted-foreground">
              Dr. med. Keller <span className="text-xs">· Umzug in Zürich</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full items-center justify-center mb-4">
          {/* Video-Thumbnail */}
          <div className="flex-1 flex flex-col items-center">
            <div className="relative w-full max-w-xs aspect-video rounded-xl overflow-hidden shadow-md">
              <img src="/video-thumb.gif" alt="Umzugsvideo Vorschau" className="object-cover w-full h-full" />
              <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold bg-black/30">
                ▶ Video ansehen (45 Sek)
              </span>
            </div>
            <span className="block mt-2 text-xs text-muted-foreground">Schauen Sie unserem Team bei der Arbeit zu.</span>
          </div>
          {/* Statistiken */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="text-3xl md:text-4xl font-extrabold text-primary">15'000+</div>
            <div className="text-xs text-muted-foreground mb-2">Umzüge seit 1980</div>
            <div className="text-2xl md:text-3xl font-extrabold text-green-600">98%</div>
            <div className="text-xs text-muted-foreground">Weiterempfehlung</div>
          </div>
        </div>
        <a href="https://www.google.com/search?q=feierabend+umz%C3%BCge+bewertungen" target="_blank" rel="noopener" className="mt-2 text-primary font-semibold underline underline-offset-2">Mehr als 250 Google-Bewertungen lesen &gt;</a>
      </div>
    </section>
  );
}
