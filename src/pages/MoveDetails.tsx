import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MoveTracker from "@/components/MoveTracker";
import DocumentManager from "@/components/DocumentManager";
import TeamChat from "@/components/TeamChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, MessageCircle, FileText } from "lucide-react";

export default function MoveDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  if (loading || !id) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="animate-pulse text-center">Laden...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/my-moves")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zu meinen Umzügen
          </Button>

          <Tabs defaultValue="tracking" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="tracking" className="gap-2">
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Tracking</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Dokumente</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tracking">
              <MoveTracker moveId={id} />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentManager moveId={id} />
            </TabsContent>

            <TabsContent value="chat">
              <TeamChat moveId={id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
}