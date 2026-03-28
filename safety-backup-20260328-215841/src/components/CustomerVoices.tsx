import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, 
  Star, Quote, CheckCircle2, ThumbsUp
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import LazyImage from "@/components/LazyImage";
import SectionBadge from "@/components/SectionBadge";

interface VideoTestimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  videoThumbnail: string;
  avatar: string;
  moveType: string;
  verified: boolean;
  date: string;
}

const videoTestimonials: VideoTestimonial[] = [
  {
    id: 1,
    name: "Familie Huber",
    location: "Zürich → Winterthur",
    rating: 5,
    text: "Der Umzug unserer 5-Zimmer-Wohnung war perfekt organisiert. Das Team war pünktlich, freundlich und hat alles mit größter Sorgfalt behandelt.",
    videoThumbnail: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800",
    avatar: "FH",
    moveType: "Familienumzug",
    verified: true,
    date: "November 2024"
  },
  {
    id: 2,
    name: "Dr. med. Keller",
    location: "Basel → Bern",
    rating: 5,
    text: "Als Arzt habe ich wenig Zeit. Feierabend Umzüge hat alles übernommen - vom Einpacken bis zum Aufhängen der Bilder. Absolut empfehlenswert!",
    videoThumbnail: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800",
    avatar: "DK",
    moveType: "VIP-Umzug",
    verified: true,
    date: "Oktober 2024"
  },
  {
    id: 3,
    name: "Seniorin Müller",
    location: "Luzern",
    rating: 5,
    text: "Mit 78 Jahren hatte ich große Angst vor dem Umzug. Das Team war so einfühlsam und geduldig. Sie haben mir sogar beim Auspacken geholfen.",
    videoThumbnail: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800",
    avatar: "SM",
    moveType: "Seniorenumzug",
    verified: true,
    date: "September 2024"
  },
  {
    id: 4,
    name: "Tech Startup AG",
    location: "St. Gallen",
    rating: 5,
    text: "Unser Büroumzug am Wochenende - Freitag Abend raus, Montag morgen arbeitsfähig. Perfekte Planung, null Ausfallzeit!",
    videoThumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    avatar: "TS",
    moveType: "Büroumzug",
    verified: true,
    date: "August 2024"
  },
];

const googleReviews = [
  { name: "M. Brunner", text: "Absolut empfehlenswert! Pünktlich, sorgfältig, freundlich.", rating: 5, ago: "vor 2 Wochen" },
  { name: "S. Keller", text: "Bester Umzugsservice den wir je hatten. Danke!", rating: 5, ago: "vor 1 Monat" },
  { name: "A. Weber", text: "Professionell und fair. Würde jederzeit wieder buchen.", rating: 5, ago: "vor 1 Monat" },
];

