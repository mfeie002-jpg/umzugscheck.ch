import { Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogHeroProps {
  title: string;
  category: string;
  date: string;
  readTime: string;
  image?: string;
}

export const BlogHero = ({ title, category, date, readTime, image }: BlogHeroProps) => {
  return (
    <div className="relative py-16 md:py-20 text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      {image && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-accent text-accent-foreground">
            <Tag className="w-3 h-3 mr-1" />
            {category}
          </Badge>
          
          <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readTime} Lesezeit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
