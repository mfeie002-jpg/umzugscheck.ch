/**
 * Platform Documentation Library
 * Runbooks, API documentation, and operational guides
 */

// ============ RUNBOOKS ============

export interface Runbook {
  id: string;
  title: string;
  category: 'incident' | 'deployment' | 'maintenance' | 'operations';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  steps: RunbookStep[];
  contacts: string[];
  lastUpdated: string;
}

export interface RunbookStep {
  order: number;
  title: string;
  description: string;
  commands?: string[];
  checkpoints?: string[];
  rollback?: string;
}

export const RUNBOOKS: Runbook[] = [
  {
    id: 'rb-001',
    title: 'Website Down - Complete Outage',
    category: 'incident',
    severity: 'critical',
    description: 'Procedure when the main website is completely unreachable',
    lastUpdated: '2025-01-21',
    contacts: ['Tech Lead', 'DevOps', 'Product Owner'],
    steps: [
      {
        order: 1,
        title: 'Verify Outage',
        description: 'Confirm the outage is real and not a local issue',
        commands: [
          'curl -I https://umzugscheck.ch',
          'ping umzugscheck.ch',
          'Check from multiple networks (mobile, different ISP)'
        ],
        checkpoints: ['DNS resolves correctly', 'Server responds or times out']
      },
      {
        order: 2,
        title: 'Check Lovable Status',
        description: 'Verify Lovable/hosting platform status',
        commands: [
          'Visit Lovable status page',
          'Check #lovable-status Discord channel'
        ],
        checkpoints: ['Identify if platform-wide issue']
      },
      {
        order: 3,
        title: 'Check Backend Services',
        description: 'Verify Supabase and edge functions',
        commands: [
          'Test Supabase connection via admin panel',
          'Check edge function logs',
          'Review recent deployments'
        ],
        checkpoints: ['Database accessible', 'Edge functions responding']
      },
      {
        order: 4,
        title: 'Communicate',
        description: 'Notify stakeholders and customers',
        commands: [
          'Post on social media about known issue',
          'Update status page if available',
          'Notify partner companies via email'
        ],
        checkpoints: ['All stakeholders informed']
      },
      {
        order: 5,
        title: 'Resolution & Post-Mortem',
        description: 'Document and learn from the incident',
        commands: [
          'Document timeline of events',
          'Identify root cause',
          'Create action items for prevention'
        ],
        rollback: 'If new deployment caused issue, revert to previous version'
      }
    ]
  },
  {
    id: 'rb-002',
    title: 'Database Performance Issues',
    category: 'incident',
    severity: 'high',
    description: 'Procedure for slow database queries or connection issues',
    lastUpdated: '2025-01-21',
    contacts: ['Tech Lead', 'Backend Developer'],
    steps: [
      {
        order: 1,
        title: 'Identify Slow Queries',
        description: 'Find queries causing performance issues',
        commands: [
          'Check Supabase logs for slow queries',
          'Review recent code changes',
          'Check for missing indexes'
        ],
        checkpoints: ['Slow queries identified']
      },
      {
        order: 2,
        title: 'Immediate Mitigation',
        description: 'Reduce load if necessary',
        commands: [
          'Enable query caching if available',
          'Reduce concurrent connections',
          'Scale up instance temporarily'
        ],
        checkpoints: ['Load reduced', 'Response times improving']
      },
      {
        order: 3,
        title: 'Fix Root Cause',
        description: 'Implement permanent fix',
        commands: [
          'Add missing indexes',
          'Optimize slow queries',
          'Implement connection pooling if needed'
        ],
        rollback: 'Remove new indexes if they cause issues'
      }
    ]
  },
  {
    id: 'rb-003',
    title: 'Production Deployment',
    category: 'deployment',
    severity: 'medium',
    description: 'Standard deployment procedure for production releases',
    lastUpdated: '2025-01-21',
    contacts: ['Tech Lead', 'QA'],
    steps: [
      {
        order: 1,
        title: 'Pre-Deployment Checks',
        description: 'Verify readiness for deployment',
        commands: [
          'Review all changes in PR',
          'Verify all tests pass',
          'Check for breaking changes in database migrations'
        ],
        checkpoints: ['All checks green', 'Team approval received']
      },
      {
        order: 2,
        title: 'Deploy',
        description: 'Execute deployment',
        commands: [
          'Merge to main branch',
          'Monitor deployment progress in Lovable',
          'Wait for build completion'
        ],
        checkpoints: ['Build successful', 'No error logs']
      },
      {
        order: 3,
        title: 'Post-Deployment Verification',
        description: 'Verify deployment success',
        commands: [
          'Run smoke tests on production',
          'Check critical user flows',
          'Monitor error rates for 30 minutes'
        ],
        checkpoints: ['All smoke tests pass', 'No increase in errors']
      },
      {
        order: 4,
        title: 'Documentation',
        description: 'Update release notes',
        commands: [
          'Update CHANGELOG if applicable',
          'Notify stakeholders of changes',
          'Update feature flags if needed'
        ],
        rollback: 'Revert merge commit and redeploy previous version'
      }
    ]
  },
  {
    id: 'rb-004',
    title: 'New Provider Onboarding',
    category: 'operations',
    severity: 'low',
    description: 'Procedure for onboarding new moving company partners',
    lastUpdated: '2025-01-21',
    contacts: ['Account Manager', 'Support'],
    steps: [
      {
        order: 1,
        title: 'Verification',
        description: 'Verify company credentials',
        commands: [
          'Check business registration (Handelsregister)',
          'Verify insurance coverage',
          'Request references'
        ],
        checkpoints: ['All documents verified']
      },
      {
        order: 2,
        title: 'Account Creation',
        description: 'Create partner account',
        commands: [
          'Create account in admin panel',
          'Set up service areas',
          'Configure pricing tier'
        ],
        checkpoints: ['Account active', 'Can receive leads']
      },
      {
        order: 3,
        title: 'Training',
        description: 'Train partner on platform usage',
        commands: [
          'Send onboarding email with credentials',
          'Schedule training call',
          'Provide documentation'
        ],
        checkpoints: ['Partner can log in', 'Understands lead flow']
      },
      {
        order: 4,
        title: 'Go Live',
        description: 'Activate partner for lead distribution',
        commands: [
          'Enable lead matching',
          'Add to ranking',
          'Monitor first leads'
        ],
        checkpoints: ['Receiving leads', 'Responding appropriately']
      }
    ]
  }
];

