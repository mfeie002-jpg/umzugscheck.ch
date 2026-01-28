import { ArrowRight, Building2, Globe2, Home } from "lucide-react";

const services = [
  {
    title: "Private Move",
    description: "Clinical packing, stair-safe workflows, Swiss Neo-Teal crew leads.",
    icon: Home,
  },
  {
    title: "Business Move",
    description: "Downtime-minimizing playbooks and fixed SLAs for offices.",
    icon: Building2,
  },
  {
    title: "International",
    description: "Logistics partners vetted for hygiene and chain-of-custody.",
    icon: Globe2,
  },
];

export function ServiceShowcase() {
  return (
    <section className="bg-surface-canvas py-14" id="services">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-2 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-secondary">Service Grid</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-heading">Coverage from local to global</h2>
          <p className="text-sm sm:text-base text-text-main max-w-3xl">
            A 0123-inspired layout with Signal Orange borders on hover to reinforce action visibility.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="group relative overflow-hidden rounded-2xl border border-line-default bg-white p-5 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-brand-secondary hover:shadow-strong"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-brand-secondary opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-text-heading">{service.title}</h3>
                <p className="mt-2 text-sm text-text-main">{service.description}</p>
                <div className="mt-6 h-1 w-16 rounded-full bg-brand-secondary/70 group-hover:w-20 transition-all duration-200" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
