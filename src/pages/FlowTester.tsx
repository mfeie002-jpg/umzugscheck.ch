/**
 * FlowTester - Redirect to Command Center Flows View
 * Merged into the unified Flow Command Center
 */

import { Navigate } from 'react-router-dom';

export default function FlowTesterPage() {
  return <Navigate to="/flow-command-center?view=flows" replace />;
}
