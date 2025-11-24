import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportGenerator } from "@/components/admin/ReportGenerator";
import { EmailAutomationManager } from "@/components/admin/EmailAutomationManager";
import { FileText } from "lucide-react";

export default function Reports() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Reports & Automation</h1>
          <p className="text-muted-foreground">
            Generiere Reports und verwalte automatisierte Workflows
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ReportGenerator />
        <EmailAutomationManager />
      </div>
    </div>
  );
}
