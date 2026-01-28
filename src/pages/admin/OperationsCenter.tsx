/**
 * Operations Command Center
 * Multi-Brand Business Operations Dashboard
 */

import { AdminLayout } from "@/components/admin/AdminLayout";
import { CommandCenter as OperationsDashboard } from "@/components/admin/operations-center";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OperationsCenter() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Back Button - Mobile optimized */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 h-11 px-3 -ml-2 md:-ml-3"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Zurück
        </Button>
        
        <OperationsDashboard />
      </div>
    </AdminLayout>
  );
}
