import { ShieldCheck, Sparkles, SprayCan, ClipboardList } from "lucide-react";

const trustItems = [
  {
    title: "Hygiene Certified",
    description: "0123-inspired disinfection protocol for every move.",
    icon: SprayCan,
  },
  {
    title: "Fixed Pricing",
    description: "Transparent quotes with Signal Orange CTAs for clarity.",
    icon: ClipboardList,
  },
  {
    title: "Trained Personnel",
    description: "Stationed crews trained at Swiss Moving Academy.",
    icon: ShieldCheck,
  },
  {
    title: "Clinical Handling",
    description: "Neo-Teal uniforms and glove-first packing routine.",
    icon: Sparkles,
  },
];

export function TrustGrid() {
  return (
    <section className="bg-surface-surface py-14" id="trust">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-secondary">Reasons to choose</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-heading">Built on hygiene and training</h2>
          <p className="text-sm sm:text-base text-text-main max-w-3xl">
            Borrowed from 0123: we answer anxiety before it is spoken. Hygiene, training, and fixed pricing lead our service promise.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-line-default bg-white shadow-soft p-4 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-hover transition-transform duration-200"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-text-heading">{item.title}</p>
                  <p className="text-sm text-text-main">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
