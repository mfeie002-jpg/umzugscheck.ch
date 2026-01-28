import { Link } from "react-router-dom";
import { ArrowRight, Camera } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const images = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

export default function GalleryPreview() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full mb-4">
            <Camera className="inline-block w-3 h-3 mr-1" />
            Eindrücke
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">
            Bilder sagen mehr als <span className="text-gradient">1000 Worte</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Einblicke in unsere tägliche Arbeit und erfolgreiche Umzüge
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {images.map((image, index) => (
            <AnimatedSection key={index} delay={index * 0.05}>
              <div className="relative aspect-square rounded-xl overflow-hidden group">
                <img
                  src={image}
                  alt={`Feierabend Umzüge Galerie ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center text-alpine font-medium hover:underline"
          >
            Zur kompletten Galerie
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
