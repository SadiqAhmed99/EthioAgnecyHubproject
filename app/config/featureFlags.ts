// Feature flag system for gradual rollouts and A/B testing
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description: string;
  rolloutPercentage?: number;
  targetUsers?: string[];
  targetRoles?: string[];
  startDate?: Date;
  endDate?: Date;
}

// Feature flags configuration
export const FEATURE_FLAGS: Record<string, FeatureFlag> = {
  // Authentication features
  TWO_FACTOR_AUTH: {
    name: 'TWO_FACTOR_AUTH',
    enabled: false,
    description: 'Enable two-factor authentication for enhanced security',
    rolloutPercentage: 0,
    targetRoles: ['admin', 'super_admin'],
  },
  
  // Employee management features
  ADVANCED_EMPLOYEE_SEARCH: {
    name: 'ADVANCED_EMPLOYEE_SEARCH',
    enabled: true,
    description: 'Enable advanced search filters for employee management',
    rolloutPercentage: 100,
  },
  
  CV_GENERATOR: {
    name: 'CV_GENERATOR',
    enabled: true,
    description: 'Enable AI-powered CV generation tool',
    rolloutPercentage: 100,
  },
  
  BULK_EMPLOYEE_OPERATIONS: {
    name: 'BULK_EMPLOYEE_OPERATIONS',
    enabled: true,
    description: 'Enable bulk operations for employee management',
    rolloutPercentage: 100,
  },
  
  // Document management features
  AUTOMATIC_DOCUMENT_VERIFICATION: {
    name: 'AUTOMATIC_DOCUMENT_VERIFICATION',
    enabled: false,
    description: 'Enable automatic document verification using AI',
    rolloutPercentage: 0,
    targetRoles: ['admin'],
  },
  
  MOLS_INTEGRATION: {
    name: 'MOLS_INTEGRATION',
    enabled: true,
    description: 'Enable integration with Ministry of Labor and Social Affairs',
    rolloutPercentage: 100,
  },
  
  DOCUMENT_CROSS_MATCH: {
    name: 'DOCUMENT_CROSS_MATCH',
    enabled: true,
    description: 'Enable cross-matching of documents between employees',
    rolloutPercentage: 100,
  },
  
  // Travel management features
  FLIGHT_BOOKING_INTEGRATION: {
    name: 'FLIGHT_BOOKING_INTEGRATION',
    enabled: false,
    description: 'Enable integration with flight booking systems',
    rolloutPercentage: 0,
  },
  
  REAL_TIME_TRACKING: {
    name: 'REAL_TIME_TRACKING',
    enabled: true,
    description: 'Enable real-time tracking of employee departures',
    rolloutPercentage: 100,
  },
  
  // Hajj & Umrah features
  HAJJ_REGISTRATION: {
    name: 'HAJJ_REGISTRATION',
    enabled: true,
    description: 'Enable Hajj registration and management',
    rolloutPercentage: 100,
  },
  
  UMRAH_REGISTRATION: {
    name: 'UMRAH_REGISTRATION',
    enabled: true,
    description: 'Enable Umrah registration and management',
    rolloutPercentage: 100,
  },
  
  PILGRIM_TRACKING: {
    name: 'PILGRIM_TRACKING',
    enabled: false,
    description: 'Enable real-time tracking of pilgrims',
    rolloutPercentage: 0,
  },
  
  // Institution features
  GOVERNMENT_INTEGRATION: {
    name: 'GOVERNMENT_INTEGRATION',
    enabled: true,
    description: 'Enable integration with government institutions',
    rolloutPercentage: 100,
  },
  
  BANK_INTEGRATION: {
    name: 'BANK_INTEGRATION',
    enabled: true,
    description: 'Enable integration with banking systems',
    rolloutPercentage: 100,
  },
  
  // Agent features
  AGENT_PERFORMANCE_ANALYTICS: {
    name: 'AGENT_PERFORMANCE_ANALYTICS',
    enabled: true,
    description: 'Enable performance analytics for agents',
    rolloutPercentage: 100,
  },
  
  AGENT_TRAINING_MODULE: {
    name: 'AGENT_TRAINING_MODULE',
    enabled: true,
    description: 'Enable training module for agents',
    rolloutPercentage: 100,
  },
  
  // Reporting features
  ADVANCED_REPORTING: {
    name: 'ADVANCED_REPORTING',
    enabled: true,
    description: 'Enable advanced reporting and analytics',
    rolloutPercentage: 100,
  },
  
  REAL_TIME_DASHBOARD: {
    name: 'REAL_TIME_DASHBOARD',
    enabled: true,
    description: 'Enable real-time dashboard updates',
    rolloutPercentage: 100,
  },
  
  EXPORT_REPORTS: {
    name: 'EXPORT_REPORTS',
    enabled: true,
    description: 'Enable export functionality for reports',
    rolloutPercentage: 100,
  },
  
  // User experience features
  DARK_MODE: {
    name: 'DARK_MODE',
    enabled: true,
    description: 'Enable dark mode theme',
    rolloutPercentage: 100,
  },
  
  MULTI_LANGUAGE: {
    name: 'MULTI_LANGUAGE',
    enabled: true,
    description: 'Enable multi-language support',
    rolloutPercentage: 100,
  },
  
  MOBILE_APP: {
    name: 'MOBILE_APP',
    enabled: false,
    description: 'Enable mobile app features',
    rolloutPercentage: 0,
  },
  
  // Notification features
  EMAIL_NOTIFICATIONS: {
    name: 'EMAIL_NOTIFICATIONS',
    enabled: true,
    description: 'Enable email notifications',
    rolloutPercentage: 100,
  },
  
  SMS_NOTIFICATIONS: {
    name: 'SMS_NOTIFICATIONS',
    enabled: true,
    description: 'Enable SMS notifications',
    rolloutPercentage: 100,
  },
  
  PUSH_NOTIFICATIONS: {
    name: 'PUSH_NOTIFICATIONS',
    enabled: false,
    description: 'Enable push notifications',
    rolloutPercentage: 0,
  },
  
  // Security features
  AUDIT_LOGGING: {
    name: 'AUDIT_LOGGING',
    enabled: true,
    description: 'Enable comprehensive audit logging',
    rolloutPercentage: 100,
  },
  
  RATE_LIMITING: {
    name: 'RATE_LIMITING',
    enabled: true,
    description: 'Enable rate limiting for API endpoints',
    rolloutPercentage: 100,
  },
  
  // Development features
  DEBUG_MODE: {
    name: 'DEBUG_MODE',
    enabled: false,
    description: 'Enable debug mode for development',
    rolloutPercentage: 0,
    targetRoles: ['admin', 'super_admin'],
  },
  
  API_DOCUMENTATION: {
    name: 'API_DOCUMENTATION',
    enabled: true,
    description: 'Enable API documentation endpoint',
    rolloutPercentage: 100,
    targetRoles: ['admin', 'super_admin'],
  },
} as const;

