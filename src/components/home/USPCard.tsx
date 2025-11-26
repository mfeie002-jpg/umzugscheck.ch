import { LucideIcon } from 'lucide-react';

interface USPCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const USPCard = ({ icon: Icon, title, description }: USPCardProps) => {
  return (
    <div className="group bg-card p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
};
