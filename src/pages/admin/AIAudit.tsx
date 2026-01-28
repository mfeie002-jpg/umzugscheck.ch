/**
 * AI Audit Page
 * Complete AI-powered site analysis system
 */

import React from 'react';
import { AIAuditDashboard } from '@/components/admin/ai-audit';

const AIAudit: React.FC = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <AIAuditDashboard />
    </div>
  );
};

export default AIAudit;
