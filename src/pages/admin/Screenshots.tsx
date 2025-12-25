import { AdminLayout } from "@/components/admin/AdminLayout";
import { ScreenshotMachine } from "@/components/admin/ScreenshotMachine";
import { SEOHtmlAnalyzer } from "@/components/admin/SEOHtmlAnalyzer";
import { AutoFlowScreenshots } from "@/components/admin/AutoFlowScreenshots";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Search, Zap } from "lucide-react";

export default function Screenshots() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Screenshots & SEO</h1>
          <p className="text-muted-foreground">
            Erstellen Sie Screenshots und analysieren Sie SEO-relevante HTML-Inhalte
          </p>
        </div>
        
        <Tabs defaultValue="auto-flows" className="space-y-4">
          <TabsList>
            <TabsTrigger value="auto-flows" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Auto Flow-Screenshots
            </TabsTrigger>
            <TabsTrigger value="screenshots" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Manuell
            </TabsTrigger>
            <TabsTrigger value="seo-html" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              SEO HTML Analyse
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="auto-flows">
            <AutoFlowScreenshots />
          </TabsContent>
          
          <TabsContent value="screenshots">
            <ScreenshotMachine />
          </TabsContent>
          
          <TabsContent value="seo-html">
            <SEOHtmlAnalyzer />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
