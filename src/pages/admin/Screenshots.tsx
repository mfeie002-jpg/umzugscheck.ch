import { AdminLayout } from "@/components/admin/AdminLayout";
import { ScreenshotMachine } from "@/components/admin/ScreenshotMachine";

export default function Screenshots() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Screenshots</h1>
          <p className="text-muted-foreground">
            Erstellen Sie Screenshots von Webseiten für Ihr Projekt
          </p>
        </div>
        
        <ScreenshotMachine />
      </div>
    </AdminLayout>
  );
}
