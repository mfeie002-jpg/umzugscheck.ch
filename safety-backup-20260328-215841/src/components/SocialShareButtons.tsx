import { Facebook, Twitter, Linkedin, Link2, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface SocialShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
}

export const SocialShareButtons = ({
  url = typeof window !== "undefined" ? window.location.href : "",
  title = "Ich habe gerade Umzugsofferten verglichen auf Umzugscheck.ch!",
  description = "Kostenlos Umzugsofferten vergleichen und bis zu 40% sparen.",
  className,
}: SocialShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-green-100 hover:text-green-600",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
      color: "hover:bg-blue-100 hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-sky-100 hover:text-sky-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
      color: "hover:bg-blue-100 hover:text-blue-700",
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link kopiert!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Kopieren fehlgeschlagen");
    }
  };

  return (
    <div className={className}>
      <p className="text-sm font-medium mb-3">Teilen Sie Ihre Erfahrung:</p>
      <div className="flex flex-wrap gap-2">
        {shareLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background transition-colors ${link.color}`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{link.name}</span>
            </a>
          );
        })}
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background transition-colors hover:bg-muted"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
          <span className="text-sm">{copied ? "Kopiert!" : "Link kopieren"}</span>
        </button>
      </div>
    </div>
  );
};