// ============ API DOCUMENTATION ============

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  auth: 'none' | 'anon' | 'user' | 'admin';
  parameters?: ApiParameter[];
  requestBody?: ApiRequestBody;
  responses: ApiResponse[];
  example?: {
    request?: string;
    response: string;
  };
}

export interface ApiParameter {
  name: string;
  in: 'path' | 'query' | 'header';
  type: string;
  required: boolean;
  description: string;
}

export interface ApiRequestBody {
  contentType: string;
  schema: Record<string, any>;
  example?: any;
}

export interface ApiResponse {
  status: number;
  description: string;
  schema?: Record<string, any>;
}

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: 'POST',
    path: '/leads',
    description: 'Create a new lead from calculator submission',
    auth: 'anon',
    requestBody: {
      contentType: 'application/json',
      schema: {
        type: 'object',
        required: ['name', 'email', 'from_postal', 'to_postal', 'calculator_input'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          from_postal: { type: 'string' },
          from_city: { type: 'string' },
          to_postal: { type: 'string' },
          to_city: { type: 'string' },
          move_date: { type: 'string', format: 'date' },
          calculator_input: { type: 'object' },
          calculator_output: { type: 'object' }
        }
      },
      example: {
        name: 'Max Muster',
        email: 'max@example.com',
        phone: '+41 79 123 45 67',
        from_postal: '8001',
        from_city: 'Zürich',
        to_postal: '3001',
        to_city: 'Bern',
        move_date: '2025-03-15',
        calculator_input: { rooms: 3, floor: 2, hasLift: true },
        calculator_output: { volume: 35, priceMin: 1200, priceMax: 1800 }
      }
    },
    responses: [
      { status: 201, description: 'Lead created successfully' },
      { status: 400, description: 'Invalid input data' },
      { status: 429, description: 'Rate limit exceeded' }
    ],
    example: {
      response: '{"id": "uuid", "status": "new", "created_at": "2025-01-21T10:00:00Z"}'
    }
  },
  {
    method: 'GET',
    path: '/companies',
    description: 'List moving companies with optional filters',
    auth: 'none',
    parameters: [
      { name: 'region', in: 'query', type: 'string', required: false, description: 'Filter by canton code' },
      { name: 'service', in: 'query', type: 'string', required: false, description: 'Filter by service type' },
      { name: 'rating', in: 'query', type: 'number', required: false, description: 'Minimum rating (1-5)' },
      { name: 'limit', in: 'query', type: 'number', required: false, description: 'Max results (default 20)' },
      { name: 'offset', in: 'query', type: 'number', required: false, description: 'Pagination offset' }
    ],
    responses: [
      { status: 200, description: 'List of companies' },
      { status: 400, description: 'Invalid parameters' }
    ],
    example: {
      response: '{"data": [{"id": "uuid", "name": "Blitz Umzüge AG", "rating": 4.8, "verified": true}], "total": 45}'
    }
  },
  {
    method: 'GET',
    path: '/companies/:slug',
    description: 'Get company details by slug',
    auth: 'none',
    parameters: [
      { name: 'slug', in: 'path', type: 'string', required: true, description: 'Company URL slug' }
    ],
    responses: [
      { status: 200, description: 'Company details' },
      { status: 404, description: 'Company not found' }
    ]
  },
  {
    method: 'POST',
    path: '/calculate',
    description: 'Calculate moving price estimate',
    auth: 'anon',
    requestBody: {
      contentType: 'application/json',
      schema: {
        type: 'object',
        required: ['from_postal', 'to_postal', 'rooms'],
        properties: {
          from_postal: { type: 'string' },
          to_postal: { type: 'string' },
          rooms: { type: 'number' },
          floor: { type: 'number' },
          hasLift: { type: 'boolean' },
          services: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    responses: [
      { status: 200, description: 'Price estimate calculated' },
      { status: 400, description: 'Invalid input' }
    ],
    example: {
      response: '{"volume": 35, "distance_km": 120, "price_min": 1200, "price_max": 1800, "matching_companies": 8}'
    }
  },
  {
    method: 'POST',
    path: '/reviews',
    description: 'Submit a review for a company',
    auth: 'anon',
    requestBody: {
      contentType: 'application/json',
      schema: {
        type: 'object',
        required: ['company_id', 'rating', 'author_name', 'content'],
        properties: {
          company_id: { type: 'string', format: 'uuid' },
          rating: { type: 'number', minimum: 1, maximum: 5 },
          author_name: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          move_date: { type: 'string', format: 'date' }
        }
      }
    },
    responses: [
      { status: 201, description: 'Review submitted (pending moderation)' },
      { status: 400, description: 'Invalid input' },
      { status: 429, description: 'Rate limit exceeded' }
    ]
  }
];

// ============ OPERATIONAL GUIDES ============

export interface OperationalGuide {
  id: string;
  title: string;
  category: 'admin' | 'marketing' | 'support' | 'development';
  sections: GuideSection[];
  lastUpdated: string;
}

export interface GuideSection {
  title: string;
  content: string;
  tips?: string[];
  warnings?: string[];
}

export const OPERATIONAL_GUIDES: OperationalGuide[] = [
  {
    id: 'guide-admin-overview',
    title: 'Admin Dashboard Overview',
    category: 'admin',
    lastUpdated: '2025-01-21',
    sections: [
      {
        title: 'Dashboard Navigation',
        content: 'The admin dashboard is accessible at /admin. It provides real-time metrics, lead management, and platform configuration tools.',
        tips: [
          'Use keyboard shortcuts: Ctrl+K for search, Ctrl+L for leads',
          'Bookmark frequently used sections',
          'Set up browser notifications for new leads'
        ]
      },
      {
        title: 'Lead Management',
        content: 'All leads are visible in the Leads section. You can filter by status, date, region, and source. Click on any lead to see full details and history.',
        tips: [
          'Use the quick filter buttons for common statuses',
          'Export leads regularly for backup',
          'Check duplicate detection before manual entry'
        ],
        warnings: [
          'Deleting a lead is permanent and cannot be undone',
          'Changing lead status triggers automated emails'
        ]
      },
      {
        title: 'Provider Management',
        content: 'Manage partner companies in the Providers section. You can verify companies, adjust rankings, and monitor performance.',
        tips: [
          'Review new provider applications weekly',
          'Check response rates monthly',
          'Use the ranking simulator before making changes'
        ]
      }
    ]
  },
  {
    id: 'guide-seo-content',
    title: 'SEO Content Guidelines',
    category: 'marketing',
    lastUpdated: '2025-01-21',
    sections: [
      {
        title: 'Page Structure',
        content: 'Every page should have exactly one H1, followed by H2s for main sections. Use H3s for subsections. Include the target keyword in H1 and at least one H2.',
        tips: [
          'Keep H1 under 60 characters',
          'Use natural language, not keyword stuffing',
          'Include location keywords for regional pages'
        ]
      },
      {
        title: 'Meta Tags',
        content: 'Title tags should be 50-60 characters. Meta descriptions should be 150-160 characters. Both should include the primary keyword and a call to action.',
        tips: [
          'Each page needs unique meta tags',
          'Include numbers when possible (e.g., "5 Tipps")',
          'Use action verbs: Vergleichen, Finden, Sparen'
        ],
        warnings: [
          'Duplicate meta tags hurt SEO rankings',
          'Missing meta descriptions reduce click-through rates'
        ]
      },
      {
        title: 'Internal Linking',
        content: 'Every page should link to at least 3 other relevant pages. Use descriptive anchor text, not "click here". Prioritize linking to high-value pages.',
        tips: [
          'Link from content to calculators',
          'Connect regional pages to each other',
          'Update old content with links to new pages'
        ]
      }
    ]
  },
  {
    id: 'guide-customer-support',
    title: 'Customer Support Procedures',
    category: 'support',
    lastUpdated: '2025-01-21',
    sections: [
      {
        title: 'Response Times',
        content: 'Email inquiries should be answered within 4 business hours. Urgent issues (complaints, billing) should be prioritized. Use templates for common questions.',
        tips: [
          'Acknowledge receipt immediately with auto-responder',
          'Escalate complaints to manager within 1 hour',
          'Follow up on unresolved issues after 48 hours'
        ]
      },
      {
        title: 'Common Issues',
        content: 'Most support requests fall into categories: lead status, provider complaints, pricing questions, and technical issues. Use the knowledge base for standard answers.',
        tips: [
          'Always verify customer identity before sharing data',
          'Document all interactions in the CRM',
          'Offer callback for complex issues'
        ],
        warnings: [
          'Never share lead data with unauthorized parties',
          'Escalate legal threats immediately'
        ]
      },
      {
        title: 'Refunds & Disputes',
        content: 'Provider disputes about lead quality should be reviewed within 24 hours. Valid complaints may result in credit. Document all decisions.',
        tips: [
          'Check lead quality score before deciding',
          'Consider provider history',
          'Offer partial credit as compromise when appropriate'
        ]
      }
    ]
  }
];

// ============ EXPORT FUNCTIONS ============

export function getRunbook(id: string): Runbook | undefined {
  return RUNBOOKS.find(rb => rb.id === id);
}

export function getRunbooksByCategory(category: Runbook['category']): Runbook[] {
  return RUNBOOKS.filter(rb => rb.category === category);
}

export function getApiEndpoint(method: string, path: string): ApiEndpoint | undefined {
  return API_ENDPOINTS.find(ep => ep.method === method && ep.path === path);
}

export function getGuide(id: string): OperationalGuide | undefined {
  return OPERATIONAL_GUIDES.find(g => g.id === id);
}

export function searchDocumentation(query: string): {
  runbooks: Runbook[];
  endpoints: ApiEndpoint[];
  guides: OperationalGuide[];
} {
  const lowerQuery = query.toLowerCase();
  
  return {
    runbooks: RUNBOOKS.filter(rb => 
      rb.title.toLowerCase().includes(lowerQuery) ||
      rb.description.toLowerCase().includes(lowerQuery)
    ),
    endpoints: API_ENDPOINTS.filter(ep =>
      ep.path.toLowerCase().includes(lowerQuery) ||
      ep.description.toLowerCase().includes(lowerQuery)
    ),
    guides: OPERATIONAL_GUIDES.filter(g =>
      g.title.toLowerCase().includes(lowerQuery) ||
      g.sections.some(s => s.title.toLowerCase().includes(lowerQuery))
    )
  };
}
