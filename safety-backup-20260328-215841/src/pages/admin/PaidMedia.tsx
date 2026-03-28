/**
 * Paid Media Admin Page
 * ROI Tracking & Kill Switch Monitoring
 */

import { AdminLayout } from "@/components/admin/AdminLayout";
import { PaidMediaDashboard } from "@/components/admin/paid-media";

export default function PaidMedia() {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <PaidMediaDashboard />
      </div>
    </AdminLayout>
  );
}
