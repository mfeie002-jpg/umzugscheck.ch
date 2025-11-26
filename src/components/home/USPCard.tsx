import { LucideIcon, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface USPCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  details?: string[];
  imageUrl?: string;
  badge?: string;
}

export const USPCard = ({ icon: Icon, title, description, details, imageUrl, badge }: USPCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-card rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl overflow-hidden h-full"
    >
      {/* Image Header if provided */}
      {imageUrl && (
        <div className="relative h-40 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          {badge && (
            <div className="absolute top-3 right-3 bg-accent/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
              {badge}
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <h3 className="font-bold text-xl mb-2 text-foreground group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{description}</p>
        
        {/* Details List */}
        {details && details.length > 0 && (
          <ul className="space-y-2 mt-4">
            {details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};
