import { Share2, Facebook, Twitter, Linkedin, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link kopiert!",
      description: "Der Link wurde in die Zwischenablage kopiert.",
    });
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  return (
    <Card className="shadow-soft">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Artikel teilen</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={shareOnFacebook}
            className="flex-1 min-w-[100px]"
          >
            <Facebook className="w-4 h-4 mr-2" />
            Facebook
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={shareOnTwitter}
            className="flex-1 min-w-[100px]"
          >
            <Twitter className="w-4 h-4 mr-2" />
            Twitter
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={shareOnLinkedIn}
            className="flex-1 min-w-[100px]"
          >
            <Linkedin className="w-4 h-4 mr-2" />
            LinkedIn
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={copyToClipboard}
            className="flex-1 min-w-[100px]"
          >
            <Link2 className="w-4 h-4 mr-2" />
            Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