// Feature flag service
export class FeatureFlagService {
  private static instance: FeatureFlagService;
  private flags: Record<string, FeatureFlag> = FEATURE_FLAGS;
  
  private constructor() {}
  
  public static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }
  
  // Check if a feature is enabled
  public isEnabled(flagName: string, userId?: string, userRole?: string): boolean {
    const flag = this.flags[flagName];
    if (!flag) return false;
    
    // Check if flag is globally disabled
    if (!flag.enabled) return false;
    
    // Check date range
    if (flag.startDate && new Date() < flag.startDate) return false;
    if (flag.endDate && new Date() > flag.endDate) return false;
    
    // Check role-based access
    if (flag.targetRoles && userRole && !flag.targetRoles.includes(userRole)) {
      return false;
    }
    
    // Check user-specific access
    if (flag.targetUsers && userId && !flag.targetUsers.includes(userId)) {
      return false;
    }
    
    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined && userId) {
      const hash = this.hashUserId(userId);
      const percentage = (hash % 100) + 1;
      return percentage <= flag.rolloutPercentage;
    }
    
    return true;
  }
  
  // Get all enabled features for a user
  public getEnabledFeatures(userId?: string, userRole?: string): string[] {
    return Object.keys(this.flags).filter(flagName => 
      this.isEnabled(flagName, userId, userRole)
    );
  }
  
  // Update a feature flag
  public updateFlag(flagName: string, updates: Partial<FeatureFlag>): void {
    if (this.flags[flagName]) {
      this.flags[flagName] = { ...this.flags[flagName], ...updates };
    }
  }
  
  // Get flag information
  public getFlag(flagName: string): FeatureFlag | undefined {
    return this.flags[flagName];
  }
  
  // Get all flags
  public getAllFlags(): Record<string, FeatureFlag> {
    return { ...this.flags };
  }
  
  // Hash user ID for consistent rollout
  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

// Export singleton instance
export const featureFlags = FeatureFlagService.getInstance();

// Helper functions
export const isFeatureEnabled = (flagName: string, userId?: string, userRole?: string): boolean => {
  return featureFlags.isEnabled(flagName, userId, userRole);
};

export const getEnabledFeatures = (userId?: string, userRole?: string): string[] => {
  return featureFlags.getEnabledFeatures(userId, userRole);
};

// Environment-based feature flags
export const getEnvironmentFlags = (): Record<string, boolean> => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    DEBUG_MODE: isDevelopment,
    API_DOCUMENTATION: isDevelopment || isProduction,
    AUDIT_LOGGING: isProduction,
    RATE_LIMITING: isProduction,
  };
};
