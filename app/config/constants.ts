// Application constants
export const APP_CONSTANTS = {
  // App information
  APP_NAME: 'Ethio Agency Hub',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Comprehensive digital management platform for Ethiopian foreign employment agencies',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES_PER_UPLOAD: 5,
  
  // Allowed file types
  ALLOWED_FILE_TYPES: {
    IMAGES: ['jpg', 'jpeg', 'png', 'gif'],
    DOCUMENTS: ['pdf', 'doc', 'docx'],
    ALL: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
  },
  
  // Date formats
  DATE_FORMATS: {
    DISPLAY: 'MMM dd, yyyy',
    INPUT: 'yyyy-MM-dd',
    DATETIME: 'MMM dd, yyyy HH:mm',
    TIME: 'HH:mm',
  },
  
  // Phone number formats
  PHONE_FORMATS: {
    ETHIOPIA: '+251',
    INTERNATIONAL: '+',
  },
  
  // Status values
  STATUSES: {
    EMPLOYEE: ['pending', 'active', 'inactive', 'suspended'],
    DOCUMENT: ['pending', 'verified', 'rejected', 'expired'],
    TRAVEL: ['scheduled', 'confirmed', 'departed', 'arrived', 'cancelled'],
    HAJJ_UMRAH: ['registered', 'confirmed', 'departed', 'completed'],
    USER: ['active', 'inactive', 'suspended'],
  },
  
  // Roles
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    AGENT: 'agent',
    EMPLOYEE: 'employee',
  },
  
  // Permissions
  PERMISSIONS: {
    EMPLOYEE: {
      CREATE: 'employee:create',
      READ: 'employee:read',
      UPDATE: 'employee:update',
      DELETE: 'employee:delete',
    },
    DOCUMENT: {
      CREATE: 'document:create',
      READ: 'document:read',
      UPDATE: 'document:update',
      DELETE: 'document:delete',
      VERIFY: 'document:verify',
    },
    TRAVEL: {
      CREATE: 'travel:create',
      READ: 'travel:read',
      UPDATE: 'travel:update',
      DELETE: 'travel:delete',
    },
    ADMIN: {
      USER_MANAGEMENT: 'admin:user_management',
      SYSTEM_SETTINGS: 'admin:system_settings',
      REPORTS: 'admin:reports',
    },
  },
  
  // Validation rules
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
    PASSWORD_MIN_LENGTH: 8,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
  },
  
  // API endpoints
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
    },
    EMPLOYEE: {
      LIST: '/api/employees',
      CREATE: '/api/employees',
      UPDATE: '/api/employees/:id',
      DELETE: '/api/employees/:id',
    },
    DOCUMENT: {
      LIST: '/api/documents',
      UPLOAD: '/api/documents/upload',
      VERIFY: '/api/documents/:id/verify',
    },
  },
  
  // Cache keys
  CACHE_KEYS: {
    USER_SESSION: 'user:session:',
    EMPLOYEE_LIST: 'employee:list:',
    DOCUMENT_LIST: 'document:list:',
    DASHBOARD_STATS: 'dashboard:stats',
  },
  
  // Cache TTL (Time To Live) in seconds
  CACHE_TTL: {
    SHORT: 300, // 5 minutes
    MEDIUM: 1800, // 30 minutes
    LONG: 3600, // 1 hour
    VERY_LONG: 86400, // 24 hours
  },
  
  // Error codes
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  },
  
  // Success messages
  SUCCESS_MESSAGES: {
    EMPLOYEE_CREATED: 'Employee created successfully',
    EMPLOYEE_UPDATED: 'Employee updated successfully',
    EMPLOYEE_DELETED: 'Employee deleted successfully',
    DOCUMENT_UPLOADED: 'Document uploaded successfully',
    DOCUMENT_VERIFIED: 'Document verified successfully',
    USER_LOGGED_IN: 'User logged in successfully',
    USER_LOGGED_OUT: 'User logged out successfully',
  },
  
  // Error messages
  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    NOT_FOUND: 'Resource not found',
    VALIDATION_FAILED: 'Validation failed',
    INTERNAL_ERROR: 'An internal error occurred',
    EXTERNAL_SERVICE_ERROR: 'External service error',
  },
  
  // Countries
  COUNTRIES: {
    ETHIOPIA: 'Ethiopia',
    SAUDI_ARABIA: 'Saudi Arabia',
    UAE: 'United Arab Emirates',
    QATAR: 'Qatar',
    KUWAIT: 'Kuwait',
    BAHRAIN: 'Bahrain',
    OMAN: 'Oman',
  },
  
  // Regions in Ethiopia
  ETHIOPIAN_REGIONS: [
    'Addis Ababa',
    'Dire Dawa',
    'Afar',
    'Amhara',
    'Benishangul-Gumuz',
    'Gambela',
    'Harari',
    'Oromia',
    'Sidama',
    'Somali',
    'SNNPR',
    'Tigray',
  ],
  
  // Languages
  LANGUAGES: {
    AMHARIC: 'Amharic',
    ENGLISH: 'English',
    ARABIC: 'Arabic',
    OROMO: 'Oromo',
    TIGRINYA: 'Tigrinya',
  },
  
  // Skills categories
  SKILL_CATEGORIES: {
    DOMESTIC: 'Domestic Work',
    HEALTHCARE: 'Healthcare',
    CONSTRUCTION: 'Construction',
    AGRICULTURE: 'Agriculture',
    HOSPITALITY: 'Hospitality',
    EDUCATION: 'Education',
  },
  
  // Document types
  DOCUMENT_TYPES: {
    PASSPORT: 'passport',
    CV: 'cv',
    MEDICAL: 'medical',
    EDUCATIONAL: 'educational',
    EXPERIENCE: 'experience',
    BANK: 'bank',
    PHOTO: 'photo',
  },
  
  // Travel types
  TRAVEL_TYPES: {
    EMPLOYMENT: 'employment',
    HAJJ: 'hajj',
    UMRAH: 'umrah',
    TOURISM: 'tourism',
    BUSINESS: 'business',
  },
} as const;

// Type for constants
export type AppConstants = typeof APP_CONSTANTS;

// Helper functions
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    pending: 'yellow',
    active: 'green',
    inactive: 'gray',
    suspended: 'red',
    verified: 'green',
    rejected: 'red',
    expired: 'orange',
    scheduled: 'blue',
    confirmed: 'green',
    departed: 'purple',
    arrived: 'green',
    cancelled: 'red',
  };
  
  return statusColors[status] || 'gray';
};

export const getRoleDisplayName = (role: string): string => {
  const roleNames: Record<string, string> = {
    super_admin: 'Super Administrator',
    admin: 'Administrator',
    agent: 'Agent',
    employee: 'Employee',
  };
  
  return roleNames[role] || role;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isValidEmail = (email: string): boolean => {
  return APP_CONSTANTS.VALIDATION.EMAIL_REGEX.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  return APP_CONSTANTS.VALIDATION.PHONE_REGEX.test(phone);
};
