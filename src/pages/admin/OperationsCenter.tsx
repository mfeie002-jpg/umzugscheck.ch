/**
 * Operations Command Center
 * Multi-Brand Business Operations Dashboard
 */

import { AdminLayout } from "@/components/admin/AdminLayout";
import { CommandCenter as OperationsDashboard } from "@/components/admin/operations-center";

export default function OperationsCenter() {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <OperationsDashboard />
      </div>
    </AdminLayout>
  );
}
