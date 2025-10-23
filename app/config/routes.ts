// Route configuration for programmatic routing
export const routes = {
  // Public routes
  home: '/',
  login: '/login',
  logout: '/logout',
  about: '/about',
  services: '/services',
  
  // Auth routes
  auth: {
    login: '/login',
    logout: '/logout',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },
  
  // App routes
  app: {
    dashboard: '/dashboard',
    profile: '/user-settings/profile',
    settings: '/user-settings',
  },
  
  // Employee management routes
  employee: {
    index: '/employee-management',
    registration: '/employee-management/registration',
    registrationSteps: {
      personal: '/employee-management/registration/personal',
      passport: '/employee-management/registration/passport',
      emergency: '/employee-management/registration/emergency-contact',
      skills: '/employee-management/registration/skills',
      languages: '/employee-management/registration/languages',
      regional: '/employee-management/registration/regional-info',
      interests: '/employee-management/registration/interests',
      documents: '/employee-management/registration/documents',
      bank: '/employee-management/registration/bank',
      appointment: '/employee-management/registration/appointment',
      preview: '/employee-management/registration/preview-submit',
    },
    cvUpload: '/employee-management/cv-upload',
    cvGenerator: '/employee-management/cv-generator',
    cvDatabase: '/employee-management/cv-database',
  },
  
  // Document management routes
  documents: {
    index: '/documents',
    dashboard: '/documents/dashboard',
    visa: '/documents/visa',
    mols: '/documents/mols',
    missingReport: '/documents/missing-report',
    crossMatch: '/documents/cross-match',
  },
  
  // Travel management routes
  travel: {
    index: '/travel',
    departure: '/travel/departure',
    ticket: '/travel/ticket',
    today: '/travel/today',
  },
  
  // Hajj & Umrah routes
  hajjUmrah: {
    index: '/hajj-umrah',
    pilgrimDetail: '/hajj-umrah/pilgrim-detail',
    requirements: '/hajj-umrah/requirements',
    documentation: '/hajj-umrah/documentation',
  },
  
  // Institution routes
  institutions: {
    index: '/institutions',
    detail: '/institutions/institution-detail',
    partners: '/institutions/partners',
    collaboration: {
      index: '/institutions/collaboration',
      government: '/institutions/collaboration/government',
      bank: '/institutions/collaboration/bank',
      insurance: '/institutions/collaboration/insurance',
      medical: '/institutions/collaboration/medical',
    },
  },
  
  // Agent routes
  agents: {
    index: '/agents',
    detail: '/agents/agent-detail',
    profile: '/agents/profile',
    performance: '/agents/performance',
    onboarding: '/agents/onboarding',
    training: '/agents/training',
    support: '/agents/support',
  },
  
  // Administration routes
  administration: {
    index: '/administration',
    settings: '/administration/settings',
    users: '/administration/users',
    rolesPermissions: '/administration/roles-permissions',
  },
  
  // Reporting & Analytics routes
  reporting: {
    index: '/reporting-analytics',
    overview: '/reporting-analytics/overview',
    employeeReports: '/reporting-analytics/employee-reports',
    documentReports: '/reporting-analytics/document-reports',
    financialReports: '/reporting-analytics/financial-reports',
  },
  
  // User settings routes
  userSettings: {
    index: '/user-settings',
    profile: '/user-settings/profile',
    security: '/user-settings/security',
    notifications: '/user-settings/notifications',
  },
  
  // API routes
  api: {
    upload: '/api/upload',
    checkEmail: '/api/check-email',
    generateCv: '/api/generate-cv',
    molsSync: '/api/mols/sync',
    reportGenerate: '/api/reports/generate',
  },
} as const;

// Route parameter types
export type RouteParams = {
  [K in keyof typeof routes]: typeof routes[K] extends string
    ? never
    : typeof routes[K] extends Record<string, any>
    ? {
        [P in keyof typeof routes[K]]: typeof routes[K][P] extends string
          ? never
          : typeof routes[K][P] extends Record<string, any>
          ? {
              [Q in keyof typeof routes[K][P]]: typeof routes[K][P][Q] extends string
                ? never
                : any;
            }
          : any;
      }
    : any;
};

// Helper functions for route generation
export const buildRoute = (route: string, params?: Record<string, string | number>): string => {
  if (!params) return route;
  
  let builtRoute = route;
  Object.entries(params).forEach(([key, value]) => {
    builtRoute = builtRoute.replace(`:${key}`, String(value));
  });
  
  return builtRoute;
};

// Route validation
export const isValidRoute = (pathname: string): boolean => {
  const allRoutes = Object.values(routes).flat();
  return allRoutes.some(route => {
    if (typeof route === 'string') {
      return pathname === route;
    }
    return false;
  });
};

// Get route by path
export const getRouteByPath = (pathname: string): string | null => {
  const allRoutes = Object.values(routes).flat();
  const route = allRoutes.find(route => {
    if (typeof route === 'string') {
      return pathname === route;
    }
    return false;
  });
  
  return typeof route === 'string' ? route : null;
};