const CustomerVoices = () => {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay || isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % videoTestimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [autoPlay, isPlaying]);

  const goTo = (index: number) => {
    setCurrent(index);
    setIsPlaying(false);
  };

  const prev = () => {
    setCurrent((current - 1 + videoTestimonials.length) % videoTestimonials.length);
    setIsPlaying(false);
  };

  const next = () => {
    setCurrent((current + 1) % videoTestimonials.length);
    setIsPlaying(false);
  };

  const testimonial = videoTestimonials[current];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-8 sm:mb-10 lg:mb-12">
          <SectionBadge variant="warm">Kundenstimmen</SectionBadge>
          <h2 className="text-balance font-display mt-3 sm:mt-4">
            Was unsere <span className="text-gradient">Kunden</span> sagen
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
            Überzeugen Sie sich selbst von der Qualität unserer Arbeit
          </p>
        </AnimatedSection>

        {/* Google Rating Summary + Recent Reviews */}
        <div className="mb-10 sm:mb-12 lg:mb-14">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            {/* Google Rating Summary */}
            <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-card border border-border shadow-soft flex-shrink-0">
              <div className="text-center">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-3xl sm:text-4xl font-bold font-display">5.0</span>
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 text-warm fill-warm" />
                </div>
                <div className="flex gap-0.5 mb-1 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-warm fill-warm" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">247 Bewertungen</p>
              </div>
              <div className="w-px h-14 bg-border" />
              <div>
                <a 
                  href="https://www.google.com/maps" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#4285F4] font-medium hover:underline"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-xs sm:text-sm">Google</span>
                </a>
                <p className="text-xs text-muted-foreground mt-1">Verifizierte Bewertungen</p>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
              {googleReviews.map((review, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 rounded-xl bg-card border border-border hover:shadow-soft transition-shadow animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-warm fill-warm" />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">{review.ago}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
                    &quot;{review.text}&quot;
                  </p>
                  <p className="text-xs font-medium">{review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Video Testimonials */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            {/* Video/Image Section */}
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group">
              <LazyImage
                src={testimonial.videoThumbnail}
                alt={testimonial.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 hover:bg-white hover:scale-110 text-primary shadow-xl backdrop-blur-sm transition-transform touch-manipulation"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 sm:w-8 sm:h-8" />
                  ) : (
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1" />
                  )}
                </Button>
              </div>

              {/* Move Type Badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-2 flex-wrap">
                <Badge className="bg-primary text-primary-foreground text-xs">
                  {testimonial.moveType}
                </Badge>
                {testimonial.verified && (
                  <Badge variant="secondary" className="bg-green-500/90 text-white gap-1 text-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    Verifiziert
                  </Badge>
                )}
              </div>

              {/* Date Badge */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <Badge variant="outline" className="bg-black/50 text-white border-white/20 text-xs">
                  {testimonial.date}
                </Badge>
              </div>

              {/* Controls */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div
                  className="h-full bg-primary transition-all duration-[6000ms] ease-linear"
                  style={{ width: "100%", animation: "progress 6s linear infinite" }}
                  key={current}
                />
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="animate-fade-in" key={testimonial.id}>
              <Card className="border-primary/10 bg-gradient-to-br from-card to-muted/20 shadow-xl">
                <CardContent className="p-5 sm:p-6 md:p-8">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-primary/30" />
                    <div className="flex items-center gap-1 bg-warm/10 px-2 sm:px-3 py-1 rounded-full">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-warm fill-warm" />
                      <span className="text-xs sm:text-sm font-medium text-warm">Top bewertet</span>
                    </div>
                  </div>
                  
                  {/* Stars */}
                  <div className="flex gap-1 mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 sm:w-6 sm:h-6 fill-warm text-warm animate-scale-in"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                    <span className="ml-2 text-xs sm:text-sm text-muted-foreground">5.0</span>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-base sm:text-lg md:text-xl text-foreground mb-4 sm:mb-6 leading-relaxed italic">
                    &quot;{testimonial.text}&quot;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-primary to-alpine text-primary-foreground flex items-center justify-center text-sm sm:text-base lg:text-lg font-bold shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm sm:text-base lg:text-lg">{testimonial.name}</p>
                        {testimonial.verified && (
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.location}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{testimonial.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-4 sm:mt-6">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={prev} 
                    className="rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:scale-105 transition-transform touch-manipulation"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={next} 
                    className="rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:scale-105 transition-transform touch-manipulation"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Dots */}
                <div className="flex gap-1.5 sm:gap-2">
                  {videoTestimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goTo(index)}
                      className={`h-2.5 sm:h-3 rounded-full transition-all touch-manipulation ${
                        index === current 
                          ? "bg-primary w-6 sm:w-8" 
                          : "bg-muted-foreground/30 w-2.5 sm:w-3 hover:bg-muted-foreground/50"
                      }`}
                    />
                  ))}
                </div>

                {/* Autoplay Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAutoPlay(!autoPlay)}
                  className={`text-xs ${autoPlay ? "text-primary" : "text-muted-foreground"}`}
                >
                  {autoPlay ? "Auto ●" : "Auto ○"}
                </Button>
              </div>
            </div>
          </div>

          {/* Social Proof Stats */}
          <AnimatedSection className="mt-8 sm:mt-10 lg:mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-4 sm:px-6 py-3 sm:py-4 bg-muted/50 rounded-full border">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["FH", "DK", "SM", "TS"].map((avatar, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs flex items-center justify-center border-2 border-background"
                    >
                      {avatar}
                    </div>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">+2&apos;500 zufriedene Kunden</span>
              </div>
              <div className="hidden sm:block h-6 w-px bg-border" />
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-warm text-warm" />
                <span className="font-bold text-sm sm:text-base">4.9</span>
                <span className="text-xs sm:text-sm text-muted-foreground">basierend auf 847 Bewertungen</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default CustomerVoices;
