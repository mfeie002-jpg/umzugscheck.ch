import { Star } from "lucide-react";

const TRUST_BAR = [
  {
    name: "Swiss Made Software",
    src: "/logos/swiss-made-software.png",
    url: "https://www.swissmadesoftware.org/",
    label: "Swiss Made Software"
  },
  {
    name: "eUmzugCH",
    src: "/logos/eumzugch.png",
    url: "https://www.eumzug.swiss/",
    label: "eUmzugCH kompatibel"
  },
  {
    name: "ASTAG",
    src: "/logos/astag.png",
    url: "https://www.astag.ch/",
    label: "ASTAG zertifiziert"
  },
  {
    name: "Die Post",
    src: "/logos/diepost.png",
    url: "https://www.post.ch/",
    label: "Post Nachsendeauftrag"
  },
  {
    name: "Trusted Reviews",
    src: "/logos/google-reviews.png",
    url: "https://www.google.com/search?q=umzugscheck+bewertungen",
    label: "4.9/5 Sterne (Google)"
  }
];

export default function HybridTrustBar() {
  return (
    <section className="py-1 md:py-2 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h2 className="text-center text-base md:text-lg font-bold text-primary mb-1 tracking-wide uppercase">Der Schweizer Standard für Ihren Umzug</h2>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 w-full max-w-4xl">
          {TRUST_BAR.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener"
              className="group flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <img
                src={item.src}
                alt={item.label}
                className="h-8 md:h-10 w-auto object-contain grayscale group-hover:grayscale-0 group-hover:drop-shadow-md transition-all duration-200"
                loading="lazy"
              />
              <span className="text-xs md:text-sm text-muted-foreground group-hover:text-primary font-medium text-center mt-1">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
