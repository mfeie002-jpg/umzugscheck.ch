import { AdminLayout } from "@/components/admin/AdminLayout";
import { ScreenshotMachine } from "@/components/admin/ScreenshotMachine";
import { SEOHtmlAnalyzer } from "@/components/admin/SEOHtmlAnalyzer";
import { AutoFlowScreenshots } from "@/components/admin/AutoFlowScreenshots";
import { AutoVersionScreenshots } from "@/components/admin/AutoVersionScreenshots";
import { BulkScreenshotCapture } from "@/components/admin/BulkScreenshotCapture";
import { ScreenshotValidationTool } from "@/components/admin/flow-command-center/components/ScreenshotValidationTool";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Camera, Search, Zap, Database, ImagePlus, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function Screenshots() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Screenshots & SEO</h1>
            <p className="text-muted-foreground">
              Erstellen Sie Screenshots und analysieren Sie SEO-relevante HTML-Inhalte
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/flow-review">
              <ExternalLink className="h-4 w-4 mr-2" />
              Flow Review (Vergleich)
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="bulk-capture" className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="bulk-capture" className="flex items-center gap-2">
              <ImagePlus className="h-4 w-4" />
              Bulk Capture
            </TabsTrigger>
            <TabsTrigger value="validation" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Validierung
            </TabsTrigger>
            <TabsTrigger value="version-screenshots" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Versions-Screenshots
            </TabsTrigger>
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
          
          <TabsContent value="bulk-capture">
            <BulkScreenshotCapture />
          </TabsContent>

          <TabsContent value="validation">
            <ScreenshotValidationTool />
          </TabsContent>
          
          <TabsContent value="version-screenshots">
            <AutoVersionScreenshots />
          </TabsContent>
          
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
